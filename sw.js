// Cache per uso offline. Rete prima (saltando anche la cache HTTP del browser), cache come riserva.
// Gli aggiornamenti arrivano appena sei online. Cambia il numero della versione solo se aggiungi nuovi file alla lista.
const C="pmp-quiz-v2";
const FILES=["./","index.html","manifest.json","domande.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!="GET")return;
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
});
