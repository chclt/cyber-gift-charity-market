import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

export function Model({ src }: { src: string }) {
    const { scene } = useGLTF(src);

    return (
        <Canvas camera={{ position: [-5, 8, 8], fov: 30 }}>
            <ambientLight intensity={1} />
            <Suspense fallback={null}>
                <primitive object={scene} />;
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
}
