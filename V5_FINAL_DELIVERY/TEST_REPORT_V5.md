# V5 测试报告（本轮实际执行）

**环境**：Windows 11；Microsoft Edge 156 headless + CDP；Node 24.19.0；桌面 1440×900；移动 390×844（mobile:true,dpr2）；真实鼠标/触摸/键盘输入。
**日期**：2026-10-29。

## 1. 实际执行结果

| 测试 | 结果 | 证据 |
|---|---|---|
| `npm run check`（内容/视觉/视图/地图契约） | **PASS，退出码 0**（5 条检查 PASS + JS 语法检查） | `npm-check-v5.log` |
| 本地源码浏览器 E2E | **14/14 通过、0 失败** | `v5-e2e-results-local.json` |
| 外部网络阻断（`https://*`）下 E2E | **14/14 通过、0 失败** | `v5-e2e-results-offline.json` |
| 解压 ZIP 后离线运行（端口 3050，外部阻断） | **14/14 通过、0 失败** | `v5-e2e-results-package-offline.json` / `v5-package-offline.log` |
| 地图资源失败隔离 | 降级提示出现；正文可读；解除阻断后恢复 11 卡/地图 | `v5-failure-results.json`、`v5-map-fallback.png` |
| 缺失值（组件注入合成夹具） | 海珠/从化缺失显示“—（缺失）”；`missingCount=2`；无 0 误显示 | `v5-failure-results.json` |
| 内容回归 | 5 章、89 段、13,766 字符、41 子标题、19 文献、4 原图；第2章2图、原V3床位图保留 | `v5-e2e-results-local.json` |
| 交互入口 | 27 个可见 `summary`，最小高度 **45px**；图标可见、整行点击展开 | `v5-e2e-results-local.json`、`v5-desktop-affordance.png` |
| 移动端 390px | `scrollWidth=390/clientWidth=390`；地图宽 346；11 区/11 条正常；触摸选中 | `v5-e2e-results-local.json`、`v5-mobile-map.png` |

### 14 项 E2E 覆盖

1. 11 区/11 标签/11 条形/8 指标渲染；
2. 内容 89 段/13766 字/41 子标题/19 文献/4 图；非地理面板为 0、地图槽为 1；
3. 8 指标逐个点击：指标 id、11 条形值、88 值全部匹配原数据；
4. 地图点击 → 条形/详情同步（真实点击）；
5. 条形点击 → 地图/详情同步（真实点击）；
6. 重置视图清空选中；
7. 缩放按钮/滚轮缩放/拖拽平移/恢复视图；
8. 键盘 Enter 选中、Escape 清除；
9. 展开入口尺寸/图标/整行点击；
10. 390px 无页面横向溢出；
11. 移动端触摸地图 → 条形同步；
12. 无外部 HTTP 请求；
13. 无脚本错误；
14. 无真实资源失败（受控失败测试另列）。

## 2. 离线测试说明

- 在浏览器层用 CDP `Network.setBlockedURLs({urls:['https://*']})` 阻断外部 HTTPS，页面/地图/CSS/JSON/图片全部只从本地 `http://127.0.0.1:3040` 加载；E2E 仍 14/14。
- 这不是物理拔网线，但能验证：运行时没有 CDN、远程瓦片、在线地图 API、外部字体等依赖；离线包内资源完整。
- 离线 ZIP 解压后另做本地服务/包内运行检查：解压到临时目录，从 `site/` 启动静态服务，外部 HTTPS 阻断下 E2E **14/14 通过**；`start-local.bat` 实际启动并返回 HTTP 200（Node 路径）。

## 3. 历史结果（不是本轮新跑）

- V4 地图版宿主 E2E 28/28（前序验收）；
- 原地图模块 48/48（原交付方）；
- V4 安全面板本地 20/20、失败/缺失 5/5（前序）。
- 上述历史结果**没有**作为 V5 本轮测试结果；V5 本轮为新跑的 14/14 + 失败/缺失检查。

## 4. 未覆盖

- Safari、Firefox、真机触摸、真实屏幕阅读器/axe 自动化未测。
- 地图审核/审图号：**未取得**，未做官方标准画法图比对；不能以本测试报告证明地图合规。
- 原始 DOCX 未随包；正文按 `content.json`/DOM/交付记录核验。
- 未做 Lighthouse/CLS 等性能量化；地图 700px 宽时高度较大，需滚动查看完整 11 区。

## 5. 截图

`TEST_RESULTS/screenshots/`
- `before-safe-panel-v4.png`、`before-safe-panel-mobile-v4.png`：修改前安全面板；
- `v5-desktop-map.png`：V5 地图桌面；
- `v5-desktop-affordance.png`：展开入口/证据核查；
- `v5-mobile-map.png`：V5 390px 地图/指标/条形；
- `v5-map-fallback.png`：地图资源失败降级；
- `v5-map-selected.png`（若已生成）：地图选中/详情。

## 6. 验收结论

**V5 开发分支的集成、交互、内容回归、移动端和外部网络阻断测试通过。**  
**未合并 main、未部署；不能把本地测试通过当作线上部署成功。**

