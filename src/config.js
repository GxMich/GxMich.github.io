/**
 * Unico posto da modificare per mettere online il sito.
 */
export const SITE = {
  /** Dominio finale, senza slash. Serve a canonical, sitemap e Open Graph. */
  url: 'https://www.modicamichele.it',
  name: 'Michele Modica',
  /** Usato nel titolo delle pagine: "Titolo — Michele Modica, sviluppatore web" */
  tagline: 'Sviluppatore web e software',
  /** L'indirizzo pubblico: contatti, piede, privacy e dati strutturati. */
  email: 'info@modicamichele.it',
  /**
   * L'indirizzo diretto, per chi ha già un preventivo in mano: lì il rapporto
   * è con la persona, non con la casella generica.
   */
  emailDiretta: 'michele@modicamichele.it',
  /** Solo cifre, con prefisso internazionale: serve per il link wa.me */
  whatsapp: '393759952066',
  whatsappLabel: '+39 375 995 2066',

  /**
   * Niente partita IVA: il lavoro va come prestazione occasionale, quindi in
   * fondo alla pagina non c'è nessun numero da mostrare. Per il GDPR, come
   * titolare del trattamento bastano nome, email e comune — e stanno nella
   * pagina privacy, che è il posto giusto.
   */
  vat: null,

  /**
   * La sede è Trino, dove vive davvero. Le città della zona stanno in `areas`
   * come luoghi dove lavora, non come sedi: dichiarare un indirizzo dove non
   * sei è la cosa che Google penalizza più volentieri sulle attività locali.
   *
   * Trino ha circa 7.000 abitanti, quindi da sola porta pochissime ricerche.
   * Il traffico arriva dal raggio: Vercelli, Casale, Novara, Chivasso.
   */
  city: 'Trino',
  region: 'Piemonte',
  /** Sigla della provincia: serve ai dati strutturati, non alla grafica. */
  provincia: 'VC',
  cap: '13039',
  areas: [
    'Trino',
    'Vercelli',
    'Casale Monferrato',
    'Novara',
    'Chivasso',
    'Tutta Italia da remoto',
  ],

  /**
   * Le città che hanno una pagina loro.
   *
   * Solo dove c'è davvero qualcosa di diverso da dire: una pagina per ogni
   * comune del raggio, con lo stesso testo e il nome sostituito, è contenuto
   * duplicato — Google la riconosce e indebolisce anche le pagine buone.
   * Trino non ce l'ha perché è la sede e ne parlano già home e contatti;
   * Novara e Chivasso non ancora, e finché non ce l'hanno restano testo
   * semplice nel piede senza che si rompa niente.
   */
  pagineZona: {
    Vercelli: '/siti-web-vercelli',
    'Casale Monferrato': '/siti-web-casale-monferrato',
  },

  /**
   * Coordinate del centro della zona servita. Non è l'indirizzo di casa: a
   * Google serve un punto per capire il raggio d'azione, e per chi lavora
   * senza sede aperta al pubblico il centro del paese va benissimo.
   */
  geo: { lat: 45.1936, lon: 8.2969 },
  /** Raggio in metri entro cui dici di lavorare di persona. 60 km. */
  raggioMetri: 60000,

  /**
   * Orari in cui rispondi davvero. Vanno nei dati strutturati, quindi mettere
   * qui orari che non rispetti è peggio che non metterli.
   */
  orari: [
    {
      giorni: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      apre: '08:00',
      chiude: '22:00',
    },
  ],

  /**
   * Profili pubblici che confermano che esisti. Google li usa per collegare
   * il sito alla persona: lascia solo quelli veri, un link morto vale zero.
   */
  profili: [
    'https://www.linkedin.com/in/michele-modica98',
    'https://github.com/GxMich',
  ],

  /**
   * La scheda Google (Profilo dell'attività).
   *
   * Sta fuori da `profili` perché non è un profilo social: è il pezzo che
   * decide se compari nella mappa quando qualcuno cerca «sviluppatore web
   * Vercelli», ed è l'unico posto dove qualcuno può lasciare una recensione
   * pubblica. Per questo in pagina ha un'etichetta sua invece di finire
   * nell'elenco «Altrove» insieme a LinkedIn e GitHub.
   *
   * L'indirizzo usa il CID della scheda (maps.google.com/?cid=…): è stabile e
   * identifica la scheda senza ambiguità. Il vecchio share.google rimandava a
   * una ricerca, non alla scheda.
   *
   * `googleRecensioni` è il link diretto che apre subito le stelline (dalla
   * dashboard del profilo, «Chiedi recensioni»). Attenzione: è una O
   * maiuscola, non uno zero.
   */
  google: 'https://maps.google.com/?cid=11384881009517492426',
  googleRecensioni: 'https://g.page/r/Ccp4YV71OP-dEBM/review',

  /** Nome dell'attività com'è scritto sulla scheda Google (alternateName). */
  nomeScheda: 'Modica Michele Web Service',

  /**
   * Profili social dell'attività. Finiscono solo nei dati strutturati
   * (sameAs), non nell'elenco «Altrove» del piede, che resta LinkedIn e GitHub.
   */
  social: [
    'https://www.instagram.com/modicamichele.web/',
    'https://www.facebook.com/people/modicamicheleweb/61596225210352/',
    'https://www.linkedin.com/company/modica-michele-web-service',
  ],

  /** ID di misurazione GA4. Il tag viene caricato solo dopo il consenso. */
  misure: {
    ga4: 'G-DWTF8YGDKG',
  },

  /**
   * Foto usata nei dati strutturati, dove serve un indirizzo pubblico stabile.
   * È la versione compressa a 900px: l'originale sta in src/assets/michele.png
   * e in pagina passa dall'ottimizzatore di Astro.
   */
  foto: '/img/michele.jpg',

  /**
   * Testimonianze vere, di persone che possono confermarle.
   *
   * L'elenco parte vuoto di proposito: finché è vuoto la sezione non compare
   * proprio. Così il sito non mostra mai un riquadro con dentro una frase
   * inventata — che è la cosa che distrugge più in fretta la fiducia, perché
   * i clienti riconoscono le finte meglio di quanto pensiamo.
   *
   * Aggiungine una solo quando qualcuno te l'ha davvero detta e sa che la
   * stai pubblicando. Servono nome e cognome veri: una testimonianza firmata
   * "M.R., imprenditore" vale meno di nessuna testimonianza.
   *
   *   {
   *     testo: 'La frase, come l'ha detta lui.',
   *     autore: 'Nome Cognome',
   *     ruolo: 'Titolare',
   *     attivita: 'Nome attività',
   *     luogo: 'Vercelli',
   *   }
   */
  testimonianze: [],

};

export const NAV = [
  { href: '/progetti', label: 'Progetti' },
  { href: '/chi-sono', label: 'Chi sono' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/contatti', label: 'Contatti' },
];

/**
 * Navigazione della direzione nuova.
 *
 * Convive con NAV finché i componenti vecchi non escono di scena: toccare NAV
 * adesso cambierebbe l'intestazione ancora in uso.
 *
 * "Lavori" e non "Progetti": chi arriva cercando un sito per la sua attività
 * riconosce prima la parola che usa lui. L'indirizzo resta /progetti, perché
 * rinominarlo butterebbe via indicizzazione e collegamenti per un guadagno
 * solo estetico.
 *
 * `principale: false` tiene la voce fuori dalla barra su schermo largo, dove
 * c'è già il bottone di contatto: nel menu a schermo intero c'è tutto.
 */
export const NAVIGAZIONE = [
  { href: '/progetti', etichetta: 'Lavori', principale: true },
  { href: '/servizi', etichetta: 'Servizi', principale: true },
  { href: '/chi-sono', etichetta: 'Chi sono', principale: true },
  { href: '/contatti', etichetta: 'Contatti', principale: false },
];
