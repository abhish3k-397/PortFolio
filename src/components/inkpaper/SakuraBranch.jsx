import React from 'react';

/**
 * SakuraBranch — Detailed SVG cherry blossom branch.
 * Each blossom has data-bloom-delay (0–1) for timed bloom animation.
 * Falling petals are SVG ellipses positioned at blossom coordinates,
 * animated with CSS keyframes so they actually fall from the flowers.
 */

const Blossom = ({ cx, cy, size = 12, rotation = 0, opacity = 1, bloomDelay = 0 }) => {
    const petals = [];
    for (let i = 0; i < 5; i++) {
        const angle = (72 * i) + rotation;
        petals.push(
            <ellipse
                key={i}
                cx={0} cy={-size * 0.55}
                rx={size * 0.38} ry={size * 0.55}
                fill="rgba(222, 170, 170, 0.7)"
                stroke="rgba(190, 140, 140, 0.3)"
                strokeWidth="0.3"
                transform={`rotate(${angle})`}
            />
        );
    }
    return (
        <g className="sakura-blossom" data-bloom-delay={bloomDelay}
            transform={`translate(${cx}, ${cy})`} opacity={opacity}>
            {petals}
            <circle r={size * 0.15} fill="rgba(200, 160, 140, 0.8)" />
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <line key={i} x1={0} y1={0}
                    x2={Math.cos(a * Math.PI / 180) * size * 0.22}
                    y2={Math.sin(a * Math.PI / 180) * size * 0.22}
                    stroke="rgba(180, 140, 120, 0.5)" strokeWidth="0.4" strokeLinecap="round"
                />
            ))}
        </g>
    );
};

const SmallBlossom = ({ cx, cy, size = 8, rotation = 0, bloomDelay = 0 }) => {
    const petals = [];
    for (let i = 0; i < 5; i++) {
        const angle = (72 * i) + rotation;
        petals.push(
            <ellipse key={i} cx={0} cy={-size * 0.45}
                rx={size * 0.32} ry={size * 0.45}
                fill="rgba(228, 185, 185, 0.55)"
                stroke="rgba(200, 160, 160, 0.2)" strokeWidth="0.2"
                transform={`rotate(${angle})`}
            />
        );
    }
    return (
        <g className="sakura-blossom" data-bloom-delay={bloomDelay} transform={`translate(${cx}, ${cy})`}>
            {petals}
            <circle r={size * 0.12} fill="rgba(200, 160, 140, 0.6)" />
        </g>
    );
};

const Bud = ({ cx, cy, size = 6, rotation = 0, bloomDelay = 0 }) => (
    <g className="sakura-blossom" data-bloom-delay={bloomDelay}
        transform={`translate(${cx}, ${cy}) rotate(${rotation})`}>
        <ellipse cx={0} cy={0} rx={size * 0.3} ry={size * 0.6}
            fill="rgba(210, 160, 160, 0.6)" stroke="rgba(160, 120, 110, 0.3)" strokeWidth="0.3" />
        <ellipse cx={-size * 0.15} cy={-size * 0.1} rx={size * 0.2} ry={size * 0.45}
            fill="rgba(180, 140, 130, 0.4)" />
    </g>
);

/* Falling petal — SVG ellipse that starts at a blossom and falls down with drift */
const FallingPetal = ({ cx, cy, size = 5, delay = '0s', dur = '8s', drift = 20 }) => (
    <ellipse
        className="sakura-falling-petal"
        cx={cx} cy={cy}
        rx={size * 0.45} ry={size * 0.3}
        fill="rgba(218, 165, 165, 0.6)"
        style={{
            animationDuration: dur,
            animationDelay: delay,
            '--fall-drift': `${drift}px`,
        }}
    />
);

