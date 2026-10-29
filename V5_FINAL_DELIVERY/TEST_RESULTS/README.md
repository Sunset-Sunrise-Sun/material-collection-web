# V5 TEST_RESULTS

**本轮实际执行**（2026-10-29；Edge 156/CDP；桌面 1440×900、移动 390×844）

| 文件 | 内容 |
|---|---|
| `v5-e2e-results-local.json` | 本地源码 E2E：14/14 通过 |
| `v5-e2e-results-offline.json` | 外部 HTTPS 阻断下 E2E：14/14 通过 |
| `v5-e2e-results-package-offline.json` / `v5-package-offline.log` | 解压 ZIP 后离线 E2E：14/14 通过 |
| `v5-e2e-local.log` / `v5-e2e-offline.log` | 上述运行日志 |
| `v5-failure-results.json` / `v5-failure.log` | 地图资源失败降级 + 合成缺失值（missingCount=2；显示“—（缺失）”，非 0） |
| `npm-check-v5.log` | `npm run check`：PASS，退出码 0 |
| `screenshots/before-safe-panel-v4.png` | 修改前：V4 非地理 11 区面板 |
| `screenshots/v5-desktop-map.png` | V5 桌面 2.5D 地图 |
| `screenshots/v5-map-selected.png` | 地图选中海珠区、条形联动 |
| `screenshots/v5-desktop-affordance.png` | 展开入口/证据核查 |
| `screenshots/v5-mobile-map.png` | V5 390px 地图/指标/条形 |
| `screenshots/v5-map-fallback.png` | 地图资源失败降级 |
| `v5_e2e.cjs` / `v5_failure.cjs` | 可复跑测试脚本 |

## 结果摘要

- 地图：11 区、11 标签、11 条形、8 指标、88 值全部匹配原数据。
- 交互：地图↔条形双向、详情、重置、键盘 Enter/Esc、缩放/滚轮/拖拽/重置视图。
- 移动端：`scrollWidth=390`、地图宽 346、无页面横向溢出；指标按钮换行不裁切；触摸选中。
- 内容：5 章/89 段/13,766 字符/41 子标题/19 文献/4 原图；第 2 章区位图、原 V3 床位图保留；非地理面板 0、地图槽 1。
- 展开入口：27 个可见 `summary` 最小高度 45px，整行点击/图标/展开正常。
- 无脚本错误、无外部 HTTP 请求、无正常资源失败；地图资源失败测试有 3 个受控 blocked request（预期）。

## 历史结果（不冒充本轮）

V4 地图版 28/28、模块 48/48、V4 安全面板 20/20 与失败/缺失 5/5 均为历史；V5 本轮实际为 14/14（本地）+14/14（外网阻断）+失败/缺失检查。

## 未覆盖

Safari/Firefox/真机触摸/真实屏幕阅读器；地图审核/审图号；原始 DOCX；Lighthouse/CLS 性能量化。

