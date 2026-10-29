# V5 边界层来源、许可与审核记录

## 1. 结论摘要

- 原 V4 的 **DataV GeoAtlas** 边界层已从本候选移除；**没有恢复**原 GeoJSON。
- V5 使用 **OpenStreetMap contributors** 的 11 个区 relation，经 Nominatim lookup 获取并转换为 `MultiPolygon` GeoJSON。
- 许可：**Open Database License (ODbL) 1.0**，需署名 © OpenStreetMap contributors；衍生数据库按 ODbL 共享。
- 坐标系：按 OSM/Nominatim 的 **WGS84 (EPSG:4326)** 记录，未声明为其他坐标系；未用权威标准画法图独立核验。
- 地图审核：**未取得审图号**；未与官方标准画法图核验。故本候选**仅用于独立分支内部评审/离线验收，未发布、未合并 main**。
- 本记录不构成“地图合规已完成”的声明。

## 2. 数据来源

- 数据提供者：OpenStreetMap contributors。
- 获取方式：Nominatim lookup API，`polygon_geojson=1`，按以下 OSM relation ID 批量读取（2026-10-29）：
  - 440103 荔湾区 — relation 3287617
  - 440104 越秀区 — relation 3987394
  - 440105 海珠区 — relation 3287615
  - 440106 天河区 — relation 3987435
  - 440111 白云区 — relation 3987393
  - 440112 黄埔区 — relation 3987437
  - 440113 番禺区 — relation 3287618
  - 440114 花都区 — relation 3287616
  - 440115 南沙区 — relation 3287345
  - 440117 从化区 — relation 3287298
  - 440118 增城区 — relation 3287299
- 页面/接口：`https://nominatim.openstreetmap.org/lookup`；来源说明：`https://www.openstreetmap.org/copyright`。
- 生成文件：`dist/assets/maps/gz_districts_11.geojson`；每要素保留 `adcode`、`name`、`center`、`centroid`、`areaKm2Geometric`、`osmRelationId`、`boundarySource`、`boundaryLicense`。

## 3. 许可与署名

- **Open Database License (ODbL) 1.0**：`https://opendatacommons.org/licenses/odbl/1-0/`
- 署名：**© OpenStreetMap contributors**；页面地图下方与指标详情均有署名/许可/审核状态提示。
- 离线包随附本文件；不得删除署名或将边界层作为“官方勘定界线”再发布。
- Nominatim 使用须遵守其使用政策（署名、合理请求频率）；本次为一次性批量 lookup，生成后页面不联网调用 Nominatim。

## 4. 坐标系与几何核验

- OSM/Nominatim 声明/按 WGS84 经纬度返回；未另行投影。
- 已做的基本检查：11 个要素、11 个 adcode、环闭合、坐标范围/经纬度数值、面要素类型；未做官方标准画法图逐点比对。
- **不宣称**“坐标系已验证”或“边界与官方标准画法图一致”；如需正式地图发布，应由主管部门/有资质单位核验。

## 5. 地图审核状态

- 状态：**not_obtained（未取得审图号 / 未完成地图审核）**。
- 本分支未发布到 GitHub Pages 或任何公开站点；在分支/离线包中仅供内部评审。
- 若用于公开网页、竞赛正式提交或其他公开场景，须由项目负责人按《地图管理条例》《地图审核管理规定》确认责任主体、申请路径、材料与时限，并取得相应审图号/审核结论；在此之前不得声称已合规。
- 原 DataV 边界的许可/再分发问题不再适用于本候选的展示内容；但 OSM 边界仍是非官方界线，地图审核问题**没有**因此自动解决。

## 6. 组件修改记录

为准确展示新数据/许可并改善可控性，对原组件做了两处**非渲染逻辑**修改：

1. 边界摘要行由“许可未见明确声明，待核”改为从 `meta.boundary.license/crs` 动态显示（避免错误声明 OSM 许可）。
2. 小屏（≤599px）指标按钮由横向滚动改为换行显示（避免 390px 下入口被裁切）；地图主体/8指标/2.5D/联动/缩放/键盘逻辑未改。

其余地图组件、指标数据、11区几何关系沿用原模块；完整差异见 `CHANGELOG_V5.md`。

## 7. 数据文件哈希

见 `docs/MAP_ASSET_MANIFEST_V5.json`（由 `scripts/verify_map_integration_v5.py` 重新计算）。
