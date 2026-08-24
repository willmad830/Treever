"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";
import RoleSelectionModal from "@/components/RoleSelectionModal";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const titleLine1 = ["Учись", "без", "пробелов"];
  const titleLine2 = ["в", "знаниях."];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springTreeX = useSpring(mouseX, { stiffness: 45, damping: 20, mass: 0.1 });
  const springTreeY = useSpring(mouseY, { stiffness: 45, damping: 20, mass: 0.1 });

  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  const springTextX = useSpring(textX, { stiffness: 60, damping: 25, mass: 0.1 });
  const springTextY = useSpring(textY, { stiffness: 60, damping: 25, mass: 0.1 });

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normalizedY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    mouseX.set(normalizedX * -16);
    mouseY.set(normalizedY * -10);

    textX.set(normalizedX * 8);
    textY.set(normalizedY * 6);
  };

  const handleSectionMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    textX.set(0);
    textY.set(0);
  };

  const titleContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 45,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="relative bg-white text-slate-950 min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      <ViewportFittedTreeBackground springX={springTreeX} springY={springTreeY} />

      <motion.div
        style={{ x: springTextX, y: springTextY }}
        className="relative z-10 max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8"
        >
          <span className="text-sm sm:text-base font-semibold tracking-[0.18em] uppercase bg-gradient-to-r from-slate-950 via-slate-600 to-slate-400 bg-clip-text text-transparent">
            Treever
          </span>
        </motion.div>

        <motion.h1
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-bold tracking-tight text-slate-950 leading-[1.08] max-w-4xl lg:max-w-5xl flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-5">
            {titleLine1.map((word, index) => (
              <span key={`l1-${index}`} className="inline-block overflow-hidden py-1">
                <motion.span
                  variants={wordVariants}
                  className="inline-block will-change-transform"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-5">
            {titleLine2.map((word, index) => (
              <span key={`l2-${index}`} className="inline-block overflow-hidden py-1">
                <motion.span
                  variants={wordVariants}
                  className="inline-block will-change-transform"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </div>
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-9 text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl sm:max-w-3xl font-normal leading-relaxed text-balance"
        >
          Поиск фундаментальной причины ошибки за{" "}
          <InteractiveKeyword text="30 секунд" />. AI разворачивает цепочку темы назад{" "}
          <InteractiveKeyword text="до 5 класса" />.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.65 }}
          className="mt-10 sm:mt-12"
        >
          <motion.div
            animate={{ y: [-2, 2] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <MagneticButton onClick={() => setRoleModalOpen(true)} />
          </motion.div>
        </motion.div>
      </motion.div>

      <RoleSelectionModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </section>
  );
}

function InteractiveKeyword({ text }: { text: string }) {
  return (
    <motion.span
      whileHover={{ y: -1.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block font-medium text-slate-900 border-b border-slate-300/90 hover:border-slate-950 transition-colors duration-200 cursor-default px-0.5"
    >
      {text}
    </motion.span>
  );
}

function ViewportFittedTreeBackground({
  springX,
  springY,
}: {
  springX: any;
  springY: any;
}) {
  const treeBranches = [
    { d: "M 480 660 C 450 680, 410 695, 370 700", width: 4.0, delay: 0.1 },
    { d: "M 520 660 C 550 680, 590 695, 630 700", width: 4.0, delay: 0.1 },

    { d: "M 490 500 C 450 440, 360 400, 270 340", width: 7.5, delay: 0.3 },
    { d: "M 360 400 C 280 430, 200 440, 120 420", width: 4.5, delay: 0.55 },
    { d: "M 200 440 C 180 380, 160 330, 140 280", width: 3.2, delay: 0.7 },
    { d: "M 270 340 C 220 270, 170 190, 130 110", width: 5.0, delay: 0.5 },
    { d: "M 270 340 C 270 240, 250 170, 230 90", width: 4.0, delay: 0.55 },
    { d: "M 250 170 C 300 150, 330 120, 350 80", width: 3.0, delay: 0.75 },

    { d: "M 510 500 C 550 440, 640 400, 730 340", width: 7.5, delay: 0.3 },
    { d: "M 640 400 C 720 430, 800 440, 880 420", width: 4.5, delay: 0.55 },
    { d: "M 800 440 C 820 380, 840 330, 860 280", width: 3.2, delay: 0.7 },
    { d: "M 730 340 C 740 295, 745 270, 750 250", width: 5.5, delay: 0.5 },
    { d: "M 730 340 C 780 270, 830 190, 870 110", width: 5.0, delay: 0.55 },
    { d: "M 750 250 C 730 175, 710 125, 680 80", width: 3.5, delay: 0.75 },
  ];

  const tipNodes = [
    { id: "tip-1", x: 120, y: 420, delay: 0.95 },
    { id: "tip-2", x: 140, y: 280, delay: 1.0 },
    { id: "tip-3", x: 130, y: 110, delay: 1.05, label: "8 класс" },
    { id: "tip-4", x: 230, y: 90, delay: 1.1 },
    { id: "tip-5", x: 350, y: 80, delay: 1.15, label: "7 класс" },
    { id: "tip-6", x: 680, y: 80, delay: 1.15, label: "7 класс" },
    { id: "tip-7", x: 870, y: 110, delay: 1.05, label: "8 класс" },
    { id: "tip-8", x: 860, y: 280, delay: 1.0 },
    { id: "tip-9", x: 880, y: 420, delay: 0.95 },
  ];

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="absolute inset-0 pointer-events-none flex items-end justify-center overflow-hidden opacity-[0.14] sm:opacity-[0.17] transition-opacity duration-700"
    >
      <svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMax meet"
        className="w-full h-full max-h-[85vh] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="fittedTreeRoseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FB7185" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.path
          d={`
            M 482 700 
            C 486 640, 489 570, 492 500 
            C 497 485, 503 485, 508 500 
            C 511 570, 514 640, 518 700 
            Z
          `}
          fill="#0F172A"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "50% 100%" }}
        />

        {treeBranches.map((b, idx) => (
          <motion.path
            key={`fit-branch-${idx}`}
            d={b.d}
            stroke="#0F172A"
            strokeWidth={b.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.0, delay: b.delay, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.3, delay: b.delay },
            }}
          />
        ))}

        {tipNodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <motion.circle
              r="5"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 14,
                delay: node.delay,
              }}
            />

            {node.label && (
              <motion.text
                x="0"
                y="17"
                textAnchor="middle"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.75, y: 17 }}
                transition={{ duration: 0.5, delay: node.delay + 0.2 }}
                className="text-[9px] font-mono fill-slate-700 font-semibold select-none"
              >
                {node.label}
              </motion.text>
            )}
          </g>
        ))}

        <g transform="translate(750, 250)">
          <motion.circle
            r="34"
            fill="url(#fittedTreeRoseGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.45],
              opacity: [0.8, 1],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1.0,
            }}
          />

          <motion.circle
            r="15"
            fill="none"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.4],
              opacity: [0.4, 0.95],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1.0,
            }}
          />

          <motion.circle
            r="6"
            fill="#E11D48"
            stroke="#FFFFFF"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 14,
              delay: 0.9,
            }}
          />

          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
          >
            <rect
              x="-60"
              y="11"
              width="120"
              height="20"
              rx="6"
              fill="#FFFFFF"
              stroke="#E11D48"
              strokeWidth="1.2"
              className="shadow-sm"
            />
            <text
              x="0"
              y="24.5"
              textAnchor="middle"
              className="text-[9.5px] font-mono fill-rose-600 font-bold select-none tracking-tight"
            >
              ● 5 класс: Пробел в ОДЗ
            </text>
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}

function MagneticButton({ onClick }: { onClick: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullFactor = 0.22;
    x.set((e.clientX - centerX) * pullFactor);
    y.set((e.clientY - centerY) * pullFactor);

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(-100);
    mouseY.set(-100);
  };

  const borderLight = useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.08) 40%, transparent 80%)`;
  const surfaceLight = useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 70%)`;

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      style={{ x: springX, y: springY }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden focus:outline-hidden cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 opacity-90 group-hover:opacity-100"
        style={{ background: borderLight }}
      />

      <div className="absolute inset-0 rounded-full border border-slate-800 pointer-events-none" />

      <div className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-slate-950 text-white font-medium text-base tracking-tight shadow-lg shadow-slate-950/10 transition-colors duration-200">
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: surfaceLight }}
        />

        <Camera className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
        <span className="text-sm sm:text-base font-semibold">Сфотографировать задачу</span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </motion.button>
  );
}
