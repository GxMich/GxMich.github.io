/**
 * Le domande e il catalogo: l'unica fonte per le due pagine riservate.
 *
 *  - /preventivo-richiesta   → il cliente compila da solo, dal telefono.
 *  - /incontro-cliente       → le stesse domande, riempite da me davanti a lui.
 *
 * Le due pagine disegnano gli stessi campi dalle stesse definizioni, e il
 * messaggio che il cliente manda ha le stesse etichette che l'incontro sa
 * rileggere: per questo l'importazione non ha bisogno di indovinare niente.
 * Cambiare una `corta` qui cambia anche come si legge il messaggio: i
 * messaggi già mandati con la vecchia etichetta non si importano più.
 *
 * Qui dentro NON ci sono prezzi. Quelli stanno cifrati in
 * `listino.cifrato.json` (vedi scripts/cifra-listino.mjs): un file pubblico
 * con la lista dei servizi va bene, uno con le cifre no.
 *
 * Regole per le opzioni dei campi `multi`: niente punto e virgola dentro, perché
 * nel messaggio i valori si separano con "; ".
 */

/**
 * tipo: testo | tel | email | area | scelta (una sola) | multi (più d'una)
 * obbl: obbligatorio nel modulo del cliente
 * fac:  mostra "facoltativo" (solo testo e area: i gruppi di scelta si saltano)
 * chiedi: suggerimento per me, visibile solo nell'incontro
 */
