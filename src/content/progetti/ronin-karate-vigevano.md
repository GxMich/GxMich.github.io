---
titolo: Ronin Karate Vigevano
cliente: A.S.D. Ronin Karate Vigevano
tipo: sito
anno: 2026
natura: cliente
stato: Online — sito dell'associazione
sfida: Una palestra di karate con dieci anni di blog, e genitori che cercavano solo il corso giusto.
riassunto: Il nuovo sito di un'associazione di karate a Vigevano, con il corso suggerito in base all'età, un messaggio WhatsApp già composto e 98 articoli recuperati dal vecchio WordPress.
link: https://roninkaratevigevano.vercel.app/

contesto: |
  Il Ronin Karate Vigevano è un'associazione sportiva dilettantistica di
  karate Shotokan: quasi novanta allievi, otto insegnanti cintura nera e
  corsi dai 6 anni agli adulti, più un percorso di difesa personale. Si
  allenano al Centro sportivo H2 Sport di via Mondetti, quattro sere a
  settimana.

  Il sito precedente era un blog su WordPress.com con un tema gratuito:
  cinque pagine, 98 articoli scritti dal 2016 e moduli di contatto su tre
  pagine. Ho seguito le proposte grafiche, il recupero dei contenuti, lo
  sviluppo, i testi su privacy e cookie e la preparazione del passaggio
  dal vecchio indirizzo al nuovo.

problema: |
  Il vecchio sito raccontava bene la vita della palestra, ma in ordine
  cronologico: in primo piano c'erano le ultime notizie. Chi arrivava per la
  prima volta, quasi sempre un genitore al telefono, doveva cercare fra le
  pagine la risposta a tre domande: c'è un corso per mio figlio di nove anni,
  quando si allenano, come faccio a provare.

  Gli articoli però andavano conservati: kata, storia del karate, esami,
  comunicazioni ai soci. Erano anni di lavoro dell'associazione, con
  indirizzi già condivisi e trovati dai motori di ricerca. E il sito doveva
  restare semplice da mantenere: niente server per i moduli, niente
  database, e un'attenzione particolare perché chi scrive spesso lo fa per
  un minore.

ricerca: |
  Sono partito da quattro proposte statiche sugli stessi contenuti: Insegna,
  l'evoluzione del sito esistente con l'insegna in legno; Tatami, sportiva,
  con i colori dell'area di gara; Cintura, con il percorso dalla bianca alla
  nera come filo conduttore; Sumi, inchiostro su carta e cultura in primo
  piano. Ne è seguito un secondo giro di quattro proposte animate.

  Kime metteva al centro il sole rosso e il samurai del logo: forte, ma poco
  utile a chi doveva scegliere un corso. Energia era la più pratica per i
  genitori, con il cercatore e il messaggio già scritto, ma perdeva il
  carattere del logo. La direzione scelta, Ronin, unisce le due: l'apertura
  di Kime e gli strumenti di Energia, nello stile scuro.

  Alcune idee sono cadute strada facendo. Il cercatore all'inizio filtrava
  anche per gare, ma l'offerta attuale non prevede un corso agonistico: è
  rimasta solo l'età. La sezione sulle cinture è stata tolta durante la
  revisione dei contenuti. E i corsi su indicazione degli insegnanti, come
  la preparazione agli esami, non vengono mai proposti in automatico a chi
  sta iniziando.

soluzione: |
  La home si apre con il sole rosso, il samurai e la scritta RONIN presi dal
  logo dell'associazione, seguiti dalla frase di Gichin Funakoshi che il
  vecchio sito usava come motto. Subito dopo arriva la parte che serve:
  «Trova il tuo corso». Si indica l'età di chi vuole iniziare e i corsi
  adatti salgono in cima, segnati da «Fa per te», con i giorni e l'orario
  del turno.

  «Come iniziare» riduce il primo passo a tre azioni: scrivere, venire in
  palestra, provare una lezione. Accanto ci sono gli orari, i numeri da
  chiamare e il pulsante per la prova. Gli insegnanti sono presentati con
  ruolo e grado; la pagina Safeguarding raccoglie la nomina del
  responsabile e i documenti dell'associazione.

  Il modulo dei contatti compone il messaggio al posto di chi scrive: nome,
  per chi è il corso, età, corso scelto e una domanda facoltativa. Il testo
  compare in anteprima e si apre in WhatsApp, oppure come bozza email.
  L'invio resta a chi lo ha scritto, dalla sua app.

  Le 98 notizie e gli approfondimenti sono nell'archivio, divisi per
  categoria e con la ricerca. Due pagine dedicate rispondono alle ricerche
  locali più frequenti: karate per bambini a Vigevano e difesa personale.
  Su telefono non ci sono sezioni bloccate durante lo scorrimento e
  Chiama e WhatsApp restano in fondo allo schermo, a portata di pollice.

