---
titolo: Voltaria Impianti Elettrici
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
stato: Demo online — l'azienda non esiste, i dati sono di fantasia
riassunto: Un sito da elettricista che pubblica il listino invece di nasconderlo, e lascia alla ditta un pannello per accendere e spegnere i servizi da sola.
link: https://gxmich.github.io/voltaria-impianti-elettrici-demo/
codice: https://github.com/GxMich/voltaria-impianti-elettrici-demo

contesto: |
  Voltaria è una ditta di impianti elettrici che non esiste: nome, indirizzo a
  Novara, telefono, partita IVA e recensione sono inventati e servono solo a far
  girare il sito. Dietro c'è però un brief vero, del tipo che si raccoglie da un
  artigiano: elettricista di provincia, lavori civili e industriali, urgenze e
  certificazioni, un vincolo esplicito — «voglio poter aggiungere e togliere i
  servizi da solo».

  L'ho tenuto anonimo apposta. Un sito dimostrativo con i dati di un'attività
  reale è una scheda Google fantasma che aspetta di essere indicizzata: qui il
  dominio è .example, un TLD che IANA non assegna a nessuno, e tutte le pagine
  portano noindex.

problema: |
  Chi cerca un elettricista lo fa quasi sempre in due situazioni opposte: il
  salvavita è appena scattato, oppure c'è una ristrutturazione da programmare fra
  tre mesi. Sono due persone diverse con due gesti diversi — una telefona subito,
  l'altra vuole leggere e confrontare — e quasi tutti i siti di categoria le
  trattano come una sola, con un modulo di contatto in fondo alla pagina.

  Il secondo problema è il prezzo. Nelle recensioni del settore la lamentela
  ricorrente non è il costo alto, è il costo che cambia in corsa. Nessun sito di
  impiantistica risponde alla domanda che tutti hanno in testa, e il silenzio non
  viene letto come riservatezza: viene letto come la conferma del sospetto.

ricerca: |
  La prima strada era quella ovvia: home con slogan generico, quattro card
  icona-titolo-paragrafo per i servizi, un «contattaci per un preventivo
  personalizzato» e il numero di telefono nell'header. È il template che gira su
  quasi tutti i siti di impiantistica.

  L'ho scartato per due motivi. Non separava i due visitatori — l'urgenza e il
  lavoro programmato finivano nella stessa call to action — e soprattutto
  spostava online la stessa reticenza sui costi che il sito doveva smontare. Un
  sito che chiede di telefonare per sapere quanto costa non risolve la
  diffidenza: la rimanda a dopo.

  Ho scartato anche la seconda idea, il listino completo con prezzi al pezzo:
  sarebbe stato falso, perché il numero vero dipende dallo stato dell'impianto e
  si fissa dopo il sopralluogo. La via di mezzo — sei voci con l'ordine di
  grandezza e la riga che spiega da cosa dipende lo scostamento — è l'unica che
  regge davanti al cliente.

soluzione: |
  L'hero ha due porte affiancate, non un pulsante. A sinistra «guasto in corso»,
  che è solo il numero di telefono in caratteri grandi; a destra «lavoro da
  programmare», che porta al preventivo. Chi ha un'emergenza non deve leggere il
  resto della pagina per trovare come chiamare.

  I costi orientativi stanno in home, in una tabella tecnica a sei voci con le
  cifre in monospace: sostituzione quadro, rifacimento completo, dichiarazione di
  conformità, punto luce, wallbox, diritto di chiamata. Ogni riga ha la sua nota
  di ambito — «appartamento 90 mq, tracce e ripristini esclusi» — e sotto una
  frase che pochi mettono per iscritto: se il tuo caso costa meno del minimo
  indicato, te lo diciamo.

  I servizi sono una bento-grid a densità differenziate invece che una griglia
  regolare, e ogni tessera porta un badge di disponibilità — Disponibile, Su
  richiesta, Non disponibile — che l'artigiano cambia dal pannello. Il percorso
  di lavoro non è la solita fila di card numerate ma una guida DIN: una barra di
  rame con quattro morsetti in ottone, cioè l'oggetto che il cliente si ritrova
  davvero dentro il quadro.

  Il pannello riservato risponde al vincolo del brief: aggiungere, modificare,
  riordinare, sospendere un servizio, con anteprima della griglia e export JSON.
  Le tessere si allargano da sole perché la griglia a quattro colonne si chiuda
  piena, quindi si possono aggiungere e togliere servizi senza rompere il layout.

