// if you change some static files you change also these name and the cache will be updated
let staticCache = 'segnapunti_cache-v3.5.1';
let dynamicCache = 'segnapunti_cache_d-v3.5.1';
let staticAssets = [
    './','./index.html','./img/quad-appunti.png','./img/quadAppunti192.png','./img/quadAppunti512.png', './img/favicon.ico',
    './img/maskable_icon.png','./img/ios_share.png','./libraries/jquery-3.5.1.min.js','./main.js','./style.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css','https://use.fontawesome.com/releases/v5.6.1/css/all.css',
    'https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/css/shepherd.css','https://unpkg.com/vue@3/dist/vue.global.prod.js', 
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js','https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/js/shepherd.min.js',
    './img/splashscreens/apple-splash-ipad-pro-12-9.png', './img/splashscreens/apple-splash-ipad-pro-l-12-9.png', './img/splashscreens/apple-splash-ipad-pro-11.png',
    './img/splashscreens/apple-splash-ipad-pro-l-11.png', './img/splashscreens/apple-splash-ipad-mini.png', './img/splashscreens/apple-splash-ipad-mini-l.png',
    './img/splashscreens/apple-splash-ipad-air.png', './img/splashscreens/apple-splash-ipad-air-l.png', './img/splashscreens/apple-splash-ipad.png',
    './img/splashscreens/apple-splash-ipad-l.png', './img/splashscreens/apple-splash-iph-12-pro-max.png', './img/splashscreens/apple-splash-iph-12-pro.png',
    './img/splashscreens/apple-splash-iph-12-mini.png', './img/splashscreens/apple-splash-iph-11-pro-max.png', './img/splashscreens/apple-splash-iph-11.png',
    './img/splashscreens/apple-splash-iph-8-plus.png', './img/splashscreens/apple-splash-iph-7.png'
];

// On install - caching the application static files
self.addEventListener('install', e => {
    // to avoid browser consider sw caching as finished
    e.waitUntil(
        caches.open(staticCache).then(cache => {
            // cache any static files that make the application work
            return cache.addAll(staticAssets);
        })
    );
});

// Clear old cache if static assets need updates
self.addEventListener('activate', e =>{
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCache && key !== dynamicCache)
                .map(key => caches.delete(key))
            )
        })
    );
})

// On network request
self.addEventListener('fetch', e => {
    e.respondWith(
        // Try the cache
        caches.match(e.request).then(cacheRes => {
            // If response is found then return it, else fetch again
            return cacheRes || fetch(e.request).then(fetchRes => {
                // Check if the response is valid before caching
                if (!fetchRes || fetchRes.status !== 200) {
                    return fetchRes;
                }
                // save in cache the response
                return caches.open(dynamicCache).then(cache => {
                    cache.put(e.request, fetchRes.clone());
                    return fetchRes;
                });
            }).catch(err => {
                console.log(err);
                return caches.match('./img/quad-appunti.png');
            });
        })
    );
});