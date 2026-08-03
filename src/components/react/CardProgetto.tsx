import { motion, useReducedMotion } from 'motion/react';

const ETICHETTA_NATURA: Record<string, string> = {
  cliente: '',
  iniziativa: 'Progetto su iniziativa',
  interno: 'Lavoro interno · riservato',
};

/**
 * Scheda progetto.
 *
 * La versione precedente era un rettangolo scuro pieno con dentro
 * un'immagine, tutto su un piano solo, e con un'inclinazione 3D al passaggio
 * del mouse che su un fondo crema sembrava un adesivo storto.
 *
 * Adesso il fondo scuro non c'è più: c'è l'immagine, grande, e il testo sotto
 * sul crema della pagina. Al passaggio del mouse l'immagine si allarga dentro
 * il proprio ritaglio e una velatura scura scopre il riassunto — che a riposo
 * resta fuori, così la griglia mostra i titoli e non tre paragrafi.
 *
 * Il movimento è tutto su `transform` e `opacity`: nessuna proprietà che
 * costringa il browser a rifare il layout mentre il mouse si sposta.
 */
interface Props {
  href: string;
  titolo: string;
  riassunto: string;
  tipo: 'sito' | 'tool';
  anno: number;
  immagine?: string;
  natura?: 'cliente' | 'iniziativa' | 'interno';
  /** La prima scheda è quella che Google misura per l'LCP: va caricata subito. */
  prioritaria?: boolean;
  /** Le schede larghe aprono la griglia e le tolgono l'aria da catalogo. */
  larga?: boolean;
}

export default function CardProgetto({
  href,
  titolo,
  riassunto,
  tipo,
  anno,
  immagine,
  natura = 'cliente',
  prioritaria = false,
  larga = false,
}: Props) {
  const etichetta = ETICHETTA_NATURA[natura];
  const ridotto = useReducedMotion();

  return (
    <motion.a
      href={href}
      className="scheda group"
      data-larga={larga || undefined}
      initial="riposo"
      whileHover={ridotto ? undefined : 'sopra'}
      whileFocus={ridotto ? undefined : 'sopra'}
      animate="riposo"
    >
      <div className="scheda-vetro">
        {immagine ? (
          <motion.img
            src={immagine}
            alt={`Anteprima del progetto ${titolo}`}
            loading={prioritaria ? 'eager' : 'lazy'}
            fetchPriority={prioritaria ? 'high' : 'auto'}
            decoding={prioritaria ? 'sync' : 'async'}
            className="scheda-img"
            variants={{ riposo: { scale: 1 }, sopra: { scale: 1.055 } }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <div className="scheda-vuota">
            <span>Anteprima da inserire</span>
          </div>
        )}

        {/* La velatura resta trasparente finché il mouse non arriva, quindi a
            riposo l'immagine si vede per intera. */}
        <motion.div
          className="scheda-velo"
          variants={{ riposo: { opacity: 0 }, sopra: { opacity: 1 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.p
            className="scheda-riassunto"
            variants={{ riposo: { y: 14, opacity: 0 }, sopra: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          >
            {riassunto}
          </motion.p>
          <motion.span
            className="scheda-vai"
            variants={{ riposo: { y: 14, opacity: 0 }, sopra: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          >
            Apri il progetto →
          </motion.span>
        </motion.div>
      </div>

      <div className="scheda-piede">
        <h3 className="scheda-titolo">{titolo}</h3>
        <span className="scheda-meta">
          {tipo === 'sito' ? 'Sito' : 'Strumento'} · {anno}
          {etichetta && <> · {etichetta}</>}
        </span>
      </div>
    </motion.a>
  );
}
