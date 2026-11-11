---
titolo: L.M. Autoservizi
cliente: L.M. Autoservizi di Miglietta Luca
tipo: sito
anno: 2026
natura: cliente
stato: Online — sito dell'officina
durata: due settimane
sfida: Un'officina con 140 recensioni da cinque stelle e un sito che la descriveva come un meccanico ambulante.
riassunto: Il nuovo sito di un'officina multimarca a Frassineto Po, in una pagina sola, con i servizi da toccare e il messaggio WhatsApp già scritto con il tipo di mezzo.
link: https://www.lmautoservizi.it/

contesto: |
  L.M. Autoservizi è l'officina di Luca Miglietta a Frassineto Po, a pochi
  chilometri da Casale Monferrato. Luca lavora da solo, su auto, furgoni,
  fuoristrada e camper di ogni marca: meccanica, elettrauto e clima,
  gommista, carrozzeria, diagnosi. Fa anche assistenza a domicilio e il
  ritiro del mezzo, e quando può lascia la vettura di cortesia. Ha venti anni
  di mestiere, l'attività in proprio dal 2020 e un voto di 5,0 su più di 140
  recensioni Google.

  Ho seguito tutto il lavoro: le domande per raccogliere i dati, i testi
  insieme a Luca, il sito, le pagine legali, la messa online sul suo hosting
  e il riordino della scheda Google.

problema: |
  Il vecchio sito era un WordPress del 2020, fatto quando Luca lavorava
  soprattutto come officina mobile. Il titolo su Google era «Meccanico a
  domicilio» e la pagina prometteva di lavorare sull'auto «ovunque tu sia»,
  senza dire fin dove arrivava. Luca riceveva telefonate da tutta Italia,
  mentre l'officina, il ritiro e la vettura di cortesia sul sito non
  c'erano.

  Anche la scheda Google raccontava un'altra attività: un'area di sosta per
  camper, un centro revisioni e fra le zone servite un paese vicino a
  Torino. E chi cerca un meccanico arriva quasi sempre dal telefono, con un
  problema in corso. Vuole sapere tre cose: se lo fa, dove e quando, come lo
  chiama.

ricerca: |
  La prima versione era un sito completo: sedici pagine in italiano e
  altrettante in inglese, una per ogni servizio, con domande frequenti,
  orari e inviti a contattare in ogni pagina. Tecnicamente reggeva, ma
  rileggendola su un telefono la stessa frase sul preventivo gratuito
  compariva quattordici volte e la griglia dei servizi tre. Le pagine dei
  servizi erano lunghe fra sette e otto schermate.

  Ho proposto a Luca di snellirle. Lui è andato oltre: voleva tutto in una
  pagina. Aveva ragione. Per un'officina che lavora su appuntamento e
  risponde al telefono di persona, sedici pagine erano sedici posti in cui
  cercare lo stesso numero. Anche la versione inglese è caduta, insieme al
  noleggio a lungo termine, che Luca non voleva sul sito.

  Per l'apertura ho preparato sei proposte e diversi slogan; Luca ha scelto
  «Lascia che il problema della tua auto sia il mio pensiero: riparti
  sereno». Sulla pagina unica ho provato anche tre impaginazioni diverse,
  un pannello, una targa e una telefonata, ma si è andati avanti con la
  versione più semplice. Le foto di esempio sono state tolte: dove non c'è
  una foto vera dell'officina lo spazio non compare.

soluzione: |
  La pagina si apre con la frase di Luca, i venti anni di esperienza e, in
  un riquadro, il voto delle recensioni, l'indirizzo e gli orari con la
  scritta «Aperto ora» o «Chiuso», calcolata al momento. Subito sotto ci
  sono Chiama, WhatsApp e «Cosa ti serve?».

  I servizi sono otto caselle, compresa «Non so cos'ha» per chi ha solo una
  spia accesa. Toccandone una si apre una tendina: si sceglie il mezzo fra
  auto, fuoristrada, furgone e camper, si aggiungono due righe se si vuole,
  e WhatsApp si apre con il messaggio già scritto. L'invio lo conferma chi
  scrive, dal suo telefono.

  Poi viene Luca, con il perché i clienti si fidano: foto e video durante il
  lavoro, preventivo prima di iniziare. Chiude l'officina, con l'indirizzo,
  il ritiro a casa o al lavoro, i pagamenti, la tabella degli orari e la
  mappa. Su telefono Chiama, Cosa ti serve e WhatsApp restano in una barra
  in fondo allo schermo. Oltre alla pagina principale ci sono solo la
  storia di Luca, la garanzia con le condizioni e la privacy.

