---
title: "嵌套子页 A：排序前缀与 URL 纯净度权衡"
---

# 嵌套子页 A：排序前缀与 URL 纯净度权衡

在母版目录 `docs/04-directory/nested/` 中，文件名使用 `01-order-and-url.md` 以保证在 Git 与代码编辑器中按阅读先后顺序排列。在 MkDocs 中，排序完全可由 `mkdocs.yml` 的 `nav:` 决定，保留 `01-` 前缀虽能维持 IDE 文件树直观有序，但也会同步进入编译后的目录路由 `/04-directory/nested/01-order-and-url/`。

- [返回母版《04. 目录结构与路由取舍》](../index.md)
- [下一篇：《嵌套子页 B：多级子目录与侧边栏同步机制》](./02-sidebar-sync.md)
