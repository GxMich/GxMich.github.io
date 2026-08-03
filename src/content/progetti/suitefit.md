---
titolo: SuiteFit
cliente: Progetto su iniziativa
tipo: tool
anno: 2026
natura: iniziativa
stato: In beta — funzionante, con dati di prova, UI e alcune funzioni da rifinire
durata: In lavorazione dal 2026
riassunto: Una piattaforma dove personal trainer e nutrizionista lavorano sullo stesso cliente, e il cliente li vede tutti e due da un accesso solo.

contesto: |
  Chi segue un percorso serio in palestra spesso ha due professionisti: il
  personal trainer per l'allenamento, il nutrizionista per la dieta. I due non
  parlano quasi mai fra loro, e il cliente diventa il postino: riceve un PDF
  dall'uno, un foglio dall'altro, e se cambia qualcosa deve dirlo due volte.

  Dall'altra parte, il professionista tiene i clienti su un misto di WhatsApp,
  Excel e memoria. Le scadenze dei rinnovi sono la prima cosa che si perde,
  perché non esistono da nessuna parte se non nella testa di chi le ha promesse.

problema: |
  Il modello dei dati è la parte difficile. Un cliente può avere un trainer, un
  nutrizionista, entrambi o nessuno. I due professionisti devono vedere il
  cliente ma non il lavoro dell'altro, mentre il cliente deve vedere tutto in
  un posto solo. Un unico rapporto "professionista-cliente" non regge: appena
  ne aggiungi un secondo tipo, i permessi diventano una serie di eccezioni.

  Poi c'è il problema noioso e obbligatorio: qui dentro finiscono dati sulla
  salute delle persone. Peso, misure, piani alimentari. Non è materiale su cui
  si può improvvisare la cancellazione dell'account.

soluzione: |
  Ho tenuto due rapporti separati invece di uno generico — trainer-cliente e
  nutrizionista-cliente sono tabelle distinte, ognuna con il suo stato. I
  permessi diventano una domanda semplice a cui si può rispondere sempre, e
  aggiungere un terzo tipo di professionista domani non richiede di riscrivere
  quelli esistenti.

  Il cliente ha una sola schermata che unisce le due parti: la scheda di
  allenamento e il piano alimentare stanno vicini perché è così che vive la sua
  settimana, non divisi per chi glieli ha dati.

  Sulla cancellazione dei dati non ho improvvisato: cancellazione morbida con
  finestra di ripensamento, un processo pianificato che rimuove davvero quello
  che è scaduto, registro dei consensi separato. È la parte che non si vede in
  nessuna schermata ed è quella che ho riscritto più volte.

risultato:
  - voce: Quattro ruoli, un accesso a testa
    dettaglio: Cliente, personal trainer, nutrizionista e amministratore. Ognuno entra dallo stesso punto e vede solo la sua parte.
  - voce: Il cliente vede entrambi i professionisti
    dettaglio: Scheda di allenamento e piano alimentare nella stessa pagina, anche se arrivano da due persone che non si sono mai parlate.
  - voce: Scadenze e rinnovi
    dettaglio: Da incassare, incassato, scaduto. È la funzione che risolve il problema più concreto del professionista, cioè accorgersi che un abbonamento è finito prima che finisca.
  - voce: Costruttore di schede e libreria esercizi
    dettaglio: Composizione della scheda per trascinamento, con una libreria di esercizi ricercabile e modelli riutilizzabili.
  - voce: Dati sanitari trattati come tali
    dettaglio: Cancellazione morbida con recupero, pulizia pianificata dei dati scaduti, registro dei consensi, limite ai tentativi di accesso.
  - voce: Cosa manca
    dettaglio: È in beta e i dati che si vedono sono di prova — nessun professionista vero la sta ancora usando con clienti veri. Interfaccia e alcune funzioni sono da rifinire. Non ci sono numeri di utilizzo perché non c'è ancora utilizzo.

anteprima: suitefit/01-costruttore-schede.png
schermate:
  - src: suitefit/01-costruttore-schede.png
    alt: "Costruttore di schede: dettagli a sinistra, righe di esercizi con serie, ripetizioni e recupero a destra"
  - src: suitefit/02-dashboard.png
    alt: Cruscotto del professionista con clienti attivi, schede assegnate, scadenze e importi da incassare
  - src: suitefit/03-clienti.png
    alt: Elenco clienti con email, numero di schede, stato e codice invito
  - src: suitefit/04-scadenze.png
    alt: Pagina scadenze con da incassare, incassato storico e pagamenti scaduti

tecnologie:
  - PHP
  - MySQL
  - JavaScript
  - HTML5
  - CSS3

inEvidenza: true
ordine: 3

metaTitolo: SuiteFit — gestionale per personal trainer e nutrizionisti
metaDescrizione: "Piattaforma dove trainer e nutrizionista seguono lo stesso cliente da profili separati, e il cliente vede scheda e dieta in un posto solo. PHP e MySQL, in beta."
---

La tentazione era fare un rapporto solo, chiamarlo "professionista-cliente" e
metterci dentro un campo tipo. Ci ho provato, e il codice si è riempito di
`if` sul tipo sparsi ovunque: nei permessi, nelle notifiche, nelle query. Ogni
funzione nuova doveva ricordarsi di controllare.

Due tabelle separate sembrano più lavoro e ne fanno di meno. La domanda
"questo nutrizionista può vedere questo cliente?" ha una risposta sola, in un
posto solo, e non cambia quando aggiungo qualcosa altrove.
