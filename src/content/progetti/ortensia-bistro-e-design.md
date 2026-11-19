---
titolo: Ortensia bistrò e design
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un locale che fa tre cose in una giornata, e vende anche le sedie su cui fai colazione.
riassunto: Il sito di un bistrò che apre col caffè e chiude a notte, con il menu completo e ricercabile, lo stato aperto o chiuso in tempo reale e una prenotazione che prepara il messaggio al posto tuo.
link: https://gxmich.github.io/ortensia-bistro-e-design-demo/
codice: https://github.com/GxMich/ortensia-bistro-e-design-demo

contesto: |
  Ortensia è un bistrò che non esiste, in un paese che non esiste: Castelmarzo,
  in Piemonte. Nome, indirizzo, telefono, menu, prezzi e recensioni sono
  inventati. Il telefono è +39 000 000 0000 e l'email finisce in .example.

  Il locale immaginato fa colazione, pranzo, aperitivo e cena. Fa la pizza, i
  piatti piemontesi e i cocktail. In più gli oggetti della sala, cioè lampade,
  ceramiche e alcune sedie, sono in vendita.

  Tutte le pagine hanno noindex e il robots.txt blocca tutto. Un locale finto
  non deve finire nelle ricerche di chi cerca davvero dove mangiare.

problema: |
  Un bistrò aperto tutto il giorno ha visitatori diversi a ore diverse. Alle
  otto qualcuno vuole sapere se è già aperto. A mezzogiorno qualcuno vuole il
  menu con i prezzi. Il sabato sera qualcuno vuole un tavolo e basta.

  Di solito questi siti mettono il menu in un PDF, gli orari in fondo al footer
  e un numero di telefono. Le tre domande più frequenti restano senza una
  risposta veloce. E la parte "design" del locale finisce in una pagina che non
  apre nessuno.

ricerca: |
  La prima idea era una pagina unica, lunga, con tutto dentro. L'ho scartata
  quando ho messo insieme i contenuti: un menu di dodici categorie, gli orari
  con chiusure dopo mezzanotte, una galleria e un modulo. Su una sola pagina il
  menu schiacciava tutto il resto, e da telefono non si arrivava mai al modulo.

  Ho scartato anche il menu come elenco statico copiato in una pagina. Con
  cinquanta voci serve poter cercare "burrata" o "vegetariana" senza scorrere.

  Alla fine ho diviso il sito in sei pagine, ognuna con un compito solo, e ho
  tenuto in ogni pagina gli stessi due punti fermi: lo stato aperto o chiuso e
  il pulsante per prenotare.

soluzione: |
  In alto, su ogni pagina, c'è lo stato del locale: «Aperto, chiude alle 15:00»
  oppure «Chiuso, apre alle 8:00». Si calcola sull'ora italiana, anche per chi
  guarda dall'estero, e gestisce le sere che finiscono all'una di notte e il
  lunedì di chiusura.

  La home racconta il locale in tre capitoli: l'impasto della pizza, i nomi dei
  fiori, la serata. Da desktop la foto resta ferma mentre il testo scorre. Poi
  c'è un'anteprima del menu con le fasce di prezzo per categoria, calcolate dal
  menu stesso: se cambia un prezzo, cambia anche l'anteprima.

  Il menu ha una barra delle categorie che segue lo scorrimento e una ricerca
  istantanea per piatto o ingrediente.

  La prenotazione è un modulo corto: giorno, ora, persone, nome, note. Le ore
  proposte sono solo quelle prenotabili per quel giorno, e oggi spariscono
  quelle già passate. Il sito compone il messaggio e lo mostra in anteprima.
  In questa demo il messaggio resta sullo schermo e non parte verso nessuno.

  Gli oggetti in vendita compaiono in home, nella galleria e nelle domande
  frequenti, dove si spiega come comprarli.

