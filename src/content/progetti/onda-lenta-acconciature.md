---
titolo: Onda Lenta Acconciature
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un salone con una sola parrucchiera, che non può rispondere al telefono mentre ha le mani nei capelli di qualcuno.
riassunto: Il sito di un piccolo salone da parrucchiera con una richiesta di appuntamento in quattro passaggi, che rispetta gli orari di apertura e non promette disponibilità che nessuno gestisce.
link: https://gxmich.github.io/onda-lenta-acconciature-demo/
codice: https://github.com/GxMich/onda-lenta-acconciature-demo

contesto: |
  Onda Lenta Acconciature non esiste. Il nome del salone e della titolare,
  l'indirizzo a Borgo Sorive (un paese inventato), il telefono, l'email, gli
  orari e le recensioni sono inventati. Il caso è quello di tanti saloni di
  paese: una titolare che lavora da sola o quasi, clienti di ogni età, quasi
  tutto passa dal telefono.

  Il sito ha noindex, l'email usa un dominio .example e la richiesta di
  appuntamento è simulata: arriva fino al riepilogo ma non invia niente.

problema: |
  In un salone con una persona sola il telefono squilla mentre lei sta tagliando
  o facendo un colore. O risponde con le mani bagnate, o non risponde e la
  cliente chiama qualcun altro.

  La cliente, dal canto suo, sa già cosa vuole: un taglio, un colore, un giorno
  in cui è libera. Le manca solo un modo per dirlo senza dover trovare il momento
  giusto per telefonare.

ricerca: |
  La strada più ovvia era un calendario con gli orari liberi in tempo reale,
  come quelli dei gestionali per saloni. L'ho scartata. Funziona solo se
  qualcuno tiene l'agenda aggiornata minuto per minuto, e in un salone con una
  persona sola quell'agenda è un quaderno vicino alla cassa. Un calendario che
  mostra orari liberi sbagliati fa più danni di un telefono che squilla.

  Ho scelto una richiesta di preferenza: la cliente indica servizio, giorno e
  fascia oraria, la titolare la richiama per confermare quando ha le mani
  libere. Il sito lo dice in chiaro, in ogni passaggio.

soluzione: |
  La prenotazione si apre da qualsiasi punto della pagina e ha quattro
  passaggi: servizio, quando, i tuoi dati, riepilogo. Toccando uno dei quattro
  servizi in pagina, la richiesta si apre con quel servizio già scelto.

  Nel secondo passaggio i prossimi giorni di apertura sono pulsanti grandi, da
  scorrere col pollice, e gli orari sono divisi fra mattina e pomeriggio. Le
  proposte seguono gli orari del salone: saltano domenica e lunedì, rispettano
  la pausa del giovedì e, se si sceglie oggi, partono da mezz'ora dopo l'ora
  attuale. Il riepilogo si può copiare negli appunti.

  Il resto della pagina accompagna: servizi, il salone, una galleria di
  ispirazioni che su telefono si scorre di lato, recensioni (inventate e
  marcate come tali), orari e domande frequenti. Su telefono una barra in basso
  tiene sempre a portata il pulsante per prenotare.

tecnica: |
  HTML, CSS e JavaScript senza build. La logica della prenotazione sta in un
  file a parte, booking-core.js, separata dall'interfaccia: orari di apertura,
  date valide, validazione del recapito e testo del riepilogo. Ha i suoi test,
  che girano con node --test.

  Le date sono calcolate sull'ora italiana con Intl.DateTimeFormat, quindi il
  sito propone gli orari giusti anche a chi lo apre di notte o nel giorno del
  cambio dell'ora. I test coprono questi casi, la pausa del giovedì e i giorni
  di chiusura.

  Menu e prenotazione sono dialog nativi aperti con showModal. Il menu blocca lo
  scroll e alla chiusura riporta la pagina dove era. I font sono serviti in
  locale, quindi la pagina non fa richieste a servizi esterni.

risultato:
  - voce: Prenotare senza telefonare
    dettaglio: Quattro passaggi, dal servizio al riepilogo, con il servizio già scelto se si parte da una card. Nella demo l'invio è simulato.
  - voce: Orari che rispettano il salone
    dettaglio: Solo giorni e fasce di apertura, pausa del giovedì compresa, e mai un orario già passato. Calcolati sull'ora italiana.
  - voce: Nessuna promessa sulla disponibilità
    dettaglio: La richiesta è una preferenza e lo dice. La conferma resta alla titolare, che richiama quando può.
  - voce: Logica testata
    dettaglio: booking-core.js è separato dall'interfaccia e ha sette test in Node, compresi il cambio dell'ora e i giorni di chiusura.
  - voce: Pensato per il pollice
    dettaglio: Giorni in pulsanti grandi, galleria a scorrimento laterale, barra di prenotazione fissa in basso e menu a schermo intero.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Salone e titolare di fantasia, recensioni marcate come dimostrative, dominio .example, noindex e avviso nel footer.

anteprima: onda-lenta-acconciature/01-home.jpg
schermate:
  - src: onda-lenta-acconciature/01-home.jpg
    alt: Apertura con il titolo "Capelli in ordine. Testa leggera." e, a destra, la foto ad arco di una ragazza con lunghi capelli ramati e mossi
  - src: onda-lenta-acconciature/02-servizi.jpg
    alt: I quattro servizi del salone in due colonne, ognuno con icona, descrizione breve e freccia per prenotare
  - src: onda-lenta-acconciature/03-salone.jpg
    alt: La sezione sul salone, con due foto di ambientazione e il testo di presentazione della titolare
  - src: onda-lenta-acconciature/04-prenotazione.jpg
    alt: La finestra di prenotazione al secondo passaggio, con i prossimi giorni di apertura in pulsanti e la scelta fra mattina e pomeriggio
  - src: onda-lenta-acconciature/05-ispirazioni.jpg
    alt: La galleria di ispirazioni con tre foto di tagli diversi, caschetto, onde e ricci
  - src: onda-lenta-acconciature/06-mobile.jpg
    alt: La prenotazione su telefono, con i giorni da scorrere col pollice, gli orari del mattino e il pulsante per andare avanti

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - Node test runner

inEvidenza: false
ordine: 50

metaTitolo: Onda Lenta Acconciature — sito dimostrativo
metaDescrizione: Sito per un piccolo salone da parrucchiera con richiesta di appuntamento in quattro passaggi, orari calcolati sull'ora italiana e logica testata. Salone di fantasia.
---

Il punto delicato di questo sito è la promessa. Un calendario che sembra un
gestionale fa pensare che l'orario sia già tuo. Qui la richiesta resta una
richiesta, e il codice che decide quali orari proporre è separato e testato,
così si può cambiare l'orario del salone senza toccare l'interfaccia.
