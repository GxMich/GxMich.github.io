import { SITE } from '../config.js';

/**
 * I dati strutturati stanno tutti qui invece che copiati in ogni pagina.
 * Motivo pratico: l'indirizzo e le coordinate comparivano in tre file diversi,
 * e il giorno che cambia la città bisogna ricordarsi di tutti e tre.
 *
 * Gli @id servono a dire a Google che la Persona citata nella scheda progetto
 * e quella che offre il servizio sono lo stesso soggetto. Senza, legge due
 * entità scollegate e non attribuisce niente a nessuno.
 */

export const ID = {
  persona: `${SITE.url}/#persona`,
  attivita: `${SITE.url}/#attivita`,
  sito: `${SITE.url}/#sito`,
};

const indirizzo = {
  '@type': 'PostalAddress',
  addressLocality: SITE.city,
  addressRegion: SITE.region,
  postalCode: SITE.cap,
  addressCountry: 'IT',
};

const posizione = {
  '@type': 'GeoCoordinates',
  latitude: SITE.geo.lat,
  longitude: SITE.geo.lon,
};

/**
 * Area servita come cerchio geografico più l'Italia intera per il lavoro da
 * remoto. Elencare solo i nomi delle città, come facevo prima, lascia fuori
 * tutti i paesi in mezzo — che sono la maggior parte dei clienti veri.
 */
const areaServita = [
  {
    '@type': 'GeoCircle',
    geoMidpoint: posizione,
    geoRadius: SITE.raggioMetri,
    description: `Zona coperta di persona attorno a ${SITE.city}`,
  },
  { '@type': 'Country', name: 'Italia' },
];

const orari = SITE.orari.map((o) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: o.giorni,
  opens: o.apre,
  closes: o.chiude,
}));

/** La persona. Referenziata per @id da tutto il resto. */
export const persona = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': ID.persona,
  name: SITE.name,
  jobTitle: 'Sviluppatore web e software',
  url: SITE.url,
  image: new URL(SITE.foto, SITE.url).href,
  email: `mailto:${SITE.email}`,
  telephone: `+${SITE.whatsapp}`,
  address: indirizzo,
  ...(SITE.profili.length > 0 && { sameAs: SITE.profili }),
  knowsAbout: [
    'Sviluppo web',
    'Siti per attività locali',
    'Automazioni e script',
    'Dashboard e analisi dati',
    'Visualizzazione 3D nel browser',
    'Accessibilità web',
    'Ottimizzazione per i motori di ricerca',
  ],
  knowsLanguage: ['it', 'en'],
};

/**
 * L'attività. ProfessionalService discende da LocalBusiness, quindi accetta
 * orari, coordinate e raggio: è il tipo giusto per chi lavora su una zona
 * senza avere un negozio in cui si entra.
 */
export const attivita = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ID.attivita,
  name: `${SITE.name} — ${SITE.tagline}`,
  description:
    'Siti su misura per attività locali e strumenti software su misura per aziende e professionisti, fra Trino, Vercelli, Casale Monferrato e Novara.',
  url: SITE.url,
  image: new URL(SITE.foto, SITE.url).href,
  email: `mailto:${SITE.email}`,
  telephone: `+${SITE.whatsapp}`,
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  address: indirizzo,
  geo: posizione,
  areaServed: areaServita,
  openingHoursSpecification: orari,
  founder: { '@id': ID.persona },
  ...(SITE.profili.length > 0 && { sameAs: SITE.profili }),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Sito su misura per attività locali',
          serviceType: 'Realizzazione siti web',
          provider: { '@id': ID.persona },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Tool e automazioni su misura',
          serviceType: 'Sviluppo software su commessa',
          provider: { '@id': ID.persona },
        },
      },
    ],
  },
};

/** Il sito come oggetto, così la ricerca interna e il nome restano collegati. */
export const sitoWeb = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': ID.sito,
  url: SITE.url,
  name: `${SITE.name} — ${SITE.tagline}`,
  inLanguage: 'it-IT',
  publisher: { '@id': ID.persona },
};

/** Briciole di pane: una riga per pagina, nell'ordine in cui si naviga. */
export function briciole(voci: { nome: string; percorso: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: voci.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.nome,
      item: new URL(v.percorso, SITE.url).href,
    })),
  };
}

/**
 * Un progetto come oggetto.
 *
 * Serve soprattutto ai motori che rispondono con una frase invece che con
 * dieci link: senza questo, una scheda progetto è solo del testo, e alla
 * domanda «cosa ha costruito Michele Modica?» non c'è niente da citare che
 * colleghi il lavoro alla persona. `author` punta allo stesso @id della
 * persona dichiarata altrove, così le sei schede diventano sei opere di un
 * soggetto solo invece di sei pagine slegate.
 *
 * `SoftwareApplication` per i tool e `WebSite` per i siti: sono i due tipi che
 * descrivono davvero le due famiglie, e usarne uno generico per entrambe
 * butterebbe via l'unica distinzione che il portfolio fa.
 */
export function progetto(d: {
  titolo: string;
  riassunto: string;
  tipo: 'sito' | 'tool';
  anno: number;
  natura: 'cliente' | 'iniziativa' | 'interno';
  stato?: string;
  tecnologie: string[];
  slug: string;
  immagine?: string;
}) {
  const url = new URL(`/progetti/${d.slug}`, SITE.url).href;

  return {
    '@context': 'https://schema.org',
    '@type': d.tipo === 'tool' ? 'SoftwareApplication' : 'WebSite',
    '@id': `${url}#opera`,
    name: d.titolo,
    description: d.riassunto,
    url,
    inLanguage: 'it-IT',
    author: { '@id': ID.persona },
    creator: { '@id': ID.persona },
    dateCreated: String(d.anno),
    isAccessibleForFree: true,
    ...(d.immagine && { image: new URL(d.immagine, SITE.url).href }),
    ...(d.tecnologie.length > 0 && { keywords: d.tecnologie.join(', ') }),
    ...(d.tipo === 'tool' && {
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
    }),
    /* Lo stato in chiaro: «in beta con dati di prova» è un'informazione che
       vale quanto il resto, e nasconderla qui mentre è scritta in pagina
       sarebbe una discrepanza fra quello che si dice e quello che si dichiara. */
    ...(d.stato && { creativeWorkStatus: d.stato }),
  };
}

/** L'elenco dei lavori, per chi chiede «cosa ha fatto» e vuole una lista. */
export function elencoProgetti(voci: { titolo: string; slug: string; riassunto: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lavori di ' + SITE.name,
    numberOfItems: voci.length,
    itemListElement: voci.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: new URL(`/progetti/${v.slug}`, SITE.url).href,
      name: v.titolo,
      description: v.riassunto,
    })),
  };
}

/** Domande e risposte. Il testo deve esistere anche in pagina, non solo qui. */
export function domande(coppie: { d: string; r: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: coppie.map((c) => ({
      '@type': 'Question',
      name: c.d,
      acceptedAnswer: { '@type': 'Answer', text: c.r },
    })),
  };
}
