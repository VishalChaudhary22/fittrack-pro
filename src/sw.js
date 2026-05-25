import { precacheAndRoute } from 'workbox-precaching';

// Precaching injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST);

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'You have a new notification.',
      icon: data.icon || '/fittrack-icon-192.png',
      badge: data.badge || '/badge-72.png',
      vibrate: data.vibrate || [100, 50, 100],
      tag: data.tag || data.type || 'fittrack-default', // Tag-based deduplication
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Kaaya Fit', options)
    );
  } catch (err) {
    // Fallback if not JSON
    event.waitUntil(
      self.registration.showNotification('Kaaya Fit', {
        body: event.data.text(),
        icon: '/kaaya-icon-192.png'
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification closes for analytics
self.addEventListener('notificationclose', (event) => {
  console.log('[ServiceWorker] Notification closed:', event.notification.tag);
  // Future: could post to a Supabase analytics endpoint here if needed
});
