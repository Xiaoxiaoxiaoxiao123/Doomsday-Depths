'use strict';
// Embedded artwork avoids dozens of independently failing image requests.
window.asset=function asset(path){return window.ASSET_IMAGES?.[path.split('?')[0]]||path;};
(()=>{
 const states=new WeakMap();
 function originalSource(img){const embedded=img.getAttribute('src');return Object.keys(window.ASSET_IMAGES||{}).find(k=>window.ASSET_IMAGES[k]===embedded)||embedded;}
 document.addEventListener('error',event=>{
  const img=event.target;if(!(img instanceof HTMLImageElement))return;
  const s=states.get(img)||{attempts:0,path:originalSource(img)};states.set(img,s);
  if(s.attempts>=2){img.classList.add('image-unavailable');return;}
  s.attempts++;setTimeout(()=>{if(!img.isConnected)return;img.src=s.path+(s.path.includes('?')?'&':'?')+'retry='+s.attempts+'&v=4';},500*s.attempts);
 },true);
 document.addEventListener('load',event=>{const img=event.target;if(img instanceof HTMLImageElement){states.delete(img);img.classList.remove('image-unavailable');}},true);
 window.addEventListener('online',()=>{document.querySelectorAll('img.image-unavailable').forEach(img=>{states.delete(img);img.classList.remove('image-unavailable');img.src=asset(originalSource(img).split('?')[0]);});});
})();
