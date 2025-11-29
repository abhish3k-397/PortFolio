import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const Blob = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Mouse interaction
        // We lerp the distortion based on mouse position (if available in state.pointer)
        // state.pointer.x goes from -1 to 1

        if (meshRef.current) {
            // Rotate the blob slowly
            meshRef.current.rotation.x = time * 0.2;
            meshRef.current.rotation.y = time * 0.3;

            // Dynamic distortion based on mouse distance from center
            const dist = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2);
            meshRef.current.distort = 0.4 + dist * 0.4; // Base 0.4, max 0.8
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 100, 200]} scale={2.2} ref={meshRef}>
                <MeshDistortMaterial
                    color="#00f3ff" // Cyan for futuristic look
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
};

const InteractiveBlob = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="cyan" intensity={2} />
                <Blob />
            </Canvas>
        </div>
    );
};

export default InteractiveBlob;
