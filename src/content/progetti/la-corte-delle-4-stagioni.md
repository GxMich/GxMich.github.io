---
titolo: La Corte delle 4 Stagioni
cliente: La Corte delle 4 Stagioni
tipo: sito
anno: 2026
natura: cliente
stato: Online — sito della struttura
sfida: Una dimora storica da raccontare, con un sito che la proprietaria potesse gestire.
riassunto: Un sito bilingue per una dimora di tre camere nel Monferrato, con fotografie reali, richieste via email o WhatsApp e un editor per aggiornare testi, immagini e prezzi.
link: https://www.lacortedelle4stagioni.com/

contesto: |
  La Corte delle 4 Stagioni è un B&B a Ozzano Monferrato, dentro Palazzo
  Callieri: tre camere con arredi d'epoca, un salone affrescato, un portico
  e un parco che cambia aspetto durante l'anno. Un'attività reale, gestita
  dalla proprietaria, con un dominio e un hosting già esistenti.

  Il lavoro comprendeva il racconto della struttura, il percorso per chiedere
  un soggiorno e gli strumenti per tenere aggiornato il sito. Ho seguito
  l'esplorazione grafica, l'organizzazione dei contenuti, lo sviluppo e
  l'adattamento al servizio di hosting della cliente.

problema: |
  La casa aveva molto da mostrare, ma il visitatore doveva anche capire in
  fretta quale camera scegliere e come contattare la proprietaria. Le
  fotografie del parco, della colazione e degli interni dovevano accompagnare
  quelle decisioni, mantenendo riconoscibile il carattere della dimora.

  C'era poi un vincolo operativo: prezzi, fotografie e testi dovevano poter
  cambiare senza passare ogni volta dallo sviluppatore. La soluzione andava
  portata sull'hosting esistente, con una gestione sostenibile per una
  struttura di tre camere.

ricerca: |
  Sono partito da dieci proposte visive, con gerarchie e soggetti fotografici
  diversi: il giardino, la colazione, gli interni Liberty, il paesaggio.
  La direzione Corte Botanica metteva subito in relazione la casa e il
  parco: testo e fotografia affiancati, avorio e verde bosco, titoli serif.
  I mockup servivano a scegliere la composizione; nel sito le immagini
  sono fotografie della struttura.

  Durante il confronto è cambiato anche il perimetro. La prima impostazione
  comprendeva prenotazioni dirette, pagamenti online e un gestionale con
  database. La proprietaria ha scelto di mantenere la risposta personale
  alle richieste. Ho quindi ricondotto il percorso pubblico a un messaggio
  preparato dal sito, da inviare tramite email o WhatsApp.

  Per gli aggiornamenti ho adattato l'editor a PHP e file JSON: una scelta
  legata al pacchetto di hosting già disponibile. Il prototipo con MySQL
  resta nella storia del progetto; il pacchetto pubblicato usa un archivio
  di contenuti su file.

soluzione: |
  La home apre sul parco e sul nome della Corte. Le quattro stagioni diventano
  un modo per esplorare il luogo: fotografie e testi mostrano come cambiano
  il giardino e il paesaggio. Il racconto prosegue negli ambienti della
  dimora, nella colazione e nel territorio, con collegamenti alle pagine
  dedicate.

  Le tre camere — Il Cardinale, Liberty e La Rossa — hanno un confronto
  iniziale e una scheda ciascuna, con fotografie, capienza, dotazioni e
  tariffa indicativa. La richiesta conserva la preferenza della camera
  scelta. Italiano e inglese seguono la stessa struttura, così chi arriva
  dall'estero trova anche le informazioni pratiche e il percorso di contatto.

  Il modulo raccoglie nome, date, ospiti, camera e un messaggio facoltativo.
  Controlla le date e prepara un riepilogo sul dispositivo: il visitatore
  sceglie se inviarlo via email o WhatsApp. La pagina chiarisce che
  disponibilità e condizioni saranno confermate personalmente dalla
  struttura.

  Dall'area riservata si aggiornano i contenuti e le fotografie. Il sito
  mantiene la propria impaginazione mentre la proprietaria interviene sui
  dati che cambiano: testi, immagini e prezzi.

