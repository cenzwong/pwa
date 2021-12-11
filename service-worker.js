let cacheName = "OpenGithubPWA";// 👈 any unique name

let filesToCache = [
  "/pwa/", // 👈 your repository name , both slash are important
  "service-worker.js",
  "https://raw.githubusercontent.com/cenzwong/OpenPWA/main/js/main.js",
  "https://raw.githubusercontent.com/cenzwong/OpenPWA/main/js/install-handler.js",
  "https://raw.githubusercontent.com/cenzwong/OpenPWA/main/js/settings.js",
  "https://raw.githubusercontent.com/cenzwong/OpenPWA/main/css/main.css",
  "https://github.com/cenzwong/OpenPWA/blob/main/assets/icons/icon.png?raw=true",
  "manifest.json"
  // add your assets here 
  // ❗️❕donot add config.json here ❗️❕
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    console.log('installed successfully')
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function (event) {

  if (event.request.url.includes('clean-cache')) {
    caches.delete(cacheName);
    console.log('Cache cleared')
  }

  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      console.log('served form cache')
    } else {
      console.log('Not serving from cache ', event.request.url)
    }
    return response || fetch(event.request);
  })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});