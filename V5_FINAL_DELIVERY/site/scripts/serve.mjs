import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2), option=(name,fallback)=>{const index=args.indexOf(name);return index>=0?args[index+1]:fallback;};
const port=Number(option('--port',process.env.PORT||'3000')), host=option('--host','0.0.0.0');
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.geojson':'application/geo+json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname==='/qa-map-host.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}).end(await readFile(new URL('./qa-map-host.html',import.meta.url)));return;}let path=resolve(root,'.'+pathname);if(path!==resolve(root)&&!path.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403).end();return;}if((await stat(path)).isDirectory())path=resolve(path,'index.html');const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');}}).listen(port,host,()=>console.log(`Research site ready at http://${host}:${port}`));
