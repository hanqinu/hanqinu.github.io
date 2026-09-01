export interface DemoMeta {
  slug: string;
  title: string;
  description: string;
  icon: string; // emoji
  category: 'interactive' | 'tool' | 'creative';
  tags: string[];
}

export const demos: DemoMeta[] = [
  {
    slug: 'chat',
    title: 'AI 对话',
    description: '模拟 AI 对话界面，支持流式输出与 Markdown 渲染',
    icon: '💬',
    category: 'interactive',
    tags: ['Streaming', 'Markdown', 'React'],
  },
  {
    slug: 'editor',
    title: '代码编辑器',
    description: '基于 CodeMirror 6 的在线代码编辑器，支持多语言高亮',
    icon: '📝',
    category: 'tool',
    tags: ['CodeMirror', 'Syntax Highlighting', 'Multi-language'],
  },
  {
    slug: 'drawing',
    title: '画板',
    description: '支持画笔、橡皮擦、颜色选择的自由绘画工具',
    icon: '🎨',
    category: 'creative',
    tags: ['Canvas', 'Drawing', 'Touch Support'],
  },
];
