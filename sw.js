const CACHE_NAME = 'scorebowl-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activation');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourne la ressource en cache si elle existe
        if (response) {
          return response;
        }

        // Sinon, récupère la ressource depuis le réseau
        return fetch(event.request).then(function(response) {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone la réponse
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(function() {
          // En cas d'erreur réseau, retourne une page d'erreur basique
          if (event.request.destination === 'document') {
            return new Response(
              `<!DOCTYPE html>
              <html>
              <head>
                <title>ScoreBowl - Hors ligne</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
                  .offline-content { max-width: 400px; margin: 0 auto; }
                  .icon { font-size: 4rem; color: #6c757d; margin-bottom: 1rem; }
                  h1 { color: #495057; }
                  p { color: #6c757d; }
                  .btn { 
                    background: #0d6efd; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; 
                    margin-top: 20px;
                  }
                </style>
              </head>
              <body>
                <div class="offline-content">
                  <div class="icon">🏆</div>
                  <h1>ScoreBowl</h1>
                  <h2>Mode hors ligne</h2>
                  <p>Vous n'êtes pas connecté à Internet, mais ScoreBowl fonctionne toujours !</p>
                  <p>Vos données sont sauvegardées localement et seront synchronisées lorsque vous serez de nouveau en ligne.</p>
                  <a href="/" class="btn">Retour à l'application</a>
                </div>
              </body>
              </html>`,
              {
                headers: {
                  'Content-Type': 'text/html'
                }
              }
            );
          }
          
          // Pour les autres types de requêtes, retourne une erreur simple
          return new Response('Contenu non disponible hors ligne', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Gestion des messages depuis l'application principale
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour disponible
self.addEventListener('updatefound', function(event) {
  const newWorker = event.target.installing;
  newWorker.addEventListener('statechange', function() {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      // Nouvelle version disponible
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({
            type: 'UPDATE_AVAILABLE'
          });
        });
      });
    }
  });
});

// Synchronisation en arrière-plan (si supportée)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Ici on pourrait synchroniser les données avec un serveur
      console.log('Synchronisation en arrière-plan')
    );
  }
});

// Gestion des notifications push (si nécessaire)
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './icons/icon-192x192.png',
      badge: './icons/icon-96x96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('./')
  );
});
