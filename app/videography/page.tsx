'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  useHelper,
  Environment,
  useTexture,
  AccumulativeShadows,
  RandomizedLight,
  SoftShadows,
  Text,
  Grid as DreiGrid,
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Camera,
  Sun,
  Layers,
  Grid,
  Box,
  Palette,
  X,
  GripHorizontal,
  Bot,
} from 'lucide-react';

type SceneProps = {
  lightIntensity: number;
  lightColor: string;
  lightPosition: { x: number; y: number; z: number };
  environmentPreset: string;
  showGrid: boolean;
  showShadows: boolean;
};

type CameraControllerProps = {
  cameraPosition: { x: number; y: number; z: number };
  updateCameraPosition: (axis: string, value: number) => void;
};

type FloatingWindowProps = {
  onClose: () => void;
  onContinue: () => void;
};

type LeftSidebarProps = {
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showShadows: boolean;
  setShowShadows: (show: boolean) => void;
  onOpenWindow: () => void;
};

type RightSidebarProps = {
  lightIntensity: number;
  setLightIntensity: (intensity: number) => void;
  lightColor: string;
  setLightColor: (color: string) => void;
  lightPosition: { x: number; y: number; z: number };
  setLightPosition: (position: { x: number; y: number; z: number }) => void;
  cameraPosition: { x: number; y: number; z: number };
  updateCameraPosition: (axis: string, value: number) => void;
  environmentPreset: string;
  setEnvironmentPreset: (preset: string) => void;
};

function Scene({
  lightIntensity,
  lightColor,
  lightPosition,
  environmentPreset,
  showGrid,
  showShadows,
}: SceneProps) {
  const boxRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');

  useFrame((state, delta) => {
    if (boxRef.current) boxRef.current.rotation.y += delta * 0.2;
    if (sphereRef.current) sphereRef.current.rotation.y += delta * 0.1;
    if (cylinderRef.current) cylinderRef.current.rotation.y += delta * 0.15;
  });

  const floorTexture = useTexture(
    'data:image/jpeg;base64,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'
  );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        ref={directionalLightRef}
        position={[lightPosition.x, lightPosition.y, lightPosition.z]}
        intensity={lightIntensity}
        color={lightColor}
        castShadow={showShadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Studio backdrop */}
      <mesh position={[0, 5, -10]} receiveShadow={showShadows}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Studio floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow={showShadows}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Studio side walls */}
      <mesh
        position={[-10, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={showShadows}
      >
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      <mesh
        position={[10, 5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={showShadows}
      >
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      {/* Studio equipment */}
      <mesh position={[-8, 0, -8]} castShadow={showShadows}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-8, 2.5, -8]} castShadow={showShadows}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      <mesh position={[8, 0, -8]} castShadow={showShadows}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[8, 2.5, -8]} castShadow={showShadows}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Sample objects for the scene */}
      <mesh
        ref={boxRef}
        position={[-2, 0.5, 0]}
        castShadow={showShadows}
        receiveShadow={showShadows}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={sphereRef}
        position={[0, 0.7, 0]}
        castShadow={showShadows}
        receiveShadow={showShadows}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="lightblue"
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      <mesh
        ref={cylinderRef}
        position={[2, 0.5, 0]}
        castShadow={showShadows}
        receiveShadow={showShadows}
      >
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>

      <Text
        position={[0, 5, -9.9]}
        fontSize={1}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        STUDIO
      </Text>

      {showShadows && (
        <AccumulativeShadows
          temporal
          frames={60}
          color="#316d39"
          colorBlend={0.5}
          opacity={0.8}
          scale={20}
          position={[0, -0.49, 0]}
        >
          <RandomizedLight
            amount={8}
            radius={4}
            ambient={0.5}
            intensity={1}
            position={[lightPosition.x, lightPosition.y, lightPosition.z]}
            bias={0.001}
          />
        </AccumulativeShadows>
      )}

      {showGrid && <DreiGrid infiniteGrid />}
    </>
  );
}

