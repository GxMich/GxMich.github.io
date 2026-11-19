---
titolo: La Gruccia Rosa
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un negozio di abbigliamento di quartiere che non può vendere online, ma vuole che le clienti arrivino già sapendo cosa provare.
riassunto: Il sito di un negozio di abiti da donna con un camerino da prenotare online, lo stato di apertura in tempo reale e WhatsApp come unico canale di contatto.
link: https://gxmich.github.io/la-gruccia-rosa-demo/
codice: https://github.com/GxMich/la-gruccia-rosa-demo

contesto: |
  La Gruccia Rosa è un negozio che non esiste. Il nome, l'indirizzo a
  Tessaglio, il telefono, l'email, la titolare, gli incontri, gli articoli e
  le recensioni sono inventati. Anche Tessaglio è un paese di fantasia. Le foto
  vengono da Unsplash.

  Il caso invece è comune: un negozio di abiti da donna con una titolare che
  conosce le clienti per nome, pochi capi per modello e nessuna voglia di
  gestire un e-commerce. Tutte le pagine hanno il noindex e robots.txt è
  chiuso.

problema: |
  Un negozio così perde clienti in due modi. Chi vede un capo sui social non
  sa se c'è la sua taglia, e non scrive. Chi entra senza un'idea guarda gli
  stender per dieci minuti e se ne va.

  Un e-commerce non risolve. Le taglie cambiano ogni settimana, i capi sono
  pochi e la titolare non ha tempo per spedizioni e resi. Serve un sito che
  porti in negozio, non uno che lo sostituisca.

ricerca: |
  La prima idea era un catalogo con il pulsante «chiedi su WhatsApp» sotto
  ogni capo. È la soluzione più diffusa tra i negozi di quartiere.

  L'ho scartata perché sposta il lavoro sulla cliente. Per chiedere tre capi
  deve mandare tre messaggi, e il negozio riceve richieste sparse senza un
  giorno di visita. Ho preferito raccogliere tutto in una lista sola, con il
  giorno e la fascia oraria già scelti.

soluzione: |
  Il centro del sito è il camerino. Dalla collezione o dalla scheda di un capo
  si aggiunge il capo con la taglia. Poi si apre il camerino, si sceglie il
  giorno tra i prossimi giorni di apertura, la mattina o il pomeriggio, si
  scrive il nome e si manda la lista. Il negozio riceve un messaggio solo, già
  ordinato.

  L'header dice se il negozio è aperto in quel momento. La stessa informazione
  torna in home, in fondo, dove scorrendo una cornice rosa si apre
  sull'interno del negozio, e nella pagina con gli orari.

  Per chi non può passare ci sono la videochiamata, le foto su WhatsApp e un
  modulo di prenotazione che compone il messaggio con nome, servizio, giorno e
  taglia. Nella demo nessun messaggio parte: una finestra mostra il testo che
  arriverebbe al negozio.

tecnica: |
  Next.js con export statico, quindi solo file HTML, CSS e JavaScript su
  GitHub Pages, pubblicati da GitHub Actions. Tutti i testi, i capi e gli
  orari stanno in un file solo, content.ts: header, pagine e dati strutturati
  leggono da lì.

  Il camerino è uno stato React salvato nella memoria locale del browser,
  quindi resta anche se si chiude la pagina. I giorni proposti sono calcolati
  dagli orari di apertura, e lo stato «aperto ora» usa l'ora di Roma qualunque
  sia il fuso del visitatore.

  L'export statico di Next 16 salva i file di prefetch con un nome diverso da
  quello che il client chiede, e su un hosting statico finiscono in 404. Uno
  script dopo la build crea le copie con il nome giusto. L'animazione
  d'ingresso usa GSAP ScrollTrigger e si spegne con prefers-reduced-motion.

risultato:
  - voce: Un camerino da prenotare
    dettaglio: La cliente raccoglie i capi con la taglia, sceglie giorno e fascia oraria e manda una lista sola. Il negozio la trova già ordinata.
  - voce: Aperto o chiuso, in tempo reale
    dettaglio: L'header, la home e la pagina degli orari dicono se il negozio è aperto adesso e quando riapre, con l'ora di Roma.
  - voce: Una pagina per ogni capo
    dettaglio: Undici capi in cinque categorie, con filtri nella collezione e una scheda con dettagli, taglia e richiesta di videochiamata.
  - voce: Contatti senza modulo email
    dettaglio: Prenotazione, camerino e domande compongono il messaggio da soli. Nella demo il testo viene mostrato e non inviato.
  - voce: Contenuti in un file solo
    dettaglio: Capi, servizi, orari, articoli e domande frequenti stanno in content.ts. Per aggiungere un capo basta una foto e un oggetto in più.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Negozio e paese di fantasia, dominio .example, noindex su tutte le pagine, mappa illustrata al posto di Google Maps e recensioni marcate come dimostrative.

anteprima: la-gruccia-rosa/01-home.jpg
schermate:
  - src: la-gruccia-rosa/01-home.jpg
    alt: Home con il titolo "Scegli online, prova con calma" e la foto di uno stender di camicie chiare dentro una cornice rosa
  - src: la-gruccia-rosa/02-collezione.jpg
    alt: Pagina della collezione con i filtri per categoria e le schede dei capi, ognuna con il pulsante per aggiungerla al camerino
  - src: la-gruccia-rosa/03-capo.jpg
    alt: Scheda di un completo verde salvia, con foto in cornice rosa, descrizione, dettagli e scelta della taglia
  - src: la-gruccia-rosa/04-camerino.jpg
    alt: Il camerino aperto sul lato destro, con tre capi e le taglie, i prossimi giorni di apertura e la fascia del pomeriggio selezionata
  - src: la-gruccia-rosa/05-camerino-come-funziona.jpg
    alt: Sezione della home che spiega il camerino in tre passi numerati, con i pulsanti per la collezione e per aprire il camerino
  - src: la-gruccia-rosa/06-mobile.jpg
    alt: La home su telefono, con il logo, il contatore del camerino, la foto in cornice e il titolo
tecnologie:
  - Next.js
  - React
  - TypeScript
  - GSAP
  - CSS
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: La Gruccia Rosa — sito dimostrativo per un negozio di abiti
metaDescrizione: Sito di un negozio di abiti da donna con camerino da prenotare online, apertura in tempo reale e richieste pronte per WhatsApp. Dati di fantasia.
---

Il sito non prova a vendere al posto del negozio. Fa arrivare la cliente con
le idee chiare e il negozio con i capi già pronti, che per un negozio piccolo
è il modo più semplice di non perdere una vendita fra lo stender e la porta.
