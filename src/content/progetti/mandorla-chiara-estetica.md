---
titolo: Mandorla Chiara Estetica
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Una promozione di un centro estetico che arriva dai social e deve funzionare sul telefono, in pochi secondi.
riassunto: "Una landing page per una promozione viso, pensata per chi arriva da un'inserzione: offerta, prezzo e contatto nella prima schermata del telefono."
link: https://gxmich.github.io/mandorla-chiara-estetica-demo/
codice: https://github.com/GxMich/mandorla-chiara-estetica-demo

contesto: |
  Mandorla Chiara Estetica non esiste. Il nome, l'indirizzo a Borgo Sorive (un
  paese inventato), il telefono, l'email, i prezzi e la promozione sono inventati
  e servono solo a far funzionare la pagina. Il caso è quello di un centro
  estetico di paese che sponsorizza una promozione stagionale su Instagram e
  Facebook.

  La pagina ha noindex e l'email usa un dominio .example. WhatsApp, prenotazione
  online e mappa sono simulati: al clic compare un avviso e non si apre niente.

problema: |
  Chi tocca un'inserzione lo fa dal telefono, spesso in un momento morto, e
  decide in pochi secondi se restare. Vuole sapere tre cose: cosa è compreso,
  quanto costa, come si prenota. Molti centri mandano questo traffico alla home
  del sito, dove la promozione è una voce fra tante e il telefono sta in fondo.

  Il secondo problema è il gesto. Per una prenotazione dal centro estetico la
  gente scrive su WhatsApp o chiama. Un modulo di contatto, su un telefono, è
  quasi sempre un passaggio in più.

ricerca: |
  La prima versione apriva con un'immagine d'atmosfera: una natura morta con
  rami d'ulivo, lino e luce di taglio. Era elegante e dava il tono, ma non
  diceva niente dell'offerta. Su telefono la foto occupava tutta la prima
  schermata e la promozione cominciava sotto.

  L'ho sostituita con la foto di un trattamento al viso, cioè con quello che la
  cliente compra. Su telefono ho invertito l'ordine: prima titolo, offerta e i
  due pulsanti, poi la foto. Chi arriva dall'inserzione vede prezzo e contatti
  senza scorrere.

soluzione: |
  La pagina è corta. In apertura c'è il nome del rituale, lo sconto in grande e
  il prezzo pieno accanto a quello scontato, con la data di scadenza. Sotto ci
  sono due pulsanti, WhatsApp e chiamata.

  La seconda sezione spiega il rituale in due parti, cosa succede in cabina e
  cosa si porta a casa, con le condizioni della promozione in un riquadro a
  parte. Poi tre domande frequenti (quanto costa, quanto dura, come prenoto) e
  i contatti con gli orari.

  Su telefono, quando i pulsanti dell'apertura escono dallo schermo, compare in
  basso una barra fissa con Chiama e WhatsApp. Sparisce quando arrivano i
  pulsanti finali, così non ci sono due copie degli stessi comandi sullo
  schermo.

tecnica: |
  HTML, CSS e JavaScript, senza build. Testi della promozione, recapiti e
  immagini stanno in config.js: per cambiare offerta il mese dopo si tocca un
  solo file, e app.js applica i valori alla pagina.

  La barra fissa usa IntersectionObserver sui pulsanti dell'apertura e su quelli
  finali, senza ascoltare lo scroll a ogni pixel. Le domande frequenti sono
  details e summary nativi, quindi funzionano con tastiera e lettore di schermo
  senza codice in più.

  La foto principale è in WebP in due misure, 640 e 1024 pixel, scelte dal
  browser con srcset. L'animazione della foto in apertura e le transizioni si
  spengono con prefers-reduced-motion.

risultato:
  - voce: Offerta e contatti nella prima schermata del telefono
    dettaglio: Nome del rituale, sconto, prezzo, scadenza e i due pulsanti stanno sopra la foto, prima di qualsiasi scroll.
  - voce: I gesti che la gente usa davvero
    dettaglio: WhatsApp e chiamata come azioni principali, la prenotazione online come alternativa. Nella demo sono simulati e lo dicono.
  - voce: Barra fissa che non si ripete
    dettaglio: Compare quando i pulsanti in alto escono dallo schermo e si nasconde vicino ai contatti finali.
  - voce: La promozione si cambia da un file
    dettaglio: Testi, prezzi, recapiti e immagini in config.js. La pagina si aggiorna senza toccare HTML o CSS.
  - voce: Foto leggere
    dettaglio: WebP in due misure con srcset. La versione per telefono pesa circa 35 KB.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Centro di fantasia, dominio .example, noindex, azioni simulate con un avviso e dichiarazione nel footer.

anteprima: mandorla-chiara-estetica/01-home.jpg
schermate:
  - src: mandorla-chiara-estetica/01-home.jpg
    alt: Apertura su fondo chiaro con il titolo "Un'ora, solo per te.", lo sconto del 20% in bordeaux, i pulsanti WhatsApp e Chiama e la foto di un massaggio al viso
  - src: mandorla-chiara-estetica/02-rituale.jpg
    alt: La sezione "Poi, a casa." con la foto di un flacone di siero e il rituale diviso fra cabina e casa
  - src: mandorla-chiara-estetica/03-domande.jpg
    alt: Le domande frequenti con le risposte su prezzo e durata aperte
  - src: mandorla-chiara-estetica/04-contatti.jpg
    alt: La sezione dei contatti su fondo rosa cipria, con i pulsanti, l'indirizzo di fantasia e gli orari
  - src: mandorla-chiara-estetica/05-mobile.jpg
    alt: La pagina su telefono a metà scorrimento, con la barra fissa Chiama e WhatsApp in basso

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - WebP

inEvidenza: false
ordine: 50

metaTitolo: Mandorla Chiara Estetica — sito dimostrativo
metaDescrizione: "Landing page per la promozione di un centro estetico, pensata per il traffico dai social: offerta e contatti nella prima schermata del telefono. Centro di fantasia."
---

Una landing per una promozione vive poche settimane. Per questo ho messo tutto
quello che cambia in un solo file, e ho tenuto la pagina corta: chi arriva da
un'inserzione ha già deciso a metà, deve solo trovare il prezzo e il pulsante.
