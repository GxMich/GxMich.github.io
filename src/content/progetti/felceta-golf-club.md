---
titolo: Felceta Golf & Country Club
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un circolo con due percorsi, una villa e quattro tipi di visitatore diversi.
riassunto: Il sito di un golf club che racconta i due percorsi buca per buca e porta ogni visitatore alla sua richiesta, già compilata.
link: https://gxmich.github.io/felceta-golf-club-demo/
codice: https://github.com/GxMich/felceta-golf-club-demo

contesto: |
  Felceta Golf & Country Club non esiste. Il circolo, il paese di Colle Albero,
  i due percorsi, le distanze, i prezzi e i recapiti sono inventati. Ho
  immaginato un circolo con trentasei buche, una villa dell'Ottocento con camere,
  una sala per eventi e un country club con piscina e tennis.

  Tutte le pagine hanno noindex e il file robots.txt blocca i motori di ricerca.
  Un circolo finto non deve finire nelle ricerche di chi cerca dove giocare.

problema: |
  Sul sito di un golf club arrivano persone che vogliono cose molto diverse. Il
  giocatore di passaggio vuole sapere com'è il percorso e quanto costa il green
  fee. Chi cerca un weekend guarda le camere. Un'azienda vuole una sala per
  sessanta persone. Chi abita vicino pensa di diventare socio.

  Di solito questi siti mettono tutto nello stesso menu e chiudono ogni pagina
  con lo stesso modulo di contatto. Il percorso, che è il motivo per cui si va in
  un circolo, si riduce a una foto e a una riga con par e lunghezza.

ricerca: |
  Ho pensato prima a una home con le quattro aree in quattro card uguali, ognuna
  con il suo pulsante «scopri di più». È la struttura più diffusa nei siti di
  circoli e resort.

  L'ho scartata perché mette tutto sullo stesso piano. Il golf diventa una voce
  fra le altre, e il visitatore deve capire da solo da dove cominciare. In più
  ogni card porta a una pagina diversa, e la richiesta finale riparte da zero:
  chi ha già scelto data e camera deve riscriverle nel modulo.

soluzione: |
  In apertura c'è un pianificatore con una sola domanda: «Vorrei giocare,
  soggiornare, organizzare un evento o diventare socio». I campi cambiano in base
  alla risposta, e il pulsante porta alla richiesta con data, notti o numero di
  ospiti già compilati.

  I due percorsi hanno una pagina ciascuno con un esploratore delle diciotto
  buche. Per ogni buca ci sono lo schema, le distanze dalle quattro partenze, il
  par, l'handicap e un consiglio di gioco. Si cambia buca con i numeri, con le
  frecce della tastiera o con uno swipe sul telefono. Sotto c'è lo score card
  completo.

  La buca più fotogenica, un par 3 con il green su un'isola nel lago, ha una
  sezione sua in home. La foto si apre a partire dal green mentre si scorre la
  pagina, e un link porta direttamente a quella buca nell'esploratore.

  La richiesta finale ha due passaggi: preferenze e riepilogo. Le date vengono
  controllate (la partenza deve venire dopo l'arrivo) e il testo si può copiare.
  Nella demo l'invio è simulato.

tecnica: |
  React con Vite e React Router, pubblicato su GitHub Pages con una GitHub
  Action. Le pagine sono vere rotte, quindi ogni buca ha il suo indirizzo
  (?hole=14) e si può condividere. Per far funzionare gli indirizzi diretti su
  Pages ho aggiunto un 404.html che rimanda all'app con il percorso richiesto.

  Gli schemi delle buche sono disegnati in SVG dal codice. Ogni buca nei dati ha
  pochi campi: verso del dogleg, posizione dell'acqua, numero di bunker, alberi
  a destra o a sinistra. Da questi il componente calcola la linea di gioco, il
  fairway e la posizione degli ostacoli. Per aggiungere una buca basta una riga
  di dati, senza disegni da preparare.

  Le lunghezze totali dei percorsi non sono scritte a mano: vengono sommate dai
  dati delle buche, così score card, tabella delle partenze e home dicono sempre
  lo stesso numero. Le animazioni usano GSAP e ScrollTrigger e si spengono con
  prefers-reduced-motion. Il meteo arriva da Open-Meteo, senza chiave e senza
  cookie.

risultato:
  - voce: Una domanda in apertura per quattro visitatori diversi
    dettaglio: Il pianificatore cambia campi in base all'intenzione e porta alla richiesta con le preferenze già compilate.
  - voce: Diciotto buche consultabili, per due percorsi
    dettaglio: Schema SVG, distanze dalle quattro partenze, handicap e consiglio per ogni buca, con navigazione da tastiera, swipe e indirizzo condivisibile.
  - voce: Schemi generati dai dati
    dettaglio: Ogni buca è descritta da pochi campi e il disegno si ricava da lì. Score card e lunghezze totali sono calcolati, non copiati.
  - voce: Richiesta in due passaggi con riepilogo
    dettaglio: Validazione delle date, riepilogo modificabile e testo copiabile. L'invio nella demo è simulato e nessun dato lascia il browser.
  - voce: Italiano e inglese
    dettaglio: Il cambio lingua mantiene la pagina e i parametri della richiesta in corso.
  - voce: Nessun dato reale
    dettaglio: Circolo e paese inventati, telefono finto, email su dominio .example, noindex su tutte le pagine e foto da Unsplash con i crediti nel repository.

anteprima: felceta-golf-club/01-home.jpg
schermate:
  - src: felceta-golf-club/01-home.jpg
    alt: Home con la foto aerea di un percorso con laghi e bunker, il titolo "Trentasei buche, tra le colline" e il pianificatore della visita in basso
  - src: felceta-golf-club/02-percorsi.jpg
    alt: Confronto fra i due percorsi a schede, con la foto del green del Bosco, la descrizione e i numeri di buche, par e lunghezza
  - src: felceta-golf-club/03-isola.jpg
    alt: Sezione dedicata alla buca 14, con il green su un'isola nel lago e il pulsante per aprirla nell'esploratore
  - src: felceta-golf-club/04-buche.jpg
    alt: Esploratore delle buche con lo schema SVG della buca 5, le distanze dalle quattro partenze e il consiglio di gioco
  - src: felceta-golf-club/05-ospitalita.jpg
    alt: Scelta della camera nella pagina ospitalità, con l'elenco delle tipologie a sinistra e la Junior Suite selezionata a destra
  - src: felceta-golf-club/06-mobile.jpg
    alt: La home su telefono, con il titolo sulla foto aerea e il menu compatto in alto

tecnologie:
  - React
  - TypeScript
  - Vite
  - React Router
  - GSAP
  - SVG
  - GitHub Pages

inEvidenza: false
ordine: 50

metaTitolo: Felceta Golf & Country Club — sito dimostrativo
metaDescrizione: Sito per un golf club di fantasia con due percorsi esplorabili buca per buca, schemi SVG generati dai dati e una richiesta guidata in due passaggi.
---

Il lavoro più lungo è stato l'esploratore delle buche. Volevo che un giocatore
potesse preparare il giro dal divano, buca per buca, come si fa con il libretto
del percorso. Disegnare gli schemi dal codice mi ha permesso di farlo senza
grafiche da preparare a mano: se il circolo cambia una partenza, si cambia un
numero nei dati e tutto il resto si aggiorna.
