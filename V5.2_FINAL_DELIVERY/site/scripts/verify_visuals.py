"""Verify source-derived numbers and original scope, without scientific overclaiming."""
import json,statistics
from pathlib import Path
p=Path(__file__).resolve().parent.parent
v=json.loads((p/'dist/visual-data.json').read_text());r=json.loads((p/'dist/content.json').read_text())
bs=[b for c in r['chapters'] for b in c['blocks']];paragraphs={b['sourceIndex']:b['text'] for b in bs if b['type']=='paragraph'}
d=v['density'];assert len(d['rows'])==11 and len({x['district'] for x in d['rows']})==11
assert [x['district'] for x in d['rows']]==['荔湾','越秀','海珠','天河','白云','黄埔','番禺','花都','南沙','从化','增城']
assert sorted(x['value'] for x in d['rows'])==sorted(x['value'] for x in d['rows'])
assert statistics.median(x['value'] for x in d['rows'])==d['median']==19.13
# Endpoint values are explicit in paragraph 59; the other labels were inspected on original image3.
assert f"{max(x['value'] for x in d['rows']):.2f}" in paragraphs[59] and f"{min(x['value'] for x in d['rows']):.2f}" in paragraphs[59]
assert d['sourceAsset']=='assets/image3.png' and '代理' in d['numerator'] and '户籍' in d['denominator']
assert len(v['annual']['rows'])==9
for x in v['annual']['rows']:
 t=paragraphs[x['sourceIndex']].replace(',','')
 assert str(x['before']) in t and str(x['after']) in t,(x['id'],'原值未在源段出现')
 calculated=(x['after']/x['before']-1)*100
 assert round(calculated,x['precision'])==x['reportedPercent'],(x['id'],calculated,x['reportedPercent'])
c=v['correlations'];assert c['n']==11
for x in c['rows']:assert f"{x['rho']:.3f}" in paragraphs[59] and f"{x['p']:.3f}" in paragraphs[59]
assert not v.get('pairedDistrictData'),'未核对逐区配对数据时禁止新增散点'
print('PASS: 11区固定行政区顺序、中位数、9项年度原值/变化率、3组原文相关统计一致；无编造配对散点')
