---
titolo: Dimora Ocra
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un bed & breakfast di tre camere che doveva farsi scegliere dalle foto, non dalle stelle.
riassunto: Il sito di un piccolo B&B in un palazzo d'epoca, in una pagina sola, con la richiesta di disponibilità che si scrive da sola.
link: https://gxmich.github.io/dimora-ocra-demo/
codice: https://github.com/GxMich/dimora-ocra-demo

contesto: |
  Dimora Ocra è un bed & breakfast che non esiste. Il nome, l'indirizzo a
  Tessaglio, il telefono, l'email, il voto e le recensioni sono inventati.
  Anche Tessaglio è un paese di fantasia. Le foto delle camere vengono da
  Unsplash.

  Il caso però è comune: tre camere al primo piano di un palazzo vecchio, una
  persona che gestisce tutto, ospiti che arrivano in treno o con il cane. Ho
  tenuto il sito anonimo e ogni pagina ha il noindex, così non diventa una
  scheda fantasma nelle ricerche locali.

problema: |
  Una struttura così piccola vive sui portali di prenotazione. Lì è una riga in
  mezzo a cento altre, con la stessa foto quadrata e un voto. Quello che la
  rende diversa, cioè la casa, si vede poco.

  Il secondo problema è il contatto. L'ospite vuole sapere una cosa sola: se ci
  sono camere libere in quelle date. Un modulo generico con nome, email e
  messaggio lo costringe a scrivere tutto da capo, e spesso lascia perdere.

ricerca: |
  La prima idea era il template classico da hotel: slider in alto, griglia di
  icone dei servizi, un calendario di prenotazione con prezzi per notte.

  L'ho scartata. Per tre camere un motore di prenotazione è sproporzionato e va
  tenuto allineato con i portali, altrimenti si vendono notti già occupate. E
  lo slider mostrava le foto tutte uguali, una dopo l'altra, senza un ordine.
  Ho preferito raccontare la casa nell'ordine in cui la scopre l'ospite, e
  lasciare la conferma a una persona.

soluzione: |
  La pagina si apre con una foto chiusa in una finestra ad arco. Scorrendo,
  l'arco si allarga fino a riempire lo schermo e compare il nome. È il gesto di
  entrare in una stanza.

  Subito dopo c'è il percorso in tre tappe: la via alberata, la scala in marmo,
  la camera. Poi le camere in uno scorrimento orizzontale, con le frecce su
  computer e lo swipe su telefono. Una camera è solo testo, perché è quella al
  piano terra senza gradini e conta più la descrizione della foto.

  Gli animali hanno una sezione tutta loro, perché per molti ospiti è la prima
  domanda. In fondo la richiesta: arrivo, partenza, ospiti, animale sì o no. Il
  sito controlla le date e compone il messaggio. In un sito vero si aprirebbe
  su WhatsApp o nell'email. Nella demo lo mostro a schermo e non parte niente.

  Su telefono c'è una barra fissa in basso con messaggio e chiamata.

tecnica: |
  HTML, CSS e JavaScript senza framework e senza build. Il sito si carica su
  qualsiasi hosting e si apre anche dal disco.

  L'arco della hero non usa librerie. Uno script misura la posizione dello
  spazio riservato alla foto e, a ogni frame di scorrimento, interpola
  posizione, dimensioni e raggio degli angoli fino allo schermo intero. Con
  prefers-reduced-motion l'animazione è spenta e la foto resta ferma.

  Italiano e inglese stanno nella stessa pagina. I testi italiani sono
  nell'HTML, quelli inglesi in un dizionario nello script, e la lingua scelta
  resta salvata nel browser. I dati strutturati JSON-LD sono di tipo
  BedAndBreakfast, compilati con i dati finti.

risultato:
  - voce: Una hero che si apre scorrendo
    dettaglio: La foto parte dentro un arco e si allarga a tutto schermo, senza librerie. Con le animazioni ridotte resta ferma.
  - voce: La casa raccontata in ordine
    dettaglio: Via, scala, camera. L'ospite vede la strada che farà prima ancora di vedere il letto.
  - voce: Richiesta di disponibilità già scritta
    dettaglio: Date, ospiti e animale diventano un messaggio pronto. Il modulo segnala date mancanti o partenza prima dell'arrivo.
  - voce: Due lingue con un tocco
    dettaglio: Italiano e inglese senza ricaricare la pagina, compresi i testi per i lettori di schermo. La scelta resta salvata.
  - voce: Pensato per il telefono
    dettaglio: Barra fissa con messaggio e chiamata, camere scorrevoli con il dito, hero che si adatta all'altezza dello schermo.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Attività e paese di fantasia, dominio .example, noindex, robots.txt chiuso, mappa illustrata al posto di Google Maps e recensioni marcate come dimostrative.

anteprima: dimora-ocra/01-home.jpg
schermate:
  - src: dimora-ocra/01-home.jpg
    alt: Hero color sabbia con il titolo "Pareti ocra e letti in ferro" e, a destra, la foto di una camera dentro una finestra ad arco
  - src: dimora-ocra/02-hero-aperta.jpg
    alt: La stessa hero dopo lo scorrimento, con la foto della camera a tutto schermo e il nome Dimora Ocra in corsivo
  - src: dimora-ocra/03-percorso.jpg
    alt: Il percorso in tre tappe, con le foto della via alberata, della scala in marmo con ringhiera in ferro e della camera
  - src: dimora-ocra/04-camere.jpg
    alt: Le camere in uno scorrimento orizzontale con le frecce, la camera ocra e la camera sul cortile
  - src: dimora-ocra/05-prenota.jpg
    alt: Sezione di richiesta su fondo bordeaux, con date compilate e il messaggio di prova composto dal sito
  - src: dimora-ocra/06-mobile.jpg
    alt: La home su telefono, con la foto ad arco in alto e la barra fissa con WhatsApp e Chiama

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - JSON-LD
  - localStorage

inEvidenza: false
ordine: 50

metaTitolo: Dimora Ocra — sito dimostrativo per un bed & breakfast
metaDescrizione: Sito di una pagina per un B&B di tre camere, con hero ad arco che si apre scorrendo, due lingue e richiesta di disponibilità già scritta. Dati di fantasia.
---

Per un B&B piccolo il sito non deve vendere notti. Deve far venire voglia di
scrivere, e poi rendere facile farlo. Tutto il resto della pagina serve a
portare l'ospite fino al modulo con una domanda precisa in testa: se ci sono
camere libere in quelle date.
