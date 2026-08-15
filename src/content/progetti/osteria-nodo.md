---
titolo: Osteria Nodo
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
stato: Concept online — il ristorante non esiste
riassunto: Un sito di ristorante costruito come una pubblicazione editoriale, non come una vetrina — con un filetto tipografico che lega il nome del locale a ogni sezione della pagina.
link: https://gxmich.github.io/osteria-nodo/
codice: https://github.com/GxMich/osteria-nodo

contesto: |
  Osteria Nodo non esiste: nessun indirizzo, recapito, recensione o
  produttore citato nel sito appartiene a un locale reale. È un secondo
  concept da ristorazione, dopo Pizzeria Moderna, per continuare a lavorare
  l'intero percorso — direzione, UX, motion, sviluppo — su un caso solo.

  Il locale immaginato è una cucina contemporanea in Piemonte: ventotto
  coperti, un solo turno a cena, carta corta di dieci piatti che cambia con
  la stagione, cucina a vista senza vetro fra sala e fuochi.

problema: |
  Quasi ogni sito di ristorazione è una vetrina con le stesse parti: hero con
  claim generico, griglia di piatti fotografati, form di contatto in fondo.
  Funziona come elenco, ma non spiega perché quella carta è corta, perché un
  ingrediente sparisce a metà anno, o perché la cucina è aperta sulla sala:
  i dettagli che di solito sono il vero motivo per cui si sceglie un
  ristorante piuttosto che un altro.

ricerca: |
  Il primo impianto provato era quello standard: header con logo e numero di
  telefono, hero a piena pagina, poi una griglia di card piatto-prezzo-foto
  ripetuta uguale per ogni sezione — luogo, carta, cantina, prenotazione.

  L'ho scartato perché un'intestazione identica su ogni sezione trasforma
  una pubblicazione in un modulo compilato: dopo la terza card il visitatore
  smette di leggere e comincia a scorrere. Un sito che vuole raccontare un
  metodo di cucina, non solo elencarne i piatti, doveva avere sezioni con
  ruoli diversi — non la stessa struttura sette volte.

soluzione: |
  Il sito è composto come una pubblicazione editoriale indipendente su un
  ristorante, non come il sito di un ristorante. Un filetto corto lega NODO
  a OSTERIA nel logotipo — l'unico elemento del marchio a portare colore — e
  lo stesso filetto ricompare davanti ai numeri di capitolo e ai segni di
  margine: un solo gesto grafico, tre luoghi diversi.

  Ogni piatto in carta deve dichiarare tre parole — ingrediente, territorio,
  gesto — ed è il "nodo" che dà il nome al locale. Delle dodici sezioni della
  pagina, cinque non hanno alcun segno di capitolo: dove il testo o la
  fotografia bastano da soli, il numero viene tolto invece di essere messo
  per coerenza.

  La carta è interattiva: puntare o tabulare su un piatto cambia la
  fotografia in una cornice fissa a destra, sceglierlo apre la descrizione.
  Un solo modello di stato serve sia il tocco che il puntatore, e la cornice
  non resta mai vuota — tiene l'ultima immagine caricata finché la nuova non
  ha finito di decodificare.

  La prenotazione chiede tre decisioni e nient'altro — data, ora, coperti —
  senza nome, email o account: la logica di sala è vera (lunedì chiuso,
  pranzo solo venerdì-domenica, gli stessi orari stampati a schermo), la
  risposta finale è dichiaratamente simulata.

tecnica: |
  Next.js 16 con App Router, React 19, TypeScript, Tailwind v4 usato solo
  per i token e il reset — la composizione delle pagine è CSS scritto a
  mano. Solo cinque componenti client su tutto il sito: header, carta
  interattiva, prenotazione, rivelazioni allo scroll, marcatore della
  stagione corrente. Il resto è statico.

  Il movimento è tutto fotografico — nove rivelazioni, la lastra che si apre
  dal bordo superiore — e nessun testo entra mai in dissolvenza: una pagina
  dove ogni paragrafo sale di quattordici pixel è il segno più riconoscibile
  di un sito generato. Le animazioni partono da uno stato nascosto solo
  dentro `@media (scripting: enabled)`, così senza JavaScript la pagina resta
  interamente leggibile.

  Tre colori con un ruolo ciascuno — vino per l'identità, rame quando il
  fondo passa alla notte, oliva per il territorio — invece di una singola
  tinta ripetuta ovunque. Le fotografie arrivano da Unsplash con un loader
  custom, perché l'export statico non ha `/_next/image`.

  Il pannello mobile rende `inert` il resto della pagina finché è aperto, i
  bersagli di tocco passano a 44px sotto `@media (pointer: coarse)`, ed è
  l'unica sezione — la cucina — a fondo scuro. Nessun dato strutturato
  `Restaurant`: richiederebbe indirizzo, telefono e orari di un locale che
  non esiste.

risultato:
  - voce: Un filetto, tre luoghi
    dettaglio: Lo stesso segno tipografico lega il marchio, apre i numeri di capitolo e marca i margini — un solo dispositivo grafico invece di tre elementi decorativi separati.
  - voce: Sezioni senza numero dove il numero non serve
    dettaglio: Cinque sezioni su dodici non hanno segno di capitolo, cosa che tiene i numeri significativi nelle altre sette invece di stamparli per abitudine.
  - voce: Il nodo di ogni piatto, non solo il prezzo
    dettaglio: Ogni voce in carta dichiara ingrediente, territorio e gesto — la carta interattiva cambia foto al passaggio e apre la descrizione alla scelta.
  - voce: Prenotazione senza dati personali
    dettaglio: Tre decisioni — data, ora, coperti — nessun nome, email o account raccolto. La logica di sala è reale, la conferma è dichiaratamente simulata.
  - voce: Movimento solo fotografico
    dettaglio: Nove rivelazioni in tutta la pagina, mai sul testo, spente del tutto senza JavaScript e con prefers-reduced-motion.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Locale, indirizzo e recensioni sono di fantasia, dichiarati in pagina; niente schema Restaurant, che avrebbe richiesto dati di un'attività che non esiste.

anteprima: osteria-nodo/01-home.jpg
schermate:
  - src: osteria-nodo/01-home.jpg
    alt: Copertina di Osteria Nodo con il claim "Ingredienti, tempo, contrasti" a sinistra e una fotografia di un piatto in preparazione a destra

tecnologie:
  - Next.js 16
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - next/image

inEvidenza: true
ordine: 6

metaTitolo: Osteria Nodo — concept editoriale per un ristorante contemporaneo
metaDescrizione: Un sito di ristorante costruito come una pubblicazione, non come una vetrina — filetto tipografico, carta interattiva e prenotazione senza dati personali. Next.js 16 e Tailwind v4.
---

Dopo Pizzeria Moderna, il vincolo che mi sono dato era non ripetere lo stesso
schema di sezioni con un colore diverso sopra. Il test più onesto è stato
quello delle cinque sezioni senza numero: toglierlo dove non serve costringe
a chiedersi, sezione per sezione, se il numero stava lì per un motivo o per
abitudine.
