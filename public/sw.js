const PRECACHE_NAME = 'precache-v1';
const RUNTIME_NAME = 'runtime-v1';
// _next/static配下はコンテンツハッシュ付きのため実質不変だが、デプロイの度に
// 新しいファイルが積み上がり続け上限なく肥大化するのを防ぐため、キャッシュ件数の
// 上限を設けて古いエントリ（挿入順で先頭）から間引く。1ページあたり約20リクエスト
// (JS+CSS) の2〜3ページ分を目安に、現行ビルドのチャンクを間引かない余裕を持たせる。
const MAX_RUNTIME_ENTRIES = 60;
// trailingSlash: true により /offline は308で /offline/ にリダイレクトされるため、
// リダイレクトを経由しない /offline/ を直接指定する（リダイレクト後のResponseを
// キャッシュしてnavigateリクエストにrespondWithすると、ブラウザによっては
// 「redirected responseで応答できない」エラーになりうるため）
const OFFLINE_URL = '/offline/';
const PRECACHE_URLS = [OFFLINE_URL, '/icon-192.png'];

// /offline/ が参照する<link rel="stylesheet">はビルド毎にファイル名がハッシュ化され
// 事前に固定できないため、キャッシュ済みHTMLから実際のhrefを読み取ってプリキャッシュする。
// これを行わないと、オンラインで一度も/offline/を開いたことがない状態で完全オフラインに
// なった場合、フォールバックページが無スタイルで表示される。
async function precacheOfflineStylesheets(cache) {
  const offlineResponse = await cache.match(OFFLINE_URL);
  if (!offlineResponse) return;

  const html = await offlineResponse.text();
  const hrefs = [];
  for (const linkTag of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = linkTag[0];
    if (!/rel=["']stylesheet["']/i.test(tag)) continue;
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (hrefMatch) hrefs.push(hrefMatch[1]);
  }

  await Promise.all(hrefs.map((href) => cache.add(href).catch(() => {})));
}

async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_NAME);
  const keys = await cache.keys();
  const overflow = keys.length - MAX_RUNTIME_ENTRIES;
  if (overflow <= 0) return;
  await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).then(() => precacheOfflineStylesheets(cache)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== PRECACHE_NAME && key !== RUNTIME_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches
            .open(RUNTIME_NAME)
            .then((cache) => cache.put(request, clone))
            .then(() => trimRuntimeCache());
          return response;
        });
      })
    );
  }
});
