---
titolo: Studio Penombra
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Uno studio fotografico di ritratti al buio che online sembrava uguale a tutti gli altri.
riassunto: Il sito di uno studio fotografico dove la prima cosa che si fa è muovere una luce, e la prenotazione si prepara in un minuto.
link: https://gxmich.github.io/studio-penombra-demo/
codice: https://github.com/GxMich/studio-penombra-demo

contesto: |
  Studio Penombra non esiste. È uno studio fotografico inventato a Roverasca,
  un paese piemontese di fantasia. La fotografa «Elena», l'indirizzo, il
  telefono, i prezzi e le recensioni sono inventati, e le recensioni lo dicono
  sotto ogni citazione.

  Il tipo di attività invece è comune: uno studio piccolo che fa neonati,
  future mamme, bambini, famiglie, animali, matrimoni e anche fototessere.
  Il tratto distintivo è la luce, una sola, su fondo nero. Le foto vengono da
  Unsplash e tutte le pagine hanno noindex.

problema: |
  Gli studi fotografici di provincia hanno quasi sempre lo stesso sito: una
  galleria a griglia, un elenco di servizi, un modulo di contatto. Se lo stile
  dello studio è la luce, una griglia di miniature non lo fa vedere.

  C'è poi un pubblico misto. Chi aspetta un bambino legge tutto con calma. Chi
  ha bisogno di una fototessera vuole solo sapere quanto costa e quando passare.
  Gli sposi vogliono sapere se la data è libera.

ricerca: |
  La prima idea era una galleria a tutto schermo con le foto migliori, una
  dopo l'altra. Bella da guardare, ma non diceva cosa fa lo studio né come
  prenotare. Dopo dieci foto il visitatore non sapeva ancora se lo studio
  fotografa anche i cani.

  Ho scartato anche il modulo di contatto classico. Per una sessione con un
  neonato servono pochi dati, ma quelli giusti: tipo di servizio, giorno,
  mattina o pomeriggio. Un campo di testo libero li lascia fuori.

soluzione: |
  L'apertura è nera, con un ritratto quasi spento. Sul computer un cerchio di
  luce calda segue il puntatore e accende la foto dove passa. È lo stile dello
  studio spiegato senza parole. Su telefono la luce resta ferma.

  Le sette sessioni scorrono in orizzontale, ognuna con una foto, due righe e
  il pulsante per prenotarla. Sul computer basta scorrere la pagina; su
  telefono si scorre col dito. Frecce e tastiera funzionano sempre.

  Ogni pulsante «Prenota» porta al modulo con il servizio già scelto. Il
  modulo chiede servizio, giorno, fascia oraria e una nota, e scrive il
  messaggio mentre lo compili. Se scegli «Matrimonio» la data diventa «Data
  delle nozze» e il testo chiede un preventivo. Nella demo il pulsante finale
  non invia niente e lo dice.

tecnica: |
  HTML, CSS e JavaScript senza build. GSAP e ScrollTrigger gestiscono le
  animazioni, Lenis lo scorrimento morbido. La luce dell'apertura è una
  seconda copia della foto con una maschera radiale che si sposta con il
  puntatore.

  La galleria orizzontale si blocca sullo schermo solo se c'è spazio: l'altezza
  delle foto viene calcolata togliendo dalla finestra header, comandi e testo
  reale delle schede. Su touch, finestre basse o con movimento ridotto la
  galleria torna allo scorrimento nativo. Se GSAP non carica, contenuti e
  galleria restano usabili.

risultato:
  - voce: La luce dello studio si vede subito
    dettaglio: Sul computer un cerchio di luce segue il puntatore sul ritratto in apertura. Su touch e con movimento ridotto la luce resta fissa.
  - voce: Sette sessioni in una galleria orizzontale
    dettaglio: Scorrimento della pagina, frecce, tastiera e contatore restano sincronizzati, fino all'ultima scheda.
  - voce: Prenotazione con il servizio già scelto
    dettaglio: Ogni scheda porta al modulo con la sessione selezionata. Il messaggio si compone mentre si compila e le date passate non sono accettate.
  - voce: Fototessere in evidenza
    dettaglio: Prezzo in grande, documenti accettati e uno schema della foto a norma che si disegna quando entra nello schermo.
  - voce: Matrimoni con contatori e recensioni dimostrative
    dettaglio: Numeri animati, cosa comprende il servizio e tre recensioni marcate come inventate.

anteprima: studio-penombra/01-home.jpg
schermate:
  - src: studio-penombra/01-home.jpg
    alt: Apertura nera con un ritratto di donna in penombra e il titolo "Ritratti che escono dal buio"
  - src: studio-penombra/02-sessioni.jpg
    alt: Galleria orizzontale delle sessioni con le schede Neonati, Premaman, Bambini e Famiglie
  - src: studio-penombra/03-studio.jpg
    alt: Sezione su fondo nero con il testo sulla fotografa e un ritratto in bianco e nero con una lama di luce
  - src: studio-penombra/04-matrimoni.jpg
    alt: Sezione matrimoni con i numeri del servizio, l'elenco di cosa comprende e la foto di due sposi in riva al mare
  - src: studio-penombra/05-prenota.jpg
    alt: Modulo di prenotazione su fondo nero con i servizi a pulsanti, giorno, fascia oraria e l'anteprima del messaggio
  - src: studio-penombra/06-mobile.jpg
    alt: L'apertura su telefono, con il ritratto in alto e i pulsanti per prenotare e per le fototessere

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - GSAP
  - ScrollTrigger
  - Lenis

inEvidenza: false
ordine: 50

metaTitolo: Studio Penombra — sito dimostrativo
metaDescrizione: Sito per uno studio fotografico di fantasia con una luce che segue il puntatore, galleria orizzontale delle sessioni e prenotazione simulata.
---

Uno studio che fotografa con una luce sola ha bisogno di un sito che
faccia vedere quella luce prima di spiegarla. Il resto della pagina è più
pratico: sette sessioni, un prezzo per le fototessere e un modulo che
scrive il messaggio al posto tuo.
