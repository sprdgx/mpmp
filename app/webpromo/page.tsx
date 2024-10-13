'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PlayCircle, PauseCircle } from 'lucide-react';

const DynamicCanvas = dynamic(() => import('./components').then((mod) => mod.DynamicCanvas), { ssr: false });

const initialFeatures = [
  {
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    title: 'Feature 1',
    description: 'Description 1',
    transition: 'bottom',
    planePosition: [0, 3, 0],
    textPosition: [0, -4.5, 0],
    holdTime: 5, // Default hold time in seconds
  },
  // Add more initial features here
];

export default function VideoEditingWorkspace() {
  const [features, setFeatures] = useState(initialFeatures);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingFeature, setEditingFeature] = useState(0);
  const [globalSettings, setGlobalSettings] = useState({
    transitionTime: 1.5,
    defaultHoldTime: 5,
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  const nextFeature = useCallback(() => {
    if (isPlaying) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
      setElapsedTime(0);
    }
  }, [features.length, isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 0.1;
          if (newTime >= features[currentIndex].holdTime + globalSettings.transitionTime) {
            nextFeature();
            return 0;
          }
          return newTime;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, features, currentIndex, globalSettings.transitionTime, nextFeature]);

  const updateFeature = (index, field, value) => {
    setFeatures(prevFeatures => {
      const updatedFeatures = [...prevFeatures];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      return updatedFeatures;
    });
  };

  const addFeature = () => {
    setFeatures(prevFeatures => [
      ...prevFeatures,
      {
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}`,
        title: `Feature ${prevFeatures.length + 1}`,
        description: `Description ${prevFeatures.length + 1}`,
        transition: 'bottom',
        planePosition: [0, 3, 0],
        textPosition: [0, -4.5, 0],
        holdTime: globalSettings.defaultHoldTime,
      }
    ]);
  };

  const removeFeature = (index) => {
    setFeatures(prevFeatures => {
      const updatedFeatures = prevFeatures.filter((_, i) => i !== index);
      if (editingFeature >= updatedFeatures.length) {
        setEditingFeature(updatedFeatures.length - 1);
      }
      return updatedFeatures;
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-1/4 p-4 border-r overflow-y-auto">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="features">
            {features.map((feature, index) => (
              <div key={index} className="mb-4 p-2 border rounded">
                <h3 className="font-bold">{feature.title}</h3>
                <Button onClick={() => setEditingFeature(index)} variant="outline" size="sm" className="mt-2">
                  Edit
                </Button>
                <Button onClick={() => removeFeature(index)} variant="destructive" size="sm" className="mt-2 ml-2">
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addFeature} className="w-full mt-4">Add New Feature</Button>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Transition Time (seconds)</label>
                <Input
                  type="number"
                  value={globalSettings.transitionTime}
                  onChange={(e) => setGlobalSettings({...globalSettings, transitionTime: parseFloat(e.target.value)})}
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Hold Time (seconds)</label>
                <Input
                  type="number"
                  value={globalSettings.defaultHoldTime}
                  onChange={(e) => setGlobalSettings({...globalSettings, defaultHoldTime: parseFloat(e.target.value)})}
                  min="1"
                  step="1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 bg-black rounded-lg overflow-hidden">
          <DynamicCanvas features={features} currentIndex={currentIndex} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button onClick={togglePlayPause}>
            {isPlaying ? <PauseCircle className="mr-2" /> : <PlayCircle className="mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <div className="text-sm">
            Time: {elapsedTime.toFixed(1)}s / {(features[currentIndex]?.holdTime + globalSettings.transitionTime).toFixed(1)}s
          </div>
          <div className="text-sm">
            Feature: {currentIndex + 1} / {features.length}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 p-4 border-l overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Feature</h2>
        {features[editingFeature] && (
          <div className="space-y-4">
            <Input
              placeholder="Image URL"
              value={features[editingFeature].image}
              onChange={(e) => updateFeature(editingFeature, 'image', e.target.value)}
            />
            <Input
              placeholder="Title"
              value={features[editingFeature].title}
              onChange={(e) => updateFeature(editingFeature, 'title', e.target.value)}
            />
            <Input
              placeholder="Description"
              value={features[editingFeature].description}
              onChange={(e) => updateFeature(editingFeature, 'description', e.target.value)}
            />
            <Select
              value={features[editingFeature].transition}
              onValueChange={(value) => updateFeature(editingFeature, 'transition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hold Time (seconds)</label>
              <Input
                type="number"
                value={features[editingFeature].holdTime}
                onChange={(e) => updateFeature(editingFeature, 'holdTime', parseFloat(e.target.value))}
                min="1"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plane Position X</label>
              <Slider
                min={-10}
                max={10}
                step={0.1}
                value={[features[editingFeature].planePosition[0]]}
                onValueChange={(value) => {
                  const newPosition = [...features[editingFeature].planePosition];
                  newPosition[0] = value[0];
                  updateFeature(editingFeature, 'planePosition', newPosition);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plane Position Y</label>
              <Slider
                min={-10}
                max={10}
                step={0.1}
                value={[features[editingFeature].planePosition[1]]}
                onValueChange={(value) => {
                  const newPosition = [...features[editingFeature].planePosition];
                  newPosition[1] = value[0];
                  updateFeature(editingFeature, 'planePosition', newPosition);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Position X</label>
              <Slider
                min={-10}
                max={10}
                step={0.1}
                value={[features[editingFeature].textPosition[0]]}
                onValueChange={(value) => {
                  const newPosition = [...features[editingFeature].textPosition];
                  newPosition[0] = value[0];
                  updateFeature(editingFeature, 'textPosition', newPosition);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Position Y</label>
              <Slider
                min={-10}
                max={10}
                step={0.1}
                value={[features[editingFeature].textPosition[1]]}
                onValueChange={(value) => {
                  const newPosition = [...features[editingFeature].textPosition];
                  newPosition[1] = value[0];
                  updateFeature(editingFeature, 'textPosition', newPosition);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}