import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const Section = ({ children, className, id }) => {
  const { ref, controls, animationVariants } = useScrollAnimation();

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariants}
      className={cn('py-16 md:py-24', className)}
    >
      {children}
    </motion.section>
  );
};

export default Section;