import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../assets/loading/main.css';
import loader1 from '../assets/loading/loader1.webp';
import loader2 from '../assets/loading/loader2.webp';
import loader3 from '../assets/loading/loader3.webp';

const AbhishekLoading = ({ onComplete }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const loadingLetter = container.querySelectorAll('.willem__letter');
        const box = container.querySelectorAll('.willem-loader__box');
        const growingImage = container.querySelectorAll('.willem__growing-image');
        const headingStart = container.querySelectorAll('.willem__h1-start');
        const headingEnd = container.querySelectorAll('.willem__h1-end');
        const coverImageExtra = container.querySelectorAll('.willem__cover-image-extra');
        const headerLetter = container.querySelectorAll('.willem__letter-white');
        const navLinks = container.querySelectorAll('.willen-nav a, .osmo-credits__p');

        /* GSAP Timeline */
        const tl = gsap.timeline({
            defaults: {
                ease: 'expo.inOut',
            },
            onStart: () => {
                container.classList.remove('is--hidden');
            },
        });

        /* Start of Timeline */
        if (loadingLetter.length) {
            tl.fromTo(loadingLetter,
                { opacity: 0 },
                {
                    opacity: 1,
                    stagger: 0.025,
                    duration: 1.25,
                }
            );
        }

        if (box.length) {
            tl.fromTo(
                box,
                { width: '0em' },
                { width: '1.28em', duration: 1.25 },
                '< 1.25'
            );
        }

        if (growingImage.length) {
            tl.fromTo(
                growingImage,
                { width: '0%' },
                { width: '100%', duration: 1.25 },
                '<'
            );
        }

        if (headingStart.length) {
            tl.fromTo(
                headingStart,
                { x: '0em' },
                { x: '-0.05em', duration: 1.25 },
                '<'
            );
        }

        if (headingEnd.length) {
            tl.fromTo(
                headingEnd,
                { x: '0em' },
                { x: '0.05em', duration: 1.25 },
                '<'
            );
        }

        if (coverImageExtra.length) {
            tl.fromTo(
                coverImageExtra,
                { opacity: 1 },
                {
                    opacity: 0,
                    duration: 0.05,
                    ease: 'none',
                    stagger: 0.5,
                },
                '-=0.05'
            );
        }

        // Removed intermediate growingImage expansion to avoid conflict

        if (box.length) {
            // Initial expansion for text reveal
            // We keep this but ensure aspect ratio is respected
        }

        if (headerLetter.length) {
            tl.from(
                headerLetter,
                {
                    yPercent: 100,
                    duration: 1.25,
                    ease: 'expo.out',
                    stagger: 0.025,
                },
                '< 1.2'
            );
        }

        if (navLinks.length) {
            tl.from(
                navLinks,
                {
                    yPercent: 100,
                    duration: 1.25,
                    ease: 'expo.out',
                    stagger: 0.1,
                },
                '<'
            );
        }

        // Expand the box to fill screen (maintaining 16:9)
        if (box.length) {
            tl.to(box, {
                width: '200vmax', // Huge width to ensure coverage
                height: '112.5vmax', // Explicit height to maintain 16:9 (200 * 9/16)
                duration: 2,
                ease: "power2.inOut",
            }, "< 1.25");
        }

        // Ensure growing image fills the box
        if (growingImage.length) {
            tl.to(growingImage, {
                width: '100%',
                height: '100%',
                duration: 0.1, // Instant update
            }, "<");
        }

        // Fade out everything to reveal actual app
        tl.to(container, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                if (onComplete) onComplete();
            }
        }, "+=0.1");

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <section className="willem-header is--loading" ref={containerRef} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            backgroundColor: 'transparent',
            pointerEvents: 'none'
        }}>
            <div className="willem-loader" style={{ zIndex: 20, pointerEvents: 'auto' }}>
                <div className="willem__h1">
                    <div className="willem__h1-start" style={{ position: 'relative', zIndex: 50 }}>
                        <span className="willem__letter">A</span>
                        <span className="willem__letter">B</span>
                        <span className="willem__letter">H</span>
                        <span className="willem__letter">I</span>
                    </div>
                    <div className="willem-loader__box" style={{ overflow: 'visible', background: 'transparent', boxShadow: '0 0 0 200vmax #000', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="willem-loader__box-inner" style={{ overflow: 'visible', background: 'transparent', width: '100%', height: '100%' }}>
                            <div className="willem__growing-image" style={{ background: 'transparent', width: '100%', height: '100%' }}>
                                <div className="willem__growing-image-wrap">
                                    <img className="willem__cover-image-extra is--1"
                                        src={loader1}
                                        loading="lazy" alt="" />
                                    <img className="willem__cover-image-extra is--2"
                                        src={loader2}
                                        loading="lazy" alt="" />
                                    <img className="willem__cover-image-extra is--3"
                                        src={loader3}
                                        loading="lazy" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="willem__h1-end" style={{ position: 'relative', zIndex: 50 }}>
                        <span className="willem__letter">S</span>
                        <span className="willem__letter">H</span>
                        <span className="willem__letter">E</span>
                        <span className="willem__letter">K</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AbhishekLoading;
