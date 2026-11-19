---
titolo: Lumetra Impianti
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Una ditta di impianti con sette competenze doveva far capire cosa sa fare mostrando i lavori, non un elenco di servizi.
riassunto: Sito per una ditta di impianti elettrici e tecnologici. Sette competenze, otto lavori filtrabili e un modulo che arriva già impostato sul servizio giusto.
link: https://gxmich.github.io/lumetra-impianti-demo/
codice: https://github.com/GxMich/lumetra-impianti-demo

contesto: |
  Lumetra Impianti è un'attività di fantasia. Nome, logo, indirizzo a Rocca
  Tessera, anno di fondazione, abilitazioni e lavori sono inventati. Le foto dei
  lavori vengono da Unsplash e illustrano cantieri immaginari.

  Il caso però è comune: una ditta di impiantisti che negli anni ha aggiunto
  all'elettrico illuminazione, fotovoltaico, domotica, sicurezza, antincendio e
  diffusione sonora. Lavora per aziende, enti pubblici, progettisti e privati.
  Tutte le pagine hanno noindex e il modulo non invia niente.

problema: |
  Una ditta così fa molte cose, e il rischio è un sito che le elenca tutte allo
  stesso modo. Chi arriva però ha una domanda precisa. L'ufficio tecnico di
  un'azienda vuole sapere se la ditta ha già lavorato in uno stabilimento. Un
  comune guarda le opere pubbliche. Un privato vuole il fotovoltaico sul tetto.

  Un elenco di sette servizi con un'icona ciascuno non risponde a nessuno dei
  tre. Servono prove: lavori fatti, con cosa è stato realizzato e per chi.

ricerca: |
  Ho pensato prima a una home costruita sulle sette competenze, con una scheda
  per ognuna. L'ho scartata perché metteva il catalogo davanti alle prove. Ho
  scelto di aprire con un lavoro, la passerella illuminata, e di mettere i
  lavori subito dopo i numeri essenziali.

  Ho scartato anche una pagina lavori a galleria di sole foto. Una foto di un
  capannone non dice cosa c'è dentro. Ogni lavoro ha quindi una scheda con
  settore, luogo, periodo, interventi eseguiti e competenze coinvolte.

soluzione: |
  La home apre con un lavoro e la sua didascalia, poi un nastro con anno di
  fondazione, numero di competenze e la sigla MT e BT. Seguono tre lavori in
  evidenza e un blocco che divide i visitatori: aziende, enti pubblici,
  progettisti e imprese, privati e condomini. Ognuno porta ai lavori del suo
  settore o a una richiesta già impostata.

  Le competenze sono un elenco numerato. Passando col mouse su una voce cambia
  la foto accanto. Ogni competenza ha la sua pagina con cosa si realizza, cosa
  preparare per il primo contatto e i lavori collegati.

  La pagina lavori si filtra per settore e dice quanti lavori sta mostrando. Dal
  modulo di contatto il titolo cambia in base al servizio scelto: chi arriva dal
  fotovoltaico legge «Richiesta per un impianto fotovoltaico» e l'elenco di cosa
  allegare. Si può aggiungere un file, per esempio una planimetria.

tecnica: |
  Ventitré pagine statiche generate da uno script Python senza dipendenze.
  Competenze, lavori, settori e abilitazioni stanno in un file JSON: per
  aggiungere un lavoro basta una voce in più, e la scheda, le card e i
  collegamenti si rigenerano da soli.

  Il CSS viene minificato insieme ai font dallo stesso script. I font IBM Plex
  sono nel progetto e ogni foto ha quattro varianti di larghezza. Il menu su
  telefono usa l'elemento dialog. Accanto a «Chiama», la barra in basso porta
  alla richiesta per il servizio della pagina; in Assistenza diventa «Richiedi
  assistenza».

risultato:
  - voce: Si apre con un lavoro
    dettaglio: La prima immagine è un intervento con la sua didascalia e il link alla scheda, prima ancora dell'elenco dei servizi.
  - voce: Otto lavori con la loro scheda
    dettaglio: Settore, luogo, periodo, interventi eseguiti e competenze coinvolte. Filtri per settore con il conteggio dei risultati.
  - voce: Quattro percorsi per quattro committenti
    dettaglio: Aziende, enti pubblici, progettisti e privati trovano ciascuno i propri lavori o una richiesta già impostata.
  - voce: Modulo che si adatta al servizio
    dettaglio: Titolo, indicazioni e servizio arrivano dal link di partenza. Il riepilogo finale mostra i dati prima dell'invio, che nella demo non avviene.
  - voce: Contenuti in un solo file
    dettaglio: Lavori e competenze sono dati JSON. Lo script rigenera pagine, card e collegamenti tra lavori e servizi.
  - voce: Nessun dato reale
    dettaglio: Attività e paese di fantasia, dominio .example, noindex su ogni pagina e foto Unsplash elencate nei crediti.

anteprima: lumetra-impianti/01-home.jpg
schermate:
  - src: lumetra-impianti/01-home.jpg
    alt: Home blu notte con il titolo "Corrente, luce, sicurezza. Un solo referente." e, a destra, una passerella pedonale illuminata riflessa nel fiume
  - src: lumetra-impianti/02-lavori.jpg
    alt: Pagina dei lavori con i filtri per settore e le card della passerella e dello stabilimento di assemblaggio
  - src: lumetra-impianti/03-competenze.jpg
    alt: Elenco numerato delle sette competenze con la foto di un quadro elettrico accanto
  - src: lumetra-impianti/04-lavoro.jpg
    alt: Scheda del lavoro Residenza per anziani con settore, luogo e periodo e la foto di un corridoio
  - src: lumetra-impianti/05-richiesta.jpg
    alt: Pagina contatti con il titolo "Richiesta per un impianto fotovoltaico" e il modulo con il servizio già scelto
  - src: lumetra-impianti/06-mobile.jpg
    alt: La home su telefono con la foto della passerella, il titolo e la barra in basso con chiamata e richiesta

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - Python
  - JSON

inEvidenza: false
ordine: 50

metaTitolo: Lumetra Impianti — sito dimostrativo
metaDescrizione: Sito per una ditta di impianti elettrici e tecnologici. Si apre con un lavoro, otto schede filtrabili, sette competenze e un modulo che si adatta al servizio.
---

In un'impresa di impianti il lavoro fatto vale più di qualsiasi descrizione.
Per questo i lavori stanno in alto e ogni competenza rimanda a un cantiere.
Con una ditta vera le schede andrebbero riempite con i suoi interventi e le sue
foto, e i settori con i committenti che ha davvero.
