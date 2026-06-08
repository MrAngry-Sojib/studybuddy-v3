const CACHE_NAME = 'studybuddy-v2'; // আপডেট দিতে চাইলে শুধু এই v2 কে v3 করে দিলেই হবে
const ASSETS = [
  'index.html',
  'tasks.html',
  'timer.html',
  'budget.html',
  'profile.html',
  'developer.html',
  'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
