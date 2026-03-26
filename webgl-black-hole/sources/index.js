import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience({
    targetElement: document.querySelector('.experience')
})

const targetElement = document.querySelector('.experience')

// Bridge mousemove events to the parent window for the custom cursor
window.addEventListener('mousemove', (e) => {
    window.parent.postMessage({
        type: 'webgl-mousemove',
        clientX: e.clientX,
        clientY: e.clientY
    }, '*');
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        window.parent.postMessage({
            type: 'webgl-interaction-key',
            isPressed: true
        }, '*');
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        window.parent.postMessage({
            type: 'webgl-interaction-key',
            isPressed: false
        }, '*');
    }
});

const emitTrackpadGesture = (e) => {
    if (!experience.isInteractive) return

    e.preventDefault()
    window.dispatchEvent(new CustomEvent('webgl-trackpad-gesture', {
        detail: {
            deltaMode: e.deltaMode,
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            ctrlKey: e.ctrlKey
        }
    }))
}

window.addEventListener('wheel', emitTrackpadGesture, { passive: false })
if (targetElement) {
    targetElement.addEventListener('wheel', emitTrackpadGesture, { passive: false })
}

let syncAcked = false
window.addEventListener('message', (event) => {
    if (event.data?.type === 'scroll-progress') {
        syncAcked = true
    }
})

window.parent.postMessage({ type: 'webgl-request-sync' }, '*')
let syncAttempts = 0
const syncTimer = window.setInterval(() => {
    syncAttempts += 1
    if (syncAcked || syncAttempts > 14) {
        window.clearInterval(syncTimer)
        return
    }
    window.parent.postMessage({ type: 'webgl-request-sync' }, '*')
}, 150)
