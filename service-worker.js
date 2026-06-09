const CACHE_NAME = 'studybuddy-v5'; // ভার্সন বাড়িয়ে v3 করা হলো যেন সবার ফোনে দ্রুত আপডেট নেয়

// স্ক্রিনশট অনুযায়ী তোমার সব ফাইলের নিখুঁত লিস্ট (অ্যাসেট) এখানে লক করা হলো
const ASSETS = [
  '/',
  'index.html',
  'help.html',
  'routine.html',
  'exam.html',
  'notes.html',
  'tasks.html',
  'timer.html',
  'budget.html',
  'profile.html',
  'developer.html',
  'manifest.json',
  '.nojekyll',
  'icon.png',         // তোমার আসল লোগো ফাইল
  'profile.jpg'       // তোমার প্রোফাইল ইমেজ ফাইল
];

// ১. ইনস্টল ইভেন্ট - অ্যাপ ইনস্টল হওয়ার সাথে সাথে সব ফাইল ব্যাকগ্রাউন্ডে ফোনে সেভ হবে
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('VaultBuddy Cache Locked Successfully!');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // নতুন কোডটিকে সাথে সাথে একটিভ করার জন্য ফোর্স করবে
});

// ২. একটিভেট ইভেন্ট - নতুন কোড পুশ হলে পুরনো v2 বা ভুতুড়ে সব ক্যাশ ডিলিট করে মেমোরি ক্লিন করবে
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Old Cache Cleared:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // ইউজার অ্যাপে থাকা অবস্থাতেই ইনস্ট্যান্ট ব্যাকগ্রাউন্ড আপডেট কার্যকর করবে
});

// ৩. ফেচ ইভেন্ট - অফলাইনে ১০০% মাখনের মতো ফাইল লোড করার কোর ইঞ্জিন (Cache-First)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // ফোনে ক্যাশ ফাইল থাকলে অফলাইনে সেটাই ইনস্ট্যান্ট স্ক্রিনে শো করবে, না থাকলে ইন্টারনেট থেকে আনবে
      return response || fetch(e.request);
    })
  );
});
