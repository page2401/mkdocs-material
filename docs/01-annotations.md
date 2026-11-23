---
title: "01. 专属标注与元数据"
description: "测试 MkDocs Material 9.8.2 的 YAML 元数据、4 空格缩进 !!! Admonition、??? Details 与 GFM Alerts 兼容性。"
---

# 01. 专属标注与元数据（MkDocs `!!!` / `???` 缩进体系）

不同静态网站生成器对“提示框 / 标注（Callouts / Admonitions）”和页面元数据的语法约定存在显著分歧。本文件由标准 GFM 母版派生适配至 **MkDocs Material (`9.8.2`)**。

## 1. Frontmatter 元数据机制

MkDocs 原生支持宽松的顶部 YAML 元数据块，既可覆盖页面 `title` 与 `description`，也可按需使用 Material 专属字段（如 `hide: [navigation, toc]` 或 `icon`）：

- **当前页标题字段**：`title: "01. 专属标注与元数据"`
- **页面摘要字段**：`description: "..."`
- **派生观察点**：无需像 Astro Starlight 那样声明强类型 Schema，但页面排序并不靠 Frontmatter `order` 字段，而是集中由 `mkdocs.yml` 的 `nav:` 树统一编排。

## 2. 标准提示语义块（MkDocs 标志性 `!!!` + 4 空格缩进语法）

不同于 Node.js 生态的 `::: warning` 闭合容器，Python-Markdown `admonition` 扩展采用 **`!!! <类型> "可选双引号标题"` + 正文严格缩进 4 个空格** 的块结构（缩进一旦回退即自动结束容器）：

!!! note
    默认信息提示块：静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支，互不污染提交历史。

!!! tip "性能优化建议"
    在 MkDocs Material 中，自定义标题需包裹在英文双引号 `"..."` 内（若写 `!!! tip ""` 则渲染为无标题紧凑提示框），且下方所有段落必须保持严格的 **4 空格缩进**。

!!! warning "版本边界注意"
    注意区分各派系语法边界——VitePress / VuePress 使用成对的 `::: warning ... :::`，而 MkDocs 依靠 Python 风格的缩进层级定界，跨生态批量正则转换时需整体增减每行前导空格。

!!! danger "不可逆分支覆盖警告"
    自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！

## 3. 可折叠详情容器（`pymdownx.details` 的 `???` 语法）

借助 `pymdown-extensions` 的 `pymdownx.details` 扩展，只需将感叹号改为三个问号 **`???`**（默认收起，若写 `???+` 则默认展开），配合 4 空格缩进即可实现优雅的 Material 折叠卡片：

??? note "点击展开查看折叠容器源码结构"

    ```markdown
    !!! tip "性能优化建议"
        正文内容与嵌套代码块均须相对标题行缩进 4 个空格。
    ```

    除了代码块，折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。

## 4. GitHub 风格引用警报（GFM Alerts）跨框架直通测试

以下三段**保持母版原文一字不改**，用于测试：如果不将母版改写为 `!!! note`，直接把标准 GitHub Markdown 丢进 MkDocs Material 默认管线会发生什么（实测：因 Python-Markdown 标准 `admonition` 扩展不识别 `> [!NOTE]` 语法，在未额外加装第三方 GFM Alert 转换插件时，下方会退化为普通引用块并裸露 `[!NOTE]` 等标记字符串）：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本，用于检验各生成器对母版语法的零改造直通能力。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了母版文档的派生改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器（如 VuePress v1、Starlight 默认配置、Docsify v4 旧插件），上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。
