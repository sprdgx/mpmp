'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Laptop, Smartphone, Globe } from 'lucide-react';
import Hero from '@/components/images/hero.png';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header Section */}
      <header className="container mx-auto py-8">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800">
              VISI
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-x-4"
          >
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Services</Button>
            <Button variant="ghost">Contact</Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="py-20 flex flex-col md:flex-row items-center justify-between">
          {/* Image on the Left */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={Hero} // Replace with the path to your image
              alt="3D Workspace"
              width={600}
              height={400}
              className="object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Text and Button on the Right */}
          <motion.div
            className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bring Your Videography Vision to Life
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              With our 3D workspace, easily plan your shoots with AI-assisted
              guidance, lighting, and camera setups.
            </p>
            <Button size="lg">Get Started</Button>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Services</h2>
          <Tabs defaultValue="web" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="web">3D Planning</TabsTrigger>
              <TabsTrigger value="mobile">AI Assistance</TabsTrigger>
              <TabsTrigger value="cloud">Cloud Collaboration</TabsTrigger>
            </TabsList>
            <TabsContent value="web">
              <Card>
                <CardHeader>
                  <CardTitle>3D Planning</CardTitle>
                  <CardDescription>
                    Plan every aspect of your shoot in a realistic 3D
                    environment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Laptop className="h-32 w-32 text-primary" />
                  </div>
                  <p className="mt-4 text-center">
                    Control lighting, camera angles, and scene setups with
                    precision.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="mobile">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistance</CardTitle>
                  <CardDescription>
                    Receive AI-driven advice and task management for your
                    shoots.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Smartphone className="h-32 w-32 text-primary" />
                  </div>
                  <p className="mt-4 text-center">
                    Get real-time suggestions for your videography projects.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="cloud">
              <Card>
                <CardHeader>
                  <CardTitle>Cloud Collaboration</CardTitle>
                  <CardDescription>
                    Collaborate with your team in real-time on cloud-based
                    platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Globe className="h-32 w-32 text-primary" />
                  </div>
                  <p className="mt-4 text-center">
                    Seamlessly share and edit project files with your crew.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button>Learn More</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Work Section */}
        <section className="py-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-0">
                    <Image
                      src={`https://source.unsplash.com/random/800x600?tech,${i}`}
                      alt={`Project ${i}`}
                      width={800}
                      height={600}
                      className="w-full h-48 object-cover"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle>Project {i}</CardTitle>
                    <CardDescription>
                      A brief description of the project and its impact.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline">View Case Study</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Innovative Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
