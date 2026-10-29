/* V5 integration + interaction E2E. Actual browser/CDP tests, not historical results. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9520;
const BASE = process.argv[2] || 'http://127.0.0.1:3040';
const SITE = 'D:/筑工杯数据获取/V5_FINAL_DELIVERY/site';
const OUT = path.join(__dirname, 'screenshots');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const ok = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail: String(detail).slice(0, 500) });
class CDP {
 constructor(u) { this.u=u; this.i=0; this.p=new Map(); this.errors=[]; this.failed=[]; this.external=[]; this.requests=[]; }
 async connect() { this.ws=new WebSocket(this.u); await new Promise((a,b)=>{this.ws.addEventListener('open',a);this.ws.addEventListener('error',b);}); this.ws.addEventListener('message',e=>{const m=JSON.parse(e.data); if(m.id&&this.p.has(m.id)){const q=this.p.get(m.id);this.p.delete(m.id);m.error?q.reject(new Error(JSON.stringify(m.error))):q.resolve(m.result);return;} if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')this.errors.push((m.params.args||[]).map(a=>a.value||a.description||'').join(' ')); if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')this.errors.push(m.params.entry.text); if(m.method==='Network.loadingFailed')this.failed.push(m.params); if(m.method==='Network.requestWillBeSent'){const u=m.params.request.url;this.requests.push(u);if(/^https?:/i.test(u)&&!u.startsWith(BASE))this.external.push(u);}}); }
 send(method,params={}){const id=++this.i;return new Promise((resolve,reject)=>{this.p.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
 async eval(expr){const r=await this.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
 async mouse(x,y,type='mouseMoved',extra={}){await this.send('Input.dispatchMouseEvent',{type,x,y,button:type==='mouseMoved'?'none':'left',clickCount:type==='mousePressed'||type==='mouseReleased'?1:0,buttons:type==='mousePressed'?1:0,...extra});}
 async clickAt(x,y){await this.mouse(x,y,'mouseMoved');await this.mouse(x,y,'mousePressed');await sleep(25);await this.mouse(x,y,'mouseReleased');await sleep(320);}
 async key(k){const base={key:k,code:k,windowsVirtualKeyCode:k==='Enter'?13:k==='Escape'?27:0,nativeVirtualKeyCode:k==='Enter'?13:k==='Escape'?27:0};if(k==='Enter'){base.text='\r';base.unmodifiedText='\r';}await this.send('Input.dispatchKeyEvent',{type:'keyDown',...base});await this.send('Input.dispatchKeyEvent',{type:'keyUp',...base,text:undefined});await sleep(260);}
 close(){try{this.ws.close();}catch{}}
}
async function waitFor(c,expr,timeout=25000,step=250){const t=Date.now();while(Date.now()-t<timeout){try{if(await c.eval(expr))return true;}catch{}await sleep(step);}return false;}
async function center(c,selector,shadow=false){const pre=shadow?`const sr=document.querySelector('gz-district-map')?.shadowRoot;const el=sr?.querySelector(${JSON.stringify(selector)});`:`const el=document.querySelector(${JSON.stringify(selector)});`;return await c.eval(`(function(){${pre}if(!el)return null;el.scrollIntoView({block:'center',inline:'center'});const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height}})()`);}
async function clickSel(c,selector,shadow=false){const p=await center(c,selector,shadow);if(!p)return false;await c.clickAt(p.x,p.y);return true;}
async function waitMap(c){return await waitFor(c,`(function(){return document.querySelectorAll('.gz-linked-row').length===11&&document.querySelectorAll('gz-district-map').length===1&&document.querySelector('gz-district-map')?.shadowRoot?.querySelectorAll('[data-adcode]').length===11})()`,30000);}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const metrics=JSON.parse(fs.readFileSync(path.join(SITE,'dist/assets/maps/district_metrics.json'),'utf8'));
 const expected=Object.fromEntries(metrics.metrics.map(m=>[m.id,Object.fromEntries(metrics.districts.map(d=>[String(d.adcode),d.values[m.id]]))]));
 const decimals=Object.fromEntries(metrics.metrics.map(m=>[m.id,m.decimals]));
 const profile=path.join(os.tmpdir(),'v5-e2e-profile');fs.rmSync(profile,{recursive:true,force:true});
 const proc=spawn(EDGE,['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--remote-debugging-port='+PORT,'--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
 try{
  let v=null;for(let i=0;i<80;i++){try{v=await(await fetch('http://127.0.0.1:'+PORT+'/json/version')).json();break;}catch{await sleep(250);}}
  if(!v)throw new Error('CDP not ready');
  const page=await(await fetch('http://127.0.0.1:'+PORT+'/json/new?about:blank',{method:'PUT'})).json();
  const c=new CDP(page.webSocketDebuggerUrl);await c.connect();await c.send('Page.enable');await c.send('Runtime.enable');await c.send('Log.enable');await c.send('Network.enable');
  await c.send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  if(process.env.V5_BLOCK_EXTERNAL==='1')await c.send('Network.setBlockedURLs',{urls:['https://*']});
  await c.send('Page.navigate',{url:BASE+'/#s-4-1'});
  const ready=await waitMap(c);await sleep(700);
  await c.eval(`(function(){const m=document.querySelector('gz-district-map');window.__v5Select=0;m.addEventListener('gzmap:select',()=>window.__v5Select++);return 1})()`);
  await c.eval(`document.querySelector('.map-integration').scrollIntoView({block:'start'});1`);await sleep(400);
  await c.send('Page.captureScreenshot',{format:'png',fromSurface:true}).then(s=>fs.writeFileSync(path.join(OUT,'v5-desktop-map.png'),Buffer.from(s.data,'base64')));

  const initial=await c.eval(`(function(){const m=document.querySelector('gz-district-map'),sr=m.shadowRoot;return {ready:document.querySelectorAll('.gz-linked-row').length===11,paths:sr.querySelectorAll('[data-adcode]').length,labels:[...sr.querySelectorAll('.lbl')].map(e=>e.textContent),bars:document.querySelectorAll('.gz-linked-row').length,metricPills:sr.querySelectorAll('.pill[data-metric]').length,selected:m.getState().selected,metric:m.getState().metricId,shadowText:sr.querySelector('.title')?.textContent,mapH:Math.round(m.getBoundingClientRect().height),panel:sr.querySelector('#gz-panel')?.innerText?.slice(0,120)}})()`);
  ok('A1 map-rendered-11-districts-labels-bars',ready&&initial.paths===11&&initial.labels.length===11&&initial.bars===11&&initial.metricPills>=8,JSON.stringify(initial));
  const content=await c.eval(`(async function(){const d=await fetch('content.json').then(r=>r.json());const ps=[];for(const ch of d.chapters)for(const b of ch.blocks)if(b.type==='paragraph')ps.push(b.text.trim());const hb=[];for(const ch of d.chapters)for(const b of ch.blocks)if(b.type==='heading')hb.push(b);return {chapters:d.chapters.length,paras:ps.length,chars:ps.join('').length,headingBlocks:hb.length,domHeadings:document.querySelectorAll('#report-content h2,#report-content h3,#report-content h4').length,refs:document.querySelectorAll('#reference-list li').length,figures:document.querySelectorAll('#report-content .report-figure').length,ch2:document.querySelectorAll('#chapter-2 .report-figure').length,bed:!!document.querySelector('#v2-density-record'),panel:document.querySelectorAll('.district-panel').length,mapSlots:document.querySelectorAll('#guangzhou-map-slot').length}})()`);
  console.log('STEP A2',JSON.stringify(content));
  ok('A2 content-regression',content.chapters===5&&content.paras===89&&content.chars===13766&&content.headingBlocks===41&&content.refs===19&&content.figures===4&&content.ch2===2&&content.bed&&content.panel===0&&content.mapSlots===1,JSON.stringify(content));

  // 8 metrics: open more if needed, click all in map shadow DOM
  await clickSel(c,'#gz-more',true);await sleep(300);
  const metricResults=[];
  for(const mm of metrics.metrics){
   const clicked=await clickSel(c,`.pill[data-metric="${mm.id}"]`,true);await sleep(350);
   const read=await c.eval(`(function(){const m=document.querySelector('gz-district-map'),sr=m.shadowRoot;return {metric:m.getState().metricId,buttons:[...document.querySelectorAll('.gz-linked-row')].map(b=>({code:b.dataset.adcode,value:b.dataset.value,text:b.innerText.replace(/\\n/g,' ')})),title:sr.querySelector('#gz-title')?.textContent,legend:sr.querySelector('#gz-legend')?.innerText?.slice(0,100)}})()`);
   const valuesOk=read.buttons.length===11&&read.buttons.every(b=>b.value===String(expected[mm.id][b.code]));
   metricResults.push({id:mm.id,clicked,metric:read.metric,valuesOk,title:read.title,legend:read.legend});
  }
  console.log('STEP B1');
  ok('B1 8-metrics-click-sync-88-values',metricResults.length===8&&metricResults.every(x=>x.clicked&&x.metric===x.id&&x.valuesOk),JSON.stringify(metricResults.map(x=>({id:x.id,ok:x.clicked&&x.metric===x.id&&x.valuesOk}))));

  // map -> bar and bar -> map, plus detail
  const mapClicked=await clickSel(c,'[data-adcode="440105"]',true);await sleep(400);
  const mapToBar=await c.eval(`(function(){const b=[...document.querySelectorAll('.gz-linked-row[aria-pressed="true"]')].map(e=>e.dataset.adcode);const p=document.querySelector('gz-district-map').shadowRoot.querySelector('#gz-panel').innerText;return {bar:b,panel:p.includes('海珠区'),snippet:p.slice(0,100)}})()`);
  await clickSel(c,'.gz-linked-row[data-adcode="440106"]');await sleep(350);
  const barToMap=await c.eval(`(function(){const m=document.querySelector('gz-district-map'),s=m.getState();return {selected:s.selected,bar:[...document.querySelectorAll('.gz-linked-row[aria-pressed="true"]')].map(e=>e.dataset.adcode),panel:m.shadowRoot.querySelector('#gz-panel').innerText.includes('天河区'),events:window.__v5Select}})()`);
  console.log('STEP C1',JSON.stringify(mapToBar));
  ok('C1 map-select-updates-bar-detail',mapClicked&&mapToBar.bar.join(',')==='440105'&&mapToBar.panel,JSON.stringify(mapToBar));
  console.log('STEP C2',JSON.stringify(barToMap));
  ok('C2 bar-click-updates-map-detail',barToMap.selected==='440106'&&barToMap.bar.join(',')==='440106'&&barToMap.panel,JSON.stringify(barToMap));

  // reset view clears selection
  await clickSel(c,'[data-act="reset-view"]',true);await sleep(350);
  const reset=await c.eval(`(function(){const m=document.querySelector('gz-district-map');return {selected:m.getState().selected,bars:[...document.querySelectorAll('.gz-linked-row[aria-pressed="true"]')].length}})()`);
  console.log('STEP C3',JSON.stringify(reset));
  ok('C3 reset-clears-selection',reset.selected===null&&reset.bars===0,JSON.stringify(reset));

  // zoom button, wheel, pan, reset view
  const view0=await c.eval(`document.querySelector('gz-district-map').getState().viewBox`);
  await clickSel(c,'[data-act="zoom-in"]',true);await sleep(300);
  const view1=await c.eval(`document.querySelector('gz-district-map').getState().viewBox`);
  const mapCenter=await center(c,'#gz-svg',true);
  if(mapCenter){await c.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:mapCenter.x,y:mapCenter.y,deltaX:0,deltaY:-280});await sleep(350);}
  const view2=await c.eval(`document.querySelector('gz-district-map').getState().viewBox`);
  if(mapCenter){await c.mouse(mapCenter.x,mapCenter.y,'mousePressed');await c.mouse(mapCenter.x+55,mapCenter.y+28,'mouseMoved',{buttons:1});await c.mouse(mapCenter.x+110,mapCenter.y+56,'mouseMoved',{buttons:1});await c.mouse(mapCenter.x+110,mapCenter.y+56,'mouseReleased');await sleep(350);}
  const view3=await c.eval(`document.querySelector('gz-district-map').getState().viewBox`);
  await clickSel(c,'[data-act="zoom-reset"]',true);await sleep(300);
  const view4=await c.eval(`document.querySelector('gz-district-map').getState().viewBox`);
  const z = {view0,view1,view2,view3,view4,zoomButton:view1[2]<view0[2],wheel:view2[2]<view1[2],pan:view3[0]!==view2[0]||view3[1]!==view2[1],reset:Math.abs(view4[2]-view0[2])<0.1};
  console.log('STEP C4');
  ok('C4 zoom-wheel-pan-reset',z.zoomButton&&z.wheel&&z.pan&&z.reset,JSON.stringify(z));

  // keyboard map select and escape
  await c.eval(`(function(){const g=document.querySelector('gz-district-map').shadowRoot.querySelector('[data-adcode="440105"]');g.focus();return document.activeElement===g})()`);
  await c.key('Enter');await sleep(250);
  const keySel=await c.eval(`document.querySelector('gz-district-map').getState().selected`);
  await c.key('Escape');await sleep(250);
  const keyEsc=await c.eval(`document.querySelector('gz-district-map').getState().selected`);
  console.log('STEP C5',JSON.stringify({keySel,keyEsc}));
  ok('C5 keyboard-enter-escape',keySel==='440105'&&keyEsc===null,JSON.stringify({keySel,keyEsc}));

  // interaction summaries: size, click row opens, hover/focus styles
  const afford=await c.eval(`(function(){const ss=[...document.querySelectorAll('details > summary')].filter(s=>s.offsetParent!==null);const heights=ss.map(s=>Math.round(s.getBoundingClientRect().height));const s=document.querySelector('.chart-source > summary')||ss[0];const before=s?.parentElement?.open;if(s)s.scrollIntoView({block:'center'});const r=s?.getBoundingClientRect();return {count:ss.length,minH:Math.min(...heights),icons:ss.filter(x=>getComputedStyle(x,'::before').content!=='none').length,s:{x:r?.left+r?.width/2,y:r?.top+r?.height/2},before}})()`);
  if(afford.s){await c.clickAt(afford.s.x,afford.s.y);await sleep(250);}
  const affordAfter=await c.eval(`(function(){const s=document.querySelector('.chart-source > summary')||document.querySelector('details > summary');return {open:s?document.querySelector('.chart-source')?.open:null,focus:document.activeElement?.tagName}})()`);
  ok('D1 disclosure-target-size-and-click',afford.count>0&&afford.minH>=44&&afford.icons>0&&affordAfter.open===true,JSON.stringify({...afford,after:affordAfter}));
  await c.send('Page.captureScreenshot',{format:'png',fromSurface:true}).then(s=>fs.writeFileSync(path.join(OUT,'v5-desktop-affordance.png'),Buffer.from(s.data,'base64')));

  // mobile 390
  await c.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await c.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await c.send('Page.navigate',{url:BASE+'/#s-4-1'});await waitMap(c);await sleep(600);
  await c.eval(`document.querySelector('.map-integration').scrollIntoView({block:'start'});1`);await sleep(400);
  const mobile=await c.eval(`(function(){return {innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,mapW:Math.round(document.querySelector('gz-district-map').getBoundingClientRect().width),bars:document.querySelectorAll('.gz-linked-row').length,paths:document.querySelector('gz-district-map').shadowRoot.querySelectorAll('[data-adcode]').length}})()`);
  const mt=await center(c,'[data-adcode="440105"]',true);if(mt){await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:mt.x,y:mt.y}]});await sleep(40);await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(500);}
  const mobileSel=await c.eval(`({selected:document.querySelector('gz-district-map').getState().selected,bars:[...document.querySelectorAll('.gz-linked-row[aria-pressed="true"]')].map(e=>e.dataset.adcode)})`);
  await c.send('Page.captureScreenshot',{format:'png',fromSurface:true}).then(s=>fs.writeFileSync(path.join(OUT,'v5-mobile-map.png'),Buffer.from(s.data,'base64')));
  console.log('STEP E1',JSON.stringify(mobile));
  ok('E1 mobile-390-no-horizontal-overflow',mobile.scrollWidth<=mobile.clientWidth+1&&mobile.mapW<=390&&mobile.bars===11&&mobile.paths===11,JSON.stringify(mobile));
  ok('E2 mobile-touch-selects-map-and-bar',mobileSel.selected==='440105'&&mobileSel.bars.join(',')==='440105',JSON.stringify(mobileSel));

  // external request check before offline simulation
  ok('F1 no-external-http',c.external.length===0,c.external.join(',').slice(0,300));
  ok('F2 no-script-errors',c.errors.length===0,c.errors.join(' | ').slice(0,300));
  const failedReal=c.failed.filter(f=>f.errorText&&!/ERR_ABORTED/.test(f.errorText));
  ok('F3 no-resource-failures',failedReal.length===0,JSON.stringify(failedReal).slice(0,300));

  const summary={total:results.length,pass:results.filter(r=>r.pass).length,fail:results.filter(r=>!r.pass).length,failures:results.filter(r=>!r.pass)};
  fs.writeFileSync(path.join(__dirname,'v5-e2e-results.json'),JSON.stringify({summary,results,initial,content,metricResults,mapToBar,barToMap,reset,z,afford,mobile,mobileSel,errors:c.errors,external:c.external},null,1));
  console.log(JSON.stringify(summary,null,1));
  c.close();
 }finally{proc.kill();}
})().catch(e=>{console.error('V5 E2E FAIL',e);process.exit(1);});



