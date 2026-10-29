"""V5 map integration contract checks (real files on the feature branch)."""
import json, hashlib
from pathlib import Path

root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
maps = dist / 'assets' / 'maps'

m = json.loads((maps / 'district_metrics.json').read_text(encoding='utf-8'))
g = json.loads((maps / 'gz_districts_11.geojson').read_text(encoding='utf-8'))
p = (dist / 'map-provider.js').read_text(encoding='utf-8')
comp = (maps / 'gz-district-map.js').read_text(encoding='utf-8')
html = (dist / 'index.html').read_text(encoding='utf-8')
overview = (dist / 'overview.js').read_text(encoding='utf-8')

assert len(m['districts']) == 11 and len(m['metrics']) == 8
assert len(g['features']) == 11
codes = {str(d['adcode']) for d in m['districts']}
assert len(codes) == 11
assert {str(f['properties']['adcode']) for f in g['features']} == codes
assert all(f['geometry']['type'] in ('Polygon', 'MultiPolygon') for f in g['features'])
assert all(len(f['geometry']['coordinates']) > 0 for f in g['features'])
assert 'OpenStreetMap' in g['source']['name'] and 'ODbL' in g['source']['license']
assert 'OpenStreetMap' in m['meta']['boundary']['sourceName']
assert 'ODbL' in m['meta']['boundary']['license']
assert m['meta']['boundary']['reviewStatus'] == 'not_obtained'
assert 'DataV' not in json.dumps(m['meta']['boundary'], ensure_ascii=False)
assert 'DataV' not in json.dumps(g['source'], ensure_ascii=False)
assert 'ResearchMapSlot.register' in p and "assets/maps/" in p
assert 'labelOffsets' in p and 'map-attribution' in p and 'bars.append' in p
assert 'data-act="reset-view"' in comp and 'data-act="zoom-in"' in comp
assert 'map-provider.js' in html
assert 'v5-enhancements.css' in html
assert '2.5D' in overview and 'OpenStreetMap' in overview
assert not (dist / 'assets' / 'maps' / 'gz_districts_11.geojson').read_text(encoding='utf-8').startswith('{"type":"FeatureCollection","name":"广州')
# runtime must not use remote tiles/APIs
for token in ('https://tile', 'tile.openstreetmap.org', 'geo.datav.aliyun.com', 'webapi.amap.com'):
    assert token not in p and token not in comp

manifest = {
    'component_sha256': hashlib.sha256((maps / 'gz-district-map.js').read_bytes()).hexdigest(),
    'metrics_sha256': hashlib.sha256((maps / 'district_metrics.json').read_bytes()).hexdigest(),
    'geojson_sha256': hashlib.sha256((maps / 'gz_districts_11.geojson').read_bytes()).hexdigest(),
    'provider_sha256': hashlib.sha256((dist / 'map-provider.js').read_bytes()).hexdigest(),
    'boundary_source': 'OpenStreetMap contributors（Nominatim lookup）',
    'boundary_license': 'ODbL 1.0',
    'review_status': 'not_obtained',
    'note': 'V5 安全候选：替换原 DataV 边界层；OSM 许可明确，但官方标准画法图一致性/审图号仍未完成；未发布。',
}
(root / 'docs' / 'MAP_ASSET_MANIFEST_V5.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding='utf-8')
print('PASS: V5 地图契约：11区/8指标/11要素；OSM/ODbL；边界来源、审核状态、provider、2.5D控件与交互样式齐备')

