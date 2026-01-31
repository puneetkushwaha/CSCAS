import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Particles({ color = "#bc13fe" }) {
    const ref = useRef();
    const spheres = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
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