export const SEZIONI = [
  {
    id: 'attivita',
    sigla: 'La tua attività',
    titolo: 'La tua attività',
    intro: 'Chi sei e come ti trovo. Solo nome, comune e un recapito sono obbligatori.',
    campi: [
      { id: 'nome', label: "Nome dell'attività", corta: 'Attività', tipo: 'testo', obbl: true, autocomplete: 'organization' },
      { id: 'referente', label: 'Il tuo nome', corta: 'Referente', tipo: 'testo', obbl: true, autocomplete: 'name' },
      { id: 'comune', label: 'Comune dove si trova', corta: 'Comune', tipo: 'testo', obbl: true, autocomplete: 'address-level2' },
      {
        id: 'settore',
        label: 'Che attività è',
        corta: 'Settore',
        tipo: 'scelta',
        opzioni: [
          'Ristorante, pizzeria o bar',
          'Alloggio (B&B, agriturismo, hotel)',
          'Artigiano o impiantista',
          'Negozio',
          'Studio professionale',
          'Benessere, estetica o sport',
          'Associazione o evento',
          'Altro',
        ],
      },
      {
        id: 'descrizione',
        label: 'Cosa fai, in due righe',
        corta: 'Cosa fa',
        tipo: 'area',
        fac: true,
        chiedi: "Fatti spiegare l'attività con le sue parole: sono quelle da usare nei testi.",
      },
      { id: 'telefono', label: 'Telefono o WhatsApp', corta: 'Telefono', tipo: 'tel', obbl: true, autocomplete: 'tel' },
      { id: 'email', label: 'Email', corta: 'Email', tipo: 'email', fac: true, autocomplete: 'email' },
      { id: 'contatto', label: 'Come preferisci essere ricontattato', corta: 'Preferisce', tipo: 'scelta', opzioni: ['WhatsApp', 'Telefonata', 'Email'] },
      {
        id: 'fascia',
        label: 'Quando sei più facile da trovare',
        corta: 'Orari per sentirci',
        tipo: 'testo',
        fac: true,
        placeholder: 'Es. dopo le 15, tranne il lunedì',
      },
    ],
  },
  {
    id: 'oggi',
    sigla: 'Presenza online',
    titolo: 'Com’è messa oggi la tua presenza online',
    intro: 'Mi serve per capire da dove si parte e cosa si può recuperare.',
    campi: [
      {
        id: 'sito',
        label: 'Hai già un sito?',
        corta: 'Sito di oggi',
        tipo: 'scelta',
        opzioni: ['Sì, ho già un sito', 'Ho solo i social o la scheda Google', 'Non ho niente online'],
        chiedi: 'Se ce l’ha: chi l’ha fatto, quando, e se c’è un rinnovo in scadenza.',
      },
      { id: 'sitoUrl', label: 'Indirizzo del sito di oggi', corta: 'Indirizzo del sito', tipo: 'testo', fac: true, placeholder: 'Es. nomeattivita.it' },
      {
        id: 'sitoCosto',
        label: 'Quanto spendi ogni anno per sito e dominio',
        corta: 'Spesa annua di oggi',
        tipo: 'testo',
        fac: true,
        placeholder: 'Es. circa 200 € l’anno, non lo so',
        chiedi: 'Se oggi paga un canone, il confronto con una cifra una tantum è il tuo argomento migliore.',
      },
      {
        id: 'dominio',
        label: 'Il dominio (l’indirizzo .it o .com) è intestato a te?',
        corta: 'Dominio',
        tipo: 'scelta',
        opzioni: ['Sì, è intestato a me', 'No, è intestato a chi ha fatto il sito', 'Non lo so', 'Non ho un dominio'],
        chiedi: 'Se non è suo, è la prima cosa da sistemare: senza il dominio non si sposta niente.',
      },
      { id: 'social', label: 'Pagine social e scheda Google', corta: 'Social e Google', tipo: 'testo', fac: true, placeholder: 'Link o nome' },
      { id: 'problemi', label: 'Cosa non va nel sito o nella presenza di oggi', corta: 'Cosa non va oggi', tipo: 'area', fac: true },
    ],
  },
  {
    id: 'obiettivi',
    sigla: 'Cosa deve fare',
    titolo: 'Cosa deve fare il sito per te',
    intro: 'Scegli tutto quello che ti serve: se sono tante cose, poi ne parliamo e le mettiamo in ordine.',
    campi: [
      {
        id: 'obiettivi',
        label: 'Cosa vuoi ottenere',
        corta: 'Obiettivi',
        tipo: 'multi',
        opzioni: [
          'Farmi trovare da chi non mi conosce',
          'Far chiamare o scrivere su WhatsApp',
          'Ricevere prenotazioni o richieste di preventivo',
          'Mostrare lavori, prodotti o ambienti',
          'Dare un’immagine più curata e professionale',
          'Sostituire un sito vecchio o troppo costoso',
          'Vendere online',
        ],
        chiedi: 'Fai scegliere i due più importanti: se tutto è prioritario, niente lo è.',
      },
      { id: 'clienti', label: 'Chi sono i tuoi clienti', corta: 'Clienti', tipo: 'area', fac: true, placeholder: 'Es. famiglie della zona, turisti, aziende' },
      { id: 'distingue', label: 'Cosa ti distingue dagli altri della zona', corta: 'Cosa lo distingue', tipo: 'area', fac: true },
    ],
  },
  {
    id: 'contenuti',
    sigla: 'Pagine e funzioni',
    titolo: 'Cosa deve contenere',
    intro: 'Se qualcosa non rientra nel mio lavoro te lo dico subito, prima di iniziare.',
    campi: [
      {
        id: 'pagine',
        label: 'Pagine',
        corta: 'Pagine',
        tipo: 'multi',
        opzioni: [
          'Home',
          'Chi siamo',
          'Servizi o prodotti',
          'Menù o listino',
          'Camere o sistemazioni',
          'Galleria foto',
          'Recensioni',
          'Dove siamo e orari',
          'Contatti',
          'Domande frequenti',
          'Notizie o blog',
        ],
        chiedi: 'Conta le pagine: oltre quelle incluse nel pacchetto scatta la pagina aggiuntiva.',
      },
      {
        id: 'funzioni',
        label: 'Funzioni',
        corta: 'Funzioni',
        tipo: 'multi',
        opzioni: [
          'Pulsanti per chiamare e scrivere su WhatsApp',
          'Mappa e orari',
          'Modulo di contatto',
          'Richiesta di disponibilità',
          'Prenotazioni online con calendario',
          'Collegamento ai social',
          'Più lingue',
          'Vendita online con carrello',
        ],
        chiedi: 'Vendita online con magazzino e prenotazioni con incasso anticipato sono fuori dal mio perimetro: dillo adesso.',
      },
      {
        id: 'lingue',
        label: 'Lingue del sito',
        corta: 'Lingue',
        tipo: 'multi',
        opzioni: ['Italiano', 'Inglese', 'Tedesco', 'Francese', 'Un’altra lingua'],
      },
      {
        id: 'quantita',
        label: 'Quante camere, prodotti, servizi o piatti da mostrare',
        corta: 'Quanti da mostrare',
        tipo: 'testo',
        fac: true,
        placeholder: 'Es. 4 camere, circa 30 piatti',
      },
    ],
  },
  {
    id: 'materiali',
    sigla: 'Cosa hai già',
    titolo: 'Cosa hai già',
    intro: 'Se non hai tutto, si parte con quello che c’è: dove manca qualcosa metto un segnaposto ben visibile, non invento niente.',
    campi: [
      {
        id: 'logo',
        label: 'Logo',
        corta: 'Logo',
        tipo: 'scelta',
        opzioni: ['Sì, in buona qualità', 'Ce l’ho ma è piccolo o sfocato', 'No, non ce l’ho'],
      },
      {
        id: 'foto',
        label: 'Foto',
        corta: 'Foto',
        tipo: 'scelta',
        opzioni: ['Sì, buone', 'Poche o vecchie', 'No, servono nuove foto'],
        chiedi: 'Chiedi di mandartene subito qualcuna dal telefono: fai in tempo a dirgli se bastano.',
      },
      {
        id: 'testi',
        label: 'Testi',
        corta: 'Testi',
        tipo: 'scelta',
        opzioni: ['Li scrivo io', 'Ho già dei testi da sistemare', 'Preferisco che li scriva tu'],
      },
      {
        id: 'listino',
        label: 'Menù, listino o elenco dei servizi',
        corta: 'Listino',
        tipo: 'scelta',
        opzioni: ['Pronto', 'Da preparare', 'Non serve'],
      },
    ],
  },
  {
    id: 'stile',
    sigla: 'Come lo immagini',
    titolo: 'Come lo immagini',
    intro: 'Non serve essere precisi: due esempi che ti piacciono dicono più di mille parole.',
    campi: [
      {
        id: 'stile',
        label: 'Come deve sembrare',
        corta: 'Stile',
        tipo: 'multi',
        opzioni: ['Elegante', 'Familiare e caldo', 'Moderno', 'Essenziale', 'Colorato', 'Professionale', 'Rustico'],
      },
      { id: 'esempi', label: 'Siti che ti piacciono', corta: 'Siti che gli piacciono', tipo: 'area', fac: true, placeholder: 'Link o nome dell’attività' },
      { id: 'evitare', label: 'Cose che non vuoi', corta: 'Da evitare', tipo: 'area', fac: true },
      { id: 'colori', label: 'Colori da usare o da evitare', corta: 'Colori', tipo: 'testo', fac: true },
    ],
  },
  {
    id: 'tempi',
    sigla: 'Tempi e budget',
    titolo: 'Tempi e budget',
    intro: 'Il budget è facoltativo. Mi serve solo per proporti la strada giusta e non farti perdere tempo.',
    campi: [
      {
        id: 'quando',
        label: 'Quando vorresti il sito online',
        corta: 'Quando lo vuole',
        tipo: 'scelta',
        opzioni: ['Il prima possibile', 'Entro un mese', 'Entro tre mesi', 'Senza fretta', 'Ho una data precisa'],
        chiedi: 'Di solito servono 3–4 settimane, sotto la settimana non si lavora: se la data è prima, dillo adesso.',
      },
      { id: 'data', label: 'Se hai una data precisa', corta: 'Data precisa', tipo: 'testo', fac: true, placeholder: 'Apertura, stagione, evento…' },
      {
        id: 'budget',
        label: 'Che budget hai in mente',
        corta: 'Budget',
        tipo: 'scelta',
        opzioni: ['Fino a 400 €', 'Tra 400 e 800 €', 'Tra 800 e 1.500 €', 'Oltre 1.500 €', 'Non lo so, consigliami'],
      },
    ],
  },
  {
    id: 'altro',
    sigla: 'Ultime cose',
    titolo: 'Ultime cose',
    campi: [
      {
        id: 'conosciuto',
        label: 'Come mi hai conosciuto',
        corta: 'Mi ha conosciuto tramite',
        tipo: 'scelta',
        opzioni: ['Passaparola', 'Ricerca su Google', 'Social', 'Di persona', 'Altro'],
      },
      { id: 'note', label: 'Altro che vuoi dirmi', corta: 'Altro', tipo: 'area', fac: true },
    ],
  },
];

