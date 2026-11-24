---
title: "05. 高阶代码块与语法高亮"
description: "实测 MkDocs Material 9.8.2 + Pygments 2.21.0 + pymdownx.highlight / pymdownx.tabbed 的代码块标题栏、hl_lines 行高亮、diff 着色与 === 缩进标签组。"
---

# 05. 高阶代码块与语法高亮（`pymdownx.highlight` + `pymdownx.tabbed`）

技术文档中超过 40% 的篇幅由代码块构成，但标准 CommonMark / GitHub Flavored Markdown **仅定义了围栏语言标识（```` ```ts ````）**，并未定义文件名标题栏、指定行高亮、带语法着色的行级 Diff 以及多语言 Tab 代码组。本文件由标准 GFM 母版派生适配至 **MkDocs Material (`9.8.2`) + Pygments (`2.21.0`)**。

## 1. 代码块文件名标题栏与基础语法高亮

在 `mkdocs.yml` 中联动 `pymdownx.highlight`（开启 `anchor_linenums: true` 与 `line_spans: __span`）与 `pymdownx.superfences` 后，即可直接在围栏信息串中声明 `title="scripts/resolve-route.ts" hl_lines="3 7-9" linenums="1"`，同时赋予代码块 Material 标题栏、可锚定行号、一键复制按钮与指定行高亮：

```ts title="scripts/resolve-route.ts" hl_lines="3 7-9" linenums="1"
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
```

## 2. 关键行聚焦与高亮（`hl_lines="3 7-9"` 空格分隔语法）

注意与 Node.js / Shiki 生态逗号分隔 `{3,7-9}` 的语法差异——`pymdownx.highlight` 的 `hl_lines` 属性采用**空格分隔**行号与区间（`hl_lines="3 7-9"`），在 Python 构建期直接将第 `3` 行与第 `7–9` 行包裹为 `.hll` 整行高亮节点，零客户端运行时开销：

```json title="bench.config.json" hl_lines="3 7-9" linenums="1"
{
  "id": "ssg-benchmark",
  "routeStyle": "clean",
  "strictZeroCdn": true,
  "markdown": {
    "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
```

## 3. 代码增删对比着色（Pygments `diff` 词法分析器）

与所有基于 **Pygments** 的 Python 文档引擎一致，MkDocs Material 原生使用独立的 `diff` 语言标识表达补丁增删（优点是零配置兼容 GitHub 原版语法并输出清晰的红绿背景行，局限在于整块切换为 `DiffLexer` 后不再叠加底层 TypeScript 关键字的词法高亮）：

```diff title="scripts/mount-subsite.patch"
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（`pymdownx.tabbed` 的 `===` + 4 空格缩进）

开启 `pymdownx.tabbed: { alternate_style: true }` 后，MkDocs Material 延续了标志性的 Python 缩进哲学——以 **`=== "标签名"`** 开启每个面板，内部代码块严格保持 **4 空格缩进**，底层编译为纯 CSS `<input type="radio">` 状态切换控件，即使禁用 JavaScript 也能流畅切换：

=== "Node.js"

    ```bash title="package.json"
    npm ci && npm run build
    ```

=== "Deno 2"

    ```bash title="deno.json"
    deno task build
    ```

=== "Python"

    ```bash title="requirements.txt"
    pip install -r requirements.txt && sphinx-build -b dirhtml . _build/dirhtml
    ```

=== "Ruby"

    ```bash title="Gemfile"
    bundle install && bundle exec jekyll build
    ```

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress、Starlight、Fumadocs、Nextra、Rspress、Nuxt、Quartz | ✅ 纯静态内联样式 | ✅ `{1,3-5}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | Docusaurus、VuePress、Eleventy (plugin)、Gatsby | ✅ 静态 Token 类名 | ✅ `{1,3-5}` / 魔法注释 | ⚠️ 需配 diff-highlight 插件 |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、Zola (Rust Giallo)、mdBook (hljs) | ✅ (mdBook 为客户端 hljs) | ✅ Hugo/Zola 原生 `hl_lines` | ⚠️ 仅标准 `diff` 块红绿 |
