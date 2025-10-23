import { Variants } from 'framer-motion'

// Global animation variants for consistent motion design
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180, scale: 0.8 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
}

export const flipIn: Variants = {
  hidden: { opacity: 0, rotateY: 90, scale: 0.8 },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

// Staggered animations for lists and grids
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

// Page transition variants
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.45, 0, 0.55, 1] }
  }
}

// Cart drawer animation
export const cartDrawer: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}

// Modal animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}

// Button hover effects
export const buttonHover = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" }
  }
}

// Product card animations
export const productCard: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
}

// Navigation menu animations
export const menuContainer: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}

export const menuItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
}

// Loading skeleton animation
export const skeleton: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
}

// Progress bar animation
export const progressBar: Variants = {
  hidden: { width: "0%" },
  visible: ({ progress = 100 }) => ({
    width: `${progress}%`,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3
    }
  })
}

// Text reveal animation
export const textReveal: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05
    }
  }
}

export const textChar: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

// Parallax scroll animation
export const parallax = {
  initial: { y: 0 },
  animate: { y: [-50, 50] },
  transition: {
    duration: 20,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "linear"
  }
}

// Magnetic cursor effect
export const magnetic = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 }
}

// Particle explosion effect
export const particle: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: ({ index, total }) => ({
    opacity: [0, 1, 0],
    scale: [0, 1, 0.5],
    x: Math.cos((index / total) * Math.PI * 2) * 100,
    y: Math.sin((index / total) * Math.PI * 2) * 100,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: index * 0.02
    }
  })
}

// Form validation animations
export const shakeAnimation = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  success: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.3, ease: "easeInOut" }
  }
}

// Tab content animations
export const tabContent: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}

// Search input animations
export const searchInput: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: "100%",
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}

// Notification animations
export const notification: Variants = {
  hidden: { opacity: 0, y: -100, scale: 0.3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    y: -100,
    scale: 0.3,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}

// Tooltip animations
export const tooltip: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: [0.45, 0, 0.55, 1] }
  }
}

// Accordion animations
export const accordionContent: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] }
  }
}