import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

type Tool = 'pen' | 'eraser';
type Color = string;

const COLORS: Color[] = [
  '#000000', // Black
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#f97316', // Orange
  '#a855f7', // Purple
  '#6b7280', // Gray
  '#ffffff', // White
];

const BRUSH_SIZES = [2, 5, 10, 20];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<Color>(COLORS[0]);
  const [brushSize, setBrushSize] = useState<number>(BRUSH_SIZES[1]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Undo stack
  const [history, setHistory] = useState<ImageData[]>([]);

  // Set up canvas and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      // Save current content
      const imageData = ctx.getImageData(0, 0, canvas.width || 1, canvas.height || 1);

      canvas.width = container.clientWidth;
      canvas.height = 500;

      // Setup default context properties
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Restore content if it exists and dimensions make sense
      if (canvas.width > 0 && canvas.height > 0 && imageData.width > 0) {
        ctx.putImageData(imageData, 0, 0);
      } else {
        // Save initial blank state to history
        setTimeout(() => {
          if (canvas.width > 0 && canvas.height > 0) {
            setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
          }
        }, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imageData]); // Keep last 10 states
  }, []);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    // Set up correct stroke style
    ctx.lineWidth = brushSize;
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const undo = () => {
    if (history.length <= 1) return; // Need at least the blank state and one stroke

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pop the current state, get the previous one
    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1]; // Get previous

    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto border border-[var(--color-border)] rounded-2xl overflow-hidden bg-[var(--color-bg-secondary)] shadow-xl relative glass glow-sm">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[var(--color-bg)]/80 backdrop-blur-md p-2 rounded-full border border-[var(--color-border)] shadow-lg z-10">
        {/* Tools */}
        <div className="flex items-center gap-1 border-r border-[var(--color-border)] pr-3">
          <button
            onClick={() => setTool('pen')}
            className={cn(
              'p-2 rounded-full transition-colors',
              tool === 'pen'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text)] hover:bg-[var(--color-bg-card)]',
            )}
            title="Pen"
          >
            ✏️
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={cn(
              'p-2 rounded-full transition-colors',
              tool === 'eraser'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text)] hover:bg-[var(--color-bg-card)]',
            )}
            title="Eraser"
          >
            🧼
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2 border-r border-[var(--color-border)] pr-3">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                'w-6 h-6 rounded-full border-2 transition-transform',
                color === c && tool === 'pen'
                  ? 'scale-125 border-[var(--color-primary)]'
                  : 'border-gray-200/50 hover:scale-110',
              )}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 border-r border-[var(--color-border)] pr-3">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                brushSize === size
                  ? 'bg-[var(--color-bg-card)]'
                  : 'hover:bg-[var(--color-bg-card)]/50',
              )}
              title={`Size ${size}`}
            >
              <div
                className="bg-[var(--color-text)] rounded-full"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="p-2 rounded-full text-[var(--color-text)] hover:bg-[var(--color-bg-card)] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            ↩️
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-full text-red-500 hover:bg-red-500/20"
            title="Clear"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="w-full h-[500px] bg-white cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          onPointerCancel={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
}
