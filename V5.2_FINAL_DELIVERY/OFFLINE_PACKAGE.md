# OFFLINE PACKAGE — 使用与边界（V5.2）

## 启动

1. 解压完整 `V5.2_FINAL_DELIVERY.zip`。
2. 双击 `V5.2_FINAL_DELIVERY/start-local.bat`。
3. 浏览器打开 `http://127.0.0.1:8765/#s-4-1`。

脚本优先使用 Node.js 18+ 的 `site/scripts/serve.mjs`；未找到 Node 时退回 Python 3 的 `http.server`。关闭控制台窗口即停止服务。

**不要直接双击 `site/dist/index.html`**：`file://` 下浏览器会阻止 `fetch` 读取报告/地图 JSON。

## 为什么必须是 HTTP

网页通过 `fetch()` 读取 `content.json`、`district_metrics.json`、`gz_districts_11.geojson`；地图组件、原图、CSS 也需要同源静态服务。启动脚本只监听 `127.0.0.1`，不连接外网。

## 包内必需内容

- `site/dist/index.html`、JS/CSS、`content.json`、`visual-data.json`；
- `site/dist/assets/maps/gz-district-map.js`、`district_metrics.json`、`gz_districts_11.geojson`；
- 4 个图片资产（页面展示3张；旧 `image1.png` 仅作审计）、favicon；
- 五章正文、19 文献、原 V3 床位图；
- `site/scripts/serve.mjs` 或系统 Python；
- `BOUNDARY_LICENSE_AND_REVIEW.md`、`TEST_REPORT_V5.2.md`、`KNOWN_LIMITATIONS.md`。

无 CDN、远程地图瓦片、在线地图 API、在线字体依赖；地图边界已随包提供，不在运行时请求 Nominatim/OSM。

## 已验证的离线行为

- 浏览器阻断外部 `https://*` 后，本地服务仍可启动，地图 11 区/8 指标/88 值/地图↔条形/缩放/重置/键盘/移动端正常（V5.2 E2E 28/28）。
- 地图资源被阻断时显示降级提示，报告正文/原图可读；恢复后地图重新加载。
- 缺失值显示“—（缺失）”，不显示 0。

## 限制

- 离线/内部评审不等于地图审核通过；OSM 边界非官方勘定界线，审图号未取得。公开/正式提交前按 `BOUNDARY_LICENSE_AND_REVIEW.md` 处理。
- 需要 Node.js 18+ 或 Python 3；没有安装运行时则启动脚本会提示。
- 移动端/桌面为 Chromium 系测试；Safari/Firefox/真机触摸未测。
- 长者饭堂独立密度图不存在、“AI说大实话”两处未定位、`(2).docx`缺失，详见 `KNOWN_LIMITATIONS.md`。
