/**
 * Unico posto da modificare per mettere online il sito.
 */
export const SITE = {
  /** Dominio finale, senza slash. Serve a canonical, sitemap e Open Graph. */
  url: 'https://www.modicamichele.it',
  name: 'Michele Modica',
  /** Usato nel titolo delle pagine: "Titolo — Michele Modica, sviluppatore web" */
  tagline: 'Sviluppatore web e software',
  email: 'modicamichelework@gmail.com',
  /** Solo cifre, con prefisso internazionale: serve per il link wa.me */
  whatsapp: '393490595725',
  whatsappLabel: '+39 349 059 5725',

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
   * L'indirizzo è quello corto ufficiale di Google (share.google): non scade e
   * non si porta dietro i parametri di tracciamento della condivisione.
   *
   * Quando ti serve il link diretto per chiedere una recensione — quello che
   * apre subito le stelline — lo trovi nella dashboard del profilo, alla voce
   * «Chiedi recensioni»: è un indirizzo g.page/r/… e va messo qui sotto in
   * `googleRecensioni`, non al posto di questo.
   */
  google: 'https://share.google/5jKMRITc1zvJk9pa7',
  googleRecensioni: null,

  /**
   * Le misure di traffico.
   *
   * Google Tag Manager e Microsoft Clarity: il primo conta le visite, il
   * secondo registra come ci si muove nella pagina. Tutti e due salvano
   * cookie e tutti e due mandano dati fuori di qui, quindi in Europa non
   * possono partire prima che qualcuno abbia detto di sì — non «mentre»
   * glielo si chiede, proprio prima. Per questo gli indirizzi stanno qui e
   * non nel layout: la fascia del consenso li legge e li inietta solo dopo la
   * risposta, e finché la risposta non c'è nella pagina non entra una riga di
   * codice di nessuno dei due.
   *
   * Mettere `null` a uno dei due lo spegne del tutto. Se li spegni entrambi
   * sparisce anche la fascia, perché non ci sarebbe più niente da chiedere.
   */
  misure: {
    gtm: 'GTM-TSLP22NJ',
    clarity: 'y2xyt4h0zn',
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

  /**
   * Endpoint del form contatti.
   * Il progetto è statico: serve un servizio che riceva il POST e giri la mail.
   * Consigliato Web3Forms (gratuito, nessun account server): metti qui la tua access key
   * e il form funziona senza altro codice. In alternativa un endpoint Formspree o
   * una function serverless tua: basta che accetti un POST JSON.
   */
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: '44b34c94-a8bc-4d2a-b530-97364608672c',
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
