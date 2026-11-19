---
titolo: Pasticceria Brinamora
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Una pasticceria di paese che voleva vendere anche a chi non ha tempo di fare la coda.
riassunto: Il sito di una pasticceria con l'ordine online e il ritiro al banco, più il pannello da cui il laboratorio accetta gli ordini e avvisa i clienti.
link: https://gxmich.github.io/pasticceria-brinamora-demo/
codice: https://github.com/GxMich/pasticceria-brinamora-demo

contesto: |
  Brinamora è una pasticceria che non esiste, in un paese che non esiste:
  Vallolmo, in Piemonte. Nome, indirizzo, telefono, prodotti, prezzi e
  recensioni sono inventati. Le foto vengono da Unsplash.

  Il caso però è comune. Una pasticceria artigianale con il laboratorio dietro il
  banco, la colazione al mattino, le monoporzioni, le torte da ordinare il giorno
  prima. Il telefono suona tutto il giorno per chiedere cosa c'è e per prenotare
  una torta, e la mattina c'è la coda.

  Tutte le pagine sono noindex e i recapiti sono finti: un sito dimostrativo non
  deve finire nelle ricerche locali.

problema: |
  Una pasticceria vende soprattutto in due momenti: la colazione, quando la gente
  ha fretta, e il fine settimana, quando arrivano gli ordini delle torte. In
  entrambi i casi il collo di bottiglia è il banco. Chi è in coda non compra di
  più, e chi telefona per una torta tiene occupata una persona che dovrebbe
  servire.

  Il sito doveva fare due cose. Far venire voglia di passare, con le foto e i
  prezzi veri del banco. E togliere lavoro al banco, facendo arrivare gli ordini
  già completi: cosa, quando, nome e telefono.

ricerca: |
  La prima versione mandava l'ordine su WhatsApp. Il cliente riempiva il
  carrello, sceglieva l'orario e si apriva un messaggio già scritto. Costava
  poco e non serviva un server.

  L'ho scartata dopo averla provata dal lato della pasticceria. Ogni ordine
  arrivava come un messaggio da ricopiare a mano. Niente impediva di scegliere
  un orario in cui il negozio è chiuso, o una torta intera per lo stesso giorno.
  Il pagamento restava al banco, e un ordine non ritirato era una perdita secca.

  La seconda versione ha un vero flusso d'ordine: regole controllate prima di
  accettare, un pannello per la pasticceria, una pagina che il cliente può
  seguire. È più lavoro da costruire, ma toglie lavoro ogni giorno a chi sta al
  banco.

soluzione: |
  La home racconta il banco. La colazione è una lista che si scorre: passando su
  un prodotto cambia la foto grande accanto. Le torte moderne scorrono di lato,
  con gli strati elencati come in una scheda. Mignon e macaron sono una griglia
  con il prezzo al pezzo. In alto c'è sempre lo stato del negozio, aperto o
  chiuso, calcolato sull'ora del visitatore.

  Il negozio online parte dal carrello e chiede solo il necessario. Il giorno e
  l'orario di ritiro si scelgono tra quelli in cui il negozio è aperto, a passi
  di un quarto d'ora. Le torte intere si ritirano dal giorno dopo e il prezzo lo
  conferma la pasticceria. Si paga online o al ritiro, e c'è il campo per il
  buono sconto.

  Dopo l'ordine il cliente riceve una pagina che si aggiorna da sola: ricevuto,
  confermato, pronto, ritirato. Può aggiungere il ritiro al calendario. Quando
  l'ordine risulta ritirato, la stessa pagina propone un sondaggio di quattro
  domande che regala un buono del 20% valido quindici giorni, dal lunedì al
  venerdì: serve a riportare gente nei giorni più tranquilli.

  Il pannello della pasticceria mostra gli ordini in colonne (da confermare, in
  preparazione, pronti) con un suono quando ne arriva uno nuovo. Da lì si accetta
  o si rifiuta, si scrive il prezzo delle torte, si segnano i prodotti esauriti,
  si mettono in pausa gli ordini online, si verifica un buono alla cassa e si
  leggono i risultati dei sondaggi. Ogni cambio di stato ha il suo messaggio
  WhatsApp già scritto per il cliente.

