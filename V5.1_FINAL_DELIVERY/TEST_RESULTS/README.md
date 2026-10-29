# V5.1 TEST_RESULTS

**实际执行**：2026-10-29；Edge 156/CDP；桌面 1440×900、移动 390×844。

| 文件 | 内容 |
|---|---|
| `v51-e2e-results-local.json` | 本地 E2E：21/21 通过 |
| `v51-e2e-results-offline.json` | 外部 HTTPS 阻断 E2E：21/21 通过 |
| `v51-e2e-results-package-offline.json` | 解压 V5.1 ZIP 后离线 E2E：21/21 通过 |
| `v51-e2e-local.log` / `v51-e2e-offline.log` / `v51-package-offline.log` | 对应运行日志 |
| `v51-failure-results.json` / `v51-failure.log` | 地图资源失败降级 + 合成缺失值 |
| `npm-check-v51.log` | `npm run check`：PASS，退出码 0 |
| `screenshots/before-v51-layout.png` | 修改前 V5 原版双卡布局 |
| `screenshots/v51-desktop-map.png` | V5.1 地图 + 右侧两张卡片 |
| `screenshots/v51-layout-selected.png` | 选中海珠区后的第二张详情卡 |
| `screenshots/v51-chart-scatter.png` | 探索性散点图默认可见 |
| `screenshots/before-chart-scatter-v5.png` | 修改前散点图折叠状态 |
| `screenshots/v51-charts-chapter4.png` | 第4章图表默认可见 |
| `screenshots/v51-mobile-map.png` | 390px 地图 |
| `screenshots/v51-map-fallback.png` | 地图资源失败降级 |

## 摘要

- 布局：恢复原版右侧两张卡片；地图在左、卡片在右；无 split 大卡/空白。
- 地图：11 区/8 指标/88 值/地图↔条形/详情/重置/缩放/滚轮/拖拽/键盘。
- 图表：散点图无需点击；第 2/4 章图表默认可见；ρ/p/n 与解释保留。
- 内容：89段/**13,747字**/41子标题/19文献/4图；4.4 四个主题；4.4.4 标题已同步；统计/审计/文献未改。
- 控制台 0 error；外部请求 0；正常资源失败 0（受控失败除外）。

## 历史结果

V5 的 14/14、V4 28/28、模块 48/48 为前序结果，不作为 V5.1 本轮数字。
