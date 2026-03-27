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

            postStateToIframe();
        };

        window.addEventListener('message', handleSyncRequest);

        const handleScroll = () => {
            const safeProgress = getSafeProgress();


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

