const FILES_TO_CACHE = ["./index.html", "./public/css/style.css"];
const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

//tell service worker how to manage caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    //return array of cache names or keyList
    caches.keys().then(function (keyList) {
      //filter out cache names with app prefix and save them in array called cacheKeepList
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      //add current cache to keep list
      cacheKeeplist.push(CACHE_NAME);
      //return promise that resolves when old caches have been delieted
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
