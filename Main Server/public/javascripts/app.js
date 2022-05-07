/**
 * called by the HTML onload
 * declaring the service worker
 */







function initBrowser(){
    initServiceWorker();
}

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }
}