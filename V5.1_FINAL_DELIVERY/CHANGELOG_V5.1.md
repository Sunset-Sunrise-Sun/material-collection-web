# CHANGELOG V5.1（最终修订）

**分支**：`feat/v5-layout-polish`
**基线**：`feat/map-integration-v5` @ `fc35704d4c1839f3d83dc115c7fdb599ce4fe1f5`
**性质**：恢复原版双卡片布局、图表常显、v2.1 措辞/四主题同步；不重做地图/全文。

## 最终保留的修改

| 文件 | 修改 |
|---|---|
| `site/dist/app.js` | image1 探索性散点图 `original-extra` 默认 `open`；移除旧“第五主题待核”aside |
| `site/dist/overview.js` | `original()` 将报告图从完整原文折叠移出直接显示；床位密度图/相关统计默认 `open`；移除旧第五主题待核卡片/aside；含图表 details 自动 open 兜底 |
| `site/dist/content.json` | v2.1 同步：供给侧段落删除一句；4.4 导语“五→四”；4.4.4 标题改为“供给侧资金人力有限”；更新 version/sourceName/sourceSha256；统计/审计/文献未改 |
| `site/dist/index.html` | 版本 V5.1；阅读说明改为 v2.1 四主题；无布局 split CSS |
| `site/package.json` | 0.5.1 |
| `site/README.md`、根 README/`V21_CONTENT_DIFF.md`/`TEST_REPORT_V5.1.md`/`CHANGELOG_V5.1.md`/`HANDOFF_V5.1.md`/`OFFLINE_PACKAGE.md` | 最终交付/测试/内容差异 |

## 已撤销的 V5.1 尝试

本轮曾尝试“地图 + 精简概览并排、完整详情下方”的 split 布局，但用户验收后认为右侧变成一张过高概览卡、下方空白大、重点不突出。最终已撤销：

- 删除 `v51-layout.css` 及 split 布局；
- 恢复 V5 原 `map-provider.js` 与 `gz-district-map.js` 的右侧两张卡片结构；
- 地图/8指标/2.5D/联动/缩放/平移/键盘/移动端未重写；
- 未把完整详情移到地图下方；未合并卡片。

分支历史中保留了该尝试提交，可独立回退/审计；最终工作日树为恢复后的双卡结构。

## 未改

- `visual-data.json`、`district_metrics.json`、`gz_districts_11.geojson`、4 原图；
- 19 条参考文献、S1—S7 审计表 42 字段、统计数字和研究结论；
- 地图 OSM/ODbL 边界与审核状态；
- 原 V5 `V5_FINAL_DELIVERY.zip`（未覆盖）。

## 内容变化摘要

- 正文 89 段不变；字符数 13,766 → **13,747**（删去 19 字符）；
- 4.4 四主题；4.4.4 标题同步；
- 图表说明、来源、ρ/p/n、图例保留。
