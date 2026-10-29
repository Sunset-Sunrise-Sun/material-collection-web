# V5.1 排版优化测试报告

**日期**：2026-10-29
**环境**：Windows 11；Microsoft Edge 156 headless + CDP；桌面 1440×900；移动 390×844（mobile:true,dpr2）；真实鼠标/触摸/键盘输入。
**分支**：`feat/v5-layout-polish`（基线 `fc35704d4c1839f3d83dc115c7fdb599ce4fe1f5`）

## 1. 实际执行结果

| 测试 | 结果 | 证据 |
|---|---|---|
| `npm run check` | **PASS，退出码 0**（5 条检查 PASS + JS 语法） | `npm-check-v51.log` |
| 本地浏览器 E2E | **21/21 通过、0 失败** | `v51-e2e-results-local.json` |
| 外部 HTTPS 阻断 E2E | **21/21 通过、0 失败** | `v51-e2e-results-offline.json` |
| 解压 ZIP 后离线运行（端口 3070，外部 HTTPS 阻断） | **21/21 通过、0 失败** | `v51-e2e-results-package-offline.json` / `v51-package-offline.log` |
| 地图资源失败隔离 | 降级提示出现；正文可读；恢复地图 | `v51-failure-results.json`、`v51-map-fallback.png` |
| 缺失值（组件注入合成夹具） | `missingCount=2`；显示“—（缺失）”，无 0 误显示 | `v51-failure-results.json` |
| 内容回归 | 5 章、89 段、13,766 字符、41 子标题、19 文献、4 图；第2章2图、原V3床位图保留 | E2E / `npm-check-v51.log` |
| 数据一致性 | `content.json`、`visual-data.json`、`district_metrics.json`、`gz_districts_11.geojson`、4 原图 SHA-256 与 V5 完全一致 | 见第 4 节 |

### 1.1 21 项 E2E 覆盖

1. 11 区/11 标签/11 条形/8 指标；
2. 内容 89 段/13,766 字/41 子标题/19 文献/4 图；非地理面板 0、地图槽 1；
3. **V5.1 分栏布局**：地图与精简概览顶部对齐、等高，完整详情位于下方且全宽；
4. 8 指标逐个点击：指标 id、11 条形值、88 值全部匹配原数据；
5. 地图真实点击→条形/完整详情同步；
6. 条形点击→地图/完整详情同步；
7. 精简概览与完整详情显示同一区；详情含全部8项指标/原始计数/质量提示；
8. 重置视图清空选中；
9. 缩放按钮/滚轮/拖拽平移/恢复视图；
10. 键盘 Enter 选中、Escape 清除；
11. 展开入口尺寸/图标/整行点击；
12. **探索性散点图默认可见**（不点击 summary）；
13. **第4章图表全部默认可见**（床位密度图、相关统计、年度图、image3/4）；
14. **相关统计文字保留**（ρ、p、n 存在）；
15. 390px 无横向溢出；
16. 移动端地图、概览、完整详情纵向排列；
17. 移动端触摸选中→地图/条形同步；
18. 移动端概览/详情同步；
19. 无外部 HTTP 请求；
20. 无脚本错误；
21. 无正常资源失败（受控失败测试另列）。

## 2. 离线包测试

- ZIP 解压到临时目录，从 `site/` 启动本地静态服务（3070）；外部 HTTPS 阻断下 E2E **21/21 通过**。
- `start-local.bat` 在最终 ZIP 解压目录实启，HTTP 200（Node 路径）；关闭窗口停止。
- 包内无 CDN、远程地图瓦片、在线 API、外部字体；地图/图表/图片均本地。

## 3. 图表检查清单

| 图表 | 原位置 | 状态 |
|---|---|---|
| 探索性散点图 image1 | 第2章研究区域 | `<details class="original-extra" open>`；图、标题、Spearman/p/n、图例/坐标轴可见 |
| 区位图 image2 | 第2章 | 直接渲染，可见 |
| 床位供给代理密度图 image3 | 第4章 | 从完整原文折叠移出，直接渲染 |
| 高龄人口结构与床位密度气泡图 image4 | 第4章 | 直接渲染 |
| 原 V3 床位交互图 | 4.1.1 | `map-original-record` 默认展开 |
| 相关统计 | 4.1.1 | `analysis-disclosure` 默认展开；ρ/p/n 保留 |
| 年度变化图 | 4.1.3 | 原本直接渲染，保持 |
| 地图联动条形 | 4.1 | 保持可见 |

长篇完整原文、章节工具、审计行内详情、时间线等**非图表**补充内容仍可折叠；未改写其文字。

## 4. 数据/正文一致性（SHA-256）

| 文件 | V5 与 V5.1 |
|---|---|
| `content.json` | 一致 `f99de25ac358ff56…` |
| `visual-data.json` | 一致 `b593c972092de522…` |
| `district_metrics.json` | 一致 `0a4b15f0cd2403ed…` |
| `gz_districts_11.geojson` | 一致 `aa3e55870e55cc92…` |
| `image1.png` | 一致 `8e9ebc789e4bb562…` |
| `image2.png` | 一致 `5dee8191c56c6121…` |
| `image3.png` | 一致 `0b435f048dc04ed8…` |
| `image4.png` | 一致 `e59560bcd16d886a…` |

结论：**只改布局/展开状态，未改研究数据、正文、指标口径、边界或图片**。

## 5. 截图

`TEST_RESULTS/screenshots/`
- `before-v51-layout.png`：V5 旧地图/侧栏布局；
- `v51-layout-default.png`、`v51-layout-selected.png`：V5.1 地图 + 精简概览 + 下方详情；
- `v51-detail-desktop.png`、`v51-detail-mobile.png`：完整详情；
- `v51-chart-scatter.png`：探索性散点图默认可见；
- `v51-charts-chapter4.png`：第4章图表区；
- `v51-mobile-map.png`：390px 地图；
- `before-chart-scatter-v5.png`：修改前散点图折叠状态；
- `v51-map-fallback.png`：地图失败降级。

## 6. 历史结果（不冒充本轮）

V5 地图版 14/14 及其外网阻断/失败测试、V4 28/28、模块 48/48 均为前序结果；V5.1 本轮实际为 **21/21**（本地）+ **21/21**（外网阻断）+ 包内/失败测试。

## 7. 未覆盖

- Safari、Firefox、真机触摸、真实屏幕阅读器/axe 自动化；
- 地图审核/审图号；官方标准画法图逐点核验；
- Lighthouse/CLS 性能量化；
- 原始 DOCX 逐块比对（正文按 `content.json`/DOM/交付记录核验）。

## 8. 结论

**V5.1 的布局调整、全站图表默认展示、内容/数据一致性和地图回归测试通过。**
**未合并 main、未部署；不能把本地测试当作线上发布成功。**
