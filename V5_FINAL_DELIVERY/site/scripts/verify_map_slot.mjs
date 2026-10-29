import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
class Element {constructor(){this.children=[];this.attrs={};this.dataset={};this.textContent='';}replaceChildren(...children){this.children=children;}append(child){this.children.push(child);}setAttribute(key,value){this.attrs[key]=value;}}
const sandbox={window:{},document:{createElement:()=>new Element()},Object,TypeError};
vm.runInNewContext(await readFile(new URL('../dist/map-slot.js',import.meta.url),'utf8'),sandbox);
const api=sandbox.window.ResearchMapSlot, host=new Element();let cleanups=0;
// A provider may arrive before report rendering, and asynchronous failure must remain isolated.
api.register(({container,context})=>{assert.equal(context.section,'4.1');container.textContent='map';return()=>{cleanups++;};});
api.mount(host,{section:'4.1'});await new Promise(setImmediate);assert.equal(host.children[0].textContent,'map');
api.register(async()=>{throw new Error('test provider unavailable');});await new Promise(setImmediate);
assert.equal(cleanups,1);assert.ok(host.children[0].textContent.includes('其余')||host.children[0].textContent.includes('仍可'));assert.equal(host.attrs['aria-busy'],'false');
api.unmount();api.register(()=>{});await new Promise(setImmediate);
console.log('PASS: map provider早于mount、清理、异步失败降级、卸载后注册均不阻塞报告');
