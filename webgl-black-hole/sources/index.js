import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience({
    targetElement: document.querySelector('.experience')
})

const targetElement = document.querySelector('.experience')
let syncLogCount = 0
let syncAttempts = 0
let iframeRState = false
let runtimeErrorLogCount = 0
let iframeKeyLogCount = 0
let iframeWheelLogCount = 0

// Bridge mousemove events to the parent window for the custom cursor
window.addEventListener('mousemove', (e) => {
    window.parent.postMessage({
        type: 'webgl-mousemove',
        clientX: e.clientX,
        clientY: e.clientY
    }, '*');
});

window.addEventListener('keydown', (e) => {
    if ((e.key === 'r' || e.key === 'R') && !iframeRState) {
        iframeRState = true
        if (iframeKeyLogCount < 12) {
            iframeKeyLogCount += 1

        }
        window.parent.postMessage({ type: 'webgl-interaction-key', isPressed: true }, '*')
    }
})

window.addEventListener('keyup', (e) => {
    if ((e.key === 'r' || e.key === 'R') && iframeRState) {
        iframeRState = false
        if (iframeKeyLogCount < 12) {
            iframeKeyLogCount += 1

        }
        window.parent.postMessage({ type: 'webgl-interaction-key', isPressed: false }, '*')
    }
})

window.addEventListener('blur', () => {
    if (!iframeRState) return
    iframeRState = false
    if (iframeKeyLogCount < 12) {
        iframeKeyLogCount += 1

    }
    window.parent.postMessage({ type: 'webgl-interaction-key', isPressed: false }, '*')
})

// No custom wheel handling:
// OrbitControls handles mouse drag + wheel/trackpad natively on targetElement.
window.addEventListener('wheel', (e) => {
    if (iframeWheelLogCount >= 10) return
    iframeWheelLogCount += 1

}, { passive: true })

let syncAcked = false
window.addEventListener('message', (event) => {
    if (event.data?.type === 'scroll-progress') {
        syncAcked = true
        if (syncLogCount < 4) {
            syncLogCount += 1

        }
    }
})

window.parent.postMessage({ type: 'webgl-request-sync' }, '*')

const syncTimer = window.setInterval(() => {
    syncAttempts += 1
    if (syncAcked || syncAttempts > 14) {
        window.clearInterval(syncTimer)
        return
    }
    window.parent.postMessage({ type: 'webgl-request-sync' }, '*')
    if (syncAttempts <= 4) {

    }
}, 150)

window.addEventListener('error', (event) => {
    if (runtimeErrorLogCount >= 8) return
    runtimeErrorLogCount += 1

})

window.addEventListener('unhandledrejection', (event) => {
    if (runtimeErrorLogCount >= 8) return
    runtimeErrorLogCount += 1

})