/**
 * Cosa mi serve dal cliente, con lo stato da segnare durante l'incontro.
 * È la lista di cui parla la sezione "Per partire mi servono" del preventivo.
 */
export const MATERIALI = [
  { id: 'logo', nome: 'Logo in alta qualità' },
  { id: 'foto-luogo', nome: 'Foto del locale, dell’attività o dei lavori' },
  { id: 'foto-prodotti', nome: 'Foto di prodotti, piatti o camere' },
  { id: 'testi', nome: 'Testi già scritti' },
  { id: 'listino', nome: 'Menù, listino o elenco dei servizi' },
  { id: 'orari', nome: 'Orari e giorni di chiusura' },
  { id: 'indirizzo', nome: 'Indirizzo e posizione sulla mappa' },
  { id: 'accessi', nome: 'Accesso a sito, dominio e hosting di oggi' },
  { id: 'fiscali', nome: 'Ragione sociale e partita IVA per il piè di pagina' },
  { id: 'recensioni', nome: 'Recensioni da mostrare, con il permesso di chi le ha scritte' },
  { id: 'consensi', nome: 'Consenso di chi compare nelle foto' },
];

export const STATI_MATERIALE = [
  ['ce-l-ha', 'Ce l’ha'],
  ['in-parte', 'In parte'],
  ['da-chiedere', 'Da chiedere'],
  ['non-serve', 'Non serve'],
];

