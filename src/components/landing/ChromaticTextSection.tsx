import React, { useRef, useEffect, useState } from 'react';
import { soundEngine } from '@/utils/audio';

export default function ChromaticTextSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse physics
  const mouse = useRef({ x: 0.5, y: 0.5, active: false });
  const mouseSmooth = useRef({ x: 0.5, y: 0.5 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0.5, y: 0.5, time: 0 });
  const hoverFactor = useRef(0);
  const lastSoundTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Get WebGL context (fall back to experimental if needed)
    const gl =
      canvas.getContext('webgl', { antialias: true, alpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      console.warn('WebGL not supported, falling back');
      return;
    }

    // =========================================================================
    // 1. Offscreen High-Res Texture for "HANQIN" Letters & Normal Bevel Mask
    // =========================================================================
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 2048;
    textCanvas.height = 1024;
    const tctx = textCanvas.getContext('2d');

    const renderTextTexture = () => {
      if (!tctx) return;
      tctx.clearRect(0, 0, 2048, 1024);

      // Deep black background
      tctx.fillStyle = '#000000';
      tctx.fillRect(0, 0, 2048, 1024);

      // Ultra-crisp, monumental "HANQIN" typography
      tctx.font = '900 360px "Inter", "Helvetica Neue", -apple-system, sans-serif';
      tctx.textAlign = 'center';
      tctx.textBaseline = 'middle';

      const cx = 1024;
      const cy = 512;

      // Channel R = Solid Letter Mask (pure white fill)
      // Channel G = Bevel / Stroke Edge (sharp outline)
      // We draw solid white letters
      tctx.fillStyle = '#ffffff';
      tctx.fillText('HANQIN', cx, cy);

      // Draw sharp outer stroke
      tctx.strokeStyle = '#888888';
      tctx.lineWidth = 12;
      tctx.strokeText('HANQIN', cx, cy);
    };

    renderTextTexture();

    // Upload textCanvas to WebGL Texture
    const textTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);

    // =========================================================================
    // 2. Vertex Shader (Full-Screen Quad)
    // =========================================================================
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        // Invert Y for canvas texture coordinate standard
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // =========================================================================
    // 3. Fragment Shader: Liquid Metallic Chrome & Iridescent Caustic Reflection
    // (Matches media_1788348293549.png with extreme fidelity!)
    // =========================================================================
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform sampler2D u_text;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_mouse_vel;
      uniform float u_time;
      uniform float u_hover;

      // Organic Caustic Noise Functions
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float val = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          val += amp * noise(p);
          p *= 2.05;
          amp *= 0.5;
        }
        return val;
      }

      // Authentic Lusion Caustic Iridescent Color Mapping (Matching Image 1)
      vec3 getIridescence(float t) {
        // High-contrast chromatic dispersion:
        // Deep Royal Blue -> Intense Cyan -> Blinding White -> Molten Gold -> Fiery Cadmium Red
        vec3 c1 = vec3(0.04, 0.08, 0.95);  // Deep Royal Blue
        vec3 c2 = vec3(0.15, 0.90, 1.00);  // Intense Cyan
        vec3 c3 = vec3(1.00, 1.00, 1.00);  // Blinding Chrome White
        vec3 c4 = vec3(1.00, 0.65, 0.02);  // Molten Gold
        vec3 c5 = vec3(1.00, 0.12, 0.01);  // Fiery Cadmium Red

        float x = fract(t);
        if (x < 0.20) return mix(c1, c2, x / 0.20);
        if (x < 0.45) return mix(c2, c3, (x - 0.20) / 0.25);
        if (x < 0.70) return mix(c3, c4, (x - 0.45) / 0.25);
        if (x < 0.88) return mix(c4, c5, (x - 0.70) / 0.18);
        return mix(c5, c1, (x - 0.88) / 0.12);
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 aspectUv = vec2(uv.x * aspect, uv.y);
        vec2 aspectMouse = vec2(u_mouse.x * aspect, u_mouse.y);

        // Sample Text Mask Texture
        vec4 textTex = texture2D(u_text, uv);
        float textMask = textTex.r;

        // Calculate Text Bevel Normals from gradient
        vec2 eps = vec2(1.5 / u_resolution.x, 1.5 / u_resolution.y);
        float tR = texture2D(u_text, uv + vec2(eps.x, 0.0)).r;
        float tL = texture2D(u_text, uv - vec2(eps.x, 0.0)).r;
        float tD = texture2D(u_text, uv + vec2(0.0, eps.y)).r;
        float tU = texture2D(u_text, uv - vec2(0.0, eps.y)).r;

        vec2 textGrad = vec2(tR - tL, tD - tU);
        float textEdge = length(textGrad) * 2.5;

        // Viscous Fluid Simulation around mouse
        vec2 toMouse = aspectUv - aspectMouse;
        float dist = length(toMouse);

        // Fluid stream elongation along mouse movement vector
        vec2 velDir = u_mouse_vel * 15.0;
        float velLen = length(velDir);
        vec2 stretchCoord = aspectUv;
        if (velLen > 0.01) {
          vec2 normVel = velDir / velLen;
          float proj = dot(toMouse, normVel);
          stretchCoord -= normVel * proj * 0.35;
        }

        float stretchDist = length(stretchCoord - aspectMouse);

        // Caustic wave distortion
        float wave1 = fbm(stretchCoord * 3.5 + vec2(u_time * 0.35, -u_time * 0.25));
        float wave2 = sin(stretchCoord.x * 6.0 + u_time * 0.8 + wave1 * 4.0);

        // Fluid intensity field
        float radius = 0.28 + wave1 * 0.08;
        float fluidStrength = smoothstep(radius, 0.02, stretchDist + (wave2 * 0.04));

        // Ambient idle liquid pulse (so it always looks metallic even when idle)
        float idleCenter = length(vec2((uv.x - 0.5) * aspect, uv.y - 0.5));
        float idleWave = fbm(aspectUv * 2.2 + vec2(u_time * 0.15, -u_time * 0.12));
        float idleFluid = smoothstep(0.45, 0.05, idleCenter + idleWave * 0.12) * 0.35;

        float combinedFluid = max(fluidStrength * u_hover, idleFluid);

        // =====================================================================
        // Physical Liquid Chrome Surface Normal
        // =====================================================================
        float dF = fbm(aspectUv * 4.0 + toMouse * 1.5 + vec2(u_time * 0.2, 0.0));
        vec3 N = normalize(vec3(
          -toMouse.x * 2.5 + (wave1 - 0.5) * 1.8 + textGrad.x * 3.0,
          -toMouse.y * 2.5 + (wave2 * 0.5) + textGrad.y * 3.0,
          0.35
        ));

        // Lighting vectors
        vec3 lightPos = vec3(aspectMouse, 0.45);
        vec3 lightDir = normalize(lightPos - vec3(aspectUv, 0.0));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDir + viewDir);

        // Blinding Specular Highlight (High Metallic Exponent)
        float spec = pow(max(0.0, dot(N, halfDir)), 48.0);
        float specSharp = pow(max(0.0, dot(N, halfDir)), 128.0);

        // Fresnel reflection
        float fresnel = pow(1.0 - max(0.0, dot(N, viewDir)), 3.5);

        // Chromatic dispersion coordinate
        float dispersionCoord = dot(N.xy, vec2(0.8, 0.6)) * 0.6 + combinedFluid * 1.4 + dF * 0.25;
        vec3 iridColor = getIridescence(dispersionCoord);

        // Compose Liquid Chrome Reflection
        vec3 chrome = iridColor * (0.6 + fresnel * 0.8);
        chrome += vec3(1.0) * (spec * 1.4 + specSharp * 2.0);

        // High-contrast gamma curve (Pure, expensive metallic look!)
        chrome = pow(chrome, vec3(1.35)) * 1.6;

        // Dark Metallic Baseline Inside Letters
        vec3 darkGlass = vec3(0.02, 0.03, 0.06);

        // Bevel Specular Rim on Letter Strokes
        vec3 bevelColor = iridColor * (1.2 + specSharp * 3.0);
        float bevelLight = textEdge * (0.4 + combinedFluid * 1.8 + spec * 2.0);

        // Assemble Final Pixel Color
        vec3 finalColor = vec3(0.0);

        if (textMask > 0.05) {
          // Inside "HANQIN" Letters
          finalColor = mix(darkGlass, chrome, combinedFluid);
          // Add razor-sharp glowing metallic bevel rim
          finalColor += bevelColor * bevelLight * 0.6;
        } else {
          // Outside Letters: Deep inky void black + subtle ambient chromatic bleed
          float bloom = textEdge * combinedFluid * 0.25;
          finalColor = iridColor * bloom;
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Compile Shaders
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API
    gl.useProgram(program);

    // Quad Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uMouseVel = gl.getUniformLocation(program, 'u_mouse_vel');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uHover = gl.getUniformLocation(program, 'u_hover');
    const uText = gl.getUniformLocation(program, 'u_text');

    gl.uniform1i(uText, 0);

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = Math.max(rect.height, 700);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse Listeners
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      const now = performance.now();
      const dt = Math.max((now - lastMousePos.current.time) / 1000, 0.001);
      const vx = (nx - lastMousePos.current.x) / dt;
      const vy = (ny - lastMousePos.current.y) / dt;
      const speed = Math.sqrt(vx * vx + vy * vy);

      mouse.current = { x: nx, y: ny, active: true };
      mouseVel.current = { x: vx, y: vy };
      lastMousePos.current = { x: nx, y: ny, time: now };

      if (speed > 1.5 && now - lastSoundTime.current > 130) {
        const freq = 420 + Math.min(speed * 30, 680);
        soundEngine.playNote(freq, 'sine', 0.07, 0.12);
        lastSoundTime.current = now;
      }
    };

    const onMouseEnter = () => {
      setIsHovered(true);
      mouse.current.active = true;
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      mouse.current.active = false;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // WebGL Render Loop
    let frame = 0;

    const render = () => {
      frame++;
      const time = frame * 0.025;

      // Smooth lerp mouse coordinates
      mouseSmooth.current.x += (mouse.current.x - mouseSmooth.current.x) * 0.14;
      mouseSmooth.current.y += (mouse.current.y - mouseSmooth.current.y) * 0.14;

      // Smooth hover fade
      const targetHover = mouse.current.active ? 1.0 : 0.25;
      hoverFactor.current += (targetHover - hoverFactor.current) * 0.1;

      // Decay velocity
      mouseVel.current.x *= 0.92;
      mouseVel.current.y *= 0.92;

      // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API
      gl.useProgram(program);
      gl.uniform2f(uMouse, mouseSmooth.current.x, mouseSmooth.current.y);
      gl.uniform2f(uMouseVel, mouseVel.current.x, mouseVel.current.y);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uHover, hoverFactor.current);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textTexture);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      gl.deleteTexture(textTexture);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section
      id="screen-2-chromatic"
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[700px] flex flex-col items-center justify-center select-none overflow-hidden cursor-crosshair z-20"
      style={{
        backgroundColor: '#000000',
      }}
    >
      {/* Full-Bleed WebGL Realtime Liquid Metallic Shader Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating Center Subtle Hover Prompt */}
      {!isHovered && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse z-30">
          <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-mono tracking-widest text-white/80 shadow-2xl">
            [ SWEEP MOUSE ACROSS HANQIN ]
          </span>
        </div>
      )}
    </section>
  );
}
