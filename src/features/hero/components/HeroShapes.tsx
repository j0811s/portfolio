'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '@/src/features/hero/styles/Hero.module.css';

const SWAP_INTERVAL = 6000;
const SLOT_KEYS = ['slot-0', 'slot-1', 'slot-2', 'slot-3'] as const;

const SHAPES = [
  {
    wrapper: styles.shapeWrapper1,
    shadow: styles.shadowLg,
    depth: 0.04,
    floatY: [-18, 0, -18] as number[],
    floatDuration: 7,
    floatDelay: 0,
    entryDelay: 0,
  },
  {
    wrapper: styles.shapeWrapper2,
    shadow: styles.shadowLg,
    depth: 0.025,
    floatY: [-14, 4, -14] as number[],
    floatDuration: 9,
    floatDelay: 1.5,
    entryDelay: 0.15,
  },
  {
    wrapper: styles.shapeWrapper3,
    shadow: styles.shadowSm,
    depth: 0.035,
    floatY: [-10, 6, -10] as number[],
    floatDuration: 6,
    floatDelay: 0.8,
    entryDelay: 0.3,
  },
  {
    wrapper: styles.shapeWrapper4,
    shadow: styles.shadowSm,
    depth: 0.02,
    floatY: [-8, 4, -8] as number[],
    floatDuration: 5,
    floatDelay: 2.2,
    entryDelay: 0.45,
  },
] as const;

type SpringValue = ReturnType<typeof useSpring>;

type ShapeProps = {
  skill: SkillInfo[number];
  index: number;
  delay: number;
  springX: SpringValue;
  springY: SpringValue;
};

function HeroShape({ skill, index, delay, springX, springY }: ShapeProps) {
  const shouldReduceMotion = useReducedMotion();
  const { wrapper, shadow, depth, floatY, floatDuration, floatDelay, entryDelay } = SHAPES[index];
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  const activeDelay = isFirstMount.current ? entryDelay : delay;

  const x = useTransform(springX, (v) => v * depth);
  const y = useTransform(springY, (v) => v * depth);

  return (
    <motion.div
      className={wrapper}
      style={{ x: shouldReduceMotion ? undefined : x, y: shouldReduceMotion ? undefined : y }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={skill.name}
          className={`${styles.shapeInner} ${shadow}`}
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={
            shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, y: floatY }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0, transition: { duration: 0.15, delay: activeDelay } }
              : { scale: 0, opacity: 0, transition: { duration: 0.2, delay: activeDelay } }
          }
          transition={{
            scale: { type: 'spring', stiffness: 260, damping: 20, delay: activeDelay },
            opacity: { duration: 0.4, delay: activeDelay },
            y: {
              duration: floatDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: floatDelay,
            },
          }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
        >
          <Image
            className={styles.shapeIcon}
            src={skill.logo.url}
            alt=""
            width={skill.logo.width}
            height={skill.logo.height}
          />
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

interface Props {
  skills: SkillInfo;
}

export default function HeroShapes({ skills }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const [swap, setSwap] = useState(() => ({
    displayed: skills.slice(0, 4) as SkillInfo,
    delays: [0, 0, 0, 0],
  }));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (skills.length <= 4) return;
    const id = setInterval(() => {
      setSwap((prev) => {
        const prevNames = new Set(prev.displayed.map((s) => s.name));
        const pool = skills.filter((s) => !prevNames.has(s.name));
        const source = pool.length >= 4 ? pool : skills;
        return {
          displayed: source.toSorted(() => Math.random() - 0.5).slice(0, 4) as SkillInfo,
          delays: [0, 1, 2, 3].toSorted(() => Math.random() - 0.5).map((rank) => rank * 0.25),
        };
      });
    }, SWAP_INTERVAL);
    return () => clearInterval(id);
  }, [skills]);

  return (
    <>
      {swap.displayed.map((skill, i) => (
        <HeroShape
          key={SLOT_KEYS[i]}
          skill={skill}
          index={i}
          delay={swap.delays[i]}
          springX={springX}
          springY={springY}
        />
      ))}
    </>
  );
}
