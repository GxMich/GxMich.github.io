/**
 * Unico posto da modificare per mettere online il sito.
 */
export const SITE = {
  /** Dominio finale, senza slash. Serve a canonical, sitemap e Open Graph. */
  url: 'https://www.modicamichele.it',
  name: 'Michele Modica',
  /** Usato nel titolo delle pagine: "Titolo — Michele Modica, sviluppatore web" */
  tagline: 'Sviluppatore web',
  /** L'indirizzo pubblico: contatti, piede, privacy e dati strutturati. */
  email: 'info@modicamichele.it',
  /**
   * L'indirizzo diretto, per chi ha già un preventivo in mano: lì il rapporto
   * è con la persona, non con la casella generica.
   */
  emailDiretta: 'michele@modicamichele.it',
  /** Solo cifre, con prefisso internazionale: serve per il link wa.me */
  whatsapp: '393534214628',
  whatsappLabel: '+39 353 421 4628',
  /**
   * Lo stesso numero, da chiamare. Il sito promette ai clienti un «telefono
   * che si chiama con un tocco»: il link tel: separato da WhatsApp è il minimo
   * per farlo anche qui. Formato E.164, senza spazi.
   */
  telefono: '+393534214628',

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
   * Il traffico arriva dal raggio. Dal 19/11/2026 la zona su cui si punta è
   * il Monferrato: colline piene di cantine, agriturismi, B&B e location, cioè
   * le attività per cui un sito vale di più. Per questo sta prima di tutto.
   */
  city: 'Trino',
  region: 'Piemonte',
  /** Sigla della provincia: serve ai dati strutturati, non alla grafica. */
  provincia: 'VC',
  cap: '13039',
  areas: [
    'Monferrato',
    'Trino',
    'Casale Monferrato',
    'Vercelli',
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
   * Novara e Chivasso aggiunte a novembre 2026, ciascuna con testi suoi.
   * Trino aggiunta il 19/11/2026: la home non nomina più le città nel title,
   * e su «siti web Trino» serviva una pagina che rispondesse.
   * Monferrato aggiunto lo stesso giorno, e messo per primo: è la zona su cui
   * punta il sito. Casale resta a parte: lì si parla della città.
   */
  pagineZona: {
    Monferrato: '/siti-web-monferrato',
    Trino: '/siti-web-trino',
    'Casale Monferrato': '/siti-web-casale-monferrato',
    Vercelli: '/siti-web-vercelli',
    Novara: '/siti-web-novara',
    Chivasso: '/siti-web-chivasso',
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

  /**
   * Strumenti di misura. Partono solo dopo il sì nella fascia del consenso
   * (Consenso.astro), e solo sul dominio vero: in sviluppo e nelle anteprime
   * non parte niente, così i dati non si sporcano.
   *
   * `clarity` è l'ID del progetto Microsoft Clarity (Impostazioni → Panoramica
   * → ID progetto). Finché è null, Clarity non c'è e la fascia non lo nomina.
   *
   * Aggiungere o togliere uno strumento cambia la versione del consenso
   * (es. «ga4+clarity»), e chi aveva già risposto se lo vede richiedere:
   * un sì dato a Google Analytics non vale per uno strumento che non c'era.
   */
  misure: {
    ga4: 'G-DWTF8YGDKG',
    clarity: 'zg6q7c2ujw',
    dominio: 'modicamichele.it',
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
   *
   * 19/11/2026: Luca Miglietta e Nicola Romano hanno dato il permesso di
   * pubblicare le loro recensioni Google, e anche quelle future. I testi sono
   * le loro parole, con la sola punteggiatura sistemata («!!!» → «!», spazio
   * prima della virgola). La prima dell'elenco compare anche accanto al
   * modulo di contatto: tenere lì la più breve.
   */
  testimonianze: [
    {
      testo:
        'Grande professionista, attento alle richieste del cliente, sa consigliare al meglio e trovare soluzioni tempestive ed efficaci, prezzi onesti e vantaggiosi! Super consigliato a tutti!',
      autore: 'Luca Miglietta',
      ruolo: 'Titolare',
      attivita: 'L.M. Autoservizi',
      luogo: 'Frassineto Po',
    },
    {
      testo:
        'Ho avuto un’ottima esperienza: preciso, disponibile e attento alle esigenze del cliente. Ha dimostrato competenza tecnica, cura dei dettagli e grande professionalità, realizzando un lavoro di qualità e rispettando le richieste concordate. Consiglio vivamente a chiunque cerchi uno sviluppatore web affidabile, capace di trasformare le idee in un progetto concreto.',
      autore: 'Nicola Romano',
    },
  ],

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
  { href: '/guide', etichetta: 'Guide', principale: false },
  { href: '/analisi-gratuita', etichetta: 'Analisi gratuita', principale: false },
];
