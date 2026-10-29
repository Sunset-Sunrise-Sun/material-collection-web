# 边界数据许可、坐标系与地图审核记录（V5）

**状态**：V5 为独立分支/离线候选；**未发布、未合并 main**。本文件记录事实与未决项，不构成“已合规”结论。

## 1. 原 V4 边界：已移除，未恢复

原 V4 使用 DataV GeoAtlas 的 `440100_full.json` 生成 `gz_districts_11.geojson`：

- 原文件 SHA-256：`c2793000c61b805e1435f5c7282317531ce8a06ac02d9e9a7bb5f1f891522b97`（63,494 B）
- 官方 DataV 文档说明：数据来自高德开放平台，**“仅供学习和交流使用”**；版权问题需向高德确认。
  - https://help.aliyun.com/zh/datav/datav-7-0/user-guide/datav-geoatlas-widgets/
- 高德开放平台服务协议对平台内容的存储、缓存、抓取、脱离服务使用及应送审地图发布有约束：
  - https://lbs.amap.com/pages/terms
- 原边界文件未声明坐标系，独立核验未通过；未取得审图号。

因此，V5 **没有恢复**原 DataV GeoJSON/地图供应文件；改用新的边界数据层（见下）。原 V4 交付包仍保留在外部目录，未修改。

## 2. V5 边界数据：OpenStreetMap / ODbL

- 来源：OpenStreetMap contributors，经 **Nominatim lookup** 批量读取 11 个区 relation（`polygon_geojson=1`），2026-10-29 获取。
- relation ID：
  - 440103 荔湾 3287617；440104 越秀 3987394；440105 海珠 3287615；440106 天河 3987435；440111 白云 3987393；440112 黄埔 3987437；440113 番禺 3287618；440114 花都 3287616；440115 南沙 3287345；440117 从化 3287298；440118 增城 3287299。
- 许可：**Open Database License (ODbL) 1.0**；署名 **© OpenStreetMap contributors**。
  - https://opendatacommons.org/licenses/odbl/1-0/
  - https://www.openstreetmap.org/copyright
- 页面地图下方、指标详情均有署名、许可与审核状态；离线包随附本记录。
- 生成文件：`site/dist/assets/maps/gz_districts_11.geojson`；SHA-256 `aa3e55870e55cc925ab4a55073ce4f6d28c43489023e1c3b9a52e79ea8c8b14e`；777,498 B。
- 每要素保留 `adcode/name/center/centroid/areaKm2Geometric/osmRelationId/boundarySource/boundaryLicense`。

### 2.1 坐标系

- OSM/Nominatim 按 **WGS84 (EPSG:4326)** 经纬度返回；本候选未另做投影，无底图叠加。
- 已做基本检查：11 要素、11 adcode、环闭合、坐标范围/数值、面类型；**未**与官方标准画法图逐点比对，也**未**由有资质单位独立核验。
- 因此只记录“按 OSM 的 WGS84 声明使用”，**不宣称完成坐标系验证**。

### 2.2 边界准确性

- OSM 是社区维护数据，**不是官方勘定界线**；不得用于米级定位、面积/界线争议或官方界线发布。
- 本候选只做区级示意/比较；页面保留“无底图、边界仅示意”的组件提示。

## 3. 地图审核

- **未取得审图号/未完成地图审核**（`reviewStatus=not_obtained`）。
- 依据：《地图管理条例》公开地图原则上应送审；展示/登载者送审；审图号；互联网地图服务资质/审核；《地图审核管理规定》展示/登载应申请、互联网地图审图号标注等。
  - https://xzfg.moj.gov.cn/front/law/detail?LawID=421&Query=
  - https://www.gov.cn/zhengce/2019-08/13/content_5711407.htm
  - https://www.gov.cn/gongbao/content/2023/content_5752310.htm
- V5 只在**独立分支和离线包**中供内部评审；**尚未公开部署**。这不等于审核通过。
- 若用于公开网页、竞赛正式提交或其他公开场景，须由项目负责人/主管部门确认适用要求、责任主体、申请路径、材料与时限，并取得相应结论/审图号；在此之前不得声称合规。
- 离线提交/内部评审与公开发布不是同一法律场景；本记录不把“未公开”当作“无需审核”。

## 4. 指标数据来源（未改）

指标来自原研究数据：2025 年末户籍 60+/65+/80+ 人口、2026-09-23 养老机构备案床位、2025-02-05 长者饭堂、2023-11 基层医疗名录。数据口径与限制见：
- `site/dist/assets/maps/district_metrics.json`
- `site/docs/` 中的原研究来源记录

已知限制：2026 床位/2025 人口跨年；备案床位≠可用床位；设施数量≠服务能力；2 条机构区划冲突；2 组饭堂同址重复；基层医疗 2023-11 较旧；`focusRule=null`，不标重点区。

## 5. 组件修改记录

为准确展示新许可并解决 390px 入口裁切，V5 对原组件做了两处非核心逻辑修改：

1. 边界摘要从“许可待核”改为读取 `meta.boundary.license/crs`（避免对 OSM 作错误许可声明）。
2. ≤599px 时指标按钮从横向滚动改为换行（保证全部指标可见可点）。

组件其余渲染/交互（2.5D、8指标、地图↔条形、详情、缩放/平移/重置、键盘、缺失处理）保持原实现；指标数据与 11 区关系未改。见 `CHANGELOG_V5.md` 与 `site/docs/MAP_ASSET_MANIFEST_V5.json`。

## 6. 结论

- 许可层：原 DataV 不再使用；新 OSM 层许可明确（ODbL 1.0），需署名/共享。
- 坐标系/准确性：按 OSM WGS84 记录；**未完成官方标准画法图核验**。
- 审核：**未取得审图号**；分支/离线可用，公开/正式提交前需完成审核判断。
- **不把本候选描述为已审核、官方边界或已发布。**
