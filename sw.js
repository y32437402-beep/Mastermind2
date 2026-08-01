self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('mastermind-store').then((cache) => cache.addAll([
      'index.html',
      'Mastermind.css',
      'Mastermind.js', // اگر نام فایل جاوااسکریپتت فرق دارد، اینجا اصلاح کن
      'mastermind.png'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
