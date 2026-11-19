---
titolo: Varco Studio
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Uno studio di personal training con due sedi molto diverse e un solo sito per raccontarle.
riassunto: Un sito multipagina per uno studio con una sala grande e una da quattro postazioni, dove la prima scelta è la sede e ogni pagina porta alla prova.
link: https://gxmich.github.io/varco-studio-demo/
codice: https://github.com/GxMich/varco-studio-demo

contesto: |
  Varco Studio non esiste. Lo studio, i paesi di Pianvecchio e Montebrina, gli
  indirizzi, il telefono, i prezzi e le capienze sono inventati. Ho immaginato
  uno studio di personal training con due sedi: una sala grande e attrezzata per
  dodici persone, e una sala piccola con quattro postazioni.

  Tutte le pagine hanno noindex e robots.txt blocca i motori di ricerca. La
  prenotazione della prova è simulata e non invia niente.

problema: |
  Le due sedi hanno prezzi, capienza e carattere diversi. Chi arriva sul sito
  deve capire subito che non sono la stessa palestra in due posti, e scegliere
  quella giusta prima di guardare i prezzi.

  Molti siti con più sedi mettono tutto in un'unica pagina con due indirizzi in
  fondo. I listini si mescolano, e chi legge non sa a quale sede si riferisce il
  prezzo che sta guardando.

ricerca: |
  All'inizio avevo pensato a una pagina unica, lunga, con le due sedi una sotto
  l'altra e un listino comune con una colonna per sede.

  L'ho scartata perché le due sedi non hanno gli stessi piani: una ha il
  mensile, l'altra parte dai tre mesi. In una tabella unica sarebbero comparse
  celle vuote, e il confronto avrebbe dato l'idea di due offerte uguali con
  prezzi diversi. Ho preferito pagine separate, con la scelta della sede sempre a
  portata di mano.

soluzione: |
  La home apre con una foto a tutto schermo e, già nella prima schermata, i due
  nomi delle sedi. Più sotto c'è la scelta vera e propria: due schede con foto,
  carattere della sala («grande e attrezzata», «piccola e tranquilla») e due
  azioni, prenota o scopri lo studio.

  Ogni sede ha la sua pagina con la capienza in grande, una fascia con
  indirizzo e modalità di accesso, la galleria e i suoi piani. La pagina dei
  prezzi tiene i listini separati e ha una piccola navigazione che segue lo
  scroll e indica quale sede si sta guardando.

  I tre format di allenamento stanno in un selettore a schede: si cambia format
  e cambia la foto. Su telefono c'è una barra fissa in basso con il telefono e
  l'azione principale della pagina.

  La pagina contatti chiude con la prenotazione di una prova: sede, giorno,
  fascia oraria e nome. Il form controlla la data e mostra un riepilogo. Nella
  demo niente viene inviato.

tecnica: |
  HTML, CSS e JavaScript nativi, senza dipendenze e senza build: sette pagine
  statiche pubblicate su GitHub Pages direttamente dal ramo main. Tutti i
  percorsi sono relativi, così il sito funziona sia in una sottocartella sia su
  un dominio proprio.

  Il JavaScript fa poche cose: menu a schermo intero con gestione della
  tastiera, selettore dei format, barra mobile che si nasconde quando in pagina
  c'è già la stessa azione, navigazione dei listini con IntersectionObserver,
  validazione della prenotazione. Le animazioni si spengono con
  prefers-reduced-motion.

  Le foto delle sale sono di Unsplash, ritagliate quadrate a due misure. Le
  immagini di allenamento della home e del metodo sono illustrazioni generate
  per il progetto, e il sito lo scrive sotto ogni immagine.

risultato:
  - voce: La sede si sceglie per prima
    dettaglio: I nomi delle due sedi sono nella prima schermata e la scelta con foto e carattere della sala arriva subito dopo.
  - voce: Listini separati per sede
    dettaglio: Ogni sede ha i suoi piani, senza celle vuote. Nella pagina prezzi una navigazione che segue lo scroll indica quale listino si sta leggendo.
  - voce: Capienza in primo piano
    dettaglio: "Dodici persone o quattro: il numero è il titolo visivo della pagina di ogni sede."
  - voce: Prova prenotabile in un minuto
    dettaglio: Sede, giorno, fascia e nome, con controllo della data e riepilogo. Nella demo l'invio è simulato.
  - voce: Nessuna build, nessuna dipendenza
    dettaglio: Pagine statiche con percorsi relativi, pubblicabili ovunque. Su telefono menu a schermo intero e barra d'azione fissa.
  - voce: Nessun dato reale
    dettaglio: Studio e paesi inventati, telefono finto, noindex su tutte le pagine, foto delle sale da Unsplash e immagini illustrative dichiarate.

anteprima: varco-studio/01-home.jpg
schermate:
  - src: varco-studio/01-home.jpg
    alt: Home con la foto di uno stacco con bilanciere e il titolo "Meno rumore. Più lavoro." con i nomi delle due sedi in basso a destra
  - src: varco-studio/02-sedi.jpg
    alt: Scelta della sede con due schede, Pianvecchio grande e attrezzata e Montebrina piccola e tranquilla
  - src: varco-studio/03-sede.jpg
    alt: Pagina della sede di Montebrina con la capienza di quattro persone in grande e la fascia gialla con indirizzo e accesso
  - src: varco-studio/04-format.jpg
    alt: Selettore dei tre format di allenamento con Functional Flow attivo e la foto del format a destra
  - src: varco-studio/05-prezzi.jpg
    alt: Pagina prezzi con i listini separati delle due sedi, tre piani per ciascuna
  - src: varco-studio/06-mobile.jpg
    alt: La home su telefono con il titolo, i collegamenti alle due sedi e il pulsante per scegliere la sede

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - GitHub Pages

inEvidenza: false
ordine: 50

metaTitolo: Varco Studio — sito dimostrativo
metaDescrizione: Sito multipagina per uno studio di personal training di fantasia con due sedi diverse, listini separati e una prova prenotabile in un minuto. Zero build.
---

Il lavoro principale è stato tenere separate due cose che il visitatore tende a
confondere: la sede e il prezzo. Ogni pagina risponde prima alla domanda «dove»,
poi alla domanda «quanto». Il resto, dalla capienza scritta in grande alla prova
gratuita, serve a far arrivare alla prima seduta con meno dubbi possibile.
