---
titolo: Carnevale di Trino
cliente: Manifestazione tradizionale, Trino (VC)
tipo: sito
anno: 2026
natura: iniziativa
stato: Completo
durata: Poche settimane
riassunto: Dieci pagine per una manifestazione che vive di date, personaggi e memoria collettiva, fatte per essere aggiornate da chi non scrive codice.

contesto: |
  Il Carnevale di Trino è una manifestazione tradizionale del Vercellese, con i
  suoi personaggi ricorrenti, un programma che cambia ogni anno, una canzone e una
  poesia ufficiali. Non è un evento commerciale: è una cosa di paese, portata
  avanti da volontari che hanno altri lavori.

problema: |
  Un sito di manifestazione ha un ciclo di vita crudele. Serve moltissimo per tre
  settimane l'anno e poi resta fermo undici mesi, e chi lo aggiorna non è la stessa
  persona ogni anno.

  Questo esclude quasi tutto quello che si sceglierebbe di istinto. Un gestionale
  di contenuti va aggiornato per sicurezza anche negli undici mesi in cui nessuno
  lo guarda, e quando arriva gennaio chi deve caricare il programma non è chi
  l'aveva caricato l'anno prima e non ha più le credenziali.

soluzione: |
  Ho scelto pagine statiche, una per sezione, senza base dati e senza pannello di
  amministrazione. È la scelta che nel breve costa di più — l'aggiornamento è un
  file da modificare, non un modulo da compilare — e nel lungo è l'unica che
  sopravvive al ricambio dei volontari.

  Un sito così non ha una versione da aggiornare, non ha una scadenza, non ha
  credenziali da recuperare. Fra cinque anni funziona ancora, e chiunque sappia
  aprire un file di testo può cambiare una data.

  Le sezioni seguono il modo in cui la gente cerca queste cose: prima il programma
  con le date, che è il novanta per cento delle visite di febbraio, e solo dopo la
  storia, i regnanti, la canzone, la poesia. La parte affettiva conta, ma non
  quando qualcuno sta cercando a che ora parte la sfilata.

risultato:
  - voce: Struttura
    dettaglio: Dieci pagine — programma, storia, regnanti, galleria, canzone, poesia, video, contatti, privacy — ognuna raggiungibile in un clic dalla home.
  - voce: Aggiornamento annuale
    dettaglio: Cambiare il programma vuol dire modificare un file. Nessuna credenziale da recuperare a distanza di un anno.
  - voce: Nessuna manutenzione fra un'edizione e l'altra
    dettaglio: Non essendoci base dati né pannello di amministrazione, non c'è niente da aggiornare per sicurezza negli undici mesi di pausa.
  - voce: Costo di gestione
    dettaglio: Solo lo spazio web. Nessun canone di piattaforma.

anteprima: carnevale-trino/01-dediche.png
schermate:
  - src: carnevale-trino/01-dediche.png
    alt: Pagina per lasciare una dedica, con campo nome e messaggio che finisce sulla bacheca pubblica
  - src: carnevale-trino/02-lettera.png
    alt: La lettera aperta al Capitano e alla Castellana dell'edizione, su fondo chiaro

tecnologie:
  - HTML e CSS senza framework
  - JavaScript
  - Pagine statiche

inEvidenza: false
ordine: 5

metaTitolo: Carnevale di Trino — sito per manifestazione tradizionale
metaDescrizione: Dieci pagine statiche per una manifestazione del Vercellese. Perché per un evento che serve tre settimane l'anno un gestionale di contenuti è la scelta sbagliata.
---

Vale la pena dire perché *non* ho usato un gestionale di contenuti, visto che è
la risposta automatica per qualunque sito con contenuti che cambiano.

Un gestionale conviene quando qualcuno aggiorna spesso e quel qualcuno resta il
medesimo. Qui gli aggiornamenti sono concentrati in tre settimane l'anno e la
persona cambia. In quelle condizioni il pannello di amministrazione non è una
comodità, è un ostacolo in più: una password persa da recuperare e un'interfaccia
da reimparare, ogni gennaio, prima ancora di poter scrivere una data.
