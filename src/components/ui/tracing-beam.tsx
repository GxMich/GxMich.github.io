"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useVelocity,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  // L'originale misura l'altezza una volta sola al montaggio. Su una pagina
  // lunga, con font e immagini che arrivano dopo, la linea resta della
  // lunghezza sbagliata per sempre: qui la rimisuro a ogni cambio.
  useEffect(() => {
    const nodo = contentRef.current;
    if (!nodo) return;
    const misura = () => setSvgHeight(nodo.offsetHeight);
    misura();
    const osservatore = new ResizeObserver(misura);
    osservatore.observe(nodo);
    return () => osservatore.disconnect();
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    },
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    },
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto h-full w-full max-w-4xl", className)}
    >
      {/* L'originale sporge fuori dal contenitore (-left-20). Qui la linea sta
          sul bordo sinistro del contenuto e su mobile sparisce del tutto: a
          390px non c'è margine dove farla vivere senza coprire il testo. */}
      <div className="absolute top-3 left-0 hidden md:block">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? "none"
                : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-[#33333B]"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "#FAFAFA" : "#0A0A0C",
              borderColor: "#FAFAFA",
            }}
            className="h-2 w-2 rounded-full border border-[#FAFAFA] bg-[#0A0A0C]"
            style={{ boxShadow: "0 0 12px rgba(255,255,255,0.55)" }}
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight} // Set the SVG height
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#FAFAFA"
            strokeOpacity="0.12"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              {/* Il gradiente originale era ciano/indaco/viola: qui è la
                  stessa rampa, ma di sola luce bianca. */}
              <stop stopColor="#FAFAFA" stopOpacity="0"></stop>
              <stop stopColor="#FAFAFA"></stop>
              <stop offset="0.325" stopColor="#FAFAFA" stopOpacity="0.7"></stop>
              <stop offset="1" stopColor="#FAFAFA" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
