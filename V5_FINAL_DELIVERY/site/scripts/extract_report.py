#!/usr/bin/env python3
"""Read-only extraction of authoritative v2 OOXML; never rewrites the report."""
import argparse,hashlib,json,re
from pathlib import Path
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table
from zipfile import ZipFile

parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
out=root/'dist';(out/'assets').mkdir(exist_ok=True)
doc=Document(args.source)
chapters=[];refs=[];current=None;h2=0;h3=0;ref_mode=False
for i,el in enumerate(doc.element.body):
 if el.tag.endswith('}p'):
  p=Paragraph(el,doc);t=p.text.strip();style=p.style.name
  if t=='参考文献':ref_mode=True;continue
  if ref_mode:
   if t:refs.append(t)
   continue
  if style=='Heading 1':
   current={'number':len(chapters)+1,'title':t,'id':f'chapter-{len(chapters)+1}','blocks':[]};chapters.append(current);h2=h3=0
  elif current is not None:
   if style in ('Heading 2','Heading 3'):
    level=int(style[-1])
    if level==2:h2+=1;h3=0
    else:h3+=1
    number=f'{current["number"]}.{h2}'+(f'.{h3}' if level==3 else '')
    current['blocks'].append({'type':'heading','level':level+1,'number':number,'id':'s-'+number.replace('.','-'),'text':t,'sourceIndex':i})
   elif t:current['blocks'].append({'type':'caption' if style=='图题和表题' else 'paragraph','text':t,'sourceIndex':i})
   for rid in p._p.xpath('.//a:blip/@r:embed'):
    part=doc.part.rels[rid].target_part
    current['blocks'].append({'type':'image','src':'assets/'+Path(part.partname).name,'sourceIndex':i})
 elif el.tag.endswith('}tbl') and current:
  rows=[[c.text for c in r.cells] for r in Table(el,doc).rows]
  current['blocks'].append({'type':'audit','headers':rows[0],'rows':rows[1:],'sourceIndex':i})
with ZipFile(args.source) as z:
 for name in z.namelist():
  if name.startswith('word/media/'):(out/'assets'/Path(name).name).write_bytes(z.read(name))
report={'title':'从场景清单到审慎试点','subtitle':'广州市人工智能养老应用的需求匹配、证据成熟度与推广条件研究','version':'v2','sourceName':args.source.name,'sourceSha256':hashlib.sha256(args.source.read_bytes()).hexdigest(),'chapters':chapters,'references':refs}
(out/'content.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
(root/'docs'/'SOURCE.md').write_text('# 正文来源与提取边界\n\n唯一正文基线：'+args.source.name+'\n\nSHA-256：`'+report['sourceSha256']+'`\n\n提取程序只读原件，正文、标题、审计表及参考文献逐项提取，不以仓库材料覆盖。章节编号为网页显式补排。\n\n原稿4.4只有四个三级标题，网页另设待核提示，未编造第五主题。第2章原稿含一张额外散点图，保留为可展开的原稿附图。图中数据口径按原图保留，尚未深度复核。4.1.3新增待补充组件，未绘制示例数据。\n')
print(json.dumps({'chapters':len(chapters),'subheadings':sum(b['type']=='heading' for c in chapters for b in c['blocks']),'images':sum(b['type']=='image' for c in chapters for b in c['blocks']),'references':len(refs),'sha256':report['sourceSha256']},ensure_ascii=False))
