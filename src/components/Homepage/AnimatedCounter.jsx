import React, { useEffect } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ to }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, count, to]);

  return <span ref={ref}>{rounded}</span>;
};

export default AnimatedCounter;