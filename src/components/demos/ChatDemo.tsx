import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const RESPONSES = [
  '这是一个模拟的 AI 回复。在实际项目中，这里会连接到后端 API，通过 Server-Sent Events 实现真正的流式输出。React 的状态管理使得实时更新 UI 变得非常自然。',
  '你好！我是一个 Demo 聊天机器人。这个界面展示了流式输出效果、消息气泡布局、自动滚动等常见聊天 UI 功能的实现方式。',
  '很高兴为你演示这个聊天界面！它使用了 React Hooks 来管理消息状态，CSS Flexbox 实现布局，以及 setInterval 模拟流式输出效果。',
  '我是一段预设的回复文本。这里的打字机效果是通过每隔几十毫秒追加一个字符来实现的，这样可以在没有真实网络延迟的情况下体验流式返回的感觉。',
];

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '你好！我是模拟 AI 助手，有什么我可以帮你的吗？' },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Simulate API delay
    timeoutRef.current = setTimeout(() => {
      const targetResponse = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      let currentLength = 0;

      const assistantMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      intervalRef.current = setInterval(() => {
        if (currentLength < targetResponse.length) {
          currentLength++;
          const currentText = targetResponse.slice(0, currentLength);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: currentText } : msg,
            ),
          );
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsStreaming(false);
        }
      }, 30);
    }, 500);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg-secondary)] shadow-xl glass">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span className="font-medium text-[var(--color-text)]">AI 助手</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-400',
            )}
          />
          <span className="text-xs text-[var(--color-text-secondary)]">
            {isStreaming ? '正在输入...' : '在线'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg)]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col max-w-[80%]',
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
            )}
          >
            <div className="text-xs text-[var(--color-text-secondary)] mb-1 mx-1">
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div
              className={cn(
                'px-4 py-2.5 rounded-2xl shadow-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text)] border border-[var(--color-border)] rounded-tl-sm',
              )}
            >
              {msg.content ||
                (msg.role === 'assistant' && isStreaming ? (
                  <span className="flex gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-200" />
                  </span>
                ) : null)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend();
            }}
            placeholder="输入消息..."
            className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text)] rounded-full px-4 py-3 pr-12 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 p-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
