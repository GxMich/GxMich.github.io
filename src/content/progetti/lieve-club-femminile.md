---
titolo: LIEVE club femminile
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un club per donne che deve convincere chi in palestra non si è mai sentita a suo agio.
riassunto: Una sola pagina per un club femminile di allenamenti da trenta minuti, con la mezz'ora raccontata da un timer e una prova di due settimane da richiedere in un minuto.
link: https://gxmich.github.io/lieve-club-femminile-demo/
codice: https://github.com/GxMich/lieve-club-femminile-demo

contesto: |
  LIEVE non esiste. Il club, il paese di Pianvecchio, la fondatrice, gli orari,
  i prezzi e le recensioni sono inventati, e le recensioni sono segnate come
  dimostrative. L'idea è quella di un piccolo club solo per donne: sessioni
  guidate da trenta minuti, cinque corsi, un'istruttrice sempre in sala.

  Le pagine hanno noindex e robots.txt blocca i motori di ricerca. I pulsanti di
  contatto non aprono nessuna chat e il modulo non invia niente.

problema: |
  Chi cerca un club come questo spesso non entra in palestra da anni, oppure ci
  è entrata e si è sentita fuori posto. Prima di iscriversi vuole capire tre
  cose: quanto tempo serve, se sarà seguita e cosa succede la prima volta.

  Le palestre di solito rispondono con foto di attrezzi, un elenco di corsi e un
  numero di telefono. Il formato da trenta minuti, che è la vera differenza, si
  perde in una riga di testo.

ricerca: |
  La prima idea era una pagina classica: hero con foto, tre card con i vantaggi,
  griglia dei corsi, prezzi, modulo di contatto. Si costruisce in fretta e si
  legge senza sorprese.

  L'ho scartata perché trattava la mezz'ora come un dettaglio. Detto in un
  paragrafo, «trenta minuti» suona come una promessa da volantino. Volevo che la
  durata si vedesse passare, e che la prova gratuita sembrasse una cosa concreta
  da tenere in mano.

soluzione: |
  La sezione del metodo è un timer che va da 00:00 a 30:00 mentre si scorre la
  pagina. Le quattro fasi della sessione si accendono una alla volta, quando il
  timer arriva al loro minuto. Subito sotto si sceglie giorno e orario della
  propria mezz'ora, con i turni ogni trenta minuti.

  I corsi scorrono in orizzontale su desktop e in verticale sul telefono. Per chi
  non sa da dove partire c'è una domanda, «Cosa cerchi, oggi?», con cinque
  risposte che portano al corso giusto.

  La prova di due settimane è disegnata come una tessera. Si inclina seguendo il
  mouse e si compila mentre si scrive: il nome compare sulla carta, la data di
  inizio diventa il periodo di validità. Il modulo chiede solo nome e telefono.

  Nella demo chat e modulo mostrano in una finestra il messaggio che verrebbe
  preparato. Nessun dato lascia il browser.

tecnica: |
  HTML, CSS e JavaScript senza build. GSAP con ScrollTrigger gestisce il timer,
  lo scorrimento orizzontale e le parole del manifesto che si accendono; Lenis
  rende lo scroll più morbido. Librerie e font sono nella cartella del sito, così
  la pagina non dipende da servizi esterni.

  L'ingresso è il nome del club in tracciati SVG, ricavati dal carattere della
  pagina. Le lettere salgono una alla volta, poi la I si allarga e diventa la
  finestra sulla foto della home. Compare una volta per sessione, si può saltare
  e ha un tempo massimo: se qualcosa non si carica, la pagina si apre comunque.

  Con «riduci movimento» attivo, o senza JavaScript, il sito resta completo:
  il timer mostra 30:00 e tutte le fasi, i corsi diventano un elenco verticale,
  l'ingresso non parte. La mappa è un'illustrazione SVG del paese inventato.

risultato:
  - voce: La mezz'ora si vede passare
    dettaglio: Un timer guidato dallo scroll accende le quattro fasi della sessione, da 00:00 a 30:00.
  - voce: Orario scelto in due tocchi
    dettaglio: Giorno e turno da trenta minuti preparano il messaggio di richiesta, con i turni calcolati dagli orari del club.
  - voce: Una domanda per trovare il corso
    dettaglio: Il mini quiz porta direttamente al corso giusto nello scorrimento orizzontale.
  - voce: La prova diventa una tessera
    dettaglio: La Carta Prova si compila mentre si scrive e mostra le date di validità. Il modulo chiede solo nome e telefono.
  - voce: Funziona anche senza animazioni
    dettaglio: Con riduci movimento o senza librerie la pagina resta completa e leggibile, e l'ingresso ha un tempo massimo.
  - voce: Nessun dato reale
    dettaglio: Club e paese inventati, recensioni marcate come dimostrative, contatti simulati, noindex e foto da Unsplash e Pexels con i crediti.

anteprima: lieve-club-femminile/01-home.jpg
schermate:
  - src: lieve-club-femminile/01-home.jpg
    alt: Home con una lezione di gruppo in una sala luminosa e il titolo "Mezz'ora. Tutta tua. Più leggera."
  - src: lieve-club-femminile/02-metodo.jpg
    alt: Sezione del metodo con il timer circolare fermo a 26:15 e le quattro fasi della sessione accanto
  - src: lieve-club-femminile/03-corsi.jpg
    alt: Corsi in scorrimento orizzontale, con la scheda Equilibrio, intensità e cosa portare
  - src: lieve-club-femminile/04-fondatrice.jpg
    alt: Sezione della fondatrice con il ritratto davanti a una parete rosa e una sua frase
  - src: lieve-club-femminile/05-carta-prova.jpg
    alt: La Carta Prova compilata con il nome e le date di validità, accanto al modulo di richiesta
  - src: lieve-club-femminile/06-mobile.jpg
    alt: La home su telefono con il titolo sulla foto e i due pulsanti per la prova e la chat

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - GSAP
  - ScrollTrigger
  - Lenis
  - SVG

inEvidenza: false
ordine: 50

metaTitolo: LIEVE club femminile — sito dimostrativo
metaDescrizione: "Una pagina per un club femminile di fantasia: timer della mezz'ora guidato dallo scroll, corsi in scorrimento e tessera prova che si compila."
---

Il punto di partenza era una sola parola: mezz'ora. Ho cercato di farla diventare
un oggetto della pagina invece di uno slogan, e il timer è venuto da lì. Il resto
del sito prova a togliere peso alla prima volta: chi ti accoglie, cosa portare,
quanto costa provare.
