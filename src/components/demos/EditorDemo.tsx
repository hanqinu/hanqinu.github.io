import React, { useEffect, useRef, useState } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { cn } from '@/utils/cn';

type Language = 'javascript' | 'html' | 'css';

const SAMPLE_CODE: Record<Language, string> = {
  javascript: `// A simple greeting function
function greet(name) {
  const greeting = 'Hello, ' + name + '!';
  console.log(greeting);
  return greeting;
}

// Call the function
greet('World');

// Using modern JS features
const calculateSum = (...numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

console.log(calculateSum(1, 2, 3, 4, 5));`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <style>
    body { font-family: sans-serif; }
  </style>
</head>
<body>
  <div id="app">
    <header>
      <h1>Welcome to Astro Demo</h1>
    </header>
    <main>
      <p>This is a sample HTML document.</p>
      <button id="action-btn">Click Me!</button>
    </main>
  </div>
</body>
</html>`,

  css: `/* Base styles */
:root {
  --primary-color: #8b5cf6;
  --bg-color: #09090b;
  --text-color: #fafafa;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.button {
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

.button:hover {
  animation: pulse 1s infinite;
  opacity: 0.9;
}`,
};

const getLanguageExtension = (lang: Language) => {
  switch (lang) {
    case 'javascript':
      return javascript();
    case 'html':
      return html();
    case 'css':
      return css();
  }
};

export default function EditorDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartmentRef = useRef(new Compartment());

  const [activeLang, setActiveLang] = useState<Language>('javascript');
  const [stats, setStats] = useState({ chars: 0, lines: 0 });

  useEffect(() => {
    if (!editorRef.current) return;

    // Create the initial editor state
    const state = EditorState.create({
      doc: SAMPLE_CODE[activeLang],
      extensions: [
        basicSetup,
        oneDark,
        languageCompartmentRef.current.of(getLanguageExtension(activeLang)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setStats({
              chars: update.state.doc.length,
              lines: update.state.doc.lines,
            });
          }
        }),
      ],
    });

    // Create the editor view
    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    setStats({ chars: state.doc.length, lines: state.doc.lines });

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle language changes
  const handleLanguageChange = (lang: Language) => {
    setActiveLang(lang);

    if (viewRef.current) {
      // Reconfigure the language compartment
      viewRef.current.dispatch({
        effects: languageCompartmentRef.current.reconfigure(getLanguageExtension(lang)),
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: SAMPLE_CODE[lang],
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-4xl mx-auto border border-[#282c34] rounded-xl overflow-hidden bg-[#282c34] shadow-xl text-white font-mono text-sm">
      {/* Toolbar */}
      <div className="flex bg-[#21252b] border-b border-[#181a1f] px-2 pt-2">
        {(['javascript', 'html', 'css'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={cn(
              'px-4 py-2 rounded-t-md transition-colors',
              activeLang === lang
                ? 'bg-[#282c34] text-[#abb2bf] border-t-2 border-[#61afef]'
                : 'text-[#5c6370] hover:text-[#abb2bf] hover:bg-[#282c34]/50',
            )}
          >
            {lang === 'javascript' ? 'main.js' : lang === 'html' ? 'index.html' : 'style.css'}
          </button>
        ))}
      </div>

      {/* Editor Container */}
      <div
        ref={editorRef}
        className="flex-1 overflow-auto bg-[#282c34] [&>.cm-editor]:h-full [&>.cm-editor]:outline-none"
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#21252b] border-t border-[#181a1f] text-[#5c6370] text-xs">
        <div className="flex items-center gap-4">
          <span>
            {activeLang === 'javascript' ? 'JavaScript' : activeLang === 'html' ? 'HTML' : 'CSS'}
          </span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Ln {stats.lines}, Ch {stats.chars}
          </span>
          <span>CodeMirror 6</span>
        </div>
      </div>
    </div>
  );
}
