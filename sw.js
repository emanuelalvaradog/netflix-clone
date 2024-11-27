self.addEventListener("install", (event) => {
  event.waitUntil(preCache());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(cachedResponse(request));

  if (navigator.onLine === true) {
    event.waitUntil(updateCache(request));
  }
});

async function preCache() {
  const cache = await caches.open("assets");
  return cache.addAll([
    "/",
    "/index.html",
    "/netflix-front/img/icon.gif",
    "/netflix-front/img/logo.png",
    "/netflix-front/img/muted.png",
    "/netflix-front/img/repeat.png",
    "/netflix-front/img/netflix.ico",
    "/netflix-front/img/unmuted.png",
    "/netflix-front/img/klausStatic.jpg",
    "/netflix-front/img/klausNetflix.png",
    "/netflix-front/img/KlausTrailer.mp4",
    "/netflix-front/js/loadCarousel.js",
    "/netflix-front/js/mainMovie.js",
    "/netflix-front/js/swRegister.js",
    "/netflix-front/styles/style.css",
  ]);
}

async function cachedResponse(request) {
  const cache = await caches.open("assets");
  const response = await cache.match(request);
  if (response) {
    return response;
  } else {
    if (navigator.onLine === true) {
      return fetch(request);
    } else {
      return;
    }
  }
}

async function updateCache(request) {
  const cache = await caches.open("assets");
  const response = await fetch(request);
  if (response.status === 200) {
    return cache.put(request, response);
  } else {
    return;
  }
}
