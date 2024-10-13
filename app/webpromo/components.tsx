'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedPlane({
  url,
  visible,
  transition,
  finalPosition,
  index,
  currentIndex,
}) {
  const texture = useTexture(url);
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const totalTime = 7;
    const transitionTime = 1.5;
    const t = visible
      ? Math.min((clock.getElapsedTime() % totalTime) / transitionTime, 1)
      : 0;
    let position = [0, 0, 0];
    let scale = visible ? 1 : 0;
    let rotation = [0, Math.sin(clock.getElapsedTime() * 0.5) * 0.1, 0];

    if (transition === 'bottom') {
      position = [0, THREE.MathUtils.lerp(-10, finalPosition[1], t), 0];
    } else if (transition === 'top') {
      position = [0, THREE.MathUtils.lerp(10, finalPosition[1], t), 0];
    } else if (transition === 'left') {
      position = [THREE.MathUtils.lerp(-10, finalPosition[0], t), 0, 0];
    } else if (transition === 'right') {
      position = [THREE.MathUtils.lerp(10, finalPosition[0], t), 0, 0];
    } else if (transition === 'zoom') {
      if (index === 2) {
        const zoomOutT = Math.max(0, (t - 0.5) * 2);
        position = [0, 0, THREE.MathUtils.lerp(-5, finalPosition[2], zoomOutT)];
        scale = THREE.MathUtils.lerp(3, 1, zoomOutT);
      } else if (index === 1) {
        const zoomInT = Math.min(t * 2, 1);
        position = [
          THREE.MathUtils.lerp(finalPosition[0], 3, zoomInT),
          THREE.MathUtils.lerp(finalPosition[1], 1, zoomInT),
          THREE.MathUtils.lerp(finalPosition[2], -0.5, zoomInT),
        ];
        scale = THREE.MathUtils.lerp(1, 3, zoomInT);
        rotation = [0, 0, 0];
      }
    }

    if (
      transition !== 'zoom' ||
      (transition === 'zoom' && index !== 1 && index !== 2)
    ) {
      scale = visible
        ? THREE.MathUtils.lerp(0, 1, t)
        : THREE.MathUtils.lerp(1, 0, t);
    }

    meshRef.current.position.lerp(new THREE.Vector3(...position), 0.1);
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    meshRef.current.rotation.set(...rotation);
  });

  return (
    <mesh
      ref={meshRef}
      visible={
        visible || (transition === 'zoom' && index === 1 && currentIndex === 2)
      }
    >
      <planeGeometry args={[16 * 0.7, 9 * 0.7]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function AnimatedText({ text, position, visible, isTitle }) {
  const textRef = useRef();

  useFrame(({ camera, clock }) => {
    if (!textRef.current) return;
    textRef.current.quaternion.copy(camera.quaternion);
    if (visible) {
      const t = Math.min((clock.getElapsedTime() % 7) / 1.5, 1);
      const targetX = THREE.MathUtils.lerp(
        position[0] < 0 ? 20 : -20,
        position[0],
        t
      );
      const targetY = THREE.MathUtils.lerp(
        position[1] < 0 ? 20 : -20,
        position[1],
        t
      );
      textRef.current.position.lerp(
        new THREE.Vector3(targetX, targetY, position[2]),
        0.1
      );
    } else {
      textRef.current.position.lerp(
        new THREE.Vector3(
          position[0] < 0 ? 20 : -20,
          position[1] < 0 ? 20 : -20,
          position[2]
        ),
        0.1
      );
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={isTitle ? 0.8 : 0.4}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      maxWidth={10}
    >
      {text}
    </Text>
  );
}

export function DynamicCanvas({ features, currentIndex }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault fov={75} position={[0, 0, 10]} />
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <AnimatedPlane
              url={feature.image}
              visible={index === currentIndex}
              transition={feature.transition}
              finalPosition={feature.planePosition}
              index={index}
              currentIndex={currentIndex}
            />
            <AnimatedText
              text={feature.title}
              position={feature.textPosition}
              visible={index === currentIndex}
              isTitle={true}
            />
            <AnimatedText
              text={feature.description}
              position={[feature.textPosition[0], feature.textPosition[1] - 1.5, feature.textPosition[2]]}
              visible={index === currentIndex}
              isTitle={false}
            />
          </React.Fragment>
        ))}
      </Suspense>
    </Canvas>
  );
}