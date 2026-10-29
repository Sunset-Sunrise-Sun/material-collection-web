# 广州 AI 养老研究网页 V5 — 2.5D 地图集成与离线交付

**分支**：`feat/map-integration-v5`（独立开发分支）
**基线**：`main` @ `a4552fb38e48e41ee8063e3459cb621933562af4`
**状态**：V5 为**本地/分支候选，未合并 main、未部署、未覆盖当前线上网页**。
**当前线上**：仍是此前的安全候选版（GitHub Pages，独立静态副本）；本轮未修改其部署。

## 1. 快速运行

### 离线包（推荐）

解压 `V5_FINAL_DELIVERY.zip`，双击根目录：

```text
start-local.bat
```

脚本会用 Node.js 18+ 启动本地 `http.server` 并打开：

```text
http://127.0.0.1:8765/#s-4-1
```

若没有 Node.js，则退回 Python 3 的 `http.server`。**不要直接双击 `dist/index.html`**：浏览器会拦截本地 `fetch()`。

### 源码运行

```powershell
cd site
npm run dev
# http://localhost:3000/#s-4-1
```

## 2. V5 改了什么

- 第 4 章 4.1 接入原 `gz-district-map` v1.0.0：11 区、8 指标、2.5D 高度/颜色、区详情、地图↔条形双向联动、滚轮/按钮缩放、拖拽平移、重置、键盘、移动端。
- 移除非地理 11 区比较面板；地图替代其位置，不再重复占据主展示区。
- 保留五章正文、89 段/13,766 字符、41 子标题、19 文献、4 原图、第 2 章区位图、第 4 章原 V3 床位图。
- 放大 `summary` 展开入口的图标/整行点击区（≥44px）、增加 hover/focus/open 状态；不改变原折叠内容。
- 增加离线启动脚本和完整静态资源（无 CDN/远程瓦片/在线地图 API）。
- 边界层由 DataV 换为 **OpenStreetMap/ODbL**；地图审核/审图号仍未取得。详见 `BOUNDARY_LICENSE_AND_REVIEW.md`。

## 3. 实际测试（本轮）

- 本地源码 E2E：**14/14 通过**（11区/8指标/88值/地图↔条形/重置/缩放/平移/键盘/详情/移动端/无外部请求/无脚本错误）。
- 外部网络阻断下 E2E：**14/14 通过**；解压 ZIP 后离线复跑：**14/14 通过**（所有资源来自本地包）。
- 地图资源失败隔离：降级提示出现、报告正文/图表可读；恢复后地图重新加载。
- 内容：89 段 / 13,766 字符 / 41 子标题 / 19 文献 / 4 原图，未改研究结论。
- 交互入口：27 个可见 `summary` 的最小高度 **45px**，图标可见，整行点击/展开正常。
- 详细结果、截图、历史结果与未测项见 `TEST_REPORT_V5.md` 与 `TEST_RESULTS/`。

## 4. 目录

```
V5_FINAL_DELIVERY/
├─ start-local.bat                  Windows 一键启动
├─ site/                            完整可运行源码（dist + scripts + docs）
├─ BOUNDARY_LICENSE_AND_REVIEW.md   边界许可/坐标系/审核记录
├─ TEST_REPORT_V5.md                本轮实际测试
├─ CHANGELOG_V5.md                  相对 V4 的修改
├─ HANDOFF_V5.md                    分支、部署与回退说明
├─ OFFLINE_PACKAGE.md               离线包使用与限制
└─ TEST_RESULTS/                    结果、截图、测试脚本、检查日志
```

## 5. 关键限制

- **未合并 main、未部署**；当前 GitHub Pages 仍展示旧安全候选版。
- **地图审核/审图号未取得**；OSM 边界非官方勘定界线，坐标系按 OSM WGS84 记录，未与官方标准画法图独立核验。分支/离线包仅供内部评审；公开或正式提交前需完成地图审核判断。
- `focusRule=null`，不标注重点区、不新增排名/推广优先级；区级描述不外推因果、街镇供需匹配或 AI 效果。
- Safari/Firefox/真机触摸/真实屏幕阅读器未测。
- 未修改原始研究数据/正文；未修改 `material-collection` 原始资料仓库。

