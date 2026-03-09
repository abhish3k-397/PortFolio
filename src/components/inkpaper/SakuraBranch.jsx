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
            {/* ===== MAIN BRANCH — long sweep from top-right to lower-left ===== */}
            <path
                d="M800,10 C760,28 720,48 680,72 C640,96 600,115 560,138
                   C520,161 485,178 450,198 C415,218 382,235 350,255
                   C318,275 288,292 258,312 C228,332 200,350 172,370
                   C148,388 125,405 100,425"
                fill="none" stroke="rgba(105, 78, 58, 0.8)" strokeWidth="7" strokeLinecap="round"
                className="sakura-branch-main"
            />
            {/* Bark texture on main */}
            <path d="M780,18 C745,35 712,52 680,72" fill="none" stroke="rgba(85, 62, 42, 0.18)" strokeWidth="3" strokeLinecap="round" className="sakura-bark" />
            <path d="M620,108 C590,125 560,140 530,155" fill="none" stroke="rgba(85, 62, 42, 0.15)" strokeWidth="2.5" strokeLinecap="round" className="sakura-bark" />
            <path d="M430,208 C405,225 380,238 355,252" fill="none" stroke="rgba(85, 62, 42, 0.12)" strokeWidth="2" strokeLinecap="round" className="sakura-bark" />
            <path d="M280,300 C260,315 240,328 220,342" fill="none" stroke="rgba(85, 62, 42, 0.1)" strokeWidth="1.5" strokeLinecap="round" className="sakura-bark" />

            {/* ===== SUB-BRANCH A — sweeps up-left from main at ~22% ===== */}
            <path
                d="M600,118 C570,95 535,72 495,52 C460,35 420,22 375,15"
                fill="none" stroke="rgba(105, 78, 58, 0.7)" strokeWidth="5" strokeLinecap="round"
                className="sakura-branch-sub1"
            />

            {/* ===== SUB-BRANCH B — drops downward from ~40% ===== */}
            <path
                d="M450,198 C462,235 470,272 475,312 C478,348 475,380 465,418"
                fill="none" stroke="rgba(105, 78, 58, 0.65)" strokeWidth="4.5" strokeLinecap="round"
                className="sakura-branch-sub2"
            />

            {/* ===== SUB-BRANCH C — upward fork from ~58% ===== */}
            <path
                d="M330,265 C308,238 282,215 252,195 C228,178 205,168 178,160"
                fill="none" stroke="rgba(105, 78, 58, 0.6)" strokeWidth="3.5" strokeLinecap="round"
                className="sakura-branch-sub3"
            />

            {/* ===== SUB-BRANCH D — short downward fork from ~72% ===== */}
            <path
                d="M228,332 C245,362 255,392 260,425 C262,445 258,465 248,488"
                fill="none" stroke="rgba(105, 78, 58, 0.55)" strokeWidth="3" strokeLinecap="round"
                className="sakura-branch-sub4"
            />

            {/* ===== SUB-BRANCH E — short spur upward from sub-A ===== */}
            <path
                d="M495,52 C478,30 458,15 435,5"
                fill="none" stroke="rgba(105, 78, 58, 0.5)" strokeWidth="2.5" strokeLinecap="round"
                className="sakura-branch-sub5"
            />

            {/* ===== MASSIVE TWIG MULTIPLICATION ===== */}
            {/* New dense smaller branches bridging out from main branch to create fullness */}

            {/* ----- Off main ----- */}
            <path d="M760,28 C750,15 745,5 735,-5" fill="none" stroke="rgba(105, 78, 58, 0.4)" strokeWidth="2" strokeLinecap="round" className="sakura-twig" />
            <path d="M720,48 C710,70 690,85 670,100" fill="none" stroke="rgba(105, 78, 58, 0.45)" strokeWidth="2.2" strokeLinecap="round" className="sakura-twig" />
            <path d="M700,65 C688,45 678,28 665,12" fill="none" stroke="rgba(105, 78, 58, 0.4)" strokeWidth="2" strokeLinecap="round" className="sakura-twig" />
            <path d="M685,68 C680,95 670,110 650,125" fill="none" stroke="rgba(105, 78, 58, 0.4)" strokeWidth="1.9" strokeLinecap="round" className="sakura-twig" />
            <path d="M640,100 C655,80 665,62 672,40" fill="none" stroke="rgba(105, 78, 58, 0.38)" strokeWidth="1.8" strokeLinecap="round" className="sakura-twig" />
            <path d="M620,105 C610,135 590,150 565,160" fill="none" stroke="rgba(105, 78, 58, 0.38)" strokeWidth="1.8" strokeLinecap="round" className="sakura-twig" />
            <path d="M590,122 C605,100 625,90 645,80" fill="none" stroke="rgba(105, 78, 58, 0.35)" strokeWidth="1.7" strokeLinecap="round" className="sakura-twig" />
            <path d="M560,140 C575,122 585,105 588,85" fill="none" stroke="rgba(105, 78, 58, 0.35)" strokeWidth="1.8" strokeLinecap="round" className="sakura-twig" />
            <path d="M540,150 C545,175 530,195 510,210" fill="none" stroke="rgba(105, 78, 58, 0.35)" strokeWidth="1.7" strokeLinecap="round" className="sakura-twig" />
            <path d="M510,168 C525,152 535,135 538,115" fill="none" stroke="rgba(105, 78, 58, 0.33)" strokeWidth="1.6" strokeLinecap="round" className="sakura-twig" />
            <path d="M485,178 C470,160 450,145 425,135" fill="none" stroke="rgba(105, 78, 58, 0.33)" strokeWidth="1.6" strokeLinecap="round" className="sakura-twig" />
            <path d="M435,208 C425,235 410,255 385,270" fill="none" stroke="rgba(105, 78, 58, 0.3)" strokeWidth="1.5" strokeLinecap="round" className="sakura-twig" />
            <path d="M415,225 C430,210 438,195 440,178" fill="none" stroke="rgba(105, 78, 58, 0.3)" strokeWidth="1.5" strokeLinecap="round" className="sakura-twig" />
            <path d="M382,235 C395,215 415,205 435,195" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.4" strokeLinecap="round" className="sakura-twig" />
            <path d="M350,258 C365,242 372,228 375,210" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.4" strokeLinecap="round" className="sakura-twig" />
            <path d="M325,270 C315,295 300,315 275,330" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.4" strokeLinecap="round" className="sakura-twig" />
            <path d="M290,298 C278,282 265,272 250,265" fill="none" stroke="rgba(105, 78, 58, 0.26)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M275,305 C290,285 310,275 330,265" fill="none" stroke="rgba(105, 78, 58, 0.26)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M245,320 C235,345 220,365 195,380" fill="none" stroke="rgba(105, 78, 58, 0.26)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M200,358 C215,375 222,392 225,410" fill="none" stroke="rgba(105, 78, 58, 0.24)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />
            <path d="M185,365 C175,345 155,335 135,325" fill="none" stroke="rgba(105, 78, 58, 0.24)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />
            <path d="M145,398 C132,385 118,378 102,372" fill="none" stroke="rgba(105, 78, 58, 0.22)" strokeWidth="1.1" strokeLinecap="round" className="sakura-twig" />
            <path d="M125,405 C140,425 150,445 155,465" fill="none" stroke="rgba(105, 78, 58, 0.22)" strokeWidth="1.1" strokeLinecap="round" className="sakura-twig" />

            {/* ----- Off sub-branch A ----- */}
            <path d="M570,95 C565,115 550,135 525,145" fill="none" stroke="rgba(105, 78, 58, 0.35)" strokeWidth="1.8" strokeLinecap="round" className="sakura-twig" />
            <path d="M540,68 C525,48 512,32 498,18" fill="none" stroke="rgba(105, 78, 58, 0.35)" strokeWidth="1.8" strokeLinecap="round" className="sakura-twig" />
            <path d="M510,58 C520,38 535,22 555,10" fill="none" stroke="rgba(105, 78, 58, 0.32)" strokeWidth="1.6" strokeLinecap="round" className="sakura-twig" />
            <path d="M460,38 C448,22 438,10 425,2" fill="none" stroke="rgba(105, 78, 58, 0.3)" strokeWidth="1.5" strokeLinecap="round" className="sakura-twig" />
            <path d="M440,30 C450,50 465,65 485,75" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.4" strokeLinecap="round" className="sakura-twig" />
            <path d="M420,28 C432,12 438,2 440,-8" fill="none" stroke="rgba(105, 78, 58, 0.25)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />

            {/* ----- Off sub-branch B ----- */}
            <path d="M455,215 C435,225 415,230 395,232" fill="none" stroke="rgba(105, 78, 58, 0.32)" strokeWidth="1.6" strokeLinecap="round" className="sakura-twig" />
            <path d="M468,265 C485,258 498,252 515,248" fill="none" stroke="rgba(105, 78, 58, 0.3)" strokeWidth="1.5" strokeLinecap="round" className="sakura-twig" />
            <path d="M470,295 C450,305 430,310 410,312" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.4" strokeLinecap="round" className="sakura-twig" />
            <path d="M476,330 C492,325 505,322 520,320" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M470,380 C455,395 445,410 438,428" fill="none" stroke="rgba(105, 78, 58, 0.25)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />
            <path d="M475,395 C495,385 515,380 535,378" fill="none" stroke="rgba(105, 78, 58, 0.25)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />

            {/* ----- Off sub-branch C ----- */}
            <path d="M315,252 C325,230 345,215 370,205" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M285,228 C270,212 255,200 238,192" fill="none" stroke="rgba(105, 78, 58, 0.28)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M255,198 C265,175 285,160 310,150" fill="none" stroke="rgba(105, 78, 58, 0.26)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M225,202 C210,188 195,180 178,175" fill="none" stroke="rgba(105, 78, 58, 0.25)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />

            {/* ----- Off sub-branch D ----- */}
            <path d="M235,348 C215,355 195,360 175,362" fill="none" stroke="rgba(105, 78, 58, 0.26)" strokeWidth="1.3" strokeLinecap="round" className="sakura-twig" />
            <path d="M252,395 C268,388 282,385 298,382" fill="none" stroke="rgba(105, 78, 58, 0.25)" strokeWidth="1.2" strokeLinecap="round" className="sakura-twig" />
            <path d="M255,448 C240,460 228,472 218,488" fill="none" stroke="rgba(105, 78, 58, 0.22)" strokeWidth="1.1" strokeLinecap="round" className="sakura-twig" />
            <path d="M258,425 C275,435 295,440 315,442" fill="none" stroke="rgba(105, 78, 58, 0.22)" strokeWidth="1.1" strokeLinecap="round" className="sakura-twig" />

            {/* ======= EXTENSIVE BLOSSOMS & BUDS ======= */}

            {/* Main branch dense core array */}
            <Blossom cx={750} cy={38} size={14} rotation={10} bloomDelay={0.04} />
            <Blossom cx={735} cy={-5} size={13} rotation={-25} bloomDelay={0.05} />
            <Blossom cx={700} cy={65} size={17} rotation={-12} bloomDelay={0.10} />
            <Blossom cx={670} cy={100} size={16} rotation={22} bloomDelay={0.13} />
            <Blossom cx={665} cy={12} size={12} rotation={25} bloomDelay={0.12} />
            <Blossom cx={650} cy={125} size={15} rotation={-18} bloomDelay={0.15} />
            <Blossom cx={645} cy={80} size={14} rotation={35} bloomDelay={0.14} />
            <Blossom cx={640} cy={100} size={19} rotation={-8} bloomDelay={0.16} />
            <Blossom cx={672} cy={40} size={13} rotation={30} bloomDelay={0.14} />
            <Blossom cx={588} cy={85} size={14} rotation={-22} bloomDelay={0.20} />
            <Blossom cx={565} cy={160} size={18} rotation={12} bloomDelay={0.25} />
            <Blossom cx={560} cy={138} size={20} rotation={15} bloomDelay={0.22} />
            <Blossom cx={538} cy={115} size={13} rotation={-28} bloomDelay={0.24} />
            <Blossom cx={510} cy={210} size={17} rotation={-15} bloomDelay={0.29} />
            <Blossom cx={510} cy={168} size={16} rotation={18} bloomDelay={0.28} />
            <Blossom cx={450} cy={198} size={21} rotation={-10} bloomDelay={0.35} />
            <Blossom cx={440} cy={178} size={12} rotation={32} bloomDelay={0.33} />
            <Blossom cx={425} cy={135} size={15} rotation={-22} bloomDelay={0.30} />
            <Blossom cx={435} cy={195} size={14} rotation={28} bloomDelay={0.36} />
            <Blossom cx={415} cy={225} size={15} rotation={-18} bloomDelay={0.38} />
            <Blossom cx={385} cy={270} size={19} rotation={15} bloomDelay={0.42} />
            <Blossom cx={375} cy={210} size={12} rotation={22} bloomDelay={0.40} />
            <Blossom cx={350} cy={255} size={18} rotation={-15} bloomDelay={0.45} />
            <Blossom cx={330} cy={265} size={13} rotation={35} bloomDelay={0.50} />
            <Blossom cx={290} cy={298} size={16} rotation={20} bloomDelay={0.55} />
            <Blossom cx={275} cy={330} size={18} rotation={-12} bloomDelay={0.58} />
            <Blossom cx={258} cy={312} size={17} rotation={-12} bloomDelay={0.60} />
            <Blossom cx={250} cy={265} size={12} rotation={28} bloomDelay={0.57} />
            <Blossom cx={228} cy={332} size={15} rotation={-8} bloomDelay={0.65} />
            <Blossom cx={195} cy={380} size={17} rotation={25} bloomDelay={0.68} />
            <Blossom cx={200} cy={358} size={14} rotation={22} bloomDelay={0.72} />
            <Blossom cx={172} cy={370} size={18} rotation={-18} bloomDelay={0.78} />
            <Blossom cx={155} cy={465} size={15} rotation={12} bloomDelay={0.83} />
            <Blossom cx={135} cy={325} size={13} rotation={-35} bloomDelay={0.75} />
            <Blossom cx={145} cy={398} size={15} rotation={10} bloomDelay={0.82} />
            <Blossom cx={102} cy={372} size={12} rotation={-25} bloomDelay={0.84} />
            <Blossom cx={100} cy={425} size={17} rotation={8} bloomDelay={0.92} />
            <Blossom cx={225} cy={410} size={11} rotation={-30} bloomDelay={0.75} />

            {/* Sub-branch A (upward) */}
            <Blossom cx={570} cy={95} size={15} rotation={-20} bloomDelay={0.25} />
            <Blossom cx={555} cy={10} size={14} rotation={28} bloomDelay={0.30} />
            <Blossom cx={525} cy={145} size={16} rotation={-15} bloomDelay={0.32} />
            <Blossom cx={540} cy={68} size={16} rotation={15} bloomDelay={0.30} />
            <Blossom cx={498} cy={18} size={12} rotation={-10} bloomDelay={0.35} />
            <Blossom cx={495} cy={52} size={18} rotation={25} bloomDelay={0.33} />
            <Blossom cx={485} cy={75} size={15} rotation={-22} bloomDelay={0.38} />
            <Blossom cx={460} cy={38} size={14} rotation={-22} bloomDelay={0.38} />
            <Blossom cx={435} cy={5} size={13} rotation={18} bloomDelay={0.42} />
            <Blossom cx={425} cy={28} size={12} rotation={-15} bloomDelay={0.40} />
            <Blossom cx={420} cy={2} size={10} rotation={30} bloomDelay={0.44} />
            <Blossom cx={375} cy={15} size={17} rotation={-8} bloomDelay={0.48} />

            {/* Sub-branch B (downward) */}
            <Blossom cx={462} cy={235} size={14} rotation={22} bloomDelay={0.42} />
            <Blossom cx={475} cy={312} size={17} rotation={-15} bloomDelay={0.55} />
            <Blossom cx={515} cy={248} size={12} rotation={35} bloomDelay={0.50} />
            <Blossom cx={520} cy={320} size={11} rotation={-20} bloomDelay={0.58} />
            <Blossom cx={476} cy={348} size={14} rotation={10} bloomDelay={0.62} />
            <Blossom cx={465} cy={418} size={16} rotation={-28} bloomDelay={0.75} />
            <Blossom cx={438} cy={428} size={12} rotation={18} bloomDelay={0.78} />
            <Blossom cx={395} cy={232} size={15} rotation={-35} bloomDelay={0.48} />
            <Blossom cx={410} cy={312} size={14} rotation={25} bloomDelay={0.58} />
            <Blossom cx={535} cy={378} size={13} rotation={-12} bloomDelay={0.68} />

            {/* Sub-branch C (upward fork) */}
            <Blossom cx={370} cy={205} size={15} rotation={18} bloomDelay={0.60} />
            <Blossom cx={308} cy={238} size={14} rotation={-10} bloomDelay={0.58} />
            <Blossom cx={282} cy={215} size={16} rotation={22} bloomDelay={0.62} />
            <Blossom cx={310} cy={150} size={14} rotation={-25} bloomDelay={0.68} />
            <Blossom cx={252} cy={195} size={18} rotation={-15} bloomDelay={0.68} />
            <Blossom cx={238} cy={192} size={11} rotation={30} bloomDelay={0.70} />
            <Blossom cx={225} cy={202} size={13} rotation={-22} bloomDelay={0.72} />
            <Blossom cx={178} cy={160} size={17} rotation={12} bloomDelay={0.78} />
            <Blossom cx={178} cy={175} size={10} rotation={-8} bloomDelay={0.76} />

            {/* Sub-branch D (downward fork) */}
            <Blossom cx={175} cy={362} size={14} rotation={-28} bloomDelay={0.75} />
            <Blossom cx={245} cy={362} size={13} rotation={18} bloomDelay={0.70} />
            <Blossom cx={260} cy={425} size={16} rotation={-12} bloomDelay={0.78} />
            <Blossom cx={298} cy={382} size={11} rotation={25} bloomDelay={0.74} />
            <Blossom cx={315} cy={442} size={13} rotation={-18} bloomDelay={0.82} />
            <Blossom cx={248} cy={488} size={14} rotation={-20} bloomDelay={0.88} />
            <Blossom cx={218} cy={488} size={11} rotation={15} bloomDelay={0.90} />

            {/* Small accent blossoms tightly packed */}
            <SmallBlossom cx={720} cy={25} size={9} rotation={25} bloomDelay={0.07} />
            <SmallBlossom cx={680} cy={50} size={9} rotation={18} bloomDelay={0.08} />
            <SmallBlossom cx={610} cy={135} size={9} rotation={-28} bloomDelay={0.18} />
            <SmallBlossom cx={582} cy={120} size={8} rotation={-15} bloomDelay={0.21} />
            <SmallBlossom cx={545} cy={175} size={8} rotation={12} bloomDelay={0.26} />
            <SmallBlossom cx={495} cy={160} size={9} rotation={28} bloomDelay={0.27} />
            <SmallBlossom cx={470} cy={160} size={7} rotation={-12} bloomDelay={0.32} />
            <SmallBlossom cx={425} cy={235} size={8} rotation={18} bloomDelay={0.35} />
            <SmallBlossom cx={400} cy={215} size={8} rotation={-10} bloomDelay={0.37} />
            <SmallBlossom cx={330} cy={272} size={8} rotation={20} bloomDelay={0.48} />
            <SmallBlossom cx={315} cy={295} size={9} rotation={-25} bloomDelay={0.52} />
            <SmallBlossom cx={275} cy={305} size={7} rotation={-18} bloomDelay={0.56} />
            <SmallBlossom cx={245} cy={345} size={8} rotation={35} bloomDelay={0.62} />
            <SmallBlossom cx={185} cy={365} size={7} rotation={25} bloomDelay={0.74} />
            <SmallBlossom cx={140} cy={425} size={8} rotation={-22} bloomDelay={0.84} />
            <SmallBlossom cx={120} cy={408} size={8} rotation={-12} bloomDelay={0.86} />
            <SmallBlossom cx={480} cy={290} size={7} rotation={15} bloomDelay={0.52} />
            <SmallBlossom cx={450} cy={305} size={8} rotation={-18} bloomDelay={0.56} />
            <SmallBlossom cx={450} cy={395} size={8} rotation={-25} bloomDelay={0.72} />
            <SmallBlossom cx={495} cy={385} size={7} rotation={12} bloomDelay={0.70} />
            <SmallBlossom cx={265} cy={210} size={7} rotation={12} bloomDelay={0.65} />
            <SmallBlossom cx={325} cy={230} size={8} rotation={-15} bloomDelay={0.62} />
            <SmallBlossom cx={195} cy={182} size={8} rotation={-20} bloomDelay={0.75} />
            <SmallBlossom cx={265} cy={175} size={8} rotation={28} bloomDelay={0.72} />

            {/* Buds */}
            <Bud cx={770} cy={25} size={7} rotation={-30} bloomDelay={0.02} />
            <Bud cx={690} cy={85} size={6} rotation={12} bloomDelay={0.11} />
            <Bud cx={620} cy={82} size={6} rotation={15} bloomDelay={0.15} />
            <Bud cx={530} cy={150} size={6} rotation={-20} bloomDelay={0.26} />
            <Bud cx={535} cy={195} size={5} rotation={35} bloomDelay={0.28} />
            <Bud cx={450} cy={145} size={5} rotation={10} bloomDelay={0.32} />
            <Bud cx={395} cy={5} size={5} rotation={25} bloomDelay={0.45} />
            <Bud cx={440} cy={-8} size={5} rotation={-12} bloomDelay={0.44} />
            <Bud cx={335} cy={260} size={5} rotation={18} bloomDelay={0.46} />
            <Bud cx={290} cy={285} size={6} rotation={-15} bloomDelay={0.54} />
            <Bud cx={460} cy={405} size={5} rotation={-15} bloomDelay={0.73} />
            <Bud cx={108} cy={418} size={6} rotation={12} bloomDelay={0.90} />
            <Bud cx={162} cy={168} size={5} rotation={-22} bloomDelay={0.80} />
            <Bud cx={285} cy={160} size={5} rotation={18} bloomDelay={0.70} />
            <Bud cx={252} cy={478} size={5} rotation={8} bloomDelay={0.86} />
            <Bud cx={502} cy={8} size={5} rotation={-10} bloomDelay={0.34} />
            <Bud cx={125} cy={390} size={5} rotation={20} bloomDelay={0.85} />
            <Bud cx={175} cy={345} size={5} rotation={-25} bloomDelay={0.78} />
            <Bud cx={492} cy={325} size={5} rotation={12} bloomDelay={0.65} />

            {/* ======= FALLING PETALS (SVG, positioned at blossoms) ======= */}
            <FallingPetal cx={640} cy={100} size={12} delay="0s" dur="9s" drift={35} />
            <FallingPetal cx={450} cy={198} size={10} delay="2s" dur="11s" drift={-30} />
            <FallingPetal cx={560} cy={138} size={9} delay="4s" dur="8s" drift={28} />
            <FallingPetal cx={350} cy={255} size={11} delay="1s" dur="12s" drift={-32} />
            <FallingPetal cx={495} cy={52} size={8} delay="3s" dur="10s" drift={25} />
            <FallingPetal cx={258} cy={312} size={10} delay="5s" dur="9.5s" drift={-28} />
            <FallingPetal cx={475} cy={312} size={9} delay="1.5s" dur="11.5s" drift={30} />
            <FallingPetal cx={178} cy={160} size={8} delay="6s" dur="8.5s" drift={-25} />
            <FallingPetal cx={290} cy={298} size={10} delay="3.5s" dur="10.5s" drift={32} />
            <FallingPetal cx={375} cy={15} size={8} delay="4.5s" dur="13s" drift={-22} />
            <FallingPetal cx={172} cy={370} size={11} delay="2.5s" dur="9s" drift={28} />
            <FallingPetal cx={700} cy={65} size={10} delay="5.5s" dur="10s" drift={-30} />
            <FallingPetal cx={465} cy={418} size={8} delay="7s" dur="11s" drift={25} />
            <FallingPetal cx={100} cy={425} size={10} delay="3s" dur="12s" drift={-28} />
        </svg>
    );
};

export default SakuraBranch;
