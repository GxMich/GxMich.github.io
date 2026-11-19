---
titolo: Filo a Piombo Costruzioni
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un'impresa edile che doveva far capire un lavoro che, finito, resta nascosto sotto l'intonaco.
riassunto: Il sito di un'impresa edile che mostra il cappotto termico strato per strato e la stessa facciata prima e dopo, con una richiesta di sopralluogo in quattro passaggi.
link: https://gxmich.github.io/filo-a-piombo-costruzioni-demo/
codice: https://github.com/GxMich/filo-a-piombo-costruzioni-demo

contesto: |
  Filo a Piombo Costruzioni è un'impresa edile di fantasia. Il nome, la sede a
  Montebrina, il telefono, l'email e gli orari sono inventati. Il dominio è
  .example e tutte le pagine hanno noindex, così un'attività che non esiste non
  finisce nelle ricerche locali.

  Il brief invece è realistico: una piccola impresa che fa cappotto termico,
  ristrutturazioni, costruzioni e facciate, lavora per privati e vuole ricevere
  richieste di sopralluogo invece di telefonate generiche.

problema: |
  Chi deve isolare casa non sa cosa sta comprando. Il cappotto, a lavoro finito,
  è una facciata tinteggiata. I sei strati che lo fanno funzionare non si vedono
  più, e il preventivo sembra caro proprio per questo.

  Il secondo problema è la richiesta di contatto. Un modulo generico con nome,
  email e messaggio produce richieste vaghe. L'impresa deve poi richiamare per
  sapere che lavoro serve, dove e su che tipo di immobile.

ricerca: |
  La prima idea era una home con una grande foto di cantiere e una griglia di
  card per i servizi, ciascuna con icona e due righe di testo. È lo schema di
  quasi tutti i siti di imprese edili.

  L'ho scartata perché trattava il cappotto come un servizio fra gli altri. Una
  card con scritto "cappotto termico" non spiega niente a chi non sa cos'è. Ho
  provato anche una versione con un lungo testo tecnico sugli strati, ma nessuno
  legge sei paragrafi su collanti e rasanti. Serviva un disegno.

soluzione: |
  Il cappotto ha due sezioni dedicate. Nella prima c'è un confronto a cursore fra
  la stessa facciata prima e dopo i lavori. Si trascina la linea, oppure si
  usano i pulsanti "Solo prima" e "Solo dopo".

  Nella seconda la parete è disegnata in assonometria, con i sei strati
  separati: muratura, collante, pannello, tasselli, rasatura armata e finitura.
  Scorrendo la pagina gli strati si allontanano. Toccando uno strato, o la sua
  voce nell'elenco, compare la spiegazione in due righe.

  I servizi sono un elenco a fisarmonica con una foto grande accanto, che cambia
  quando si apre una voce. Ogni servizio dice cosa comprende in quattro punti.

  La richiesta di sopralluogo è divisa in quattro passaggi: tipo di lavoro, tipo
  di immobile e comune, dettagli facoltativi, anteprima del messaggio. Alla fine
  il testo è già scritto e pronto da mandare. Nella demo i pulsanti WhatsApp e
  SMS mostrano solo un avviso e non inviano niente.

tecnica: |
  React e Vite, ma la pagina arriva già renderizzata: uno script al build
  inserisce l'HTML generato e il CSS in linea. Il sito si legge anche senza
  JavaScript, e React poi aggiunge le parti interattive.

  Lo spaccato del cappotto è un SVG calcolato nel codice. Ogni strato è un
  parallelepipedo con le sue coordinate isometriche, e GSAP aggiorna solo la
  distanza fra gli strati mentre si scorre. Con prefers-reduced-motion le
  animazioni si spengono e il disegno resta fermo e leggibile.

  Lo stato "aperto ora" o "chiuso, riapre alle 8" si calcola nel browser con
  l'ora di Roma. Nell'HTML pre-generato compaiono gli orari fissi, così la
  pagina non mostra un dato sbagliato prima che parta JavaScript. Il sito non ha
  backend, cookie o tracker ed è pubblicato su GitHub Pages con GitHub Actions.

risultato:
  - voce: Il cappotto spiegato con un disegno
    dettaglio: Sei strati in assonometria che si separano durante lo scroll, ognuno con la sua spiegazione breve.
  - voce: Prima e dopo sulla stessa facciata
    dettaglio: Confronto a cursore utilizzabile con mouse, dito e tastiera, più due pulsanti per vedere solo una delle due versioni.
  - voce: Richieste di sopralluogo già complete
    dettaglio: Quattro passaggi guidati producono un messaggio con lavoro, immobile, comune e dettagli. Nella demo l'invio è simulato.
  - voce: Orari che si aggiornano da soli
    dettaglio: Il sito dice se l'ufficio è aperto e quando riapre, partendo dalla tabella degli orari.
  - voce: Leggibile anche senza JavaScript
    dettaglio: HTML pre-generato al build e CSS in linea. Le animazioni rispettano prefers-reduced-motion.
  - voce: Dati inventati, dichiarati
    dettaglio: Avviso nel footer di ogni pagina, dominio .example, noindex e robots.txt che blocca i motori di ricerca.

anteprima: filo-a-piombo-costruzioni/01-home.jpg
schermate:
  - src: filo-a-piombo-costruzioni/01-home.jpg
    alt: Apertura con il titolo "Muri dritti, case che durano" su fondo grafite, a destra la foto di una casa con facciata color sabbia e persiane verdi
  - src: filo-a-piombo-costruzioni/02-servizi.jpg
    alt: Sezione servizi con una grande foto di due operai che posano pannelli isolanti e, accanto, l'elenco a fisarmonica con la voce Cappotto termico aperta
  - src: filo-a-piombo-costruzioni/03-prima-dopo.jpg
    alt: Confronto a cursore fra la stessa facciata con l'intonaco rovinato e dopo i lavori, con tre brevi vantaggi del cappotto sulla destra
  - src: filo-a-piombo-costruzioni/04-cappotto.jpg
    alt: Spaccato in assonometria dei sei strati del cappotto, dalla muratura in mattoni alla finitura color sabbia, con l'elenco numerato degli strati
  - src: filo-a-piombo-costruzioni/05-richiesta.jpg
    alt: Richiesta di sopralluogo all'ultimo passaggio, con l'anteprima del messaggio già composto e i pulsanti WhatsApp, SMS e copia testo
  - src: filo-a-piombo-costruzioni/06-mobile.jpg
    alt: La stessa apertura su telefono, con la barra fissa in basso per chiamare o richiedere un sopralluogo

tecnologie:
  - React
  - Vite
  - GSAP
  - SVG
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: Filo a Piombo Costruzioni — sito dimostrativo
metaDescrizione: Sito di un'impresa edile di fantasia con il cappotto termico disegnato strato per strato, un confronto prima e dopo e la richiesta di sopralluogo guidata.
---

Il cappotto termico è un lavoro che, finito, non si vede più. Per questo il sito
ci dedica due sezioni intere: una mostra il risultato sulla facciata, l'altra
apre la parete e fa vedere cosa c'è sotto. Il resto della pagina serve a
trasformare la curiosità in una richiesta di sopralluogo già chiara.
