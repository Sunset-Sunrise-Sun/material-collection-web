# CHANGELOG V5.1（相对 V5 排版候选）

**分支**：`feat/v5-layout-polish`
**基线**：`feat/map-integration-v5` @ `fc35704d4c1839f3d83dc115c7fdb599ce4fe1f5`
**性质**：仅布局与默认展开状态；不重做地图、不改研究数据/正文。

## 新增

| 文件 | 原因 |
|---|---|
| `site/dist/v51-layout.css` | 地图 + 精简概览并排；完整详情全宽在下；桌面/移动端/打印布局；复制面板的样式 |
| `V5.1_FINAL_DELIVERY/` 根文档与 `TEST_RESULTS/` | V5.1 测试、截图、离线包 |

## 修改

| 文件 | 修改 |
|---|---|
| `site/dist/map-provider.js` | 上半部改为 `map-upper`（地图 + `map-compact` 精简概览）；完整详情 `#map-detail` 由组件同一 `#gz-panel` 投影生成；选中/指标/重置事件同步概览和详情；不新增独立状态；地图设 `external-panel` |
| `site/dist/assets/maps/gz-district-map.js` | 组件 CSS 增加 `:host([external-panel])`：隐藏内部长侧栏、主区单列、地图容器高度收敛到 `clamp(400px,52vh,520px)`；**核心渲染/交互/数据逻辑未改** |
| `site/dist/app.js` | image1 探索性散点图的 `original-extra` 增加 `open`，无需点击即可见 |
| `site/dist/overview.js` | `original()` 将报告图从完整原文折叠中移到直接渲染区域；床位密度图 `map-original-record` 与相关统计 `analysis-disclosure` 默认 `open`；增加“含图表 details 自动 open”兜底 |
| `site/dist/index.html` | 引用 `v51-layout.css`；版本标注 V5.1 |
| `site/package.json` | 0.5.0 → 0.5.1 |
| `site/README.md` | V5.1 状态、布局/图表说明 |
| 根 `README.md`、`TEST_REPORT_V5.1.md`、`BOUNDARY_LICENSE_AND_REVIEW.md`、`OFFLINE_PACKAGE.md`、`HANDOFF_V5.1.md` | V5.1 交付/测试/交接 |

## 未改

- `dist/content.json`、`dist/visual-data.json`、`district_metrics.json`、`gz_districts_11.geojson`、4 原图、正文/统计口径/参考文献；
- 地图边界（OSM/ODbL）与地图审核状态；
- 图表标题、图例、坐标轴、Spearman/p/n、数据来源、质量提示；
- 原 V5 ZIP（保留未覆盖）。

## 行为变化

- 地图上方高度降低，右侧不再放置完整长面板；完整详情使用整行宽度。
- 所有图表默认可见；长篇原文/章节目录/审计行内详情/时间线仍可折叠。
- 图表的 `summary` 若包含图表会被自动展开；纯文字补充不强制展开。