const SakuraBranch = () => {
    const { branches, flowers, fallingPetals } = React.useMemo(() => {
        const generatedBranches = [];
        const generatedFlowers = [];
        const generatedPetals = [];

        let branchId = 0;
        let flowerId = 0;
        let petalId = 0;

        // Custom seeded rand logic or Math.random
        const rand = (min, max) => Math.random() * (max - min) + min;

        // Recursive mathematical branch generation
        const buildBranch = (x, y, angleDeg, length, depth, branchWidth, delayAccum) => {
            if (depth === 0) return;

            const angleRad = angleDeg * (Math.PI / 180);

            // Add slight organic curvature by using a quadratic bezier
            const curveFactor = rand(-0.25, 0.25);
            const midX = x + Math.cos(angleRad + curveFactor) * (length * 0.5);
            const midY = y + Math.sin(angleRad + curveFactor) * (length * 0.5);
            const x2 = x + Math.cos(angleRad) * length;
            const y2 = y + Math.sin(angleRad) * length;

            // Base delay increases as depth decreases (moving away from root)
            const currentDelay = delayAccum + rand(0.1, 0.25);

            generatedBranches.push({
                id: branchId++,
                path: `M ${x},${y} Q ${midX},${midY} ${x2},${y2}`,
                width: branchWidth,
                delay: currentDelay,
                opacity: 0.8 - (6 - depth) * 0.08
            });

            // Normalise bloom delay from 0 to 1
            const bloomDelay = Math.min(1, currentDelay / 2.5);

            // "Lower the number of flowers just a bit" -> drop spawn chance from 85% to 55%
            if (Math.random() > 0.45) {
                // Spawn fewer items per cluster as well
                const numFlowers = Math.floor(rand(1, 3));
                for (let i = 0; i < numFlowers; i++) {
                    const t = rand(0.1, 0.9);
                    const fx = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * midX + t * t * x2;
                    const fy = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * midY + t * t * y2;

                    const type = rand(0, 1) > 0.3 ? 'blossom' : 'small';
                    generatedFlowers.push({
                        id: flowerId++,
                        type,
                        cx: fx + rand(-15, 15), cy: fy + rand(-15, 15),
                        size: type === 'blossom' ? rand(10, 16) : rand(6, 10),
                        rotation: rand(0, 360),
                        delay: bloomDelay + rand(0, 0.3)
                    });

                    // Add falling petals
                    if (Math.random() > 0.8) {
                        generatedPetals.push({
                            id: petalId++,
                            cx: fx, cy: fy,
                            delay: `${bloomDelay * 3 + rand(0, 5)}s`,
                            dur: `${rand(8, 14)}s`,
                            drift: rand(-40, 40)
                        });
                    }
                }
            }

            // Always add flowers or buds at branch tips
            if (depth === 1 || Math.random() > 0.4) {
                const type = depth <= 2 ? 'blossom' : (Math.random() > 0.5 ? 'small' : 'bud');
                generatedFlowers.push({
                    id: flowerId++,
                    type, cx: x2, cy: y2,
                    size: type === 'blossom' ? rand(12, 18) : rand(5, 9),
                    rotation: rand(0, 360),
                    delay: bloomDelay + 0.15
                });
            }

            // Spawn sub-branches
            if (depth > 1) {
                const numBranches = Math.floor(rand(2, 4.5));
                for (let i = 0; i < numBranches; i++) {
                    const angleOffset = rand(8, 30) * (Math.random() > 0.5 ? 1 : -1);
                    const nextAngle = angleDeg + angleOffset;
                    // Retain more length per split to make it overall "longer and bigger"
                    const nextLength = length * rand(0.65, 0.88);
                    const nextWidth = Math.max(0.6, branchWidth * 0.75);
                    buildBranch(x2, y2, nextAngle, nextLength, depth - 1, nextWidth, currentDelay);
                }
            }
        };

        // Root starts top right, pointing down-left into the viewport
        // Increased base length from 140 to 180, and base width from 7 to 9
        buildBranch(800, 10, 140, 180, 6, 9, 0);

        return { branches: generatedBranches, flowers: generatedFlowers, fallingPetals: generatedPetals };
    }, []);

    return (
        <svg
            className="sakura-svg"
            viewBox="0 0 800 700"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                top: '-15%',
                right: '-10%',
                width: 'clamp(420px, 60vw, 850px)',
                height: 'auto',
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'visible',
            }}
        >
            {/* Draw Branches Dynamically */}
            {branches.map(b => (
                <path
                    key={b.id}
                    d={b.path}
                    fill="none"
                    stroke={`rgba(105, 78, 58, ${b.opacity})`}
                    strokeWidth={b.width}
                    strokeLinecap="round"
                    className="sakura-branch"
                    data-branch-delay={b.delay}
                />
            ))}

            {/* Draw Flowers Dynamically */}
            {flowers.map(f => {
                if (f.type === 'blossom') return <Blossom key={f.id} cx={f.cx} cy={f.cy} size={f.size} rotation={f.rotation} opacity={0} bloomDelay={f.delay} />;
                if (f.type === 'small') return <SmallBlossom key={f.id} cx={f.cx} cy={f.cy} size={f.size} rotation={f.rotation} bloomDelay={f.delay} />;
                return <Bud key={f.id} cx={f.cx} cy={f.cy} size={f.size} rotation={f.rotation} bloomDelay={f.delay} />;
            })}

            {/* SVG Falling animators */}
            {fallingPetals.map(p => (
                <FallingPetal key={p.id} cx={p.cx} cy={p.cy} delay={p.delay} dur={p.dur} drift={p.drift} />
            ))}
        </svg>
    );
};

export default SakuraBranch;
