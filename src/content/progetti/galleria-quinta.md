---
titolo: Galleria Quinta
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un negozio di provincia che vende moda, oggetti per la casa e arte, e non voleva sembrare un e-commerce.
riassunto: Il sito di un concept store impaginato come una rivista, con una selezione filtrabile e i laboratori al posto dei loghi dei marchi.
link: https://gxmich.github.io/galleria-quinta-demo/
codice: https://github.com/GxMich/galleria-quinta-demo

contesto: |
  Galleria Quinta è un negozio che non esiste. Il nome, l'indirizzo a
  Tessaglio, il telefono, l'email, i prezzi, i laboratori e la fondatrice
  citata sono inventati. Anche Tessaglio è un paese di fantasia. Le foto
  vengono da Unsplash e non ritraggono un negozio vero.

  Il tipo di attività invece è reale e diffuso: un negozio cresciuto negli
  anni, che accanto all'abbigliamento ha aggiunto ceramiche, piccoli arredi e
  una parete per gli artisti. La pagina ha il noindex e robots.txt è chiuso.

problema: |
  Un negozio così vende tre cose diverse a persone diverse. Chi cerca un
  cappotto non guarda i vasi, chi viene per la mostra non pensa ai vestiti. Ma
  il motivo per entrare è proprio vederle insieme.

  Il secondo problema è il catalogo. Un negozio fisico con pezzi singoli e
  poche taglie non può tenere aggiornato un e-commerce, e un sito che sembra un
  e-commerce promette una cosa che poi non mantiene.

ricerca: |
  La prima strada era quella dei negozi multimarca: griglia di prodotti in
  home, menu per categorie e una fila di loghi dei marchi trattati.

  L'ho scartata per due motivi. La griglia mette tutto sullo stesso piano e
  la parte design e arte finisce in fondo, come un'aggiunta. E i loghi dei
  marchi dicono cosa vendi ma non perché dovrei venire da te: sono gli stessi
  di altri cento negozi.

soluzione: |
  La home è divisa in nove capitoli numerati, come le sezioni di una rivista:
  apertura, il punto di vista del negozio, moda, appena arrivati, laboratori,
  design, arte, storia, visita. Ogni capitolo ha il suo fondo e il suo
  impaginato, quindi scorrendo si capisce quando si passa da un mondo
  all'altro.

  La selezione mostra solo quattro capi con prezzo e laboratorio, con i filtri
  per nuovi arrivi, donna e accessori. Ogni scheda rimanda alla visita in
  negozio, perché il negozio vende lì e non online.

  Al posto dei loghi c'è l'elenco dei laboratori che fanno i pezzi. In fondo
  ci sono orari, telefono e WhatsApp. Su telefono una barra fissa li tiene
  sempre a portata. Nella demo WhatsApp e newsletter sono simulati: mostrano un
  avviso e non inviano niente.

tecnica: |
  React e TypeScript con Vite. Il sito è una pagina sola e statica, compilata
  da GitHub Actions e pubblicata su GitHub Pages con il percorso base del
  repository.

  Lo stile è CSS scritto a mano, con variabili per i colori e clamp() per le
  dimensioni dei titoli, così l'impaginato si adatta senza molti breakpoint.
  Tailwind serve solo per il reset di base. Il filtro della selezione è uno
  stato React. Le transizioni si spengono con prefers-reduced-motion.

risultato:
  - voce: Tre mondi in una pagina sola
    dettaglio: Moda, design e arte hanno ciascuno un capitolo con un fondo e un impaginato propri, invece di finire in una griglia unica.
  - voce: Una selezione che non finge di essere un negozio online
    dettaglio: Quattro capi con prezzo e laboratorio, filtrabili. Ogni scheda porta alla visita in negozio.
  - voce: I laboratori al posto dei loghi
    dettaglio: Un elenco con i nomi di chi fa i pezzi, che racconta il negozio meglio di una fila di marchi.
  - voce: Pensato per il telefono
    dettaglio: Menu a tutto schermo, titoli che si ridimensionano da soli e una barra fissa con orari, WhatsApp e chiamata.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Negozio e paese di fantasia, dominio .example, noindex, robots.txt chiuso, contatti simulati e foto Unsplash con i crediti nel repository.

anteprima: galleria-quinta/01-home.jpg
schermate:
  - src: galleria-quinta/01-home.jpg
    alt: Apertura a tutto schermo con l'interno di un negozio in mattoni, e il titolo "Moda. Design. Arte." in grande a sinistra
  - src: galleria-quinta/02-moda.jpg
    alt: Capitolo moda, con il ritratto di una donna in giacca color crema a sinistra e il testo su fondo bordeaux a destra
  - src: galleria-quinta/03-selezione.jpg
    alt: Selezione "Appena arrivati" con i filtri e quattro capi, ciascuno con laboratorio e prezzo
  - src: galleria-quinta/04-design.jpg
    alt: Capitolo design su fondo nero, con una fila di vasi in ceramica e la foto di una sedia appoggiata di sbieco
  - src: galleria-quinta/05-visita.jpg
    alt: Sezione visita con la foto di un angolo del negozio, orari, telefono, email e i pulsanti per chiamare e scrivere
  - src: galleria-quinta/06-mobile.jpg
    alt: La home su telefono, con il titolo grande sopra la foto e la barra fissa in basso con orari, WhatsApp e chiama

tecnologie:
  - React
  - TypeScript
  - Vite
  - CSS
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: Galleria Quinta — sito dimostrativo per un concept store
metaDescrizione: Sito di una pagina per un negozio di moda, design e arte, impaginato in nove capitoli, con selezione filtrabile e contatti a portata su telefono. Dati di fantasia.
---

Per un negozio che vende cose diverse la difficoltà è tenerle insieme senza
confonderle. Qui l'ho fatto con l'impaginato: ogni mondo ha il suo capitolo,
e il filo che li lega è la visita in negozio, che resta l'unico posto dove si
compra.
