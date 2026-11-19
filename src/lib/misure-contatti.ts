/**
 * Misura dei contatti: chi chiama, chi scrive, chi chiede l'analisi.
 *
 * Funziona solo se il visitatore ha detto sì alle misure: `gtag` esiste solo
 * dopo il consenso (Consenso.astro), quindi senza consenso queste funzioni
 * non fanno niente e non chiamano nessuno.
 *
 * Nomi degli eventi in GA4:
 *  - `contatto_telefono`  clic su un link tel:
 *  - `contatto_email`     clic su un link mailto:
 *  - `contatto_whatsapp`  solo per i moduli che aprono WhatsApp da script.
 *    I clic sui link wa.me li conta già GA4 da solo (misurazione avanzata,
 *    clic in uscita) e li trasforma nello stesso evento con una regola creata
 *    nella proprietà: mandarli anche da qui li conterebbe due volte.
 *
 * In GA4 `contatto_telefono` e `contatto_email` vanno segnati come eventi
 * chiave a mano, la prima volta che compaiono.
 */

type Parametri = Record<string, string>;

export function segnaContatto(evento: string, parametri: Parametri = {}) {
  const w = window as any;
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', evento, { pagina: location.pathname, ...parametri });
}

/**
 * Un solo ascoltatore sul documento, montato una volta per visita: con le
 * transizioni di pagina il documento resta lo stesso, quindi rimontarlo a
 * ogni pagina conterebbe ogni clic più volte.
 */
export function montaMisureContatti() {
  const w = window as any;
  if (w.__misureContatti) return;
  w.__misureContatti = true;

  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    const dove = link.closest('[data-barra-contatti]')
      ? 'barra'
      : link.closest('footer')
        ? 'piede'
        : link.closest('[data-menu]')
          ? 'menu'
          : 'pagina';

    if (href.startsWith('tel:')) segnaContatto('contatto_telefono', { posizione: dove });
    else if (href.startsWith('mailto:')) segnaContatto('contatto_email', { posizione: dove });
  });
}
