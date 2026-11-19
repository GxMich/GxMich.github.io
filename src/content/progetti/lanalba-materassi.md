---
titolo: Lanalba Materassi
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Uno showroom di materassi che doveva vendere online senza vendere online.
riassunto: "Il sito di un negozio di materassi costruito come un e-commerce, con prezzi per misura e filtri, ma con un solo obiettivo finale: far prenotare una prova in negozio."
link: https://gxmich.github.io/lanalba-materassi-demo/
codice: https://github.com/GxMich/lanalba-materassi-demo

contesto: |
  Lanalba Materassi è un negozio di fantasia a Montebrina. Il nome, l'indirizzo,
  i recapiti, i marchi, i 31 prodotti, i prezzi, le promozioni e le recensioni
  sono inventati. Le pagine hanno noindex e il dominio è .example.

  Il caso invece è comune: uno showroom di provincia con molti modelli esposti,
  materassi, reti, guanciali, letti e poltrone relax. Il cliente arriva dal
  telefono, confronta i prezzi online e poi decide se vale la pena uscire di casa.

problema: |
  Un materasso si sceglie sdraiandosi, ma la ricerca parte dallo schermo. Se il
  sito del negozio non dice quanto costa un modello, il cliente va a guardare i
  siti che vendono online e spesso non torna.

  Il negozio però non vuole spedire materassi. Vuole che la persona entri, provi
  due o tre modelli e compri con la consegna e il ritiro dell'usato. Il sito
  deve quindi dare tutte le informazioni di un negozio online e chiudere con un
  appuntamento.

ricerca: |
  La prima strada era il sito vetrina classico: una pagina per categoria, poche
  foto, la frase "venite a trovarci" e un modulo di contatto. È quello che hanno
  quasi tutti i negozi di materassi locali.

  L'ho scartata perché non rispondeva alla domanda vera, cioè quanto costa. Ho
  valutato anche il contrario, un e-commerce completo con carrello e pagamento,
  ma avrebbe spinto a comprare senza provare, che è proprio quello che il
  negozio vuole evitare. Ho tenuto l'impianto dell'e-commerce e ho cambiato solo
  l'ultimo passo: al posto del carrello c'è la prenotazione della prova.

soluzione: |
  Il catalogo funziona come in un negozio online. Ci sono sei categorie, cinque
  tipi di materasso e i filtri per materiale, prezzo, marchio e dispositivo
  medico. Ogni scheda ha il prezzo per misura: scegli 160×200 e il prezzo
  cambia subito.

  La misura scelta passa alla prenotazione. Il modulo ha due passi: nel primo ci
  sono i prossimi giorni di apertura come pulsanti, con mattina o pomeriggio;
  nel secondo i dati. Alla fine si può scaricare l'appuntamento per il
  calendario.

  Per chi non sa da dove partire c'è un questionario di quattro domande: come
  dormi, se dormi da solo o in due, se soffri il caldo e quanto vuoi spendere.
  Il risultato è una lista di modelli da provare per primi. Le promozioni hanno una data di fine e scadono
  da sole, anche se nessuno ricompila il sito.

tecnica: |
  Astro genera 73 pagine statiche. I dati stanno in pochi file: i prodotti in un
  JSON, i prezzi per misura in un altro, categorie, marchi, promozioni e domande
  frequenti in file TypeScript. Aggiungere un prodotto significa aggiungere una
  voce e una foto, le pagine si creano da sole.

  Le immagini vengono ridimensionate e convertite in WebP al build. Il prezzo per
  misura è calcolato nel browser leggendo le varianti già scritte nella pagina,
  senza chiamate a un server. Ogni scheda ha i dati strutturati del prodotto con
  il prezzo minimo e massimo.

  Il sito è pubblicato in una sottocartella di GitHub Pages. I link interni sono
  scritti come "/pagina/" e uno script dopo il build aggiunge il percorso giusto.
  Moduli e WhatsApp sono simulati: validano, confermano e non inviano niente.

risultato:
  - voce: Prezzo visibile per ogni misura
    dettaglio: Scegliendo la misura il prezzo della scheda si aggiorna, e la stessa scelta arriva già compilata nella prenotazione.
  - voce: Un catalogo vero, con filtri
    dettaglio: 31 prodotti in sei categorie, filtrabili per materiale, fascia di prezzo, marchio e dispositivo medico, più la ricerca nell'intestazione.
  - voce: Prenotazione in due passi
    dettaglio: I prossimi giorni di apertura sono pulsanti, con mattina e pomeriggio. A fine prenotazione si scarica l'appuntamento per il calendario.
  - voce: Questionario per chi non sa scegliere
    dettaglio: Quattro domande su come si dorme e un elenco di modelli da provare per primi in negozio.
  - voce: Promozioni che scadono da sole
    dettaglio: Ogni offerta ha una data di fine. Dopo quella data appare come conclusa, anche senza un nuovo build.
  - voce: Dati inventati, dichiarati
    dettaglio: Avviso nel footer di ogni pagina, recensioni marcate come dimostrative, noindex e robots.txt che blocca i motori di ricerca.

anteprima: lanalba-materassi/01-home.jpg
schermate:
  - src: lanalba-materassi/01-home.jpg
    alt: Home con la foto di una coppia a letto, il titolo "Sdraiati, poi scegli" e a destra la promozione in corso su fondo giallo
  - src: lanalba-materassi/02-catalogo.jpg
    alt: Catalogo dei materassi con i filtri per materiale, prezzo e marchio a sinistra e le schede prodotto con il prezzo di partenza
  - src: lanalba-materassi/03-scheda-prodotto.jpg
    alt: Scheda di un materasso con la galleria fotografica, le misure come pulsanti e il prezzo aggiornato per la misura matrimoniale
  - src: lanalba-materassi/04-prenotazione.jpg
    alt: Prenotazione della prova con i prossimi giorni di apertura come pulsanti e la scelta fra mattina e pomeriggio
  - src: lanalba-materassi/05-questionario.jpg
    alt: Primo passo del questionario "Trova il tuo materasso" con le quattro posizioni di sonno
  - src: lanalba-materassi/06-mobile.jpg
    alt: Scheda prodotto su telefono, con la barra fissa in basso che mostra il prezzo e il pulsante per prenotare la prova

tecnologie:
  - Astro
  - Tailwind CSS
  - TypeScript
  - GSAP
  - JSON-LD
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: Lanalba Materassi — sito dimostrativo
metaDescrizione: Sito di uno showroom di materassi di fantasia, con catalogo filtrabile, prezzi per misura, questionario e prenotazione della prova in negozio.
---

Il negozio vende ancora in negozio, e il sito lo accetta. Fa tutto quello che fa
un e-commerce, dal filtro al prezzo per misura, e si ferma un passo prima del
pagamento. In quel punto, al posto del carrello, c'è un appuntamento.
