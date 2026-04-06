"use client";

import { useState, useEffect } from "react";

interface NeumorphicWatchProps {
  className?: string;
}

export default function NeumorphicWatch({ className = "" }: NeumorphicWatchProps) {
  const [time, setTime] = useState<string>("");
  const [showColon, setShowColon] = useState<boolean>(true);

  useEffect(() => {
    // Initialize time immediately
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();

    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);

    // Blinking colon effect (every 500ms)
    const colonInterval = setInterval(() => {
      setShowColon((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(colonInterval);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Watch Container */}
      <div className="relative w-[340px] h-[340px] animate-breathe">
        {/* Outer Circle - Neumorphic Effect */}
        <div
          className="absolute inset-0 rounded-full bg-[#f3f3f3]"
          style={{
            boxShadow: `
              20px 20px 60px #d1d1d1,
              -20px -20px 60px #ffffff,
              inset 8px 8px 16px #d1d1d1,
              inset -8px -8px 16px #ffffff
            `,
          }}
        >
          {/* Inner Ring (Bezel) */}
          <div
            className="absolute inset-4 rounded-full bg-[#f3f3f3]"
            style={{
              boxShadow: `
                inset 6px 6px 12px #d1d1d1,
                inset -6px -6px 12px #ffffff
              `,
            }}
          >
            {/* Watch Face */}
            <div
              className="absolute inset-3 rounded-full bg-linear-to-br from-[#fafafa] to-[#f0f0f0] flex items-center justify-center shadow-neumorphic-face"
            >
              {/* Glass Highlight Overlay */}
              <div className="absolute inset-0 rounded-full glass-highlight" />

              {/* Clock Display */}
              <div className="relative z-10 flex items-center justify-center">
                <time className="font-mono text-4xl font-light text-neutral-700 tracking-wider select-none">
                  {time.split("").map((char, index) => {
                    // Apply blinking effect to colons
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
              </div>

              {/* Hour Markers (Optional - 12 dots) */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-neutral-400/40"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Crown (Side Button) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 rounded-r-lg bg-[#f3f3f3]"
          style={{
            boxShadow: `
              4px 4px 8px #d1d1d1,
              -2px -2px 6px #ffffff,
              inset 2px 2px 4px #d1d1d1
            `,
          }}
        />
      </div>
    </div>
  );
}
