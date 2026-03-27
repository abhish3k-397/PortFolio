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
            // #region agent log
            fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline12',hypothesisId:'H20',location:'index.js:keydown-r',message:'iframe-r-keydown-posted',data:{count:iframeKeyLogCount,repeat:e.repeat,iframeRState,targetTag:e.target?.tagName||null},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
        }
        window.parent.postMessage({ type: 'webgl-interaction-key', isPressed: true }, '*')
    }
})

window.addEventListener('keyup', (e) => {
    if ((e.key === 'r' || e.key === 'R') && iframeRState) {
        iframeRState = false
        if (iframeKeyLogCount < 12) {
            iframeKeyLogCount += 1
            // #region agent log
            fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline12',hypothesisId:'H20',location:'index.js:keyup-r',message:'iframe-r-keyup-posted',data:{count:iframeKeyLogCount,repeat:e.repeat,iframeRState,targetTag:e.target?.tagName||null},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
        }
        window.parent.postMessage({ type: 'webgl-interaction-key', isPressed: false }, '*')
    }
})

window.addEventListener('blur', () => {
    if (!iframeRState) return
    iframeRState = false
    if (iframeKeyLogCount < 12) {
        iframeKeyLogCount += 1
        // #region agent log
        fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline12',hypothesisId:'H20',location:'index.js:blur',message:'iframe-r-reset-on-blur',data:{count:iframeKeyLogCount},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    }
    window.parent.postMessage({ type: 'webgl-interaction-key', isPressed: false }, '*')
})

// No custom wheel handling:
// OrbitControls handles mouse drag + wheel/trackpad natively on targetElement.
window.addEventListener('wheel', (e) => {
    if (iframeWheelLogCount >= 10) return
    iframeWheelLogCount += 1
    // #region agent log
    fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline12',hypothesisId:'H21',location:'index.js:wheel-observer',message:'wheel-seen-in-iframe',data:{count:iframeWheelLogCount,deltaMode:e.deltaMode,deltaX:e.deltaX,deltaY:e.deltaY,ctrlKey:e.ctrlKey,cancelable:e.cancelable,isInteractive:experience.isInteractive,targetTag:e.target?.tagName||null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
}, { passive: true })

let syncAcked = false
window.addEventListener('message', (event) => {
    if (event.data?.type === 'scroll-progress') {
        syncAcked = true
        if (syncLogCount < 4) {
            syncLogCount += 1
            // #region agent log
            fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline',hypothesisId:'H3',location:'index.js:message-scroll-progress',message:'iframe-received-scroll-progress',data:{syncAcked,attempts:syncAttempts,syncLogCount:syncLogCount,progress:event.data.progress,isInteractive:event.data.isInteractive},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
        }
    }
})

window.parent.postMessage({ type: 'webgl-request-sync' }, '*')
// #region agent log
fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline',hypothesisId:'H1',location:'index.js:init',message:'sent-webgl-request-sync-initial',data:{hasTargetElement:!!targetElement},timestamp:Date.now()})}).catch(()=>{});
// #endregion
const syncTimer = window.setInterval(() => {
    syncAttempts += 1
    if (syncAcked || syncAttempts > 14) {
        window.clearInterval(syncTimer)
        return
    }
    window.parent.postMessage({ type: 'webgl-request-sync' }, '*')
    if (syncAttempts <= 4) {
        // #region agent log
        fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline',hypothesisId:'H1',location:'index.js:syncTimer',message:'resent-webgl-request-sync',data:{syncAttempts,syncAcked},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    }
}, 150)

window.addEventListener('error', (event) => {
    if (runtimeErrorLogCount >= 8) return
    runtimeErrorLogCount += 1
    // #region agent log
    fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline6',hypothesisId:'H11',location:'index.js:window-error',message:'iframe-runtime-error',data:{count:runtimeErrorLogCount,message:event.message,filename:event.filename,lineno:event.lineno,colno:event.colno},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
})

window.addEventListener('unhandledrejection', (event) => {
    if (runtimeErrorLogCount >= 8) return
    runtimeErrorLogCount += 1
    // #region agent log
    fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline6',hypothesisId:'H11',location:'index.js:unhandledrejection',message:'iframe-unhandled-rejection',data:{count:runtimeErrorLogCount,reason:String(event.reason)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
})
