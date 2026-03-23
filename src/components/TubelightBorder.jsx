import React, { useId } from 'react';

function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const int = parseInt(h, 16);
    return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

const TubelightBorder = ({ children, color = '#5227FF', thickness = 2, className, innerClassName, style }) => {
    const rawId = useId().replace(/[:]/g, '');
    const filterId = `static-turbulent-${rawId}`;

    const colorMap = {
        cyan: '#06b6d4',
        yellow: '#fcee0a',
        red: '#ff003c',
        purple: '#d946ef',
        white: '#ffffff'
    };

    const activeColor = colorMap[color] || color;

    const inheritRadius = {
        borderRadius: style?.borderRadius ?? 'inherit'
    };

    return (
        <div className={'relative isolate ' + (className ?? '')} style={style}>
            {/* The exact same SVG math as ElectricBorder, but driven entirely by CSS/SVG engine, no JS loops */}
            <svg
                className="fixed -left-[10000px] -top-[10000px] w-[10px] h-[10px] opacity-[0.001] pointer-events-none"
                aria-hidden
                focusable="false"
            >
                <defs>
                    {/* Fixed 500% bounds to ensure it covers large divs without needing JS resize recalculations */}
                    <filter id={filterId} colorInterpolationFilters="sRGB" x="-200%" y="-200%" width="500%" height="500%">
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise1" seed="1" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                            <animate attributeName="dy" values="300; -300" dur="4s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise2" seed="2" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                            <animate attributeName="dx" values="-300; 300" dur="5s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feComposite in="offsetNoise1" in2="offsetNoise2" mode="color-dodge" result="combinedNoise" />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="combinedNoise"
                            scale="20"
                            xChannelSelector="R"
                            yChannelSelector="B"
                        />
                    </filter>
                </defs>
            </svg>

            <div className="absolute inset-0 pointer-events-none" style={inheritRadius}>
                {/* The stroke that gets the SVG filter applied directly via CSS */}
                <div 
                    className="absolute inset-0 box-border will-change-transform" 
                    style={{
                        ...inheritRadius,
                        borderWidth: thickness,
                        borderStyle: 'solid',
                        borderColor: activeColor,
                        filter: `url(#${filterId})`
                    }} 
                />
                
                {/* Classic Glows */}
                <div 
                    className="absolute inset-0 box-border" 
                    style={{
                        ...inheritRadius,
                        borderWidth: thickness,
                        borderStyle: 'solid',
                        borderColor: hexToRgba(activeColor, 0.6),
                        filter: `blur(${0.5 + thickness * 0.25}px)`,
                        opacity: 0.5
                    }} 
                />
                <div 
                    className="absolute inset-0 box-border" 
                    style={{
                        ...inheritRadius,
                        borderWidth: thickness,
                        borderStyle: 'solid',
                        borderColor: activeColor,
                        filter: `blur(${2 + thickness * 0.5}px)`,
                        opacity: 0.5
                    }} 
                />
                <div 
                    className="absolute inset-0" 
                    style={{
                        ...inheritRadius,
                        transform: 'scale(1.08)',
                        filter: 'blur(32px)',
                        opacity: 0.3,
                        zIndex: -1,
                        background: `linear-gradient(-30deg, ${hexToRgba(activeColor, 0.8)}, transparent, ${activeColor})`
                    }} 
                />
            </div>

            <div className={'relative ' + (innerClassName ?? '')} style={inheritRadius}>
                {children}
            </div>
        </div>
    );
};

export default TubelightBorder;