tecnica: |
  Il sito è statico, costruito con Astro 5: 109 pagine generate, senza
  server applicativo né database. Recapiti, staff, corsi e orari stanno in
  un unico file di dati, usato da tutte le pagine. Gli articoli sono file
  Markdown, uno per notizia.

  Il recupero da WordPress è uno script che ho scritto e lanciato una sola
  volta: legge l'esportazione, toglie gli avanzi del vecchio tema e dei
  pulsanti di condivisione, decodifica i caratteri speciali, sistema i
  titoli scritti tutto in maiuscolo e collega immagini e PDF salvati in
  locale. I video YouTube diventano segnaposto che si caricano solo dopo il
  consenso.

  Le animazioni usano GSAP con ScrollTrigger, SplitText e Flip: Flip
  riordina i corsi nel cercatore quando cambia l'età. Lenis rende morbido lo
  scorrimento. Con la preferenza di movimento ridotto tutto si ferma, e se
  gli script non partono i contenuti compaiono comunque. L'introduzione con
  il caricamento si vede solo alla prima visita della sessione.

  Caratteri e gestione dei cookie sono ospitati sul sito. Google Maps e
  YouTube sono due categorie separate, spente finché il visitatore non le
  sceglie; la revoca rimuove anche i contenuti già caricati. Non ci sono
  statistiche né pixel pubblicitari. Il modulo non conserva i dati in
  cookie o nella memoria del browser.

  Per il passaggio dal vecchio sito ho preparato 204 regole di
  reindirizzamento, che portano 98 articoli e 4 pagine WordPress ai nuovi
  indirizzi. Le anteprime di Vercel restano escluse dai motori di ricerca,
  mentre sitemap e robots.txt sono generati con il dominio definitivo.

risultato:
  - voce: Online su Vercel
    dettaglio: Il sito è pubblicato su roninkaratevigevano.vercel.app, con 109 pagine statiche e un'identità costruita sul logo dell'associazione.
  - voce: Dieci anni di articoli recuperati
    dettaglio: 98 notizie e approfondimenti, dal 2016 al 2025, con le loro immagini e i documenti, sono nell'archivio con categorie e ricerca.
  - voce: Il corso giusto in un gesto
    dettaglio: Indicando l'età, chi visita vede in cima i corsi adatti con giorni e orario, e può chiedere informazioni su quel corso.
  - voce: Un messaggio pronto, senza backend
    dettaglio: Il modulo prepara il testo per WhatsApp o per email e lo mostra in anteprima. Nessun servizio esterno raccoglie i dati e nessun messaggio parte dal sito.
  - voce: Servizi esterni solo su scelta
    dettaglio: Mappa e video restano spenti finché il visitatore non li autorizza. Il sito non usa statistiche né pixel pubblicitari.
  - voce: Cosa manca ancora
    dettaglio: Indicizzazione su Google e reindirizzamenti dal vecchio WordPress sono pronti e verificati in locale, in attesa di pubblicazione sull'account dell'associazione. Non ci sono ancora dati su visite o iscrizioni arrivate dal sito.

anteprima: ronin-karate-vigevano/01-home.png
schermate:
  - src: ronin-karate-vigevano/01-home.png
    alt: Home del Ronin Karate con il sole rosso, il samurai del logo, la scritta RONIN e i pulsanti per la prova su WhatsApp e la chiamata
  - src: ronin-karate-vigevano/02-manifesto.png
    alt: Sezione rossa con la frase di Gichin Funakoshi «Non pensare che si pratichi karate solamente nel dojo» e la presentazione dell'associazione
  - src: ronin-karate-vigevano/03-cercatore.png
    alt: Strumento Trova il tuo corso con l'età impostata a 10 anni e il corso Ragazzi evidenziato in rosso in cima all'elenco
  - src: ronin-karate-vigevano/04-iniziare.png
    alt: Sezione Come iniziare con tre passi, i giorni di allenamento, gli orari delle 18 e delle 19 e i pulsanti per prenotare la prova
  - src: ronin-karate-vigevano/05-insegnanti.png
    alt: Elenco degli insegnanti con ruolo e grado di cintura nera indicato con barre
  - src: ronin-karate-vigevano/06-contatti.png
    alt: Modulo Componi il messaggio compilato con dati di prova e anteprima del testo per WhatsApp, accanto ai recapiti degli insegnanti
  - src: ronin-karate-vigevano/07-news.png
    alt: Archivio news con 98 articoli dal 2016, filtri per categoria e campo di ricerca
  - src: ronin-karate-vigevano/08-mobile.png
    alt: Home su telefono con la scritta RONIN, il samurai sul sole rosso e la barra fissa con Chiama e WhatsApp

tecnologie:
  - Astro 5
  - Markdown
  - GSAP / ScrollTrigger / Flip
  - Lenis
  - vanilla-cookieconsent
  - Vercel

inEvidenza: true
ordine: 0.5

metaTitolo: Ronin Karate Vigevano — sito per un'associazione di karate
metaDescrizione: Sito per un'associazione di karate a Vigevano, con corso suggerito in base all'età, messaggio WhatsApp già composto e 98 articoli recuperati da WordPress.
---

Il lavoro è partito da una domanda semplice: cosa cerca chi apre il sito
per la prima volta? Quasi sempre un corso per un figlio, e un modo rapido per
chiedere una prova. Da lì ho dato a quella domanda la seconda sezione della
home, subito dopo il logo, e ho spostato le notizie in un archivio ordinato.
Dieci anni di articoli restano tutti consultabili, senza stare davanti al
corso da scegliere.
