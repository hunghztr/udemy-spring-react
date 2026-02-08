"use client";

import { motion } from "framer-motion";

const MotionPath = motion.path;

export default function AnimatedWaves() {
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 220,
        zIndex: 1,
      }}
    >
      {/* Wave 1 – đậm nhất */}
      <MotionPath
        fill="rgba(255,255,255,0.9)"
        d="M0,120 C240,180 480,60 720,90 960,120 1200,180 1440,140 L1440,220 L0,220 Z"
        animate={{
          d: [
            "M0,120 C240,180 480,60 720,90 960,120 1200,180 1440,140 L1440,220 L0,220 Z",
            "M0,100 C240,140 480,100 720,120 960,140 1200,100 1440,120 L1440,220 L0,220 Z",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Wave 2 – nhạt hơn */}
      <MotionPath
        fill="rgba(255,255,255,0.6)"
        d="M0,140 C320,200 640,100 960,140 1120,160 1280,180 1440,160 L1440,220 L0,220 Z"
        animate={{
          d: [
            "M0,140 C320,200 640,100 960,140 1120,160 1280,180 1440,160 L1440,220 L0,220 Z",
            "M0,160 C320,120 640,180 960,120 1120,100 1280,140 1440,130 L1440,220 L0,220 Z",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Wave 3 – xa nhất */}
      <MotionPath
        fill="rgba(255,255,255,0.35)"
        d="M0,160 C360,220 720,140 1080,170 1200,180 1320,190 1440,180 L1440,220 L0,220 Z"
        animate={{
          d: [
            "M0,160 C360,220 720,140 1080,170 1200,180 1320,190 1440,180 L1440,220 L0,220 Z",
            "M0,180 C360,140 720,200 1080,150 1200,130 1320,160 1440,170 L1440,220 L0,220 Z",
          ],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}
