---
title: "04. 目录结构与路由取舍"
description: "实测 MkDocs Material 的 docs/ 单层隔离、原生 .md 相对路径重写与显式 nav 树维护。"
---

# 04. 目录结构与路由取舍（MkDocs `docs/` + 显式 `nav:` 编排）

将标准 GFM 母版 `docs/04-directory/` 迁移至 MkDocs Material 时，它在**文件树纯净度与离线相对链接兼容性**上表现极佳，但也体现了集中式配置 `mkdocs.yml` 的取舍：

1. **天然的 `docs/` 单层隔离**：所有正文存放于 `docs/`，工程配置仅根部一个 `mkdocs.yml` 加 `requirements.txt`，仓库 `README.md` 与文档内容天然物理隔离。
2. **一等公民级相对 `.md` 链接校验与自动重写**：与母版完全一致，内部互链直接书写 `./nested/01-order-and-url.md` 与 `../index.md`——既能在 VS Code / Obsidian / GitHub 网页端直接点击跳转，又会在 `mkdocs build`（开启 `use_directory_urls: true`）时由编译器自动重写为干净的目录式路由并做断链告警！
3. **`navigation.indexes` 与显式 `nav:` 权衡**：开启 Material 的 `navigation.indexes` 特性后，`04-directory/index.md` 可直接挂载在折叠分组标题自身；但要为 `nested/` 指定中文分组名并严格控制顺序，仍需在 `mkdocs.yml` 的 `nav:` 节点中显式声明路径映射（若新增文档未写入 `nav:`，构建时 MkDocs 会提示页面未包含在导航树中）。

## 母版嵌套子文档入口（原样保留 `.md` 相对链接）

- [进入子文档 A：排序前缀与 URL 纯净度权衡](./nested/01-order-and-url.md)
- [进入子文档 B：多级子目录与侧边栏同步机制](./nested/02-sidebar-sync.md)
