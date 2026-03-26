import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience({
    targetElement: document.querySelector('.experience')
})

// Bridge mousemove events to the parent window for the custom cursor
window.addEventListener('mousemove', (e) => {
    window.parent.postMessage({
        type: 'webgl-mousemove',
        clientX: e.clientX,
        clientY: e.clientY
    }, '*');
});
