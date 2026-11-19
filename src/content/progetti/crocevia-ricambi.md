---
titolo: Crocevia Ricambi
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un magazzino ricambi che lavora con le officine doveva far arrivare le richieste già complete.
riassunto: Sito per un magazzino di ricambi auto che parla alle officine. Ogni pagina porta alla richiesta giusta, e il modulo cambia domande in base a cosa serve.
link: https://gxmich.github.io/crocevia-ricambi-demo/
codice: https://github.com/GxMich/crocevia-ricambi-demo

contesto: |
  Crocevia Ricambi è un'attività di fantasia. Nome, logo, indirizzo a Rocca
  Tessera, telefono ed email sono inventati. Il paese stesso non esiste. Il brief
  però è realistico: un magazzino di ricambi auto che vende soprattutto a
  officine e carrozzerie, consegna in giornata nei paesi vicini e ha un portale
  per gli ordini dei clienti abituali.

  Le pagine hanno noindex, l'email usa un dominio .example e il telefono è una
  fila di zeri. Il modulo, WhatsApp e il portale sono simulati: non parte niente.

problema: |
  Un meccanico che chiama il magazzino ha fretta. Ha l'auto sul ponte e vuole
  sapere se il pezzo c'è e quando arriva. Il magazzino, per rispondere, ha bisogno
  di targa o telaio, del componente e della quantità. Se queste informazioni non
  arrivano nella prima richiesta, serve una seconda telefonata.

  I siti del settore di solito mostrano un catalogo di marchi e un modulo
  generico in fondo. Il catalogo non aiuta, perché il codice giusto dipende dal
  veicolo. Il modulo generico porta richieste a metà.

ricerca: |
  La prima idea era un catalogo con le schede dei singoli ricambi. L'ho scartata
  presto. Per un magazzino così le schede non servono a vendere: l'officina non
  sceglie il pezzo da una foto, chiede il pezzo per quella targa. Un catalogo
  avrebbe promesso una ricerca che il sito non poteva fare, e sarebbe invecchiato
  in fretta.

  Ho tenuto le quattro famiglie (manutenzione, meccanica, carrozzeria,
  accessori) come indice. Ogni famiglia dice cosa si può chiedere e manda alla
  richiesta già impostata su quella famiglia.

soluzione: |
  In apertura ci sono tre ricambi scontornati, numerati come in un esploso:
  filtro olio, disco freno, candela. Accanto, due azioni: chiedere un ricambio o
  diventare cliente. Chi ha già un accesso trova il portale nell'header.

  La richiesta è il centro del sito. Il modulo cambia campi, titolo ed esempi in
  base al tema: per un ricambio chiede targa e codice, per un nuovo cliente il
  comune dell'officina. I link delle altre pagine arrivano con tema e famiglia
  già scelti. Prima dell'invio il visitatore vede un riepilogo da controllare.

  Su telefono una barra con chiamata e richiesta compare solo quando i pulsanti
  in alto sono usciti dallo schermo. Nella pagina contatti non c'è, perché i
  recapiti sono già accanto al modulo.

tecnica: |
  Le undici pagine sono HTML statico generato da uno script Python che usa solo
  la libreria standard. Header, footer, invito al contatto e schede delle
  famiglie sono scritti una volta sola. Stili e comportamenti stanno in un file
  CSS e uno JavaScript, senza framework.

  I font sono nel progetto e le foto hanno varianti in quattro larghezze, così il
  telefono non scarica l'immagine da 2000 pixel. I titoli si compongono lettera
  per lettera con un'animazione che si spegne con «riduci movimento». Il testo
  vero resta leggibile dai lettori di schermo.

risultato:
  - voce: Richieste che arrivano complete
    dettaglio: Il modulo chiede targa, codice e quantità quando servono, e il comune dell'officina quando si parla di consegne o di nuovi clienti.
  - voce: Ogni pagina porta alla richiesta giusta
    dettaglio: I pulsanti delle famiglie e dei servizi aprono il modulo con tema e famiglia già scelti.
  - voce: Riepilogo prima dell'invio
    dettaglio: Il visitatore rilegge i dati in una tabella e può tornare a modificarli. Nella demo WhatsApp ed email mostrano solo un avviso.
  - voce: Barra rapida su telefono
    dettaglio: Chiamata e richiesta restano a portata di pollice, ma compaiono solo dopo che le azioni principali sono uscite dallo schermo.
  - voce: Undici pagine da un solo generatore
    dettaglio: Uno script Python senza dipendenze produce tutte le pagine. Il sito pubblicato è statico e non carica librerie esterne.
  - voce: Nessun dato reale
    dettaglio: Attività e paese di fantasia, dominio .example, noindex su ogni pagina e foto Unsplash elencate nei crediti.

anteprima: crocevia-ricambi/01-home.jpg
schermate:
  - src: crocevia-ricambi/01-home.jpg
    alt: Home su fondo scuro con il titolo "Il ricambio giusto. L'officina riparte." e, a destra, filtro olio, disco freno e candela scontornati con etichette numerate
  - src: crocevia-ricambi/02-famiglie.jpg
    alt: Le quattro famiglie di ricambi, manutenzione, meccanica, carrozzeria e accessori, ognuna con foto, descrizione breve e link
  - src: crocevia-ricambi/03-processo.jpg
    alt: Sezione chiara con un meccanico al lavoro sul motore e i tre passaggi per chiedere un ricambio, dalla targa al codice
  - src: crocevia-ricambi/04-richiesta.jpg
    alt: Pagina contatti con il riepilogo della richiesta pronto, i dati del veicolo in tabella e i pulsanti WhatsApp ed email simulati
  - src: crocevia-ricambi/05-famiglia.jpg
    alt: Pagina della famiglia Manutenzione con il filtro olio scontornato e l'elenco delle tipologie che si possono richiedere
  - src: crocevia-ricambi/06-mobile.jpg
    alt: La home su telefono, con titolo, pulsanti a tutta larghezza e i ricambi numerati sotto il testo

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - Python
  - JSON-LD

inEvidenza: false
ordine: 50

metaTitolo: Crocevia Ricambi — sito dimostrativo
metaDescrizione: Sito per un magazzino ricambi che lavora con le officine. Richiesta guidata che cambia in base al tema, riepilogo prima dell'invio, undici pagine statiche.
---

Il lavoro vero di questo sito sta nel modulo. Le foto e le animazioni portano
l'officina fino alla richiesta, ma è la richiesta a far risparmiare la seconda
telefonata. Con un magazzino vero andrebbe collegata a un recapito reale e
verificata con chi risponde al banco.
