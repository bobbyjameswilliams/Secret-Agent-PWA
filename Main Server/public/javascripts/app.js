/**
 * called by the HTML onload
 * registering the service worker
 */
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }
}

window.initServiceWorker = initServiceWorker;