tecnica: |
  Il sito è statico e lo genera uno script Python che ho scritto per questo
  progetto: i dati dell'officina stanno in un solo file e ogni pagina li
  legge da lì. Così telefono, orari e indirizzo sono scritti in un punto
  solo e non possono andare fuori allineamento. Stili e script vengono
  uniti in un file ciascuno; le animazioni usano GSAP con ScrollTrigger, e
  con la preferenza di movimento ridotto si fermano.

  All'apertura il sito non chiede niente ad altri server: carattere e
  librerie sono ospitati sul dominio, la mappa è un'immagine fissa di
  OpenStreetMap e quella interattiva di Google si carica solo se la si
  tocca. Non ci sono cookie, quindi non serve il banner. Il messaggio di
  WhatsApp viene composto nel browser e non passa da nessun modulo.

  Due controlli girano a ogni generazione. Il primo verifica link, immagini
  e ancore; il secondo controlla titoli, descrizioni, dati strutturati e
  che nessuna nota interna finisca online. Lo stesso progetto produce
  l'anteprima, esclusa dai motori di ricerca, e la versione definitiva, con
  i dati strutturati dell'officina (indirizzo, orari, zona servita,
  servizi) e un file .htaccess. Questo porta gli indirizzi del vecchio
  WordPress alla pagina giusta e chiude quelli che i robot provano sempre,
  come wp-login.php.

  Il sito è andato online sull'hosting dove Luca aveva già dominio e posta,
  senza toccare i DNS: un pacchetto di 24 file con le istruzioni per
  caricarlo, la copia di sicurezza del vecchio sito e i controlli da fare
  subito dopo.

risultato:
  - voce: Online sul dominio dell'officina
    dettaglio: Dal 10 novembre 2026 su lmautoservizi.it c'è il sito nuovo, al posto del WordPress del 2020. Il vecchio sito è salvato per intero.
  - voce: Tutto in una pagina
    dettaglio: Servizi, chi è Luca, officina, orari e mappa stanno in una pagina, con tre pagine di supporto. Il titolo su Google passa da «Meccanico a domicilio» a «Meccanico a Frassineto Po e Casale Monferrato».
  - voce: Il messaggio è già scritto
    dettaglio: Chi visita sceglie il servizio e il mezzo, e Luca riceve su WhatsApp una richiesta da cui capisce subito di cosa si tratta.
  - voce: Nessun cookie
    dettaglio: All'apertura il sito non contatta altri server e non usa cookie, quindi non ha il banner. Al controllo PageSpeed del 10 novembre ha preso 100 in tutte e quattro le voci, da telefono e da computer.
  - voce: Scheda Google riordinata
    dettaglio: Tolti la sosta camper, il centro revisioni e la zona sbagliata. Ora scheda e sito riportano gli stessi servizi, gli stessi orari e i paesi dove Luca lavora davvero.
  - voce: Cosa manca ancora
    dettaglio: Google deve ancora aggiornare titolo e descrizione nei risultati e non ci sono dati su chiamate o messaggi arrivati dal sito. Le statistiche, con il banner dei cookie, sono pronte ma restano spente finché Luca non crea il suo account.

anteprima: lm-autoservizi/01-home.png
schermate:
  - src: lm-autoservizi/01-home.png
    alt: Apertura del sito L.M. Autoservizi con la frase «Lascia che il problema della tua auto sia il mio pensiero» e RIPARTI SERENO in arancione, il logo a ingranaggio e i riquadri con voto, indirizzo e orari
  - src: lm-autoservizi/02-servizi.png
    alt: Otto caselle dei servizi su fondo scuro, da «Non so cos'ha» e Assistenza a domicilio fino a Gommista, Carrozzeria, Diagnosi e Gomme e ricambi
  - src: lm-autoservizi/05-tendina.png
    alt: Tendina del servizio Gommista con la scelta del mezzo fra auto, fuoristrada, furgone e camper, due righe di testo e il pulsante Invia su WhatsApp
  - src: lm-autoservizi/03-luca.png
    alt: Sezione chiara con il numero 20 per gli anni di esperienza, il titolo «Perché i clienti si fidano di me» e quattro punti su qualità, ricambi, trasparenza e preventivo
  - src: lm-autoservizi/04-officina.png
    alt: Sezione L'officina con indirizzo di Frassineto Po, riquadro per il ritiro del mezzo, pulsanti per chiamare e scrivere, orari e mappa fissa con il pulsante per quella interattiva
  - src: lm-autoservizi/06-chi-sono.png
    alt: Pagina La mia storia con i dati di Luca Miglietta, venti anni di esperienza, titolare dal 2020, e un riquadro In breve con officina, orari e abilitazioni
  - src: lm-autoservizi/07-mobile.png
    alt: Apertura su telefono con la frase RIPARTI SERENO, il riquadro con recensioni, indirizzo e orari e la barra in basso con Chiama, Cosa ti serve e WhatsApp

tecnologie:
  - Python (generatore statico)
  - HTML / CSS
  - GSAP / ScrollTrigger
  - Schema.org JSON-LD
  - Apache .htaccess

inEvidenza: true
ordine: 0.25

metaTitolo: L.M. Autoservizi — sito per un'officina a Frassineto Po
metaDescrizione: Sito in una pagina per un'officina multimarca a Frassineto Po, con servizi da toccare, messaggio WhatsApp già scritto, zero cookie e la scheda Google riordinata.
---

Il lavoro è cominciato con sedici pagine ed è finito con una. Luca risponde
di persona e lavora su appuntamento, quindi al sito serve una cosa sola:
far arrivare a lui la richiesta giusta, con il mezzo e il problema già
scritti. Il resto lo fa al telefono, come ha sempre fatto.
