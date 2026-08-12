---
titolo: Pizzeria Moderna
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
stato: Concept online — non è un locale reale
riassunto: Un sito di pizzeria che non fa il menù digitale. Racconta il mestiere — impasto, forno, sala — e mette il menù come una tappa del racconto, non l'apertura.
link: https://gxmich.github.io/pizzeria-moderna
codice: https://github.com/GxMich/pizzeria-moderna

contesto: |
  Pizzeria Moderna non ha un cliente dietro: è un concept che mi sono dato da
  solo, per una pizzeria di quartiere immaginaria a Torino, zona Aurora — forno
  a legna, ventotto coperti, una lista corta di pizze fatte sempre allo stesso
  modo. Niente reinvenzione fine dining, niente catena: un posto che fa poche
  cose e le fa vedere.

  Il punto non era vendere un servizio, era completare da solo l'intero
  percorso — direzione, UX, motion, sviluppo — su un caso solo, prima di
  proporlo a un cliente vero.

problema: |
  La maggior parte delle pizzerie indipendenti comunica online con un PDF del
  menù, una scheda Google e un profilo Instagram. Quei canali dicono cosa c'è
  da mangiare. Raramente spiegano perché l'impasto riposa ventiquattr'ore,
  perché la lista degli ingredienti è corta apposta, o come si sta in sala il
  venerdì alle otto — i dettagli che di solito sono il vero motivo per cui si
  sceglie una pizzeria piuttosto che un'altra.

ricerca: |
  Il primo istinto per un sito di ristorazione è il menù digitale: foto di
  ogni piatto, prezzo sotto, pulsante "prenota" ripetuto in ogni sezione. È lo
  schema di quasi tutti i siti di pizzerie indipendenti — la stessa cosa che
  fanno già la scheda Google e il PDF, solo spostata online.

  L'ho scartato perché non avrebbe risolto il problema vero: non spiegava
  perché quell'impasto riposa un giorno intero o perché la lista degli
  ingredienti è corta apposta. Digitalizzare il menù avrebbe solo spostato
  online lo stesso canale debole che il sito doveva sostituire.

soluzione: |
  Ho scelto di raccontare il mestiere, non il menù: forno, impasto,
  ingredienti, sala — con il menù come una tappa del racconto, non
  l'apertura.

  L'impasto diventa una timeline legata allo scroll: un'immagine fissa e una
  barra che si riempie mentre si legge, così le ventiquattr'ore di riposo si
  percepiscono come tempo che passa, non come una riga di testo. Più avanti
  la pizza firma resta ferma a schermo mentre si scorre la sezione, si mette
  a fuoco e ruota leggermente — l'unico punto in cui il movimento serve solo
  a dare peso a un piatto, come una foto a piena pagina su una rivista.

  Il pulsante di prenotazione compare due volte sole, in apertura e alla fine
  naturale del racconto: non segue chi scorre lungo tutta la pagina, perché
  non ogni sezione deve chiedere un'azione.

  Anche il mobile è una composizione a parte, non il desktop rimpicciolito:
  il taglio diagonale dell'hero cambia angolo, i pannelli immagine di
  impasto e menù si abbassano perché non spingano il testo fuori schermo, e
  la navigazione diventa un pannello a schermo intero con tasto Escape e
  ritorno del focus — non un hamburger che apre la stessa lista rimpicciolita.

tecnica: |
  Next.js 16 con App Router e metadata basati su file (sitemap, robots,
  immagine Open Graph generata), componenti server per il testo e componenti
  client solo dove serve stato — la voce attiva del menù, il passo della
  timeline, la finestra di prenotazione.

  Ogni animazione di comparsa passa da un solo componente con tre varianti —
  dissolvenza, maschera, scala — attivato da IntersectionObserver e
  disattivato del tutto quando il sistema chiede meno movimento. Nessuna
  libreria di animazione, nessuna dipendenza da scroll-jacking.

risultato:
  - voce: Timeline dell'impasto legata allo scroll
    dettaglio: Immagine fissa e barra di avanzamento che si riempie mentre si legge, per far percepire il tempo di riposo prima ancora che il testo lo dica.
  - voce: La pizza firma tenuta a schermo
    dettaglio: Fissata e guidata dallo scroll per la durata della sua sezione — l'unico punto del sito dove il movimento serve solo a dare peso al piatto.
  - voce: Un solo pattern di animazione, disattivabile
    dettaglio: Dissolvenza, maschera, scala — sempre lo stesso componente, spento del tutto con prefers-reduced-motion.
  - voce: Il mobile non è il desktop rimpicciolito
    dettaglio: Taglio dell'hero, altezze dei pannelli immagine e menu di navigazione hanno valori dedicati, non una scala proporzionale del layout desktop.
  - voce: Zero dipendenze di runtime oltre React e Next.js
    dettaglio: Nessuna libreria di animazione o di componenti — il movimento gira su CSS e IntersectionObserver.
  - voce: Non è un locale vero
    dettaglio: Nessuna prenotazione, recensione o numero di attività reale. Il sito lo dichiara apertamente — è un concept, non una commessa travestita da una.

anteprima: pizzeria-moderna/01-home.jpg
schermate:
  - src: pizzeria-moderna/01-home.jpg
    alt: Hero con taglio diagonale, una margherita filante a destra e il claim "Pizza, senza fronzoli" a sinistra
  - src: pizzeria-moderna/02-impasto.jpg
    alt: Timeline dell'impasto legata allo scroll, con foto della lavorazione a mano e barra di avanzamento verticale
  - src: pizzeria-moderna/03-menu.jpg
    alt: Menu editoriale con l'elenco dei piatti a sinistra e un pannello immagine fisso a destra
  - src: pizzeria-moderna/04-la-pizza.jpg
    alt: La pizza firma inquadrata in un cerchio, fissata sullo schermo mentre si scorre la sezione
  - src: pizzeria-moderna/05-mobile.jpg
    alt: La stessa home su telefono, con il taglio diagonale dell'hero adattato al formato verticale

tecnologie:
  - Next.js 16
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - next/image

inEvidenza: true
ordine: 1

metaTitolo: Pizzeria Moderna — concept per una pizzeria di quartiere a Torino
metaDescrizione: Un sito che racconta il mestiere di una pizzeria invece del suo menù — impasto, forno, sala — con motion legato allo scroll e nessuna libreria di animazione. Next.js 16 e Tailwind v4.
---

L'ho tenuto volutamente fuori dal resto del portfolio dei clienti: qui il
cliente ero io, e quando il cliente sei tu è facile essere indulgenti. La
prova più onesta non è quanto è bello il risultato, ma se regge lo stesso
livello di attenzione che avrei chiesto per una commessa vera — dalla
direzione visiva al motion, fino a cosa succede quando `prefers-reduced-motion`
è attivo.
