export interface DemoMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  category: 'interaction' | 'creative' | 'system';
  status: 'incubation' | 'planned' | 'tbd';
  tags: string[];
}

export const demos: DemoMeta[] = [
  {
    slug: 'micro-interactions',
    title: '微交互与物理触觉',
    subtitle: 'TACTILE & SPRING MOTION',
    description: '探索牛顿弹簧阻尼力学、高精度按压形变与多态流体灵动岛微交互实验。',
    icon: '⚡',
    category: 'interaction',
    status: 'incubation',
    tags: ['Spring Kinetics', 'Tactile UI', 'State Machine'],
  },
  {
    slug: 'creative-computing',
    title: '创意计算与 2D 画布',
    subtitle: 'ALGORITHMIC VISUALS',
    description: '基于 Canvas 2D 的亚像素粒子系统、平滑贝塞尔运动轨迹与动力学流体渲染。',
    icon: '🎨',
    category: 'creative',
    status: 'planned',
    tags: ['Canvas 2D', 'Kinetic Vector', 'Sub-pixel'],
  },
  {
    slug: 'system-components',
    title: '设计工程系统组件',
    subtitle: 'ENGINEERING DESIGN SYSTEM',
    description: '极致对比度发丝微边框、自适应光斑追踪与微秒级响应的高级交互组件套件。',
    icon: '🎛️',
    category: 'system',
    status: 'tbd',
    tags: ['Design System', 'Hairline Borders', 'A11y'],
  },
];
