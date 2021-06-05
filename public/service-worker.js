const FILES_TO_CACHE = ["./index.html", "./public/css/style.css"];
const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

//listen for install event, capture event with e
self.addEventListener("install", function (e) {
  //tell browser to wait until the following code is executed
  e.waitUntil(
    //open cache storage instance
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
        //look through key list
        keyList.map(function (key, i) {
          //if key isn't in cache keep list, delete it from cache
          //only return value of -1 if value isn't found in key list
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

//retrieve information from cache
self.addEventListener("fetch", function (e) {
  //log URL of requested resource
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    //check to see if the requested resource matches any resource in the cache
    caches.match(e.request).then(function (request) {
      //if it is in the cache, respond with cached resource
      if (request) {
        console.log("responding with cache : " + e.request.url);
        return request;
        //if it's not in the cache, make a normal request
      } else {
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
      // can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  );
});