tecnica: |
  Il sito è HTML, CSS e JavaScript senza framework. Le animazioni allo scroll
  usano GSAP e Lenis e si spengono con prefers-reduced-motion. Il catalogo sta
  in un solo file, menu-data.js, da cui leggono home, menu completo, pagina delle
  torte su misura e negozio.

  Nella versione completa gli ordini passano da funzioni serverless con un
  database, e il pagamento online autorizza la carta all'ordine e incassa solo
  quando la pasticceria accetta: se rifiuta, il cliente non paga nulla. Su
  GitHub Pages un server non c'è, quindi ho portato le stesse rotte nel browser
  (app/demo-api.js). Le regole sono le stesse: orari di ritiro, preavviso per le
  torte, validità dei buoni, passaggi di stato. I dati restano nel localStorage
  di chi visita, e i messaggi WhatsApp vengono mostrati invece che inviati.

  Al primo accesso il pannello contiene tre ordini e cinque sondaggi di esempio,
  così chi apre la demo vede subito come lavora la pasticceria.

risultato:
  - voce: Ordini già completi, negli orari giusti
    dettaglio: Giorno e orario si scelgono solo quando il negozio è aperto, le torte intere solo dal giorno dopo. Gli errori li ferma il sistema, prima che arrivino al banco.
  - voce: Un pannello pensato per il laboratorio
    dettaglio: Ordini in colonne per stato, suono all'arrivo, prezzo delle torte da scrivere all'accettazione, prodotti esauriti e pausa degli ordini con un tocco.
  - voce: Il cliente sa sempre a che punto è
    dettaglio: Una pagina dell'ordine che si aggiorna da sola, con il ritiro da aggiungere al calendario e un messaggio pronto a ogni cambio di stato.
  - voce: Un buono che riempie i giorni feriali
    dettaglio: Dopo il ritiro, quattro domande e un buono del 20% valido dal lunedì al venerdì. I risultati dei sondaggi si leggono nel pannello.
  - voce: Un catalogo, un file
    dettaglio: Home, menu, torte su misura e negozio leggono gli stessi 39 prodotti da menu-data.js. Un prezzo si cambia in un punto solo.
  - voce: Demo che funziona davvero, senza server
    dettaglio: Il giro completo dell'ordine gira nel browser con le stesse regole della versione con database. Niente esce dal dispositivo di chi la prova.

anteprima: pasticceria-brinamora/01-home.jpg
schermate:
  - src: pasticceria-brinamora/01-home.jpg
    alt: Home della pasticceria con il titolo "Il banco del mattino" e un croissant appena sfornato dentro una cornice ad arco
  - src: pasticceria-brinamora/02-colazione.jpg
    alt: La colazione come lista con i prezzi, accanto alla foto grande del prodotto selezionato
  - src: pasticceria-brinamora/03-creazioni.jpg
    alt: Le torte moderne su fondo color mora, che scorrono di lato con gli strati elencati sotto ogni foto
  - src: pasticceria-brinamora/04-shop.jpg
    alt: Il negozio online con ricerca, categorie, prodotti consigliati e il carrello sempre visibile a destra
  - src: pasticceria-brinamora/05-pannello.jpg
    alt: Il pannello della pasticceria con gli ordini divisi in da confermare, in preparazione e pronti al banco
  - src: pasticceria-brinamora/06-mobile.jpg
    alt: La home su telefono, con il pulsante per ordinare sempre in alto

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - GSAP
  - Lenis
  - localStorage

inEvidenza: false
ordine: 50

metaTitolo: Pasticceria Brinamora — sito dimostrativo
metaDescrizione: Sito di pasticceria con ordine online e ritiro al banco, pagina di tracking, pannello per il laboratorio e sondaggio con buono. Attività di fantasia.
---

Il punto del progetto è il banco. Ogni scelta, dalla lista della colazione al
pannello degli ordini, serve a far arrivare la gente quando il pacchetto è già
pronto. Con una pasticceria vera, il lavoro che resta è confermare prezzi, orari
e regole dei buoni prima di aprire gli ordini.
