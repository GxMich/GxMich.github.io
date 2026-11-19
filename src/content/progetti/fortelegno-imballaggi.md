---
titolo: Fortelegno Imballaggi
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un'azienda di imballaggi in legno che doveva farsi capire da chi spedisce macchinari, non da chi compra bancali a peso.
riassunto: Un sito per un'azienda di imballaggi industriali che parte da cosa deve viaggiare, mostra tutto il ciclo del legno e porta a una richiesta guidata in tre passi.
link: https://gxmich.github.io/fortelegno-imballaggi-demo/
codice: https://github.com/GxMich/fortelegno-imballaggi-demo

contesto: |
  Fortelegno Imballaggi è un'azienda di fantasia. Il nome, il paese di San
  Ferlino, l'indirizzo, il telefono e la storia sono inventati per far
  funzionare la demo. Il settore invece è reale: un'impresa che progetta e
  costruisce bancali, casse e gabbie in legno, imballa macchinari anche nello
  stabilimento del cliente e prepara il legno per l'export.

  Ho usato dati finti apposta. Un sito di prova con i dati di un'azienda vera
  rischia di finire nei risultati di ricerca al posto suo. Qui recapiti e dominio
  sono di esempio e ogni pagina ha noindex.

problema: |
  Chi cerca un fornitore di imballaggi industriali non sa quasi mai che cosa gli
  serve. Sa che cosa deve spedire: una pressa, duecento bancali al mese, un lotto
  di componenti. I siti del settore però partono dal catalogo: bancali, casse,
  film. Il cliente deve tradurre da solo il suo problema in un prodotto.

  C'è poi un secondo ostacolo. Per un preventivo servono misure, peso,
  destinazione, a volte disegni. Un modulo con venti campi obbligatori spaventa
  chi ha solo una foto e un'idea del peso, e quella persona finisce per non
  scrivere.

ricerca: |
  La prima idea era un catalogo classico: una pagina per prodotto, schede
  tecniche, un modulo di contatto unico in fondo. È ordinato e facile da
  aggiornare.

  L'ho scartata perché metteva il lavoro di scelta sulle spalle del visitatore.
  Chi spedisce un macchinario per la prima volta non sa se gli serve una cassa,
  una gabbia o l'imballo in sede. Un catalogo gli chiede proprio la risposta che
  lui sta cercando.

soluzione: |
  La home apre con una domanda: cosa deve viaggiare? Tre risposte portano a tre
  strade diverse, macchinari, merce su bancale e componenti in serie. Le sei
  soluzioni vengono dopo, per chi sa già cosa cerca.

  Ogni pagina soluzione ha la stessa struttura: cosa facciamo, quattro punti,
  tre foto ingrandibili e l'elenco dei dati che servono per l'offerta. Il
  pulsante della pagina apre il modulo con la soluzione già scelta.

  La richiesta è divisa in tre passi: il carico, i recapiti, il riepilogo. Solo
  la descrizione del prodotto è obbligatoria. Misure, peso, quantità e
  destinazione stanno in un pannello facoltativo che si apre solo se serve.

  La pagina dello stabilimento mostra una foto dall'alto con sei punti numerati.
  Passando sopra a un numero compare la descrizione del reparto. Sotto c'è il
  percorso del legno in otto fasi, dal tronco al marchio di trattamento.

tecnica: |
  Il sito è HTML, CSS e JavaScript senza framework. Le pagine si generano da
  sorgenti separati con uno script Python che usa solo la libreria standard:
  intestazione, footer, titoli e dimensioni delle immagini stanno in un posto
  solo. Su GitHub Pages si pubblicano gli HTML già generati.

  Lo script aggiunge da solo larghezza, altezza e srcset a ogni immagine e una
  versione ai file CSS e JS, così il browser non tiene copie vecchie. Un secondo
  script controlla link interni, ancore, testi alternativi e noindex prima della
  pubblicazione.

  Il modulo lavora solo nel browser. Controlla i campi, accetta fino a tre file
  senza caricarli e compone un riepilogo da copiare. Nella demo non parte nulla.

risultato:
  - voce: Si parte da cosa deve viaggiare
    dettaglio: Tre strade in home per macchinari, bancali e componenti in serie, prima dell'elenco delle sei soluzioni.
  - voce: Una richiesta che non spaventa
    dettaglio: Tre passi, un solo campo obbligatorio sul carico e i dati tecnici in un pannello facoltativo.
  - voce: Pagine soluzione tutte uguali nella forma
    dettaglio: Stessa struttura per sei pagine, con l'elenco dei dati utili all'offerta e il modulo già impostato sulla soluzione.
  - voce: Lo stabilimento si visita dall'alto
    dettaglio: Foto aerea con sei reparti numerati e descrizioni accessibili anche da tastiera, più il percorso del legno in otto fasi.
  - voce: Generato da un solo script
    dettaglio: Quindici pagine create da sorgenti comuni con Python standard, più un controllo automatico di link, immagini e meta tag.
  - voce: Nessun dato reale
    dettaglio: Azienda e paese di fantasia, recapiti di esempio, noindex su tutte le pagine e foto Unsplash con i crediti nel repository.

anteprima: fortelegno-imballaggi/01-home.jpg
schermate:
  - src: fortelegno-imballaggi/01-home.jpg
    alt: Apertura con il titolo "Imballi in legno. Pensati sul carico, pronti per partire" e la foto di un operatore al lavoro su una trave sotto una macchina a controllo numerico
  - src: fortelegno-imballaggi/02-soluzioni.jpg
    alt: Sezione "Cosa deve viaggiare?" con tre percorsi per macchinari, merce su bancale e componenti in serie, e l'inizio della sezione "Ogni carico ha la sua forma"
  - src: fortelegno-imballaggi/03-stabilimento.jpg
    alt: Pagina dello stabilimento con la foto aerea del deposito di legname e sei punti numerati che indicano i reparti
  - src: fortelegno-imballaggi/04-richiesta.jpg
    alt: Richiesta guidata in tre passi, con la scelta della soluzione, la descrizione del carico e il pannello dei dati tecnici facoltativi
  - src: fortelegno-imballaggi/05-mobile.jpg
    alt: La home su telefono, con la foto in alto, il titolo su tre righe e il pulsante per richiedere un preventivo

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - Python
  - GitHub Pages

inEvidenza: false
ordine: 50

metaTitolo: Fortelegno Imballaggi — sito dimostrativo
metaDescrizione: Sito per un'azienda di imballaggi industriali in legno che parte da cosa deve viaggiare, con stabilimento esplorabile e richiesta guidata in tre passi.
---

Per un'azienda di imballaggi il sito deve fare il lavoro del commerciale al
primo contatto: capire che cosa deve partire e chiedere solo i dati che servono.
Qui l'ho provato su un'azienda inventata. Con un'azienda vera andrebbero
confermati foto, norme citate e tempi prima di pubblicare.
