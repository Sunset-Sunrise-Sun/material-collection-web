#!/usr/bin/env python3
"""Content-contract check; optionally compare every extracted source block to DOCX."""
from pathlib import Path
import argparse,json,re,hashlib
root=Path(__file__).resolve().parent.parent
p=argparse.ArgumentParser();p.add_argument('--source',type=Path);a=p.parse_args()
r=json.loads((root/'dist/content.json').read_text());blocks=[b for c in r['chapters'] for b in c['blocks']]
assert [c['title'] for c in r['chapters']]==['研究介绍','研究区域','研究方法','研究结果','讨论与总结']
heads=[b for b in blocks if b['type']=='heading'];assert len(heads)==41
assert len({b['id'] for b in heads})==len(heads)
expected=['1.1','1.2','3.1','3.2','3.2.1','3.2.2','3.3','3.4','3.4.1','3.4.2','3.4.3','3.4.4','3.5','4.1','4.1.1','4.1.2','4.1.3','4.2','4.2.1','4.2.2','4.3','4.4','4.4.1','4.4.2','4.4.3','4.4.4','5.1','5.2','5.3','5.3.1','5.3.2','5.3.3','5.3.4','5.3.5','5.3.6','5.4','5.4.1','5.4.2','5.4.3','5.5','5.6']
assert [b['number'] for b in heads]==expected
rows=next(b['rows'] for b in blocks if b['type']=='audit');assert len(rows)==7 and all(len(row)==6 for row in rows)
assert [row[0].split(' ')[0] for row in rows]==[f'S{i}' for i in range(1,8)]
assert [row[4][0] for row in rows]==list('ACACBDC')
assert len(r['references'])==19
images=[b for b in blocks if b['type']=='image'];assert len(images)==3
assert [b['src'] for b in images]==['assets/image2.png','assets/image3.png','assets/image4.png']
assert all((root/'dist'/b['src']).is_file() for b in images)
content='\n'.join(b.get('text','') for b in blocks)
assert not re.search(r'\bS(?:8|9|10)\b',content)
assert all(x in content for x in ['单点单次','人次','非AI运行基线','户籍人口','L1：','L2：','L3：','A类','B类','C类','D类'])
if a.source:
 from docx import Document
 from docx.text.paragraph import Paragraph
 from docx.table import Table
 from zipfile import ZipFile
 assert hashlib.sha256(a.source.read_bytes()).hexdigest()==r['sourceSha256']
 d=Document(a.source);by_index={b['sourceIndex']:b for b in blocks if b['type']!='image'}
 for i,e in enumerate(d.element.body):
  if i in by_index:
   b=by_index[i]
   if b['type']=='audit': assert [[c.text for c in row.cells] for row in Table(e,d).rows]==[b['headers']]+b['rows']
   else: assert Paragraph(e,d).text.strip()==b['text'],f'原文差异 {i}'
 with ZipFile(a.source) as z:
  for b in images: assert (root/'dist'/b['src']).read_bytes()==z.read('word/media/'+Path(b['src']).name)
 print('PASS: 原文逐块一致，审计表42个字段一致，3张展示图片字节一致，源文件SHA-256一致')
print('PASS: 5章、41子标题、7场景及分类、19文献、3张展示原图，范围与关键边界检查通过')
