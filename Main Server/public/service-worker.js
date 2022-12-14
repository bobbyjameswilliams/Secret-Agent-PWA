// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let cache= null;
let dataCacheName = 'ArticleData-v1';
let cacheName = 'ArticlePWA-step-8-1';
let filesToCache = [
    '/',
    '/stylesheets/partials/navbar.css',
    '/stylesheets/bootstrap.css',
    '/stylesheets/card.css',
    '/stylesheets/insert.css',
    '/stylesheets/room.css',

    '/javascripts/app.js',
    '/javascripts/canvas.js',
    '/javascripts/card-feed.js',
    '/javascripts/comment.js',
    '/javascripts/database.js',
    '/javascripts/knowledge-graph.js',
    '/javascripts/view-handler.js',

    '/images/cathedral.jpg',
    '/images/placeholder.png',

];

/**
 * Writes all files to cache
 * @returns {Promise<void>}
 */
async function preCache(){
    const cache = await caches.open(cacheName);
    return cache.addAll(filesToCache);
}

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(preCache());
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

/**
 * Caching strategy and logic goes here
 */
self.addEventListener('fetch', function (e) {
    //console.log('[Service Worker] Fetch', e.request.url); // too much noise
    //e.respondWith(fetchAssets(e));
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const resClone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, resClone);
                    });
                return res;
            })
            .catch(err => caches.match(e.request).then(res => res))
    );
});
