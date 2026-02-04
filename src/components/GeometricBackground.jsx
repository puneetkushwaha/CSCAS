import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Particles({ color = "#bc13fe" }) {
    const ref = useRef();
    const spheres = useMemo(() => {
        try {
            const count = 6000;
            const positions = new Float32Array(count);
            const data = random.inSphere(positions, { radius: 1.5 });

            // Robust check for invalid values (NaN or Infinity)
            let hasInvalid = false;
            for (let i = 0; i < data.length; i++) {
                if (isNaN(data[i]) || !isFinite(data[i])) {
                    data[i] = 0;
                    hasInvalid = true;
                }
            }

            if (hasInvalid) {
                console.warn("Three.js Background: Invalid vertex data detected and sanitized.");
            }

            return data;
        } catch (error) {
            console.error("Three.js Random Generation Error:", error);
            // Fallback to a safe empty array if generation fails completely
            return new Float32Array(5000).fill(0);
        }
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={spheres} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

const GeometricBackground = ({ color = "#bc13fe", opacity = 0.3 }) => {
    return (
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none" style={{ opacity }}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Particles color={color} />
            </Canvas>
        </div>
    );
};

export default GeometricBackground;
