// Nome do cache
const CACHE_NAME = 'thees-construtora-v1';

// Arquivos para cache
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/images/logo.png',
  '/assets/images/favicon1.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Instala o Service Worker e armazena em cache os recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativa o Service Worker e remove caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia de cache: Network First, fallback para cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Verifica se a resposta é válida
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clona a resposta
        const responseToCache = response.clone();

        // Armazena a resposta em cache
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Se a rede falhar, tenta buscar do cache
        return caches.match(event.request)
          .then(response => {
            // Retorna a resposta do cache ou uma resposta de fallback
            return response || caches.match('/offline.html');
          });
      })
  );
});
