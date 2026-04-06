"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface HeroWatchAnimationProps {
  label: string;
}

// Premium watch component with rotating bezels and real-time clock

export default function HeroWatchAnimation({ label }: HeroWatchAnimationProps) {
  const watchRef = useRef<HTMLDivElement>(null);
  const outerBezelRef = useRef<HTMLDivElement>(null);
  const innerBezelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const [time, setTime] = useState<string>("");
  const [showColon, setShowColon] = useState<boolean>(true);

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    const colonInterval = setInterval(() => setShowColon((prev) => !prev), 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(colonInterval);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !watchRef.current) return;

    const ctx = gsap.context(() => {
      const watch = watchRef.current;
      const outerBezel = outerBezelRef.current;
      const innerBezel = innerBezelRef.current;

      // 1. Entrance animation
      const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      entranceTl.fromTo(
        watch,
        { scale: 0.8, opacity: 0, rotation: -4 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2 }
      );

      // 2. Continuous floating animation
      const floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });

      floatTl
        .to(watch, {
          y: -10,
          scale: 1.02,
          duration: 2.5,
        })
        .to(watch, {
          y: 10,
          scale: 1,
          duration: 2.5,
        });

      // 3. Outer bezel rotation (clockwise)
      gsap.to(outerBezel, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      // 4. Inner bezel rotation (counter-clockwise)
      gsap.to(innerBezel, {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: "none",
      });

      // 5. Scroll-based interaction
      gsap.to(watch, {
        y: "+=60",
        ease: "none",
        scrollTrigger: {
          trigger: watch,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={watchRef} className="relative shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[480px] xl:h-[480px]">
      {/* Outer glow — soft ambient light */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-neutral-300/40 via-transparent to-transparent blur-2xl sm:blur-3xl scale-125" />
      
      {/* Inner glow — focused highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/60 via-transparent to-transparent blur-xl sm:blur-2xl scale-110" />

      {/* Watch face — neumorphic design */}
      <div 
        className="relative w-full h-full rounded-full bg-[#ecf0f3] flex items-center justify-center"
        style={{
          boxShadow: `
            12px 12px 20px #d1d9e6,
            -12px -12px 20px #ffffff
          `,
        }}
      >
        {/* Outer bezel — dotted border rotating clockwise */}
        <div
          ref={outerBezelRef}
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px dotted rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
          }}
        >
          {/* Hour markers on outer bezel */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 !== 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const radius = 46;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={i}
                className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-neutral-400/60"
                style={{
                  left: `calc(50% + ${x}%)`,
                  top: `calc(50% + ${y}%)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        {/* Inner bezel — solid border rotating counter-clockwise */}
        <div
          ref={innerBezelRef}
          className="absolute inset-6 sm:inset-7 md:inset-8 rounded-full"
          style={{
            border: "1.5px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "50%",
            boxShadow: `
              inset 3px 3px 6px #d1d9e6,
              inset -3px -3px 6px #ffffff
            `,
          }}
        >
          {/* Minute markers on inner bezel */}
          {[...Array(60)].map((_, i) => {
            if (i % 15 !== 0) return null;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const radius = 42;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={i}
                className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-neutral-500/40"
                style={{
                  left: `calc(50% + ${x}%)`,
                  top: `calc(50% + ${y}%)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        {/* Watch face center */}
        <div
          className="absolute inset-10 sm:inset-11 md:inset-12 rounded-full bg-[#ecf0f3] flex items-center justify-center"
          style={{
            boxShadow: `
              inset 4px 4px 8px #d1d9e6,
              inset -4px -4px 8px #ffffff
            `,
          }}
        >
          {/* Glass highlight */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: `
                radial-gradient(
                  circle at 30% 30%,
                  rgba(255, 255, 255, 0.9) 0%,
                  rgba(255, 255, 255, 0.4) 30%,
                  transparent 60%
                )
              `,
            }}
          />

          {/* Clock display */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2">
            <time className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-neutral-700 tracking-wider select-none">
              {time.split("").map((char, index) => {
                if (char === ":") {
                  return (
                    <span
                      key={index}
                      className={`transition-opacity duration-100 ${
                        showColon ? "opacity-100" : "opacity-20"
                      }`}
                    >
                      {char}
                    </span>
                  );
                }
                return <span key={index}>{char}</span>;
              })}
            </time>
            
            {/* Label */}
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-500 tracking-widest uppercase font-medium text-center">
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom shadow — grounded depth */}
      <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 sm:h-6 md:h-8 bg-neutral-900/10 blur-xl sm:blur-2xl rounded-full" />
    </div>
  );
}
