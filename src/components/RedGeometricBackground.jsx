import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RedGeometricBackground = ({
    height = 5,
    jaggednessScale = 2.5,
    opacity = 0.6,
    reverse = false,
    planeSize = [35, 20],
    cameraPos = [0, 2, 8],
    meshPos = [0, -7, 0],
    ashCount = 50,
    ashColor = 0xff6600,
    ashSize = 0.03,
    showPoints = true,
    wireframeOpacity = 0.8
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Geometry - Low Poly Plane (Customizable via props)
        const geometry = new THREE.PlaneGeometry(planeSize[0], planeSize[1], 50, 50);
        const positionAttribute = geometry.getAttribute('position');
        const originalPositions = new Float32Array(positionAttribute.array);

        // Create a L-to-R climbing height gradient for the mountains
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);

            // Normalize X to 0 (left) to 1 (right) based on plane width
            let normalizedX = (x + planeSize[0] / 2) / planeSize[0];
            if (reverse) normalizedX = 1 - normalizedX;

            // Base height increases towards the right, plus jagged peaks
            const climbHeight = normalizedX * height;
            const jaggedness = Math.random() * jaggednessScale;

            positionAttribute.setZ(i, climbHeight + jaggedness);
        }
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        // Mesh Material (Subtle base)
        const material = new THREE.MeshPhongMaterial({
            color: 0x660000,
            transparent: true,
            opacity: opacity,
            flatShading: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2.2;
        mesh.position.set(meshPos[0], meshPos[1], meshPos[2]);
        scene.add(mesh);

        // Wireframe / Edges (The Plexus Look)
        const wireframe = new THREE.WireframeGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: wireframeOpacity
        });
        const lineSegments = new THREE.LineSegments(wireframe, lineMaterial);
        lineSegments.rotation.x = mesh.rotation.x;
        lineSegments.position.y = mesh.position.y;
        scene.add(lineSegments);

        // Vertices (Points)
        let pointsMaterial = null;
        if (showPoints) {
            pointsMaterial = new THREE.PointsMaterial({
                color: 0xff0000,
                size: 0.1,
                transparent: true,
                opacity: 1.0
            });
            const points = new THREE.Points(geometry, pointsMaterial);
            points.rotation.x = mesh.rotation.x;
            points.position.y = mesh.position.y;
            scene.add(points);
        }

        // Subtle Ashes / Sparks System
        const ashGeometry = new THREE.BufferGeometry();
        const ashPositions = new Float32Array(ashCount * 3);
        const ashVelocities = new Float32Array(ashCount);

        for (let i = 0; i < ashCount; i++) {
            ashPositions[i * 3] = (Math.random() - 0.5) * (planeSize[0] * 1.5); // X Spread
            ashPositions[i * 3 + 1] = (Math.random() - 0.5) * 30; // Random Y position within range
            ashPositions[i * 3 + 2] = (Math.random() - 0.5) * 15; // Z Spread
            ashVelocities[i] = 0.01 + Math.random() * 0.03;
        }

        ashGeometry.setAttribute('position', new THREE.BufferAttribute(ashPositions, 3));
        const ashMaterial = new THREE.PointsMaterial({
            color: ashColor,
            size: ashSize,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const ashes = new THREE.Points(ashGeometry, ashMaterial);
        scene.add(ashes);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff0000, 30);
        pointLight.position.set(0, 5, 5);
        scene.add(pointLight);

        camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2]);

        // Animation
        let frame = 0;
        const animate = () => {
            frame += 0.005;

            // Subtle wave movement
            const pos = geometry.getAttribute('position');
            for (let i = 0; i < pos.count; i++) {
                const z = originalPositions[i * 3 + 2] + Math.sin(frame + i * 0.2) * 0.15;
                pos.setZ(i, z);
            }
            pos.needsUpdate = true;

            // Animate Ashes upwards
            const ashPos = ashGeometry.getAttribute('position');
            for (let i = 0; i < ashCount; i++) {
                ashPos.setY(i, ashPos.getY(i) + ashVelocities[i]);

                // Reset ash if it goes too high (scaled with camera depth)
                // Reset ash if it goes too high (scaled with coverage)
                if (ashPos.getY(i) > 40) {
                    ashPos.setY(i, -30);
                    ashPos.setX(i, (Math.random() - 0.5) * (planeSize[0] * 2.5));
                }
            }
            ashPos.needsUpdate = true;

            // Removed rotation for static mountain feel

            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Resize Handling
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            lineMaterial.dispose();
            if (pointsMaterial) pointsMaterial.dispose();
            ashGeometry.dispose();
            ashMaterial.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none z-0 bg-transparent overflow-hidden"
            style={{
                maskImage: 'linear-gradient(to bottom, black 0%, black 90%, transparent 100%)'
            }}
        />
    );
};

export default RedGeometricBackground;
