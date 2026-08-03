import { getImage } from 'astro:assets';

/**
 * I componenti React ricevono l'immagine come URL, non come oggetto Astro,
 * quindi non passano dal tag <Image>. Qui la faccio comunque ottimizzare da
 * Astro — WebP e larghezza giusta — e restituisco solo l'indirizzo finale.
 */
const sorgenti = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/progetti/**/*.{jpeg,jpg,png,webp,avif,svg}',
  { eager: true }
);

/**
 * Gli SVG non passano dall'ottimizzatore. Convertirli in WebP li
 * trasformerebbe in pixel, cioè butterebbe via l'unica cosa per cui li ho
 * scelti: restano nitidi a qualsiasi ingrandimento e pesano un decimo. Qui
 * l'indirizzo si usa così com'è.
 */
const eSvg = (p?: string) => !!p && p.toLowerCase().endsWith('.svg');

export function originale(percorso?: string): ImageMetadata | undefined {
  if (!percorso) return undefined;
  return sorgenti[`/src/assets/progetti/${percorso}`]?.default;
}

export async function urlWebp(percorso?: string, larghezza = 900) {
  const img = originale(percorso);
  if (!img) return undefined;
  if (eSvg(percorso)) return img.src;
  const ottimizzata = await getImage({ src: img, format: 'webp', width: larghezza });
  return ottimizzata.src;
}

/**
 * Come `urlWebp`, ma restituisce anche le due dimensioni finali.
 *
 * Servono negli `<img>` scritti a mano: senza width e height il browser non
 * sa quanto spazio riservare, disegna la pagina con l'immagine alta zero e la
 * fa sobbalzare quando arriva. Su una scheda progetto con quattro schermate
 * in fila il salto è di parecchie centinaia di pixel, e lo paghi due volte —
 * chi legge perde il segno, e Google lo misura come instabilità del layout.
 *
 * L'altezza la calcolo dal rapporto dell'originale invece di chiederla
 * all'immagine ottimizzata: il rapporto non cambia con il ridimensionamento,
 * e così la funzione resta sincrona su quel pezzo.
 */
export async function immagineWebp(percorso?: string, larghezza = 900) {
  const img = originale(percorso);
  if (!img) return undefined;

  if (eSvg(percorso)) {
    // Il rapporto lo legge comunque da viewBox, quindi lo spazio in pagina
    // resta riservato come per le altre immagini.
    return {
      src: img.src,
      width: img.width || larghezza,
      height: img.height || Math.round(larghezza * 0.5),
    };
  }

  // Ingrandire un originale piccolo lo sgranerebbe: in quel caso resta com'è.
  const finale = Math.min(larghezza, img.width);
  const ottimizzata = await getImage({ src: img, format: 'webp', width: finale });

  return {
    src: ottimizzata.src,
    width: finale,
    height: Math.round((img.height * finale) / img.width),
  };
}
