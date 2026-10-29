# CHANGELOG V5（相对当前 main / V4 安全候选）

**分支**：`feat/map-integration-v5`
**基线**：`main` @ `a4552fb38e48e41ee8063e3459cb621933562af4`（当前线上安全候选 ZIP 的提交）
**原则**：不修改 main、不部署、不删除旧版本；V5 全部改动在分支/离线包。

## 新增

| 文件 | 原因 |
|---|---|
| `site/dist/assets/maps/district_metrics.json`、`gz-district-map.js` | 恢复原 2.5D 地图组件；组件文件来自冻结模块；本次仅改边界显示文案 + 小屏指标换行 |
| `site/dist/assets/maps/gz_districts_11.geojson` | **新** OSM 边界层（ODbL 1.0），替代原 DataV 边界；11 区 relation 见 `BOUNDARY_LICENSE_AND_REVIEW.md` |
| `site/dist/v5-enhancements.css` | 展开入口 ≥44px、图标、hover/focus/open；地图边界署名/审核提示样式 |
| `start-local.bat` | Windows 一键离线启动（Node 优先，Python 兜底，打开 4.1） |
| `site/docs/BOUNDARY_SOURCE_OSM.md`、`site/docs/MAP_ASSET_MANIFEST_V5.json` | 边界来源/许可/坐标/审核状态与哈希 |
| `TEST_RESULTS/v5_e2e.cjs`、`v5_failure.cjs`、结果 JSON、截图 | 本轮实际测试证据 |
| 根目录 `README.md`、`BOUNDARY_LICENSE_AND_REVIEW.md`、`TEST_REPORT_V5.md`、`CHANGELOG_V5.md`、`HANDOFF_V5.md`、`OFFLINE_PACKAGE.md` | 交付/验收/交接 |

## 修改

| 文件 | 修改 |
|---|---|
| `site/dist/index.html` | 引入 `v5-enhancements.css`；版本标注 V5 候选；阅读说明更新 |
| `site/dist/map-provider.js` | 恢复原地图适配；增加 OSM 署名/审核提示；恢复条形 append；地图事件/选中/缩放/清理沿用；响应式标签偏移 |
| `site/dist/overview.js` | 4.1 恢复 2.5D 地图入口；说明缩放/平移/键盘；边界质量提示改为 OSM/ODbL + 审核未取得 |
| `site/dist/assets/maps/district_metrics.json` | 仅更新 `meta.boundary` 为 OSM 来源/许可/坐标/审核状态；**指标数值未改** |
| `site/dist/assets/maps/gz-district-map.js` | 仅两处：边界摘要动态显示许可/坐标；≤599px 指标按钮由横向滚动改为换行。核心渲染/交互未改 |
| `site/package.json` | 0.3.1 → 0.5.0；检查改用 `verify_map_integration_v5.py` |
| `site/README.md` | V5 状态、运行、边界/审核限制 |
| 删除旧 `DELIVERY_STATE.json`、`.openai`、旧 V4 地图专属 docs | 避免把 V5 候选误标为已保存 Sites 版本；旧 DataV 文档不再作为当前说明 |

## 未改

`dist/content.json`、`dist/visual-data.json`、4 张原图、五章正文、41 子标题、19 文献、原 V3 床位图、指标数值/口径、章节路由。

