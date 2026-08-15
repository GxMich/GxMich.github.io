---
titolo: Cruscotto di monitoraggio SLA
cliente: Operatore logistico — progetto interno
tipo: tool
anno: 2025
natura: interno
stato: In uso
durata: Alcune settimane
sfida: Numeri che arrivavano il lunedì, quando non c'era più niente da correggere.
riassunto: Gli indicatori di servizio si leggevano il lunedì per la settimana finita. Ora si vedono mentre succedono, e avvisano da soli.

contesto: |
  Chi lavora sotto accordi di livello di servizio ha dei numeri da rispettare:
  puntualità delle consegne, qualità, tasso di reso. Sono numeri contrattuali, con
  penali attaccate.

  Anche questo è lavoro interno, quindi i valori reali non compaiono qui. Racconto
  l'architettura e le scelte, non i dati.

problema: |
  I numeri esistevano già, ma arrivavano in un report settimanale. Vuol dire che
  un peggioramento cominciato di martedì lo si leggeva il lunedì successivo, con
  sei giorni di scivolamento già accumulati e nessun modo di recuperarli.

  Un rapporto che descrive un problema chiuso non è uno strumento di lavoro, è un
  verbale. Serviva sapere le cose mentre erano ancora modificabili.

soluzione: |
  Ho spostato i dati su un archivio pensato per le serie temporali, invece di
  interrogare il gestionale a ogni caricamento della pagina. Il gestionale è
  costruito per le transazioni, non per rispondere trecento volte al giorno alla
  domanda "come sta andando la media mobile": tenerlo fuori dal percorso di lettura
  è stata la decisione che ha reso possibile tutto il resto.

  Sulle soglie ho scelto tre fasce invece di una linea sola. Una soglia unica
  produce due comportamenti, entrambi sbagliati: o scatta tardi, o scatta così
  spesso che la gente smette di guardarla. Con la fascia intermedia esiste uno
  stato "attenzione" che si può ancora raddrizzare senza svegliare nessuno, e
  l'allarme vero resta raro abbastanza da essere credibile.

  Gli avvisi salgono per gradi: prima il canale di gruppo, poi la posta, e il
  messaggio sul telefono solo per la fascia critica. Chi riceve una notifica di
  notte deve poter dare per scontato che valga la pena alzarsi.

risultato:
  - voce: Tempo di reazione
    dettaglio: Da un report settimanale a un quadro che si aggiorna durante la giornata.
  - voce: Tre fasce invece di una soglia
    dettaglio: Verde, attenzione, critico. La fascia di mezzo esiste per intervenire prima che il numero diventi contrattuale.
  - voce: Avvisi per gradi
    dettaglio: Canale di gruppo, posta, messaggio sul telefono. L'ultimo scalino resta raro per restare credibile.
  - voce: Carico sul gestionale
    dettaglio: "Le letture del cruscotto non lo toccano: passano da un archivio separato pensato per le serie temporali."

anteprima: monitoraggio-sla/copertina.jpg
schermate:
  - src: monitoraggio-sla/soglie.svg
    alt: Un andamento che sale verso la scadenza contrattuale attraversando tre fasce. Nella prima tutto procede, nella seconda parte l'avviso ed è ancora possibile intervenire, nella terza la scadenza è già superata.

tecnologie:
  - Python
  - Archivio a serie temporali
  - D3.js
  - Avvisi via SMS e posta

inEvidenza: false
ordine: 4

metaTitolo: Cruscotto SLA — monitoraggio in tempo reale con avvisi
metaDescrizione: Da un report settimanale a un quadro che si aggiorna durante la giornata. Tre fasce di soglia invece di una, avvisi a gradi, archivio a serie temporali.
---

La scelta di cui vado più fiero è la più noiosa: la fascia gialla. Tecnicamente
non fa niente che non facesse la soglia singola, sposta solo un numero. In pratica
ha cambiato il rapporto delle persone con il cruscotto, perché ha reso l'allarme
rosso un evento invece che un rumore di fondo. Gli strumenti di monitoraggio non
muoiono quando sbagliano: muoiono quando la gente smette di crederci.
