---
titolo: Rossovento Autotrasporti
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un autotrasportatore che voleva un sito con carattere, senza perdere la strada più corta verso il preventivo.
riassunto: Un sito scuro e cinematografico per un'impresa di autotrasporti, con un preventivo rapido già nella prima schermata e un modulo che cambia campi per trasporto, container e magazzino.
link: https://gxmich.github.io/rossovento-autotrasporti-demo/
codice: https://github.com/GxMich/rossovento-autotrasporti-demo

contesto: |
  Rossovento Autotrasporti è un'azienda inventata. Nome, paese di San Ferlino,
  indirizzo, telefono, email e logo sono di fantasia. Il settore invece è
  concreto: trasporti in Italia e in Europa, container dai porti, magazzino e
  una pagina per chi vuole lavorare come autista.

  Ho lavorato con dati finti per non creare un doppione di un'azienda vera nei
  risultati di ricerca. Recapiti e dominio sono di esempio e tutte le pagine
  hanno noindex.

problema: |
  I siti di autotrasporto si somigliano tutti: foto di camion, quattro servizi
  in griglia, il telefono in alto. Un'azienda che vuole distinguersi rischia di
  esagerare con l'immagine e di nascondere l'unica cosa che il visitatore cerca,
  cioè come chiedere un prezzo.

  Inoltre trasporto, container e magazzino non hanno le stesse domande. Per un
  container servono porto e tipo; per il magazzino servono quantità e periodo.

ricerca: |
  All'inizio avevo messo il modulo di preventivo solo nella pagina contatti e
  una grande foto in apertura con lo slogan. Era d'impatto ma faceva fare al
  visitatore due passaggi in più prima di dire cosa doveva spedire.

  L'ho scartata quando ho visto che la prima schermata era tutta immagine. Ho
  spostato una versione ridotta del preventivo dentro l'apertura, senza togliere
  la foto.

soluzione: |
  La prima schermata ha il titolo in tre righe, "Trasporti. Logistica.
  Rossovento.", e sotto una barra di preventivo rapido: servizio, partenza,
  destinazione. Il pulsante apre la pagina contatti con la tratta già scritta e
  porta direttamente al campo successivo da compilare.

  I servizi sono un elenco a destra di una foto. Passando su un servizio la foto
  cambia. Ogni pagina servizio ha i punti chiave, le domande frequenti e gli
  altri servizi collegati.

  Il modulo cambia campi in base al servizio: tratta per i trasporti, porto,
  tipo di container e operazione per i container, quantità e periodo per il
  magazzino. I campi nascosti non vengono controllati e non finiscono nel
  riepilogo, che si può scaricare in testo.

  Un camion illustrato avanza lungo una strada tratteggiata mentre si scorre la
  pagina. Con "riduci movimento" attivo resta fermo.

tecnica: |
  Il sito è HTML, CSS e JavaScript senza librerie. Uno script Python genera le
  undici pagine da un elenco di servizi; un secondo script controlla link,
  ancore, etichette dei campi, JSON-LD e noindex.

  Le animazioni partono solo quando l'utente scorre, senza un ciclo continuo in
  background. Font Barlow e icone sono ospitati in locale. I pulsanti di invio
  dei moduli partono disabilitati e si attivano solo quando lo script è pronto,
  così senza JavaScript non si invia nulla per errore.

  Nella demo i moduli mostrano solo un riepilogo. Nessun dato lascia il browser.

risultato:
  - voce: Preventivo nella prima schermata
    dettaglio: Servizio, partenza e destinazione si scelgono in apertura e passano alla pagina contatti già compilati.
  - voce: Un modulo per tre tipi di richiesta
    dettaglio: Campi diversi per trasporto, container e magazzino, con controlli e riepilogo solo sui campi visibili.
  - voce: Foto che segue il servizio
    dettaglio: Nella home l'immagine cambia passando sull'elenco dei quattro servizi.
  - voce: Movimento legato allo scorrimento
    dettaglio: Il camion illustrato avanza con lo scroll e resta fermo con "riduci movimento".
  - voce: Pagina per le candidature
    dettaglio: Lavora con noi ha un modulo dedicato per autisti, magazzino e ufficio traffico.
  - voce: Nessun dato reale
    dettaglio: Azienda e paese di fantasia, logo disegnato per la demo, noindex e foto Unsplash con i crediti nel repository.

anteprima: rossovento-autotrasporti/01-home.jpg
schermate:
  - src: rossovento-autotrasporti/01-home.jpg
    alt: Apertura scura con il titolo "Trasporti. Logistica. Rossovento." in maiuscolo condensato, un camion in autostrada al tramonto e la barra del preventivo rapido
  - src: rossovento-autotrasporti/02-servizi.jpg
    alt: Elenco dei quattro servizi numerati accanto alla foto di una strada al tramonto
  - src: rossovento-autotrasporti/03-camion.jpg
    alt: Sezione "La strada cambia. Il riferimento no." con il camion illustrato rosso e bianco su una strada tratteggiata
  - src: rossovento-autotrasporti/04-preventivo.jpg
    alt: Pagina contatti con i recapiti dell'ufficio traffico a sinistra e il modulo di richiesta con la scelta del servizio a destra
  - src: rossovento-autotrasporti/05-mobile.jpg
    alt: La home su telefono con il titolo in tre righe e la barra delle azioni rapide in basso

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - Python
  - GitHub Pages

inEvidenza: false
ordine: 50

metaTitolo: Rossovento Autotrasporti — sito dimostrativo
metaDescrizione: Sito per un'impresa di autotrasporti con preventivo rapido in apertura, modulo diverso per trasporto, container e magazzino e camion animato allo scroll.
---

Qui volevo un sito con più carattere del solito, senza rallentare chi deve
chiedere un prezzo. La foto resta grande, ma la prima cosa che si può fare è
scrivere da dove a dove. Con un'azienda vera andrebbero aggiunti mezzi, zone
servite e una foto della flotta.
