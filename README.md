# 广州 AI 养老研究成果网页（V4 候选）

本仓库用于独立部署研究成果静态网页，不替代原始研究资料仓库：
https://github.com/Sunset-Sunrise-Sun/material-collection

## 当前状态

- 部署目标：GitHub Pages
- 网页文件来源：`V4_FINAL_DELIVERY.zip` 中的 `V4_FINAL_DELIVERY/site/dist/`
- 当前已准备自动部署工作流；**网页尚未发布**。
- 交付包中包含研究正文、区级比较面板和配套静态资源。发布后仍需进行线上资源回归测试。

## 完成首次发布

1. 将完整的 `V4_FINAL_DELIVERY.zip` 上传到本仓库根目录，文件名必须完全一致。
2. 打开 **Settings → Pages**，将 **Build and deployment → Source** 设置为 **GitHub Actions**。
3. 上传 ZIP 后，打开 **Actions** 页面，等待 **Deploy V4 site to GitHub Pages** 工作流完成。
4. 工作流成功后，从 Actions 运行记录或 Settings → Pages 获取实际发布网址。

工作流只发布 ZIP 中的 `V4_FINAL_DELIVERY/site/dist/`，不会把交付报告、测试截图或内部交接文件发布到网站。

## 研究与发布边界

V4 是候选版本，不代表原 ChatGPT Sites 站点已更新。发布到 GitHub Pages 是一个独立的静态副本；不会修改原 Sites，也不会修改原始研究资料仓库。行政区边界许可/审图、数据深度核验及其他交付文档列明的限制仍然有效。
