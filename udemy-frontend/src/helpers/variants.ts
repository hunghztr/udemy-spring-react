import type { Variants } from "framer-motion";
// auth
export const authVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

export const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.8, 0.25, 1], // ✅ thay "easeOut"
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// variant step
export const stepVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1], // ✅ material / easeOut chuẩn
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  }),
};
