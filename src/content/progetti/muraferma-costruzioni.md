---
titolo: Muraferma Costruzioni
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un'impresa edile di paese aveva bisogno di una pagina sola, che portasse al telefono o al preventivo senza giri.
riassunto: Home in una pagina per un'impresa edile. Colori presi da persiane e intonaco, quattro servizi, tre cantieri d'esempio e un preventivo con tre campi soltanto.
link: https://gxmich.github.io/muraferma-costruzioni-demo/
codice: https://github.com/GxMich/muraferma-costruzioni-demo

contesto: |
  Muraferma Costruzioni è un'attività di fantasia. Nome, indirizzo a Rocca
  Tessera, telefono, email, orari e cantieri sono inventati. Le foto vengono da
  Unsplash e ognuna porta l'etichetta «Foto dimostrativa».

  Il brief è quello di tante piccole imprese edili: ristrutturazioni di case,
  capannoni per le aziende, facciate e manutenzioni. Chi chiama di solito ha un
  lavoro in mente e vuole un sopralluogo. La pagina ha noindex, il modulo e
  WhatsApp sono simulati.

problema: |
  I siti delle imprese edili spesso sono lunghi e generici: slogan, gallerie
  enormi, un modulo con dieci campi in fondo. Chi cerca un'impresa vuole sapere
  due cose: se fa il lavoro che gli serve e come chiamarla.

  Il telefono è il canale principale, ma molti preferiscono scrivere la sera.
  Il preventivo deve quindi chiedere pochissimo, e il numero deve essere
  visibile sempre, anche su telefono mentre si scorre.

ricerca: |
  Una prima versione partiva dal cartello di cantiere: caratteri condensati,
  fondo color calce e un rosso mattone per i pulsanti. Era coerente, ma parlava
  del cantiere aperto, con il disordine e i divieti che si porta dietro. Chi
  cerca un'impresa pensa alla casa finita.

  La versione pubblicata prende i colori da quello che l'impresa sistema: il
  verde delle persiane e l'ocra dell'intonaco. Il carattere è uno solo, largo
  nei titoli e normale nel testo.

soluzione: |
  L'apertura è divisa in due ante. Da una parte la foto di un cortile con il
  ponteggio, dall'altra il titolo, il pulsante del preventivo, il telefono e
  WhatsApp. Su schermi larghi la foto è verticale, come una finestra.

  I servizi sono quattro righe con foto, titolo e due frasi. Le facciate hanno
  la fascia color intonaco. Segue il metodo in quattro passi, con il preventivo
  scritto prima di iniziare, poi tre cantieri d'esempio e la zona servita.

  Il preventivo chiede solo tipo di lavoro, comune e un recapito. Se manca
  qualcosa, l'errore compare sotto il campo, scritto per esteso. Su telefono una
  barra fissa tiene a portata chiamata, WhatsApp e preventivo.

tecnica: |
  È una sola pagina in HTML e CSS scritti a mano, con poche righe di JavaScript
  per il modulo e per l'avviso di WhatsApp. Colori, caratteri e spaziature sono
  variabili in un file di token: cambiare il verde delle persiane vuol dire
  cambiare una riga.

  Il carattere è Archivo a larghezza variabile, ospitato nel progetto: lo stesso
  file dà titoli larghi e testo normale. Le foto hanno due larghezze e una
  versione verticale per l'apertura su desktop.

risultato:
  - voce: Telefono sempre a portata
    dettaglio: Nell'apertura, nella fascia dei dati, nell'intestazione su desktop e nella barra fissa su telefono.
  - voce: Preventivo con tre campi
    dettaglio: Tipo di lavoro, comune e un recapito. Errori segnalati sotto ogni campo e riepilogo in cima al modulo.
  - voce: Colori presi dal mestiere
    dettaglio: Verde persiana e ocra intonaco al posto dei colori da cartello di cantiere, definiti come token riutilizzabili.
  - voce: Foto dichiarate come dimostrative
    dettaglio: Ogni foto porta un'etichetta visibile e i crediti Unsplash sono nel piede e nel repository.
  - voce: Una pagina, nessuna libreria
    dettaglio: HTML, CSS e poche righe di JavaScript. Si apre anche da disco, senza server.
  - voce: Nessun dato reale
    dettaglio: Attività e paese di fantasia, dominio .example, noindex e WhatsApp simulato.

anteprima: muraferma-costruzioni/01-home.jpg
schermate:
  - src: muraferma-costruzioni/01-home.jpg
    alt: Apertura con il pannello verde scuro, il titolo "Impresa edile a Rocca Tessera" e la foto di un cortile con persiane verdi e un ponteggio
  - src: muraferma-costruzioni/02-servizi.jpg
    alt: Sezione "Cosa facciamo" con le righe Casa e appartamento e Azienda e capannone, ognuna con foto e descrizione
  - src: muraferma-costruzioni/03-lavori.jpg
    alt: Tre cantieri d'esempio con foto etichettate come dimostrative, una facciata, un intonaco interno e un magazzino
  - src: muraferma-costruzioni/04-preventivo.jpg
    alt: Modulo di preventivo con tre campi e i messaggi di errore mostrati sotto ciascun campo
  - src: muraferma-costruzioni/05-mobile.jpg
    alt: La pagina su telefono con la foto in alto, il titolo e i pulsanti per preventivo, chiamata e WhatsApp

tecnologie:
  - HTML
  - CSS
  - JavaScript

inEvidenza: false
ordine: 50

metaTitolo: Muraferma Costruzioni — sito dimostrativo
metaDescrizione: "Home in una pagina per un'impresa edile: colori da persiane e intonaco, telefono sempre visibile e un preventivo con tre campi. Senza librerie."
---

Per un'impresa edile piccola il sito serve soprattutto a far partire una
telefonata. Ho tolto tutto quello che la rallentava e ho tenuto le prove che
servono: i servizi, il metodo e qualche cantiere. Con un'impresa vera le foto
dimostrative andrebbero sostituite con i suoi lavori.
