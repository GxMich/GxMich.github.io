---
titolo: Tracciamento pallet in magazzino
cliente: Operatore logistico — progetto interno
tipo: tool
anno: 2025
natura: interno
stato: In uso
durata: Sviluppo e messa a regime nell'arco di alcuni mesi
riassunto: Registrare un pallet richiedeva un paio di minuti di trascrizione a mano. Ora è una scansione e la riga si scrive da sola.

contesto: |
  Un centro di distribuzione dove i pallet in uscita vanno registrati uno per uno:
  cosa contengono, dove sono fisicamente adesso, per che destinazione partono, con
  che documentazione. Il numero di pallet al giorno è alto abbastanza da rendere
  la trascrizione manuale il collo di bottiglia dell'intero turno.

  Il lavoro è stato fatto internamente all'azienda, quindi qui non trovi né il
  nome né i dati operativi. Quello che posso raccontare è il problema tecnico e
  come l'ho affrontato.

problema: |
  Non era la lentezza il vero costo, era l'errore. Un codice trascritto male su un
  pallet in uscita non si scopre in magazzino: si scopre a destinazione, quando la
  merce è già viaggiata. A quel punto il rientro costa molte volte quello che
  sarebbe costato accorgersene al momento.

  Il secondo problema era che la posizione fisica dei pallet viveva nella testa
  degli operatori del turno. A cambio turno, quell'informazione non passava.

soluzione: |
  Ho tolto la tastiera dal percorso. La scansione del codice a barre compila la
  riga, e l'operatore conferma invece di digitare: gli errori di trascrizione non
  si riducono, spariscono come categoria, perché non c'è più una trascrizione.

  La destinazione viene proposta dal sistema in base al contenuto, non scelta da
  un elenco lungo. È la differenza fra chiedere all'operatore di ricordare e
  chiedergli di verificare — la seconda regge la stanchezza di fine turno, la
  prima no.

  Sulla posizione ho scelto una lavagna condivisa aggiornata in tempo reale invece
  di un report da consultare. Chi entra in turno vede lo stato senza dover chiedere
  a chi esce, e questo ha risolto il passaggio di consegne senza toccare le procedure.

risultato:
  - voce: Tempo per pallet
    dettaglio: Da circa due minuti di compilazione manuale a pochi secondi con la scansione.
  - voce: Errori di trascrizione
    dettaglio: Eliminati alla radice sui campi che ora arrivano dal codice a barre, invece che ridotti con un controllo a valle.
  - voce: Passaggio di consegne
    dettaglio: Lo stato del magazzino è visibile a chi entra in turno senza doverlo chiedere a chi esce.
  - voce: Documentazione
    dettaglio: Le etichette e i report di spedizione escono dal sistema già compilati, in CSV o PDF.

anteprima: gestione-pallet/copertina.jpg
schermate:
  - src: gestione-pallet/flusso.svg
    alt: "Confronto fra i due flussi. Prima: leggere l'etichetta, trascrivere a mano, ricopiare nel gestionale, cercare l'errore quando non torna — due minuti. Dopo: una scansione e la riga si scrive da sola, in pochi secondi."

tecnologie:
  - Node.js
  - PostgreSQL
  - Scansione codici a barre
  - Aggiornamenti in tempo reale

inEvidenza: true
ordine: 3

metaTitolo: Tracciamento pallet — automazione per magazzino logistico
metaDescrizione: Da due minuti di trascrizione manuale per pallet a una scansione. Come ho eliminato gli errori di trascrizione alla radice invece di controllarli a valle.
---

La lezione che mi porto dietro da questo lavoro riguarda il turno di notte. Le
soluzioni che funzionano alle nove del mattino con un operatore riposato non
dicono niente: la prova vera è alle quattro, alla fine di un turno lungo, quando
chi usa lo strumento ha smesso di leggere e va a memoria. Ogni scelta di questo
progetto è stata pesata su quel momento lì.
