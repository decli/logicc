// 思维小画本的离线缓存（service worker）
//
// 网络不稳也要能玩：第一次打开时，把首页、图标和两个语音包（读题 voice-zh，古诗太鼓 voice-shi，一共约 17 MB）
// 存进浏览器缓存，以后断网也能打开、也能出声。有网时每次打开悄悄检查新版本，下载完整了下次打开就用上。
//
// - 首页、json 这类小文件：先走网络，最多等 4 秒；拿到就顺手存进缓存，网络断了或太慢就用缓存里的
// - 语音包 voice-xx.bin?h=<指纹>：指纹变了就是新文件，所以缓存里有就直接用，没有才下载；旧指纹的那份删掉
// - 语音包的索引 json 和 bin 必须配对：新 json 要等它的 bin 整个下载完、存好，才换进缓存。
//   在那之前页面拿到的一直是旧的一对，所以下载到一半断网也不会出错
// - 「造物」「彩虹钢琴」（zaowu/、piano/）不预先下载（加起来快 40 MB），打开过一次就存下，之后断网也能玩
const CACHE = 'logicc-v1';
const SCOPE = new URL('./', self.location).href;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const BANKS = ['voice-zh', 'voice-shi'];
const abs = u => new URL(u, SCOPE).href;
const wait = ms => new Promise(r => setTimeout(r, ms));

// 安装时只存首页和图标（很快），马上接管页面；语音包由页面自己的请求经过这里下载、顺手存下（页面还会发 sync 补齐）
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => fetch(abs(u), { cache: 'no-cache' }).then(r => (r.ok ? c.put(abs(u), r) : null)).catch(() => { })))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 页面每次打开都发一句 sync：有网就检查更新、补齐没下载完的
self.addEventListener('message', e => { if (e.data === 'sync') e.waitUntil(syncAll().catch(() => { })); });

// 同一个文件同时只下载一份（安装时的预下载和页面自己的请求常常撞在一起）
const inflight = {};
function once(key, job) {
  if (!inflight[key]) inflight[key] = job().finally(() => { delete inflight[key]; });
  return inflight[key];
}
function syncAll() {
  return once('all', async () => {
    const c = await caches.open(CACHE);
    await Promise.all([
      ...SHELL.map(u => fetch(abs(u), { cache: 'no-cache' }).then(r => (r.ok ? c.put(abs(u), r) : null)).catch(() => { })),
      ...BANKS.map(b => syncBank(c, b).catch(() => { }))
    ]);
  });
}
// 取最新的索引；它的 bin 在缓存里了（或者刚下载完存好）才把索引换进缓存
function syncBank(c, name) {
  return once('bank:' + name, async () => {
    const r = await fetch(abs(name + '.json'), { cache: 'no-cache' });
    if (!r.ok) throw r.status;
    const ix = await r.clone().json();
    if (ix.h) await getBin(c, abs(name + '.bin?h=' + ix.h));
    await c.put(abs(name + '.json'), r);
  });
}
function getBin(c, url) {
  return once(url, async () => {
    if (await c.match(url)) return;
    const r = await fetch(url);
    if (!r.ok) throw r.status;
    await c.put(url, r);   // 整个下载完才算存好
    const path = new URL(url).pathname;
    for (const k of await c.keys()) { const u = new URL(k.url); if (u.pathname === path && u.href !== url) await c.delete(k); }
  });
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || req.headers.has('range')) return;
  if (/\.bin$/.test(url.pathname) && url.searchParams.has('h')) return e.respondWith(binFirst(req, e));
  const bank = BANKS.find(b => url.href.split('?')[0] === abs(b + '.json'));
  if (bank) return e.respondWith(bankIndex(bank, e));
  e.respondWith(netFirst(req, e));
});

async function binFirst(req, e) {
  const c = await caches.open(CACHE), hit = await c.match(req.url);
  if (hit) return hit;
  const job = getBin(c, req.url); e.waitUntil(job.catch(() => { }));
  try { await job; const r = await c.match(req.url); if (r) return r; } catch (err) { }
  return fetch(req);
}
// 有缓存：等新版本最多 2.5 秒（通常索引没变，马上就好），不然先用缓存里那一对；没有缓存（第一次）：等网络
async function bankIndex(name, e) {
  const c = await caches.open(CACHE), key = abs(name + '.json');
  const cached = await c.match(key);
  const job = syncBank(c, name); e.waitUntil(job.catch(() => { }));
  if (cached) await Promise.race([job.catch(() => { }), wait(2500)]);
  else await job.catch(() => { });
  return (await c.match(key)) || cached || fetch(key);
}
async function netFirst(req, e) {
  const c = await caches.open(CACHE);
  const net = fetch(req).then(r => {
    if (r.ok && r.type === 'basic') { const copy = r.clone(); e.waitUntil(c.put(req, copy).catch(() => { })); }
    return r;
  });
  e.waitUntil(net.then(() => { }, () => { }));
  const nav = req.mode === 'navigate';
  const cached = await c.match(req, { ignoreSearch: nav }) || (nav && url0(req) ? await c.match(abs('index.html')) : null);
  if (!cached) return net.catch(() => new Response('离线，还没有缓存这个文件', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
  return Promise.race([net.then(r => (r.ok ? r : cached), () => cached), wait(4000).then(() => cached)]);
}
// 首页的几种写法（/、/index.html、带 ?v= 的）都算首页
function url0(req) { const p = new URL(req.url).pathname; return p === new URL(SCOPE).pathname || p === new URL(abs('index.html')).pathname; }
