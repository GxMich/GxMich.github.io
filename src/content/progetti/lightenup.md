---
titolo: LightenUp
cliente: Progetto su iniziativa
tipo: tool
anno: 2026
natura: iniziativa
stato: Online da poco — poche persone, nessuna promozione
durata: Riscritto da zero nel 2026, prima versione nel 2023
sfida: Uno spazio per scrivere quello che non firmeresti col tuo nome.
riassunto: Un diario per quello che non riesci ancora a dire ad alta voce. Scrivi in privato, pubblichi in anonimo, e dal profilo pubblico non si risale a te.

contesto: |
  I social chiedono di stare bene in pubblico. Le app di diario chiudono tutto in
  un file che non legge nessuno. In mezzo manca il posto dove scrivere una cosa
  difficile sapendo che qualcuno la leggerà, senza che quel qualcuno sappia chi sei.

  L'avevo scritto nel 2023 come tracciatore di allenamenti, in PHP, per imparare.
  Non lo apriva nessuno, me compreso. Nel 2026 l'ho rifatto da zero cambiando
  quello che fa: non i chili sollevati, ma come stai.

problema: |
  Il problema non è tecnico, è di fiducia. Se prometti l'anonimato devi
  mantenerlo davvero: un post anonimo che ricompare sul profilo pubblico — anche
  solo per una query dimenticata — tradisce esattamente la persona che si era
  fidata a scrivere la cosa più difficile.

  E c'è la parte che nessuno affronta volentieri: se dai alle persone un posto
  dove scrivere che stanno male, prima o poi qualcuno scriverà qualcosa di grave.
  Non puoi aprire una piattaforma così e pensarci dopo.

soluzione: |
  Privato come stato di partenza, non come opzione da cercare nelle impostazioni.
  Si scrive per sé; pubblicare è un gesto in più, da fare apposta.

  Sull'anonimato ho lavorato su due fronti. Il profilo pubblico esclude i post
  anonimi già nella richiesta al database, non nascondendoli dopo averli
  caricati: se il filtro stesse nell'interfaccia, basterebbe una pagina
  dimenticata per far uscire tutto. E per i post anonimi il collegamento
  all'autore non viene proprio generato — non c'è un link disattivato, non c'è
  un link.

  Sull'abitudine ho messo il contatore di giorni consecutivi, che è una
  meccanica da social usata al contrario: non per farti tornare a guardare gli
  altri, per farti tornare a scrivere di te. Vale anche un check-in umore
  salvato in privato, senza pubblicare niente.

  Le linee guida della community, i termini e la pagina sulla sicurezza le ho
  scritte prima di aprire, non dopo.

risultato:
  - voce: Privato di partenza, pubblico per scelta
    dettaglio: Quello che scrivi resta visibile solo a te finché non decidi diversamente.
  - voce: Anonimato filtrato alla fonte
    dettaglio: I post anonimi sono esclusi dal profilo pubblico nella query, e per quei post il collegamento all'autore non viene generato affatto.
  - voce: Check-in umore e giorni consecutivi
    dettaglio: "L'abitudine si mantiene anche senza pubblicare niente: basta registrare come stai."
  - voce: Funziona anche senza rete
    dettaglio: Applicazione web installabile, con una schermata dedicata a quando la connessione manca.
  - voce: Regole scritte prima di aprire
    dettaglio: Linee guida della community, termini, privacy, cookie e una pagina sulla sicurezza. Su una piattaforma dove si parla di come si sta, non sono contorno.
  - voce: Quante persone la usano
    dettaglio: Pochissime, ed è un numero vero. È online da poco e non ho fatto nessuna promozione. Non ho utenti attivi da dichiarare e non me li invento.

anteprima: lightenup/01-home.png
schermate:
  - src: lightenup/01-home.png
    alt: Schermata principale con i tag emotivi, la casella di scrittura e il pulsante per pubblicare in anonimo
  - src: lightenup/02-profilo.png
    alt: Profilo con contatore dei giorni consecutivi e i propri post, dove quelli anonimi restano visibili solo a chi li ha scritti
  - src: lightenup/03-mobile.png
    alt: Lo stesso profilo su telefono, in tema scuro

tecnologie:
  - Next.js 15
  - React 19
  - TypeScript
  - Supabase
  - Tailwind CSS

inEvidenza: false
ordine: 5

metaTitolo: LightenUp — diario emotivo con post anonimi
metaDescrizione: "Un diario dove scrivere in privato e pubblicare in anonimo, con check-in umore e giorni consecutivi. Next.js 15 e Supabase, riscritto da zero nel 2026."
---

La versione del 2023 la considero un fallimento utile. Era un tracciatore di
allenamenti come ce ne sono centinaia, scritto per imparare il PHP, e la sua
unica qualità era esistere.

Rifarlo ha voluto dire ammettere che il problema non era il codice: non stavo
risolvendo niente per nessuno. Del progetto vecchio è rimasto solo il nome —
alleggerire — che nel frattempo aveva smesso di riferirsi al peso sui bilancieri.
