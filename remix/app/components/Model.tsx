import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

export function Model({ src }: { src: string }) {
    const { scene } = useGLTF(src);

    return (
        <Canvas camera={{ position: [-10, 15, 15], fov: 50 }}>
            <ambientLight intensity={1} />
            <Suspense fallback={null}>
                <primitive object={scene} />;
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
}
