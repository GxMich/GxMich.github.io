import React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

const STAGGER = 0.035;

/**
 * Titolo che ruota lettera per lettera al passaggio del mouse: la riga sopra
 * esce verso l'alto mentre una copia identica entra dal basso.
 *
 * Il componente arriva da 21st.dev ed è tenuto com'è, salvo due cose.
 *
 * La direttiva "use client" non c'è: è di Next, e qui non significa niente —
 * l'idratazione la decide Astro con `client:visible` dove il componente viene
 * usato.
 *
 * La copia di sotto è nascosta ai lettori di schermo. Senza, ogni titolo del
 * sito verrebbe letto due volte di fila, lettera per lettera, perché ognuna
 * sta in uno span suo.
 */
export default function TextRoll({
  children,
  className,
  center = false,
}: {
  children: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn('relative block overflow-hidden', className)}
      style={{ lineHeight: 0.85 }}
    >
      {/* riga che sale */}
      <div>
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{ initial: { y: 0 }, hovered: { y: '-100%' } }}
              transition={{ ease: 'easeInOut', delay }}
              className="inline-block"
              key={i}
            >
              {/* lo spazio unificatore tiene aperte le parole: uno spazio
                  normale dentro un inline-block viene collassato via */}
              {l === ' ' ? ' ' : l}
            </motion.span>
          );
        })}
      </div>

      {/* riga che entra dal basso */}
      <div className="absolute inset-0" aria-hidden="true">
        {children.split('').map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{ initial: { y: '100%' }, hovered: { y: 0 } }}
              transition={{ ease: 'easeInOut', delay }}
              className="inline-block"
              key={i}
            >
              {l === ' ' ? ' ' : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
}
