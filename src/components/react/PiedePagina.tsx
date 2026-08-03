import { motion, useReducedMotion } from 'motion/react';
import { Mail, MessageCircle } from 'lucide-react';

/**
 * I loghi di GitHub e LinkedIn non arrivano da lucide: dalla versione 1 le
 * icone dei marchi sono state tolte dalla libreria per una questione di
 * licenze. Stanno qui, disegnate a mano, e servono solo a indicare il profilo
 * a cui portano.
 */
function IconaGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function IconaLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/**
 * Chiusura della pagina.
 *
 * Il componente che avevi passato importava `@/components/ui/modem-animated-footer`,
 * che nel pacchetto non c'era — quindi la parte animata è questa, scritta con
 * gli stessi ingredienti: griglia di collegamenti, icone da lucide, comparsa a
 * cascata quando il piede entra nello schermo.
 *
 * Due scelte diverse dal modello di partenza. Le icone social sono solo quelle
 * che esistono davvero: un'icona di Twitter che porta a un profilo vuoto fa
 * più danno che non averla. E il nome grande in fondo non è decorazione — è
 * l'ultima cosa che si legge prima di chiudere, e deve restare il nome giusto.
 */
interface Collegamento {
  href: string;
  label: string;
}

interface Props {
  nome: string;
  descrizione: string;
  email: string;
  whatsapp: string;
  navigazione: Collegamento[];
  profili: string[];
  anno: number;
}

function iconaPer(url: string) {
  if (url.includes('github')) return { Icona: IconaGitHub, nome: 'Il mio profilo GitHub' };
  if (url.includes('linkedin')) return { Icona: IconaLinkedIn, nome: 'Il mio profilo LinkedIn' };
  return { Icona: Mail, nome: 'Profilo' };
}

export default function PiedePagina({
  nome,
  descrizione,
  email,
  whatsapp,
  navigazione,
  profili,
  anno,
}: Props) {
  const ridotto = useReducedMotion();

  const entra = (ritardo: number) =>
    ridotto
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const, delay: ritardo },
        };

  return (
    <div className="piede-griglia">
      <motion.div className="piede-marchio" {...entra(0)}>
        <p className="piede-nome">{nome}</p>
        <p className="piede-desc">{descrizione}</p>

        <div className="piede-social">
          {profili.map((url) => {
            const { Icona, nome: etichetta } = iconaPer(url);
            return (
              <a key={url} href={url} rel="noopener" aria-label={etichetta} className="piede-icona">
                <Icona />
              </a>
            );
          })}
          <a href={`mailto:${email}`} aria-label="Scrivimi una email" className="piede-icona">
            <Mail aria-hidden="true" />
          </a>
          <a
            href={`https://wa.me/${whatsapp}`}
            rel="noopener"
            aria-label="Scrivimi su WhatsApp"
            className="piede-icona"
          >
            <MessageCircle aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      <motion.nav className="piede-nav" aria-label="Piè di pagina" {...entra(0.08)}>
        <p className="piede-etichetta">Pagine</p>
        <ul>
          {navigazione.map((v) => (
            <li key={v.href}>
              <a href={v.href}>{v.label}</a>
            </li>
          ))}
          <li>
            <a href="/privacy">Privacy</a>
          </li>
        </ul>
      </motion.nav>

      <motion.div className="piede-diretto" {...entra(0.16)}>
        <p className="piede-etichetta">In diretta</p>
        <a className="piede-email" href={`mailto:${email}`}>
          {email}
        </a>
        <p className="piede-nota">
          Rispondo io, la sera e nei fine settimana. Nessun modulo che finisce nel vuoto.
        </p>
      </motion.div>

      <motion.p className="piede-basso" {...entra(0.24)}>
        © {anno} {nome} · Prestazione occasionale, senza partita IVA
      </motion.p>
    </div>
  );
}