tecnica: |
  L'interfaccia nasce in React 19 e Vite. Le pagine vengono anche preparate
  come HTML: un router PHP le serve con titolo, descrizione, canonical,
  lingue alternative e dati strutturati già nella risposta iniziale.
  Sul server di produzione bastano PHP e i file del sito; Node.js serve
  nella fase di sviluppo e compilazione.

  L'editor salva i contenuti in JSON e gestisce le fotografie caricate.
  Il backend controlla la revisione prima di sovrascrivere i testi, usa
  scritture temporanee con sostituzione del file e un blocco per coordinare
  le modifiche. Al salvataggio l'area riservata rigenera anche le pagine
  pubbliche, senza richiedere una compilazione manuale del progetto.

  Il pacchetto comprende le regole per Windows/IIS e per Apache. Il router
  gestisce i vecchi indirizzi con redirect, restituisce una pagina 404 con
  lo stato corretto e genera sitemap e robots.txt sul dominio definitivo.

  Le fotografie hanno varianti WebP e i caratteri sono ospitati localmente.
  GSAP e ScrollTrigger accompagnano il racconto nelle sezioni fotografiche;
  con la preferenza di movimento ridotto le informazioni e i controlli
  restano disponibili. Su telefono navigazione, camere e modulo si
  dispongono in una sola colonna.

risultato:
  - voce: Online sul dominio della struttura
    dettaglio: Il sito è pubblicato su www.lacortedelle4stagioni.com, con un'identità costruita intorno alla dimora e alle sue fotografie.
  - voce: Due lingue, lo stesso percorso
    dettaglio: Italiano e inglese comprendono home, camere, informazioni sulla struttura e richiesta di disponibilità, con collegamenti fra le pagine equivalenti.
  - voce: Tre camere da confrontare
    dettaglio: Il Cardinale, Liberty e La Rossa hanno pagine dedicate con capienza, fotografie, dotazioni e prezzi indicativi, collegate alla richiesta di soggiorno.
  - voce: Richieste pronte per la risposta personale
    dettaglio: Il visitatore prepara un messaggio con date e preferenze e sceglie email o WhatsApp. La disponibilità viene confermata dalla proprietaria.
  - voce: Contenuti aggiornabili dall'area riservata
    dettaglio: Testi, fotografie e prezzi si gestiscono con un editor e un archivio su file, compatibile con il pacchetto PHP della cliente.
  - voce: Cosa manca da misurare
    dettaglio: Non sono disponibili dati verificati sull'aumento delle richieste o delle prenotazioni. I risultati qui documentati riguardano il sito realizzato e il suo funzionamento.

anteprima: la-corte-delle-4-stagioni/01-home.png
schermate:
  - src: la-corte-delle-4-stagioni/01-home.png
    alt: Home della Corte con il titolo Quattro stagioni, una sola corte, il terrazzo in autunno e i pulsanti per camere e disponibilità
  - src: la-corte-delle-4-stagioni/02-stagioni.png
    alt: Sezione delle quattro stagioni con il parco in primavera, il selettore stagionale e il racconto della fioritura
  - src: la-corte-delle-4-stagioni/03-camere.png
    alt: Confronto fra Il Cardinale, Liberty e La Rossa con fotografie, capienza, prezzi indicativi e collegamenti alle schede
  - src: la-corte-delle-4-stagioni/04-cardinale.png
    alt: Scheda della camera Il Cardinale con fotografie degli arredi e informazioni sul soggiorno
  - src: la-corte-delle-4-stagioni/05-disponibilita.png
    alt: Modulo di richiesta disponibilità con nome, date, ospiti, preferenza camera e indicazione della risposta personale
  - src: la-corte-delle-4-stagioni/06-mobile.png
    alt: Home su telefono con navigazione compatta, testo introduttivo, pulsanti di contatto e fotografia autunnale
  - src: la-corte-delle-4-stagioni/07-english.png
    alt: Versione inglese della home con descrizione della dimora e collegamenti per camere e richiesta di soggiorno

tecnologie:
  - React 19
  - Vite
  - PHP
  - JSON
  - GSAP / ScrollTrigger
  - CSS responsive

inEvidenza: true
ordine: 0

metaTitolo: La Corte delle 4 Stagioni — sito B&B nel Monferrato
metaDescrizione: Sito bilingue per un B&B a Ozzano Monferrato, con tre camere, richieste via email o WhatsApp ed editor di testi, foto e prezzi sull'hosting esistente.
---

La decisione che ha dato forma al progetto è arrivata parlando della gestione
quotidiana: la proprietaria voleva continuare a rispondere personalmente agli
ospiti. Da lì ho organizzato il lavoro intorno a due cose concrete: aiutare
chi visita a scegliere una camera e dare a chi accoglie gli strumenti per
tenere il sito aggiornato. Anche l'hosting già presente è diventato un
vincolo di progetto, con una soluzione su file adatta ai contenuti da gestire.
