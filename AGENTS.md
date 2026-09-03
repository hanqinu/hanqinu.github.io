# AI 协作与工程规范指南 (AGENTS.md)

欢迎来到 **HANQIN 创意实验室 (`creative-lab`)** 代码仓库。
本文档为在此代码库中工作的 AI Agent（以及协同开发者）制定了架构约定、关键硬性约束、设计系统规范与验证工作流。

---

## 1. 项目概览与技术栈

- **框架底座**：[Astro 5](https://astro.build/)（静态站点生成 SSG / 孤岛架构 Islands Architecture）
- **UI 与交互孤岛**：[React 19](https://react.dev/) (`@astrojs/react`)
- **样式引擎**：[UnoCSS](https://unocss.dev/) 配合专属暗黑极客质感主题（详见 [uno.config.ts](file:///d:/others/hanqinu/uno.config.ts)）
- **物理动效与图形**：[Matter.js](https://brm.io/matter-js/)、HTML5 Canvas 2D / WebGL、Web Audio API
- **工程化工具链**：
  - **Linter 代码检查**：[Biome](https://biomejs.dev/)（纯 Linter 模式，`pnpm lint`）
  - **Formatter 代码格式化**：[Prettier](https://prettier.io/) 搭配 `prettier-plugin-astro`（`pnpm format`）
  - **类型检查**：TypeScript 5.7 Strict 模式 + Astro Check（`pnpm typecheck`）

---

## 2. 目录架构与职责划分

```
d:/others/hanqinu/
├── src/
│   ├── components/
│   │   ├── landing/     # 首页全屏交互与动效区块组件（React .tsx）
│   │   └── ui/          # 通用核心 UI 基础组件（.astro 静态组件 & .tsx 交互组件）
│   ├── data/            # 静态数据与 Demo 元数据注册中心（demos.ts）
│   ├── hooks/           # 动效渲染、主题与传感器自定义 Hooks（useAnimationFrame 等）
│   ├── layouts/         # Astro 全局页面布局模版（BaseLayout.astro）
│   ├── pages/           # Astro 文件路由（index.astro 首页、demos/index.astro 实验列表等）
│   ├── styles/          # 全局基础样式与排版重置（global.css）
│   └── utils/           # 通用工具函数与音频引擎（audio.ts）
├── astro.config.mjs     # Astro 整合与构建配置
├── biome.json           # Biome 规则配置（纯 Linter 模式，已禁用 Formatter）
├── package.json         # 项目依赖与自动化脚本
├── tsconfig.json        # TypeScript 配置（别名映射 `@/*` -> `./src/*`）
└── uno.config.ts        # UnoCSS 颜色、质感规则与快捷类定义
```

---

## 3. 核心工程硬性约束（必须严格遵守）

### 3.1 Astro 孤岛水合指令（Islands Hydration Directives）

- 在 `.astro` 模板中引入任何带有状态、事件监听或动效的 React 组件时，**必须**显式添加 Astro 客户端水合指令，否则组件仅会渲染为无交互的纯静态 HTML：
  - `client:load`：首屏关键视口组件（如 Hero 交互、鼠标聚光灯追踪）。
  - `client:visible`：视口滚动触发区块（如滚动卡片翻折、粒子海浪、着色器流体排版）。
  - `client:idle`：低优先级后台辅助交互。
- **严禁**在 `.astro` 文件的 Frontmatter（`---` 顶部代码块）中调用 React Hooks（如 `useState`、`useEffect`）。

### 3.2 零 SSR 泄漏（静态构建安全）

- Astro 在构建阶段（`pnpm build`）会于 Node.js 环境执行静态 HTML 预渲染。
- **严禁**在模块顶层作用域或 React 组件渲染函数体内直接访问浏览器特有对象（如 `window`、`document`、`navigator`、`localStorage`、`AudioContext`、`HTMLCanvasElement.getContext`）。
- 所有浏览器 API 必须且仅能在 `useEffect(() => { ... }, [])` 生命周期内部调用，或在外层包裹防御判断 `if (typeof window !== 'undefined')`。

### 3.3 资源与内存生命周期销毁（Prevent Memory Leaks）

创意编程涉及高频动画循环与物理计算引擎。所有挂载了活跃资源的 Hook 或组件，在卸载（Unmount）时**必须彻底释放资源**：

- **Canvas / 动效渲染**：必须在 cleanup 中取消帧调度 `cancelAnimationFrame(id)`。
- **Matter.js 物理世界**：必须显式停止并清空引擎与渲染器（`Engine.clear(engine)`、`Render.stop(render)`）。
- **Web Audio 音频**：及时断开节点（`disconnect`），暂停或关闭音频上下文。
- **DOM 事件监听**：在 `window.addEventListener` 后，必须在清理函数中执行对应的 `window.removeEventListener`。

### 3.4 WebGL 原生 API 与 Hooks 检查器防误报

Biome 的 React 规则会将所有以 `use` 开头且首字母大写的方法视为 React Hook。WebGL 原生上下文的方法 `gl.useProgram(...)` 会误触 `useHookAtTopLevel` 规则。

- 当调用 `gl.useProgram(...)` 时，**必须**在其正上方添加忽略注释：
  ```ts
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API
  gl.useProgram(program);
  ```

---

## 4. UnoCSS 设计字典与样式规范

**严禁**随意编造或使用通用 Tailwind 默认灰阶类（例如避免使用 `bg-gray-900`、`border-gray-800`）。必须严格使用 [uno.config.ts](file:///d:/others/hanqinu/uno.config.ts) 中定义的专属设计语义：

### 颜色 Token

- **深色基底**：`bg-obsidian`（`#090a0f` 纯黑曜石底色）、`bg-surface-100`（`#161922`）、`bg-surface-200`（`#12141c`）、`bg-surface-300`（`#0d0f15`）、`bg-surface-card`、`bg-surface-cardHover`
- **强调色**：
  - 琥珀橙（Amber）：`text-accent-amber`（`#f97316`）、`text-accent-amberLight`（`#fb923c`）
  - 极客靛蓝（Cobalt）：`text-accent-cobalt` (`#6366f1`）、`text-accent-cobaltLight`（`#818cf8`）
  - 荧光祖母绿（Emerald）：`text-accent-emerald`（`#10b981`）、`text-accent-emeraldLight`（`#34d399`）

### 自定义质感规则与快捷类

- **毛玻璃面板**：`glass-card`（20px 模糊、暗黑质感微边框）、`glass-subtle`（12px 轻度模糊）
- **发丝级微边框**：`border-hairline`（8% 不透明度发丝边框）、`border-hairline-hover`（悬浮增强至 20%）
- **背景纹理**：`bg-grid-pattern`（32px 网格）、`bg-dot-pattern`（24px 点阵）
- **文字排版与渐变**：
  - `heading-hero`（超大 Hero 标题）、`heading-section`（区块大标题）、`heading-card`（卡片标题）
  - `mono-tag`（等宽代码胶囊标签）
  - `text-gradient-amber`（金属白到琥珀橙渐变文字）、`text-gradient-silver`（纯白到银灰渐变文字）
- **标准容器**：`section-container`（`max-w-7xl mx-auto px-6 py-20 md:px-12 lg:px-20`）

---

## 5. 开发与质量验证工作流（分级高效策略）

为了最大化 AI 响应速度与开发效率，**严禁在每次日常微小改动后无意义地全量运行 `pnpm verify`**。本项目采用**“日常轻量 + Git 提交自动兜底 + 重大变更按需全检”**的分级策略：

### 5.1 日常微小改动（改文案、调样式、单文件逻辑）

- **改完即交付，无需手动全量扫描**：项目已配置 Git `pre-commit` 钩子（Husky + lint-staged）。代码提交时会自动对暂存区变动文件执行增量修复与格式化（耗时仅数十毫秒）。
- **极速单文件自检（按需）**：若编写了复杂的 React/TypeScript 逻辑并希望立即验证，只检查被修改的目标文件即可（耗时约 5ms）：
  ```powershell
  pnpm biome lint src/components/landing/YourComponent.tsx
  ```

### 5.2 重大重构或架构交付（新建路由页面、引入新三方库、全局排版重构）

- 仅在重大任务交付或用户明确要求验证时，按需执行：
  ```powershell
  pnpm typecheck   # 运行 Astro check 与 TypeScript 严格类型检查
  pnpm verify      # 综合门禁（类型检查 + Biome + Prettier 格式全检）
  pnpm build       # 静态打包验证（确认无任何 SSR window/document 泄漏）
  ```

### 5.3 Git 提交自动守门员（Git Commit Hooks）

- 代码执行 `git commit` 时，`lint-staged` 会自动触发：
  - 对暂存的 `*.{js,ts,tsx}` 执行 `biome lint --write` 自动排查/修复问题；
  - 对所有暂存文件执行 `prettier --write` 确保统一排版风格。

---

## 6. 环境与操作系统约束

- **运行环境**：Windows 10 / PowerShell 7 (`pwsh`)。
- 命令行命令必须采用兼容 PowerShell 的语法规范（禁止使用 Linux Bash 专属的 heredoc 或未经转义的多层嵌套引号）。
- 包管理工具统一使用 `pnpm`。
