import React, { useState, useEffect } from 'react';

const BlackHoleBackground = ({ isInteractive }) => {
    return (
        <iframe
            title="WebGL Black Hole Background"
            src="/blackhole/index.html"
            className="absolute inset-0 w-full h-full border-0 transition-opacity duration-300"
            style={{
                pointerEvents: isInteractive ? 'auto' : 'none',
            }}
        />
    );
};

export default BlackHoleBackground;

