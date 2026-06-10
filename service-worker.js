const CACHE_NAME = 'studybuddy-v6'; // অফিশিয়াল স্থায়ী ভার্সন v6

// স্ক্রিনশট অনুযায়ী তোমার গিটহাবের সব ফাইলের নিখুঁত অ্যারে লিস্ট
const ASSETS = [
  './',
  'index.html',
  'routine.html',
  'exam.html',
  'notes.html',
  'tasks.html',
  'timer.html',
  'budget.html',
  'profile.html',
  'developer.html',
  'help.html',
  'manifest.json',
  'icon.png',
  'profile.jpg',
  '.nojekyll'
];

// ইনস্টল ইভেন্ট - কোনো ফাইল গিটহাবে মিসিং থাকলেও যেন অ্যাপ ক্র্যাশ না করে
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('System Caching Online...');
      return Promise.all(
        ASSETS.map(asset => {
          return cache.add(asset).catch(err => console.log('Skipped Asset:', asset));
        })
      );
    })
  );
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে লাইনে দাঁড়িয়ে না রেখে সাথে সাথে পুশ করবে
});
// একটিভেট ইভেন্ট - পুরোনো মেমোরির জটলা মেমোরি থেকে একদম রুট লেভেলে মুছে দেবে
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Old Cache Vaporized:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // অ্যাপ ওপেন থাকা অবস্থাতেই নতুন v6 ক্যাশ কন্ট্রোল নিয়ে নেবে
});

// ফেচ ইভেন্ট - অফলাইনে ১০০% রকেট স্পিডে ফাইল রান করার ইঞ্জিন (Cache-First)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // ফোনে ক্যাশ ফাইল সেভ থাকলে অফলাইনে সেটাই ইনস্ট্যান্ট দেখাবে
      if (cachedResponse) {
        return cachedResponse;
      }

      // ফোনে না থাকলে ইন্টারনেট থেকে নিয়ে আসবে
      return fetch(e.request).catch(() => {
        // যদি ইউজার পুরোপুরি অফলাইন থাকে এবং মেইন পেজে নেভিগেট করতে চায়
        if (e.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
