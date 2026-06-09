const CACHE_NAME = 'studybuddy-v6'; // ভার্সন ৫ করা হলো যেন নতুন করে ফ্রেশ ক্যাশ নেয়

// তোমার গিটহাব রিপোজিটরির স্ক্রিনশট অনুযায়ী নিখুঁত ফাইল লিস্ট
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
  'help.html',        // আমাদের নতুন ইউজার গাইডলাইন পেজ
  'manifest.json',
  'icon.png',         // তোমার অ্যাপ লোগো
  'profile.jpg'       // প্রোফাইল ইমেজ
];

// ইনস্টল ইভেন্ট - কোনো ফাইল মিসিং থাকলেও যেন ক্র্যাশ না করে সেফটি ইঞ্জিনসহ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('StudyBuddy Cache Locking...');
      // এখানে প্রতিটি ফাইলকে আলাদাভাবে ট্রাই করবে যেন কোনো একটা ভুলের জন্য পুরো অ্যাপ অফলাইন ব্রেক না করে
      return Promise.all(
        ASSETS.map(asset => {
          return cache.add(asset).catch(err => console.log('Asset load skipped or failed: ', asset, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// একটিভেট ইভেন্ট - পুরোনো মেমোরি ক্লিনআপ
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ফেচ ইভেন্ট - ১০০% অফলাইন মাখনের মতো লোড করার কোর মোড
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // যদি ক্যাশে ফাইল থাকে তবে অফলাইনে সেটাই দেখাবে, নয়তো ইন্টারনেট থেকে আনবে
      return response || fetch(e.request).catch(() => {
        // যদি একদমই অফলাইন থাকে এবং মেইন পেজ রিকোয়েস্ট হয়
        if (e.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
