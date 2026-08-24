"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { GraduationCap, User, X } from "lucide-react";
import { hasCompletedDiagnostic } from "@/lib/profileStorage";

type RoleSelectionModalProps = {
  open: boolean;
  onClose: () => void;
};

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants: Variants = {
  hidden: { scale: 0.85, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    scale: 0.92,
    opacity: 0,
    y: 12,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: spring,
  },
};

const roles = [
  {
    id: "student",
    title: "Я ученик",
    description: "Сканируйте задачи и закрывайте пробелы",
    href: "/dashboard",
    icon: User,
  },
  {
    id: "teacher",
    title: "Я учитель",
    description: "Кабинет педагога и аналитика класса",
    href: "/teacher",
    icon: GraduationCap,
  },
] as const;

export default function RoleSelectionModal({
  open,
  onClose,
}: RoleSelectionModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const handleSelect = (roleId: string, href: string) => {
    onClose();
    if (roleId === "student" && !hasCompletedDiagnostic()) {
      router.push("/diagnostic");
      return;
    }
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.button
            type="button"
            aria-label="Закрыть"
            variants={backdropVariants}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-2xl cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
            variants={panelVariants}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-white border border-black/5 shadow-2xl shadow-black/10 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <div>
                <motion.h2
                  id="role-modal-title"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-slate-950"
                >
                  Выберите, кто вы
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.05 }}
                  className="mt-1.5 text-sm text-slate-500"
                >
                  Выберите роль для входа в систему
                </motion.p>
              </div>

              <motion.button
                type="button"
                aria-label="Закрыть окно"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
                className="shrink-0 rounded-full border border-black/5 bg-white p-2 text-slate-400 hover:text-slate-950 hover:border-black/15 shadow-sm cursor-pointer"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </motion.button>
            </div>

            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-3 p-6 sm:p-8 sm:pt-6"
            >
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <motion.button
                    key={role.id}
                    type="button"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                      borderColor: "rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={spring}
                    onClick={() => handleSelect(role.id, role.href)}
                    className="group relative flex w-full items-center gap-4 rounded-2xl border border-black/5 bg-white px-5 py-4 text-left shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <motion.span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-black/10"
                      whileHover={{ rotate: [-3, 3], scale: 1.05 }}
                      transition={{
                        rotate: {
                          duration: 0.55,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                        scale: spring,
                      }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </motion.span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold tracking-tight text-slate-950">
                        {role.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500">
                        {role.description}
                      </span>
                    </span>

                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow:
                          "0 0 0 1px rgba(0,0,0,0.06), 0 18px 40px -24px rgba(0,0,0,0.35)",
                      }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
