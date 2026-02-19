"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const apartments = [
  { id: 1, type: "Studio", price: "$180K", rooms: 1, area: "650 sq ft", color: "#ff6b6b", features: ["Modern Kitchen", "Balcony", "Gym Access"] },
  { id: 2, type: "2 BHK", price: "$280K", rooms: 2, area: "1200 sq ft", color: "#4ecdc4", features: ["Master Bedroom", "2 Bathrooms", "Parking"] },
  { id: 3, type: "3 BHK", price: "$420K", rooms: 3, area: "1800 sq ft", color: "#45b7d1", features: ["Spacious Living", "Study Room", "Premium Fixtures"] },
  { id: 4, type: "4 BHK Duplex", price: "$650K", rooms: 4, area: "2800 sq ft", color: "#f7b731", features: ["Duplex Design", "Terrace Garden", "Home Theater"] },
];

function Building({ color, scale = 1 }: { color: string; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={ref} scale={scale}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 1, 1.5]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.2, 1.3]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[-0.7 + (i % 3) * 0.6, 0.3 + Math.floor(i / 3) * 0.5, 0.76]} castShadow>
            <boxGeometry args={[0.25, 0.35, 0.02]} />
            <meshStandardMaterial color="#1a1a2e" emissive="#ffd700" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Scene({ selectedApt, scrollProgress }: { selectedApt: number; scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
      groupRef.current.position.y = Math.sin(scrollProgress * Math.PI) * 2;
      groupRef.current.scale.setScalar(1 + scrollProgress * 0.5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} intensity={1.5} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4ecdc4" />
      <group ref={groupRef}>
        <Building color={apartments[selectedApt].color} scale={1 + selectedApt * 0.2} />
      </group>
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2.5} />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

export default function ApartmentsPage() {
  const [selected, setSelected] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".hero-title", { y: -100, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".hero-subtitle", { y: 50, opacity: 0, duration: 1, delay: 0.3 });

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    ScrollTrigger.create({
      trigger: ".apartments-grid",
      start: "top 80%",
      onEnter: () => {
        gsap.from(".apt-card", {
          y: 100,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".features-section",
      start: "top 70%",
      onEnter: () => {
        gsap.from(".feature-item", {
          scale: 0,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      },
    });
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
      <section className="relative h-screen">
        <div ref={canvasRef} className="fixed inset-0 z-0">
          <Canvas camera={{ position: [6, 4, 6], fov: 50 }}>
            <Suspense fallback={null}>
              <Scene selectedApt={selected} scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 p-8">
          <h1 className="hero-title text-7xl font-bold text-white drop-shadow-2xl">
            Premium Living Spaces
          </h1>
          <p className="hero-subtitle text-2xl text-purple-200">Experience Luxury Redefined</p>
        </div>
      </section>

      <section className="apartments-grid relative z-20 bg-gradient-to-b from-transparent to-slate-950 px-8 py-20">
        <h2 className="mb-16 text-center text-5xl font-bold text-white">Choose Your Dream Home</h2>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {apartments.map((apt, idx) => (
            <div
              key={apt.id}
              className={`apt-card group cursor-pointer rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/50 ${
                selected === idx ? "ring-4 ring-purple-400 scale-105" : ""
              }`}
              onClick={() => {
                setSelected(idx);
                gsap.to(window, { scrollTop: 0, duration: 1, ease: "power2.inOut" });
              }}
            >
              <div className="mb-4 h-3 w-3 rounded-full" style={{ backgroundColor: apt.color }} />
              <h3 className="mb-2 text-3xl font-bold text-white">{apt.type}</h3>
              <p className="mb-4 text-4xl font-bold" style={{ color: apt.color }}>{apt.price}</p>
              <p className="mb-6 text-gray-300">{apt.area}</p>
              <div className="space-y-2">
                {apt.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section relative px-8 py-20">
        <h2 className="mb-16 text-center text-5xl font-bold text-white">World-Class Amenities</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {["Swimming Pool", "Fitness Center", "24/7 Security", "Smart Home", "Clubhouse", "Kids Play Area", "Landscaped Gardens", "Power Backup"].map((feature, i) => (
            <div key={i} className="feature-item rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 text-center backdrop-blur-sm">
              <div className="mb-3 text-4xl">✨</div>
              <p className="font-semibold text-white">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-8 py-20 text-center">
        <h2 className="mb-8 text-5xl font-bold text-white">Ready to Move In?</h2>
        <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-4 text-xl font-bold text-white transition-transform hover:scale-110">
          Schedule a Visit
        </button>
      </section>
    </div>
  );
}
