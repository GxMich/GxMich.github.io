---
titolo: Chiaravia Trasporti e Logistica
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un piccolo trasportatore che doveva spiegare in fretta la differenza tra un camion dedicato e un pallet in groupage.
riassunto: Un sito chiaro per un'impresa di trasporti e magazzino, con tre servizi spiegati prima di chiedere i dati e un preventivo che cambia domande in base al servizio.
link: https://gxmich.github.io/chiaravia-trasporti-demo/
codice: https://github.com/GxMich/chiaravia-trasporti-demo

contesto: |
  Chiaravia Trasporti e Logistica non esiste. Nome, paese di San Ferlino,
  indirizzo, telefono ed email sono inventati per la demo. Il lavoro che
  descrive invece è comune a molte piccole imprese del Nord Ovest: camion
  dedicati, spedizioni di pochi pallet in groupage e un magazzino in conto
  terzi.

  Ho scelto dati di fantasia perché un sito di prova con i recapiti di
  un'azienda vera può confondere chi la cerca. Recapiti e dominio sono di
  esempio e tutte le pagine hanno noindex.

problema: |
  Chi deve spedire qualcosa conosce la sua merce, non il gergo dei trasporti.
  FTL, collettame, conto terzi: sono parole che il cliente non usa. Se il sito le
  mette in primo piano, il visitatore non capisce quale servizio fa per lui e
  chiede un preventivo generico, o non lo chiede.

  Il preventivo stesso è un problema. Un camion intero, tre pallet e un
  magazzino richiedono dati diversi. Un modulo unico finisce per chiedere tutto
  a tutti.

ricerca: |
  La prima versione aveva tre card con icona, titolo e due righe, e un modulo
  unico in fondo a ogni pagina. È lo schema che si trova in quasi tutti i siti
  di trasporti.

  L'ho scartata perché le card dicevano il nome del servizio e basta. Non
  aiutavano a scegliere. Il modulo unico, poi, chiedeva il peso anche a chi
  voleva solo affittare spazio in magazzino.

soluzione: |
  I servizi sono righe ampie con foto, una frase sul caso d'uso ("un camion solo
  per la tua merce", "paghi solo lo spazio che occupi") e i termini tecnici in
  piccolo, come etichette. Una pagina guida chiede di partire dalla situazione:
  quattro frasi, quattro risposte.

  Ogni pagina servizio spiega cosa comprende prima di chiedere qualcosa, poi
  elenca i dati da tenere pronti per il preventivo.

  La richiesta ha tre passi: il servizio, la merce, i recapiti. Il secondo passo
  cambia domande in base alla scelta. Per un trasporto chiede partenza,
  destinazione e quantità; per il magazzino attività, volumi e cadenza. Alla fine
  compare una scheda strutturata con quello che arriverebbe all'ufficio, da
  copiare o scaricare come testo.

tecnica: |
  Il sito è HTML, CSS e JavaScript senza librerie. Un unico script Python
  genera tutte le pagine da un elenco di servizi e da un file di
  configurazione: aggiungere un servizio vuol dire aggiungere un blocco di dati.

  Il modulo è costruito per la tastiera e per i lettori di schermo: errori
  collegati ai campi, focus sul primo errore, annunci a ogni passo. Il menu su
  telefono usa l'elemento dialog e tiene il focus all'interno. Font e immagini
  sono ospitati insieme alle pagine.

  Nella demo i dati del modulo restano nella pagina e spariscono alla chiusura.

risultato:
  - voce: Servizi spiegati con il caso d'uso
    dettaglio: Ogni servizio parte da una frase sulla situazione del cliente. Le sigle del settore restano visibili ma in secondo piano.
  - voce: Una guida per scegliere
    dettaglio: Quattro situazioni tipiche portano al servizio giusto o alla richiesta "da valutare insieme".
  - voce: Domande diverse per servizi diversi
    dettaglio: Il secondo passo del preventivo cambia campi tra trasporto, magazzino e caso da valutare.
  - voce: Riepilogo pronto da leggere
    dettaglio: Una scheda divisa per merce, viaggio o magazzino e contatto, copiabile o scaricabile in testo.
  - voce: Accessibile da tastiera
    dettaglio: Errori legati ai campi, focus gestito tra i passi e menu mobile con dialog nativo.
  - voce: Nessun dato reale
    dettaglio: Azienda e paese di fantasia, recapiti di esempio, noindex e foto Unsplash con i crediti nel repository.

anteprima: chiaravia-trasporti/01-home.jpg
schermate:
  - src: chiaravia-trasporti/01-home.jpg
    alt: Apertura su sfondo carta con il titolo "Ogni carico merita un viaggio pulito" e la foto di un autoarticolato in corsa
  - src: chiaravia-trasporti/02-servizi.jpg
    alt: I tre servizi come righe editoriali numerate, con foto, frase sul caso d'uso ed etichette arrotondate con i termini del settore
  - src: chiaravia-trasporti/03-metodo.jpg
    alt: Sezione "Come lavoriamo" su fondo petrolio con la foto aerea di un piazzale di semirimorchi e i tre passi del metodo
  - src: chiaravia-trasporti/04-preventivo.jpg
    alt: Richiesta di preventivo in tre passi, con l'avanzamento a sinistra e la scelta del servizio a destra
  - src: chiaravia-trasporti/05-mobile.jpg
    alt: La home su telefono con il titolo, il pulsante del preventivo e la foto del camion

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - Python
  - GitHub Pages

inEvidenza: false
ordine: 50

metaTitolo: Chiaravia Trasporti e Logistica — sito dimostrativo
metaDescrizione: Sito per un'impresa di trasporti e magazzino con servizi spiegati dal caso d'uso e un preventivo in tre passi che cambia domande in base al servizio.
---

In un sito di trasporti il preventivo è la parte che conta. Ho cercato di farlo
assomigliare a una telefonata con l'ufficio: prima capire cosa serve, poi
chiedere solo i dati utili. Su un'azienda vera andrebbero aggiunti zone servite e
tempi di risposta reali.
