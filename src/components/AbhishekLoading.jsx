import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../assets/loading/main.css';
import loader1 from '../assets/loading/loader1.webp';
import loader2 from '../assets/loading/loader2.webp';
import loader3 from '../assets/loading/loader3.webp';
import futureImg from '../assets/loading/future.png';

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
                { width: '1em', duration: 1.25 },
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

        if (growingImage.length) {
            tl.to(
                growingImage,
                {
                    width: '100vw',
                    height: '100dvh',
                    duration: 2,
                },
                '< 1.25'
            );
        }

        if (box.length) {
            tl.to(
                box,
                {
                    width: '110vw',
                    duration: 2,
                },
                '<'
            );
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

        // Expand the growing image to fill screen
        if (growingImage.length) {
            tl.to(growingImage, {
                width: '100vw',
                height: '100vh',
                duration: 1.5,
                ease: "power2.inOut",
            }, "<");

            // Scale up the image inside to create "entering" effect
            tl.to(container.querySelectorAll('.willem__cover-image'), {
                scale: 1,
                duration: 1.5,
                ease: "power2.inOut",
            }, "<");
        }

        // Expand the box to push text away
        if (box.length) {
            tl.to(box, {
                width: '100vw',
                duration: 1.5,
                ease: "power2.inOut",
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
            backgroundColor: '#000000'
        }}>
            <div className="willem-loader" style={{ zIndex: 20 }}>
                <div className="willem__h1">
                    <div className="willem__h1-start">
                        <span className="willem__letter">A</span>
                        <span className="willem__letter">B</span>
                        <span className="willem__letter">H</span>
                        <span className="willem__letter">I</span>
                    </div>
                    <div className="willem-loader__box">
                        <div className="willem-loader__box-inner">
                            <div className="willem__growing-image">
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
                                    <img className="willem__cover-image"
                                        src={futureImg}
                                        loading="lazy" alt="Portfolio Preview" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="willem__h1-end">
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
