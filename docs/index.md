---
title: "00. 概览与版本档案 (MkDocs Material)"
description: "Python 生态标杆文档生成器 MkDocs 1.6.1 + Material for MkDocs 9.8.2 基准实测子站。"
---

# MkDocs Material (`9.8.2`) 基准实测子站

本子模块由主仓 `page2401.github.io/docs/` 标准 GFM 母版**最小化派生适配**而来，实测 Python 科研与技术文档生态统治级组合 **`mkdocs@1.6.1` + `mkdocs-material@9.8.2` + `pymdown-extensions@13.1.2`** 的方言特性、4 空格缩进语法约定及全离线数学/图表表现。

## 精确锁定版本档案（`requirements.txt` + 本地 Vendor）

Python 构建链通过虚拟环境 `.venv` 与 `requirements.txt` 严格锁定，前端数学与流程图库本地化托管于 `docs/javascripts/` 与 `docs/stylesheets/`，零外部 CDN 波动风险：

| 模块 / 依赖包 | 精确锁定版本 | 在本子站中的职责与接入方式 |
| :--- | :--- | :--- |
| `mkdocs` | `1.6.1` | Python 静态文档构建器核心，原生支持相对 `.md` 链接校验与目录式 URL |
| `mkdocs-material` | `9.8.2` | Material Design 主题系统，提供 `default` / `slate` 双配色方案与中文全文检索 |
| `pymdown-extensions` | `13.1.2` | 提供 `pymdownx.details`、`pymdownx.superfences` 与 `pymdownx.arithmatex` 核心语法扩展 |
| `markdown` | `3.11.3` | Python-Markdown 标准解析内核（内置 `admonition` 与 `tables` 扩展） |
| `pygments` | `2.21.0` | 构建期多语言语法高亮引擎 |
| `katex` (vendored) | `0.19.1` | 配合 `arithmatex (generic: true)` 在同源本地完成公式排版 |
| `mermaid` (vendored) | `12.3.0` | 配合 `superfences` 自定义 `mermaid` 围栏实现零 CDN 矢量图表渲染 |

## 六大标准基准章节导览

| 章节路径 | 测试维度 | 相对母版 `docs/*.md` 的核心派生改造点 |
| :--- | :--- | :--- |
| [`01-annotations.md`](./01-annotations.md) | 专属标注与元数据 | 第 2 节改写为标志性 `!!! note` + **4 空格缩进**；第 3 节改写为 `??? note`；第 4 节实测发现原生不解析 `> [!NOTE]` GFM Alerts |
| [`02-diagrams.md`](./02-diagrams.md) | 流程图与时序图 | 正文代码块零改动，在 `mkdocs.yml` 配置 `pymdownx.superfences` 自定义 `mermaid` 围栏 |
| [`03-math.md`](./03-math.md) | 数学公式排版 | 正文公式零改动，由 `pymdownx.arithmatex: { generic: true }` 无损保护反斜杠并交由 KaTeX 0.19.1 渲染 |
| [`04-directory/`](./04-directory/index.md) | 目录结构与路由取舍 | 100% 保留母版相对 `.md` 互链（构建期自动重写），但在 `mkdocs.yml` 维护显式 `nav:` 树防止结构失序 |
| [`05-code-blocks.md`](./05-code-blocks.md) | 高阶代码块与语法高亮 | 基于 `pymdownx.highlight` 启用 `title` / `hl_lines` / `linenums` 属性，配合 `pymdownx.tabbed`（`=== "Node.js"` + 4 空格缩进）实现多语言标签组 |
