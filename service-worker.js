"use strict";

const CACHE_NAME = "gulnar-shell-v6";
const CACHE_PREFIX = "gulnar-shell-";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./supabase-config.js",
  "./manifest.webmanifest",
  "./share.html",
  "./share-page.css",
  "./share-page.js",
  "./gulnar-app-icon.svg",
  "./gulnar-app-icon-192.png",
  "./gulnar-app-icon-512.png"
];
const APP_SHELL_URLS = APP_SHELL.map(asset => new URL(asset, self.registration.scope));
const CORE_ASSET_PATHS = new Set(APP_SHELL_URLS.map(url => url.pathname));
const INDEX_URL = new URL("./index.html", self.registration.scope).href;

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL_URLS.map(url => new Request(url, { cache: "reload" }))))
  );
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const isNavigation = request.mode === "navigate";
  if (!isNavigation && !CORE_ASSET_PATHS.has(url.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(new Request(request, { cache: "no-store" }));
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      const cachedResponse = await cache.match(request, { ignoreSearch: true });
      if (cachedResponse) return cachedResponse;
      if (isNavigation) {
        const appShell = await cache.match(INDEX_URL);
        if (appShell) return appShell;
      }
      return Response.error();
    }
  })());
});
