const CACHE='love-ai-html-v8';
const FILES=['./','./index.html','./manifest.webmanifest','./favicon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.hostname.includes('supabase.co')||u.hostname.includes('youtube')||u.hostname.includes('youtu.be')||u.hostname.includes('googlevideo.com')||u.hostname.includes('ytimg.com')||u.hostname.includes('jsdelivr.net'))return;
  if(r.mode==='navigate'||r.destination==='document'){
    e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res}).catch(()=>caches.match(r).then(c=>c||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(r,copy));return res})));
});