tecnica: |
  HTML, CSS e JavaScript senza framework e senza build: si carica via FTP su un
  hosting da qualche euro l'anno e funziona. Per un artigiano che non ha un
  reparto tecnico questo conta più di qualsiasi scelta di stack — non c'è niente
  da ricompilare, e fra cinque anni si apre ancora.

  Il pannello è dichiaratamente una demo, e il sito lo dice in chiaro: la
  password è confrontata nel browser e le modifiche vivono nel localStorage, il
  che significa che restano su quel dispositivo e non raggiungono gli altri
  visitatori. Sono limiti strutturali di un sito senza server, non bug, e il
  README elenca le tre strade per superarli — uno script PHP con
  password_hash(), un CMS headless, oppure una funzione serverless — insieme al
  punto esatto da toccare: il corpo di store.all(), il resto del rendering non
  cambia.

  Il design system è stato esteso in due punti. Un terzo carattere monospace per
  sigle di norma, cifre del listino e numeri di telefono, che dà al sito il
  registro della documentazione tecnica invece di quello del volantino. E i
  colori del brand resi come materiali — acciaio, metallo brunito, rame, ottone,
  vetro satinato — con micro-grana in repeating-linear-gradient: nessuna
  immagine caricata, costo di rendering trascurabile.

risultato:
  - voce: Due porte in apertura, non una call to action
    dettaglio: Urgenza e lavoro programmato hanno ciascuna il proprio gesto — il numero di telefono da un lato, il preventivo dall'altro — invece di dividersi lo stesso pulsante.
  - voce: Il listino è pubblicato, con l'ambito di ogni voce
    dettaglio: Sei ordini di grandezza in home, ognuno con la riga che dice cosa è incluso e cosa no, più l'impegno a dirlo quando il caso costa meno del minimo.
  - voce: L'artigiano accende e spegne i servizi da solo
    dettaglio: Pannello riservato con aggiunta, modifica, riordino, badge di disponibilità, anteprima live ed export JSON. La bento-grid si ricompone da sola per restare piena.
  - voce: Componenti diversi per sezioni diverse
    dettaglio: Spec list, tabella tecnica, bento a densità variabile, guida DIN con morsetti, citazione asimmetrica — invece della stessa griglia di card ripetuta sette volte.
  - voce: Nessuna build, nessuna dipendenza
    dettaglio: HTML, CSS e JavaScript vanilla, caricabili via FTP. L'unica risorsa esterna sono i font, e il README spiega come portarli in locale.
  - voce: Contrasti verificati su tutte le pagine
    dettaglio: Nessun testo sotto la soglia WCAG AA, focus ring sempre visibile, animazioni spente con prefers-reduced-motion, layout senza overflow fino a 320px.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Azienda di fantasia, dominio .example, noindex su tutte le pagine e recensione marcata come dimostrativa. Il README elenca ogni segnaposto da sostituire prima di pubblicare per davvero.

anteprima: voltaria-impianti/01-home.jpg
schermate:
  - src: voltaria-impianti/01-home.jpg
    alt: Hero blu notte con il titolo "Impianti a norma. Prezzo scritto prima di iniziare" e, di fianco, un quadro servizi con badge di disponibilità
  - src: voltaria-impianti/02-listino.jpg
    alt: Sezione costi orientativi, tabella tecnica a due colonne con le cifre in monospace e la nota di ambito sotto ogni voce
  - src: voltaria-impianti/03-servizi.jpg
    alt: Bento-grid dei servizi a densità differenziate, con una tessera grande in metallo brunito e una tessera arancione di invito a scrivere
  - src: voltaria-impianti/04-percorso.jpg
    alt: Il percorso di lavoro disegnato come una guida DIN, barra di rame con quattro morsetti in ottone e le quattro fasi sotto
  - src: voltaria-impianti/05-admin.jpg
    alt: Pannello riservato per la gestione dei servizi, con conteggi, pulsanti di export e import JSON ed elenco riordinabile
  - src: voltaria-impianti/06-mobile.jpg
    alt: La stessa home su telefono, con la barra di azione fissa in basso che tiene sempre a portata chiamata e messaggio

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - JSON-LD
  - localStorage

inEvidenza: true
ordine: 3

metaTitolo: Voltaria Impianti Elettrici — sito dimostrativo
metaDescrizione: Sito da elettricista con il listino pubblicato in home, due porte per urgenza e lavoro programmato e un pannello per gestire i servizi. Zero build.
---

È il caso in cui il mestiere e il sito dicono la stessa cosa: un impianto è a
norma quando è documentato, e un preventivo è onesto quando è scritto prima. Il
listino in home non è una scelta di marketing, è la stessa promessa applicata
alla pagina — e resta la parte che, con un'azienda vera, va confermata voce per
voce prima di andare online.
