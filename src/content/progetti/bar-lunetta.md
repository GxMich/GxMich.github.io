---
titolo: Bar Lunetta
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un bar di paese che di giorno fa i caffè e di sera vuole riempire i tavoli.
riassunto: Una pagina sola per un bar che vive dalla colazione al dopocena, con l'apericena in primo piano, i prezzi scritti e un calendario di serate che non scade mai.
link: https://gxmich.github.io/bar-lunetta-demo/
codice: https://github.com/GxMich/bar-lunetta-demo

contesto: |
  Bar Lunetta è un bar che non esiste, in Via del Borgo a Castelmarzo, un paese
  di fantasia in Piemonte. Telefono, email, orari, prezzi e serate sono
  inventati. Il numero è +39 000 000 0000 e l'email finisce in .example.

  Il bar immaginato è quello sotto casa: apre alle sette con il caffè, a pranzo
  fa un piatto del giorno, la sera fa l'apericena e il fine settimana chiude
  all'una.

  La pagina ha noindex e il robots.txt blocca tutto: un bar finto non deve
  comparire nelle ricerche di chi cerca un posto vero per l'aperitivo.

problema: |
  Un bar di paese di solito ha una pagina social e basta. Chi lo cerca la sera
  vuole sapere tre cose: com'è l'apericena, quanto costa, se è aperto. Sulla
  pagina social le trova solo scorrendo post vecchi.

  Il secondo problema sono le serate. Un calendario aggiornato a mano invecchia
  in fretta, e un sito con eventi passati sembra un locale chiuso.

ricerca: |
  La prima strada era un sito di più pagine: chi siamo, menu, eventi, contatti.
  L'ho scartata perché per un bar i contenuti sono pochi. Quattro pagine mezze
  vuote fanno più fatica a trovare l'informazione di una pagina sola fatta
  bene.

  Ho scartato anche il menu completo con tutte le bottiglie. Chi decide dove
  fare l'aperitivo vuole un'idea dei prezzi, non la carta intera. Per ogni
  momento della giornata ho tenuto tre o quattro voci con il prezzo.

soluzione: |
  La pagina si apre sulla sala la sera, con il titolo «La sera comincia qui.»,
  l'indirizzo e un solo pulsante: scopri l'apericena. Subito sotto c'è
  l'apericena, con una foto grande della tavola.

  Poi ci sono tre schede: Apericena, Da bere, Di giorno. Ognuna ha la sua foto,
  due righe di testo e una lista corta con i prezzi. Le schede si cambiano con
  il mouse, con il dito o con le frecce della tastiera.

  Le serate in programma sono un elenco di righe con data, ora e titolo. Ogni
  riga apre una scheda con la descrizione. Le date si calcolano sui prossimi
  giorni della settimana, così la demo mostra sempre serate future.

  In fondo ci sono gli orari della settimana, il telefono e l'indirizzo, su un
  fondo giallo che si riconosce anche scorrendo veloce. Da telefono, quando
  l'hero esce dallo schermo, compare una barra in basso con l'offerta e la
  posizione.

tecnica: |
  React e Vite, con CSS scritto a mano e nessuna libreria di animazione: le
  transizioni usano la Web Animations API e i token di durata stanno in
  variabili CSS. Con il movimento ridotto le animazioni finiscono subito.

  La galleria scorre in orizzontale e apre una finestra a tutto schermo con
  frecce, tastiera e swipe. Le finestre usano l'elemento dialog nativo, con il
  focus che resta dentro finché sono aperte.

  I font sono serviti dal sito. Le foto sono WebP con una versione più leggera
  per i telefoni. La pubblicazione passa da GitHub Actions, che esegue i test
  e pubblica su GitHub Pages.

risultato:
  - voce: L'apericena in apertura
    dettaglio: È la prima sezione dopo l'hero, con una foto grande e un collegamento diretto ai prezzi.
  - voce: Prezzi per ogni momento della giornata
    dettaglio: Tre schede con tre o quattro voci ciascuna, navigabili anche da tastiera.
  - voce: Serate che non scadono
    dettaglio: Le date si calcolano sulle prossime settimane. Ogni serata apre una scheda di dettaglio.
  - voce: Orari e contatti in un solo blocco
    dettaglio: Settimana tipo, telefono, email e indirizzo insieme, su un fondo che si riconosce a colpo d'occhio.
  - voce: Pensato per il telefono
    dettaglio: Navigazione a tutto schermo, galleria con lo swipe e barra di azioni rapide che compare dopo l'hero.
  - voce: Attività di fantasia dichiarata
    dettaglio: Avviso visibile nel footer, finestra con i crediti delle foto, noindex e robots.txt che blocca tutto.

anteprima: bar-lunetta/01-home.jpg
schermate:
  - src: bar-lunetta/01-home.jpg
    alt: Hero di Bar Lunetta con la sala la sera sfocata sullo sfondo, il titolo «La sera comincia qui.» e il pulsante giallo per scoprire l'apericena
  - src: bar-lunetta/02-apericena.jpg
    alt: La sezione apericena, con una tavola di focaccia, piccoli panini e calici di vino rosso accanto al titolo «Un tavolo, qualcosa da dividere.»
  - src: bar-lunetta/03-momenti.jpg
    alt: Le schede dei momenti della giornata aperte su «Da bere», con la foto di un martini al bancone e la lista dei cocktail con i prezzi
  - src: bar-lunetta/04-locale.jpg
    alt: La sezione «Il bar della via» con la foto di un bancone in legno sotto un arco bianco e l'inizio della galleria orizzontale
  - src: bar-lunetta/05-serate.jpg
    alt: L'elenco delle prossime serate con data, ora e titolo, e sotto il blocco giallo con orari e contatti
  - src: bar-lunetta/06-mobile.jpg
    alt: La pagina su telefono, con la foto della sala, il titolo grande e il pulsante per scoprire l'apericena

tecnologie:
  - React
  - Vite
  - CSS
  - Web Animations API
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: Bar Lunetta — sito dimostrativo
metaDescrizione: Pagina unica per un bar di paese, con l'apericena in primo piano, prezzi per ogni momento della giornata e serate che si aggiornano da sole. Attività di fantasia.
---

Il punto di partenza era capire cosa cerca chi apre il sito di un bar alle
sette di sera. Da lì è venuto l'ordine delle sezioni: prima l'apericena, poi
i prezzi, poi le serate e gli orari. Con un bar vero le serate andrebbero
collegate al calendario che il locale aggiorna già, invece di essere scritte
nel codice.
