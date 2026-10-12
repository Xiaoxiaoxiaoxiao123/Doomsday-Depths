const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const images=JSON.parse(fs.readFileSync('src/image-pack.json','utf8'));
const html=fs.readFileSync('dist/index.html','utf8');
assert.equal(Object.keys(images).length,60);
for(const [key,data] of Object.entries(images)){
 assert.ok(data.startsWith('data:image/webp;base64,'),key);
 const bytes=Buffer.from(data.split(',')[1],'base64');assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.ok(html.includes(JSON.stringify(key)+':'+JSON.stringify(data)),key+' not embedded');
}
assert.ok(!/<script src=|<link rel="stylesheet"/.test(html));
for(const [,js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(js);
const events={},windowEvents={},timers=[],failed=[];
class Img{constructor(src){this.src=src;this.isConnected=true;this.flags=new Set();this.classList={add:k=>this.flags.add(k),remove:k=>this.flags.delete(k)};}getAttribute(){return this.src;}}
const ctx={window:null,ASSET_IMAGES:images,HTMLImageElement:Img,document:{addEventListener:(e,f)=>events[e]=f,querySelectorAll:()=>failed},addEventListener:(e,f)=>windowEvents[e]=f,setTimeout:f=>timers.push(f)};ctx.window=ctx;
vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/images.js','utf8'),ctx);
assert.equal(ctx.asset('assets/rooms/library.webp'),images['assets/rooms/library.webp']);
const img=new Img(images['assets/rooms/library.webp']);
events.error({target:img});timers.shift()();assert.ok(img.src.startsWith('assets/rooms/library.webp?retry=1'));
events.error({target:img});timers.shift()();assert.ok(img.src.includes('retry=2'));
events.error({target:img});assert.ok(img.flags.has('image-unavailable'));assert.equal(timers.length,0);
failed.push(img);windowEvents.online();assert.equal(img.src,images['assets/rooms/library.webp']);assert.equal(img.flags.size,0);
console.log('PASS: 60 embedded images, zero external startup dependencies, inline JS syntax, bounded retries, reconnection recovery.');
