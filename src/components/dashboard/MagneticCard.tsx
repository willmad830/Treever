"use client";

import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  type MotionStyle,
} from "framer-motion";
import {
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";

type MagneticCardProps = {
  children: ReactNode;
  className?: string;
  tiltMax?: number;
  shiftMax?: number;
  depth?: number;
};

const springCfg = { stiffness: 180, damping: 22, mass: 0.4 };

export function MagneticCard({
  children,
  className = "",
  tiltMax = 7,
  shiftMax = 10,
  depth = 1,
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const rotateX = useTransform(sy, [-1, 1], [tiltMax, -tiltMax]);
  const rotateY = useTransform(sx, [-1, 1], [-tiltMax, tiltMax]);
  const x = useTransform(sx, [-1, 1], [-shiftMax * depth, shiftMax * depth]);
  const y = useTransform(sy, [-1, 1], [-shiftMax * depth, shiftMax * depth]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px * 2 - 1);
    my.set(py * 2 - 1);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const style: MotionStyle = {
    rotateX,
    rotateY,
    x,
    y,
    transformPerspective: 900,
    transformStyle: "preserve-3d",
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={style}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
