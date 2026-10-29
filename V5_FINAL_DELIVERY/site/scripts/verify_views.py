"""V3 content/citation contract checks; navigation behavior is verified in the browser."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parent.parent
r=json.loads((root/'dist/content.json').read_text());m=json.loads((root/'docs/CITATION_MAPPING.json').read_text())
ps={b['sourceIndex']:b['text'] for c in r['chapters'] for b in c['blocks'] if b['type']=='paragraph'}
assert [x['reference'] for x in m['rows']]==list(range(1,20))
for row in m['rows']:
 assert row['entry']==r['references'][row['reference']-1]
 cites=set()
 for a,b in re.findall(r'\[(\d+)(?:[-–—](\d+))?\]',ps[row['sourceIndex']]):cites.update(range(int(a),int(b or a)+1))
 assert row['reference'] in cites,(row['reference'],row['sourceIndex'])
intro=(root/'dist/introduction.js').read_text()
# Comma formatting changes only display, not numeric values.
assert all(x in ps[4] and x in intro for x in ['221.69','31.57','20.3%','2.9%'])
assert '1180' in ps[4] and '1,180' in intro
html=(root/'dist/index.html').read_text();assert 'view-router.js' in html and 'introduction.js' in html
assert all(f'href="#chapter-{i}"' in html for i in range(1,6))
assert 'href="#chapter-4"' in html and 'href="#chapter-5"' in html
router=(root/'dist/view-router.js').read_text();assert 'popstate' in router and 'hashchange' in router and "scrollRestoration='manual'" in router
print('PASS: 19项原稿引文映射逐项匹配原综述与文末条目；背景事实与原段一致；视图入口完整')