/**
 * I pacchetti. Pagine incluse e dotazione sono quelle della specifica:
 * i prezzi no, vivono nel listino cifrato sotto lo stesso `id`.
 */
export const PACCHETTI = [
  {
    id: 'essenziale',
    nome: 'Essenziale',
    perChi: 'Chi vuole esserci online, subito.',
    pagine: 1,
    include: [
      'Una pagina unica, pensata per il telefono',
      'Pulsanti per chiamare e scrivere su WhatsApp',
      'Mappa e orari',
      'Titoli e dati per farsi trovare su Google, di base',
      'Informativa privacy e cookie',
    ],
  },
  {
    id: 'completo',
    nome: 'Completo',
    perChi: 'Chi vuole essere scelto da chi non lo conosce.',
    pagine: 5,
    include: [
      'Fino a 5 pagine, pensate per il telefono',
      'Pulsanti per chiamare e scrivere su WhatsApp',
      'Mappa e orari',
      'Galleria foto',
      'Modulo di contatto',
      'Titoli e dati per farsi trovare su Google, completi',
      'Informativa privacy e cookie',
    ],
  },
  {
    id: 'misura',
    nome: 'Su misura',
    perChi: 'Chi ha esigenze particolari: si compone a voci.',
    pagine: 0,
    include: ['Tutto si decide a voci, qui sotto: ognuna con il suo prezzo.'],
  },
];

/**
 * Extra a prezzo di listino.
 *  - unita: come si conta (null = una volta sola)
 *  - ricorrente: costo annuo e facoltativo, fuori dal totale una tantum
 *  - qtaDa: se la quantità si può ricavare dalle risposte del cliente
 */
export const EXTRA = [
  { id: 'pagina', nome: 'Pagina aggiuntiva', unita: 'pagine', nota: 'Oltre a quelle incluse nel pacchetto.' },
  { id: 'prenotazioni', nome: 'Prenotazione online collegata al sito', unita: null, nota: 'Calendario con richiesta di prenotazione. Senza incasso anticipato.' },
  { id: 'testi', nome: 'Testi scritti da me a partire da una chiacchierata', unita: 'pagine' },
  { id: 'lingua', nome: 'Versione in un’altra lingua', unita: 'lingue' },
  { id: 'migrazione', nome: 'Passaggio dal sito di oggi', unita: null, nota: 'Contenuti e dominio spostati dal sito esistente (es. Wix).' },
  { id: 'scheda-google', nome: 'Scheda Google dell’attività, creata o sistemata', unita: null },
  { id: 'recensioni', nome: 'Analisi delle recensioni Google con risposte pronte', unita: null, nota: 'Ha senso solo se ci sono recensioni a cui vale la pena rispondere.' },
  { id: 'modifica', nome: 'Giro di modifiche in più', unita: 'giri', nota: 'Oltre a quelli inclusi.' },
  { id: 'assistenza', nome: 'Aggiornamenti e assistenza annuale', unita: null, ricorrente: true, nota: 'Facoltativa. Costo annuo, fuori dal totale.' },
];

/** Valori di partenza delle condizioni: sono modificabili in ogni incontro. */
export const CONDIZIONI = {
  validitaGiorni: 30,
  accontoPercentuale: 40,
  giriDiModifica: 2,
  assistenzaGiorni: 30,
  tempi: '3–4 settimane dalla conferma e dal materiale',
  dominioHosting: 'Dominio e hosting restano fuori dal prezzo: circa 50–120 € l’anno, pagati dal cliente direttamente al fornitore e intestati a lui.',
};

/**
 * Regimi. La dicitura è quella che compare sul preventivo stampato.
 * Sono proposte da far vedere al commercialista prima di usarle.
 */
export const REGIMI = [
  {
    id: 'occasionale',
    nome: 'Prestazione occasionale',
    dicitura: 'Prestazione di lavoro autonomo occasionale: operazione fuori campo IVA.',
    iva: 0,
  },
  {
    id: 'forfettario',
    nome: 'Regime forfettario',
    dicitura: 'Operazione senza applicazione dell’IVA, ai sensi dell’art. 1, commi 54-89, L. 190/2014. Compenso non soggetto a ritenuta d’acconto.',
    iva: 0,
  },
  {
    id: 'ordinario',
    nome: 'IVA ordinaria 22%',
    dicitura: 'I prezzi indicati sono IVA esclusa (22%).',
    iva: 22,
  },
];

export const ALIQUOTA_RITENUTA = 20;
