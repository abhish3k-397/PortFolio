import React, { useEffect, useRef } from 'react';

const BlackHoleBackground = ({ isInteractive }) => {
    const iframeRef = useRef(null);
    const lastProgressRef = useRef(0);
    const postLogCountRef = useRef(0);
    const syncRequestLogCountRef = useRef(0);
    const heartbeatLogCountRef = useRef(0);
    const scrollLogCountRef = useRef(0);
    
    const getSafeProgress = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const rawProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        return Number.isFinite(rawProgress) ? Math.min(Math.max(rawProgress, 0), 1) : 0;
    };

    const postStateToIframe = (progressOverride) => {
        if (!iframeRef.current?.contentWindow) return;
        const baseProgress = typeof progressOverride === 'number' ? progressOverride : getSafeProgress();
        const progress = isInteractive ? lastProgressRef.current : baseProgress;
        if (!isInteractive) {
            lastProgressRef.current = progress;
        }
        if (postLogCountRef.current < 6) {
            postLogCountRef.current += 1;
            // #region agent log
            fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline',hypothesisId:'H1',location:'BlackHoleBackground.jsx:postStateToIframe',message:'posting-state-to-iframe',data:{hasWindow:!!iframeRef.current?.contentWindow,isInteractive,progress,baseProgress,postCount:postLogCountRef.current},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
        }

        iframeRef.current.contentWindow.postMessage({
            type: 'scroll-progress',
            progress,
            isInteractive: isInteractive
        }, '*');

        iframeRef.current.contentWindow.postMessage({
            type: 'interaction-state',
            isInteractive: isInteractive
        }, '*');
    };

    useEffect(() => {
        const handleSyncRequest = (event) => {
            if (!event.data || event.data.type !== 'webgl-request-sync') return;
            if (syncRequestLogCountRef.current < 4) {
                syncRequestLogCountRef.current += 1;
                // #region agent log
                fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline',hypothesisId:'H1',location:'BlackHoleBackground.jsx:handleSyncRequest',message:'received-webgl-request-sync',data:{syncCount:syncRequestLogCountRef.current,isInteractive},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
            }
            postStateToIframe();
        };

        window.addEventListener('message', handleSyncRequest);

        const handleScroll = () => {
            const safeProgress = getSafeProgress();
            if (scrollLogCountRef.current < 20) {
                scrollLogCountRef.current += 1;
                // #region agent log
                fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline3',hypothesisId:'H8',location:'BlackHoleBackground.jsx:handleScroll',message:'scroll-handler-fired',data:{count:scrollLogCountRef.current,scrollY:window.scrollY,docScrollTop:document.documentElement.scrollTop,scrollHeight:document.documentElement.scrollHeight,innerHeight:window.innerHeight,safeProgress,isInteractive},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
            }

            if (!isInteractive) {
                lastProgressRef.current = safeProgress;
            }

            const progressToSend = isInteractive ? lastProgressRef.current : safeProgress;
            lastProgressRef.current = progressToSend;

            postStateToIframe(progressToSend);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        postStateToIframe();

        const syncTimer = window.setInterval(() => {
            const safeProgress = getSafeProgress();
            const progressToSend = isInteractive ? lastProgressRef.current : safeProgress;
            if (!isInteractive) {
                lastProgressRef.current = safeProgress;
            }
            if (heartbeatLogCountRef.current < 4) {
                heartbeatLogCountRef.current += 1;
                // #region agent log
                fetch('http://127.0.0.1:7566/ingest/ddb65d42-c42b-4d3f-a233-340b59f387ad',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0b6722'},body:JSON.stringify({sessionId:'0b6722',runId:'baseline',hypothesisId:'H6',location:'BlackHoleBackground.jsx:syncTimer',message:'periodic-sync-tick',data:{tick:heartbeatLogCountRef.current,isInteractive,progressToSend,safeProgress},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
            }
            postStateToIframe(progressToSend);
        }, 120);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('message', handleSyncRequest);
            window.clearInterval(syncTimer);
        };
    }, [isInteractive]);

    const handleIframeLoad = () => {
        const safeProgress = getSafeProgress();
        lastProgressRef.current = safeProgress;

        postStateToIframe(safeProgress);
    };

    useEffect(() => {
        if (!isInteractive) return;
        iframeRef.current?.focus();
    }, [isInteractive]);

    return (
        <iframe
            ref={iframeRef}
            title="WebGL Black Hole Background"
            src="/blackhole/index.html"
            onLoad={handleIframeLoad}
            tabIndex={-1}
            className="absolute inset-0 w-full h-full border-0 transition-opacity duration-300"
            style={{
                pointerEvents: isInteractive ? 'auto' : 'none',
            }}
        />
    );
};

export default BlackHoleBackground;

