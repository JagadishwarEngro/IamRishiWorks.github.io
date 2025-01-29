'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "b4e21ee50b22fe7a055361081ccb103c",
"version.json": "c6be0fd8c22b01aea4f1d726d0e04563",
"index.html": "38f9cfc706c7e4c241f103e4bf865be2",
"/": "38f9cfc706c7e4c241f103e4bf865be2",
"main.dart.js": "95a6f09e5bb3d6648c8f7e21b08064af",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"favicon.png": "8b2b9f3cc85667e988c5abd8de73936d",
"icons/Icon-192.png": "8b2b9f3cc85667e988c5abd8de73936d",
"icons/Icon-maskable-192.png": "8b2b9f3cc85667e988c5abd8de73936d",
"icons/Icon-maskable-512.png": "8b2b9f3cc85667e988c5abd8de73936d",
"icons/Icon-512.png": "8b2b9f3cc85667e988c5abd8de73936d",
"manifest.json": "e6fda338fbcc6224e1a658758d6b863e",
"assets/AssetManifest.json": "592182298ff5629a7a359f678f664255",
"assets/NOTICES": "b31155be2ca2bbfc573c90cf8235ff56",
"assets/FontManifest.json": "926b873ceb792b053fd2752f3bebaa86",
"assets/AssetManifest.bin.json": "c3a75bfcc66a6c6ac54b9eafbc5042dd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "613eccdf89d95bdae9decf65e23fc531",
"assets/fonts/Gilroy-Medium.ttf": "c83281ae1ca703d0741a770ee7e7c091",
"assets/fonts/Gilroy-Regular.ttf": "31ff7c1a62a300dbbf9656b4ba14a0d5",
"assets/fonts/Gilroy-Light.ttf": "4b236c6cb4c59d66b80dde6f9c614ebd",
"assets/fonts/Gilroy-Thin.ttf": "437d0d08a241c1d07517909f70c8ef11",
"assets/fonts/Gilroy-Bold.ttf": "b381c2abd2972024a6a7e3d882208d9b",
"assets/fonts/MaterialIcons-Regular.otf": "0be2e8bb04b238c6dbafafce36ca1c0c",
"assets/assets/images/dashboard.jpg": "195de2157e90bbb2468d18ff4fcbf685",
"assets/assets/images/zapitm.png": "d1fd2ce4feac1e8ac17cf3452954ba24",
"assets/assets/images/mobile.jpeg": "a98a76d6efa25b5acf3f4ae1f5dc6a98",
"assets/assets/images/charge.png": "48ebba9ed6057279649e55fdb9e4e780",
"assets/assets/images/createx.png": "de543eaa92bccc57b8ed34141fe25089",
"assets/assets/images/office.jpeg": "94516f50867b525a3c57f4b78a46d418",
"assets/assets/images/zapit.png": "bab86d0999d4d87562451e1ba3e0f234",
"assets/assets/images/circles.png": "7bf04a436a57fae73cb17afad05ec343",
"assets/assets/images/ev.png": "2f844ad7aefb105c140fa8002f504145",
"assets/assets/images/postbox.jpg": "8989528a7936fc07e0da6ef3938688ea",
"assets/assets/images/shapeupm.png": "cbb85ecb1bc84feec3fc136dad1ef272",
"assets/assets/images/shapeup.png": "e20c4b1b4cfdc0b1d56384111e2e6dda",
"assets/assets/images/ai.png": "f0846c03135c863d48c5741cdeac1321",
"assets/assets/logo/rworksw.png": "b984fe624e004eab00948a5c474b0db0",
"assets/assets/logo/rworks.png": "1e5055bd2d06dfe599eb0557b06c0526",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
