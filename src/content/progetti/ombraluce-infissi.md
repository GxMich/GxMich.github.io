---
titolo: Ombraluce Infissi
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Una piccola ditta di serramenti che vende meglio in sede, con il campione in mano, che sul web.
riassunto: Un sito di una pagina per un serramentista di paese, che porta al sopralluogo e alla visita in sede invece di imitare il catalogo del produttore.
link: https://gxmich.github.io/ombraluce-infissi-demo/
codice: https://github.com/GxMich/ombraluce-infissi-demo

contesto: |
  Ombraluce Infissi non esiste. Il nome, l'indirizzo a Borgo Sorive (un paese
  inventato), il telefono, l'email e la partita IVA servono solo a far funzionare
  il sito. Il caso però è comune: una ditta piccola che vende e posa finestre,
  porte, persiane e tende, con una sede dove tiene i campioni.

  Il sito è pubblicato con noindex e l'email usa un dominio .example, che non
  recapita posta. Così una ditta finta non finisce nelle ricerche locali.

problema: |
  Chi cambia le finestre di casa raramente sa cosa chiedere. Sente parlare di
  alluminio, PVC, vetrocamera, e si trova davanti a siti che copiano le schede
  tecniche del produttore. Per un artigiano questo è un terreno perso in
  partenza: i cataloghi dei marchi grandi sono più ricchi e più belli.

  Quello che la ditta piccola ha in più è la persona che viene a misurare e la
  sede dove si toccano i profili. Il sito doveva portare lì, al sopralluogo o
  alla visita, con meno passaggi possibile.

ricerca: |
  Ho provato più direzioni prima di questa. La più ambiziosa era una pagina
  costruita intorno a una finestra in 3D che si montava pezzo per pezzo mentre
  si scorreva, con GSAP e una scena animata a tutto schermo.

  L'ho scartata. Era la parte più bella da vedere e la meno utile: per arrivare
  ai prodotti e ai contatti bisognava scorrere a lungo, e su un telefono di
  fascia media la scena pesava. Chi cerca un serramentista vuole capire in fretta
  se fa quello che gli serve e come chiamarlo.

  Ho scartato anche le foto di installazioni prese in giro. Mostrare lavori che
  la ditta non ha fatto è una promessa falsa. Ho scelto illustrazioni disegnate
  per il sito, dichiarate come tali, in attesa delle foto vere.

soluzione: |
  La pagina è una sola e segue l'ordine delle domande di chi visita. In alto il
  messaggio e due strade: guardare i prodotti o venire in sede. Sotto, tre
  righe su come lavora la ditta: misure prese in casa, tre materiali da
  confrontare dal vero, posa fatta dalla stessa squadra.

  I prodotti sono sei card, una per famiglia: finestre, porte, persiane, grate,
  tende e zanzariere, verande e pergole. Ogni card porta al modulo in fondo e
  sceglie già il prodotto nel menu a tendina, così chi arriva al modulo deve solo
  scrivere il nome e il paese, se vuole.

  Poi il percorso in quattro passi, dalla telefonata alla regolazione delle ante
  dopo la posa, e la sezione della sede con indirizzo e orari. Il modulo ha un
  solo campo obbligatorio. Accanto ci sono telefono ed email per chi preferisce
  chiamare.

tecnica: |
  Tutto sta in un file HTML con CSS e JavaScript dentro, senza framework e senza
  build. Si carica su qualsiasi hosting. Le illustrazioni sono SVG sotto il
  kilobyte ciascuna, nitide su ogni schermo.

  Su telefono il menu si apre a tutto schermo. Mentre è aperto blocca lo scroll
  della pagina, tiene il focus dentro il menu, si chiude con Esc e alla chiusura
  riporta la pagina dove era. Il resto della pagina diventa inert, così il
  lettore di schermo non ci finisce dentro per sbaglio.

  Le sezioni compaiono con una piccola animazione legata a IntersectionObserver,
  che si spegne con prefers-reduced-motion. Il modulo usa la validazione nativa
  del browser e qui è simulato: mostra un messaggio di conferma e non invia
  niente.

risultato:
  - voce: Dal prodotto al modulo con un clic
    dettaglio: Ogni card dei prodotti porta alla richiesta con il prodotto già selezionato. Il modulo ha un solo campo obbligatorio.
  - voce: Il sopralluogo al centro
    dettaglio: Hero, percorso di lavoro e modulo spingono tutti verso la stessa azione, la visita in casa per prendere le misure.
  - voce: La sede trattata come un argomento di vendita
    dettaglio: Una sezione dedicata con indirizzo, orari e cosa si trova in sede, per chi preferisce vedere i campioni prima di decidere.
  - voce: Un file solo, nessuna build
    dettaglio: HTML, CSS e JavaScript in un unico file, illustrazioni SVG leggere. L'unica risorsa esterna sono i font.
  - voce: Menu mobile accessibile
    dettaglio: Focus trattenuto nel menu, chiusura con Esc, scroll bloccato e posizione ripristinata, animazioni ridotte quando il sistema lo chiede.
  - voce: Nessun dato reale, e lo dice
    dettaglio: Ditta di fantasia, dominio .example, noindex, modulo simulato e avviso nel footer.

anteprima: ombraluce-infissi/01-home.jpg
schermate:
  - src: ombraluce-infissi/01-home.jpg
    alt: Hero verde scuro con il titolo "Finestre. Su misura." e, di fianco, l'illustrazione di una finestra con il bollino "Sopralluogo e rilievo inclusi"
  - src: ombraluce-infissi/02-prodotti.jpg
    alt: La sezione "Cosa facciamo", con una card grande per finestre e portefinestre e quattro card più piccole per porte, persiane, grate e tende
  - src: ombraluce-infissi/03-percorso.jpg
    alt: Il percorso di lavoro su fondo verde, in quattro passi dal primo contatto alla posa, con il pulsante "Vieni in sede"
  - src: ombraluce-infissi/04-sede.jpg
    alt: La sezione della sede, con l'illustrazione di una facciata, l'indirizzo e gli orari di apertura
  - src: ombraluce-infissi/05-richiesta.jpg
    alt: Il modulo di richiesta con "Persiane e tapparelle" già selezionato e il messaggio di conferma simulata, accanto telefono ed email di fantasia
  - src: ombraluce-infissi/06-mobile.jpg
    alt: La stessa home su telefono, con il titolo grande, i due pulsanti e l'illustrazione della finestra sotto

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - SVG

inEvidenza: false
ordine: 50

metaTitolo: Ombraluce Infissi — sito dimostrativo
metaDescrizione: Sito di una pagina per un serramentista di paese, con sei famiglie di prodotto, modulo che si precompila e sezione della sede. Ditta di fantasia.
---

Per una ditta di serramenti il sito serve a far partire una telefonata o una
visita. Per questo ho tolto tutto quello che allungava la strada, anche la parte
più spettacolare. Le illustrazioni tengono il posto delle foto: con una ditta
vera andrebbero sostituite con i suoi lavori, uno per famiglia di prodotto.
