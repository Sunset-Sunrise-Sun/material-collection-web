# V3修改文件清单

## 新增

- `dist/view-router.js`：7视图切换、原锚点解析、历史与阅读位置、当前视图进度/焦点、跨视图引用返回。
- `dist/introduction.js`：第1章概括/事实/逻辑图、三类研究综合视图、原文折叠与证据核查。
- `dist/views.css`：沿用品牌的视图布局、首页压缩、阅读层级、移动审计纵向展示。
- `scripts/verify_views.py`：原报告引文映射与背景事实、章节入口检查。
- `docs/CITATION_MAPPING.json`：19项原稿引用与条目逐项对应，不表示全文独立核验。
- `docs/V3_ACCEPTANCE.md`、`docs/V3_CHANGES.md`：本轮验收与清单。

## 修改

- `dist/index.html`：精简首页、顶部快速导航、当前章节上下文、新脚本/样式入口、V3标识。
- `dist/app.js`：第1章渲染挂钩、源段锚点、当前视图导航进度、上下章入口、路由联动及图像占位比例。
- `dist/overview.js`：三层结果入口、次级统计/明细折叠、S1/S5简化对照、四类证据边界、跨章治理入口、可见后地图挂载。
- `package.json`：版本0.3.0与检查入口，无新增依赖。
- `README.md`、`docs/STATUS.md`、`docs/HANDOFF_DEEPSEEK.md`、`docs/MAP_INTEGRATION.md`：更新维护、验收与交接说明。

## 保持不变

`dist/content.json`、`dist/visual-data.json`、4张原图、`dist/map-slot.js`、`dist/map-provider.js`、`dist/map-provider.css`和原报告均未修改。参考资料仓库未写入。