tecnica: |
  Next.js 16 in export statico, quindi solo file HTML, CSS e JavaScript su
  GitHub Pages. Tutti i testi, i prezzi e gli orari stanno in pochi file di
  contenuto: chi gestisce il locale cambia un orario in un punto e lo vede
  aggiornato nella tabella, nello stato in tempo reale e negli orari del
  modulo.

  Le foto passano da uno script con sharp che genera AVIF, WebP e JPEG in
  cinque larghezze, più un'anteprima sfocata minuscola per il caricamento. I
  ritagli a proporzione fissa, come la banda dell'hero, sono generati dallo
  stesso script.

  Le animazioni usano GSAP con ScrollTrigger e si spengono quando il sistema
  chiede movimento ridotto. I font sono serviti dal sito, la mappa è un
  disegno: la pagina non chiama servizi esterni e non ha bisogno del banner
  dei cookie.

risultato:
  - voce: Stato aperto o chiuso su ogni pagina
    dettaglio: Calcolato sull'ora italiana, con le chiusure dopo mezzanotte e il giorno di riposo. La riga del giorno si evidenzia anche nella tabella degli orari.
  - voce: Menu completo con ricerca
    dettaglio: Dodici categorie, barra che segue lo scorrimento e ricerca per piatto o ingrediente, con il numero di voci trovate.
  - voce: Prenotazione in un solo modulo
    dettaglio: Propone solo gli orari prenotabili di quel giorno e mostra il messaggio pronto. Nella demo non invia niente.
  - voce: Prezzi scritti una volta sola
    dettaglio: Le fasce di prezzo della home e i piatti citati nella pagina della cucina leggono i dati dal menu.
  - voce: Galleria con filtri e finestra a tutto schermo
    dettaglio: Mosaico di tredici foto filtrabile per tema, con lightbox che si usa anche da tastiera.
  - voce: Attività di fantasia dichiarata
    dettaglio: Avviso nel footer di ogni pagina, recensioni marcate come dimostrative, noindex e robots.txt che blocca tutto.

anteprima: ortensia-bistro-e-design/01-home.jpg
schermate:
  - src: ortensia-bistro-e-design/01-home.jpg
    alt: Home di Ortensia, titolo «Si mangia, si beve, si porta a casa.» sopra una banda con una pizza con crudo e burrata, e lo stato del locale nell'header
  - src: ortensia-bistro-e-design/02-racconto.jpg
    alt: Il primo capitolo del racconto in home, «L'impasto», con il testo a sinistra e la foto di una pizza agli spinaci a destra
  - src: ortensia-bistro-e-design/03-bistro.jpg
    alt: La pagina «Il bistrò», titolo «Un bistrò che è anche un negozio» con la foto di un tavolo tondo e l'inizio della giornata tipo
  - src: ortensia-bistro-e-design/04-menu.jpg
    alt: La pagina del menu alla sezione Pizze, con la barra delle categorie e la ricerca a sinistra e le pizze su due colonne con i prezzi
  - src: ortensia-bistro-e-design/05-prenotazione.jpg
    alt: Il modulo di prenotazione compilato, con giorno, ora, persone, nome, note e l'anteprima del messaggio
  - src: ortensia-bistro-e-design/06-mobile.jpg
    alt: La home su telefono, con la foto della pizza in alto, il titolo, lo stato del locale e il pulsante per prenotare

tecnologie:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - GSAP
  - sharp

inEvidenza: false
ordine: 50

metaTitolo: Ortensia bistrò e design — sito dimostrativo
metaDescrizione: Sito per un bistrò aperto tutto il giorno, con stato aperto o chiuso in tempo reale, menu ricercabile e prenotazione guidata. Attività di fantasia.
---

Ho lavorato su una domanda semplice: cosa vuole sapere chi apre il sito di un
bistrò, a che ora lo apre. La risposta cambia nel corso della giornata, e il
sito la tiene sempre in alto. Con un locale vero andrebbero confermati orari,
prezzi e menu, e il modulo andrebbe collegato al canale che il locale usa
davvero per le prenotazioni.