function CameraController({
  cameraPosition,
  updateCameraPosition,
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    targetPosition.current.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );
  }, [cameraPosition]);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05);
  });

  return null;
}

function FloatingWindow({ onClose, onContinue }: FloatingWindowProps) {
  const [shotName, setShotName] = useState('');
  const [shotLocation, setShotLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [equipment, setEquipment] = useState({
    camera: false,
    tripod: false,
    lights: false,
    microphone: false,
    gimbal: false,
    drone: false,
    slider: false,
    greenScreen: false,
  });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef<HTMLDivElement>(null);

  const handleEquipmentChange = (item: keyof typeof equipment) => {
    setEquipment((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  useEffect(() => {
    const dragElement = dragRef.current;
    if (!dragElement) return;

    let isDragging = false;
    let startX: number, startY: number;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX - position.x;
      startY = e.clientY - position.y;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    dragElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      dragElement.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [position]);

  return (
    <Card
      className="absolute shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '480px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <CardHeader
        className="flex flex-row items-center justify-between cursor-move"
        ref={dragRef}
      >
        <CardTitle>Shot Details</CardTitle>
        <div className="flex items-center">
          <GripHorizontal className="h-4 w-4 mr-2" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="shot-name">Shot Name</Label>
            <Input
              id="shot-name"
              value={shotName}
              onChange={(e) => setShotName(e.target.value)}
              placeholder="Enter shot name"
            />
          </div>
          <div>
            <Label htmlFor="shot-location">Shot Location</Label>
            <Input
              id="shot-location"
              value={shotLocation}
              onChange={(e) => setShotLocation(e.target.value)}
              placeholder="Enter shot location"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or instructions"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="workspace">Workspace / Shot Ideas</Label>
            <Textarea
              id="workspace"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="Describe the workspace or add shot ideas"
              rows={3}
            />
          </div>
          <div>
            <Label>Equipment</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(equipment).map(([item, checked]) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={checked}
                    onCheckedChange={() =>
                      handleEquipmentChange(item as keyof typeof equipment)
                    }
                  />
                  <label
                    htmlFor={item}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={onContinue}>
            Continue to AI Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LeftSidebar({
  showGrid,
  setShowGrid,
  showShadows,
  setShowShadows,
  onOpenWindow,
}: LeftSidebarProps) {
  return (
    <div className="w-64 h-full bg-background border-r overflow-y-auto flex flex-col">
      <div className="flex-grow p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Scene Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={showGrid ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="w-4 h-4 mr-2" />
                {showGrid ? 'Hide Grid' : 'Show Grid'}
              </Button>
              <Button
                variant={showShadows ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setShowShadows(!showShadows)}
              >
                <Layers className="w-4 h-4 mr-2" />
                {showShadows ? 'Hide Shadows' : 'Show Shadows'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 border-t">
        <Card>
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onOpenWindow}
            >
              <Bot className="w-4 h-4 mr-2" />
              Open AI Assistant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RightSidebar({
  lightIntensity,
  setLightIntensity,
  lightColor,
  setLightColor,
  lightPosition,
  setLightPosition,
  cameraPosition,
  updateCameraPosition,
  environmentPreset,
  setEnvironmentPreset,
}: RightSidebarProps) {
  return (
    <div className="w-80 h-full bg-background border-l overflow-y-auto">
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="camera">
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="lighting">
            <Sun className="w-4 h-4 mr-2" />
            Lighting
          </TabsTrigger>
          <TabsTrigger value="environment">
            <Palette className="w-4 h-4 mr-2" />
            Environment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="camera" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Camera Position</h3>
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{axis.toUpperCase()}</Label>
                  <span className="text-sm text-muted-foreground">
                    {cameraPosition[
                      axis as keyof typeof cameraPosition
                    ].toFixed(2)}
                  </span>
                </div>
                <Slider
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[cameraPosition[axis as keyof typeof cameraPosition]]}
                  onValueChange={(value) =>
                    updateCameraPosition(axis, value[0])
                  }
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCameraPosition('reset', 0)}
            >
              Reset Camera
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="lighting" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lighting</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Intensity</Label>
                <span className="text-sm text-muted-foreground">
                  {lightIntensity.toFixed(2)}
                </span>
              </div>
              <Slider
                min={0}
                max={2}
                step={0.01}
                value={[lightIntensity]}
                onValueChange={(value) => setLightIntensity(value[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: lightColor }}
                />
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Light Position</h4>
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{axis.toUpperCase()}</Label>
                    <span className="text-sm text-muted-foreground">
                      {lightPosition[
                        axis as keyof typeof lightPosition
                      ].toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[lightPosition[axis as keyof typeof lightPosition]]}
                    onValueChange={(value) =>
                      setLightPosition((prev) => ({
                        ...prev,
                        [axis]: value[0],
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="environment" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Environment Settings</h3>
            <div className="space-y-2">
              <Label>Environment Preset</Label>
              <select
                className="w-full p-2 border rounded"
                value={environmentPreset}
                onChange={(e) => setEnvironmentPreset(e.target.value)}
              >
                <option value="studio">Studio</option>
                <option value="sunset">Sunset</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function VideographyScene3D() {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightColor, setLightColor] = useState('#ffffff');
  const [lightPosition, setLightPosition] = useState({ x: 5, y: 5, z: 5 });
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 5, z: 10 });
  const [environmentPreset, setEnvironmentPreset] = useState('studio');
  const [showGrid, setShowGrid] = useState(false);
  const [showShadows, setShowShadows] = useState(true);
  const [showFloatingWindow, setShowFloatingWindow] = useState(false);

  const updateCameraPosition = (axis: string, value: number) => {
    if (axis === 'reset') {
      setCameraPosition({ x: 0, y: 5, z: 10 });
    } else {
      setCameraPosition((prev) => ({ ...prev, [axis]: value }));
    }
  };

  const handleOpenWindow = () => {
    setShowFloatingWindow(true);
  };

  const handleCloseWindow = () => {
    setShowFloatingWindow(false);
  };

  const handleContinueToAIChat = () => {
    // Placeholder for AI chat navigation
    console.log('Navigating to AI Chat...');
    // Here you would typically navigate to the AI chat interface
    // or open a new component for the AI chat
  };

  return (
    <div className="w-full h-screen flex">
      <LeftSidebar
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showShadows={showShadows}
        setShowShadows={setShowShadows}
        onOpenWindow={handleOpenWindow}
      />
      <div className="flex-grow relative">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
          <SoftShadows size={25} samples={16} focus={0.5} />
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls enableDamping dampingFactor={0.05} />
          <Scene
            lightIntensity={lightIntensity}
            lightColor={lightColor}
            lightPosition={lightPosition}
            environmentPreset={environmentPreset}
            showGrid={showGrid}
            showShadows={showShadows}
          />
          <Environment preset={environmentPreset as any} background />
          <CameraController
            cameraPosition={cameraPosition}
            updateCameraPosition={updateCameraPosition}
          />
        </Canvas>
        {showFloatingWindow && (
          <FloatingWindow
            onClose={handleCloseWindow}
            onContinue={handleContinueToAIChat}
          />
        )}
      </div>
      <RightSidebar
        lightIntensity={lightIntensity}
        setLightIntensity={setLightIntensity}
        lightColor={lightColor}
        setLightColor={setLightColor}
        lightPosition={lightPosition}
        setLightPosition={setLightPosition}
        cameraPosition={cameraPosition}
        updateCameraPosition={updateCameraPosition}
        environmentPreset={environmentPreset}
        setEnvironmentPreset={setEnvironmentPreset}
      />
    </div>
  );
}
