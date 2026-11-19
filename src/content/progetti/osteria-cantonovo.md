---
titolo: Osteria Cantonovo
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un'osteria di paese dove si prenota al telefono, e il sito non deve cambiare questa abitudine.
riassunto: Il sito di un'osteria impaginato come il suo menu stampato, con lo stato «oggi aperto» in apertura e il telefono sempre a un tocco.
link: https://gxmich.github.io/osteria-cantonovo-demo/
codice: https://github.com/GxMich/osteria-cantonovo-demo

contesto: |
  L'Osteria Cantonovo non esiste. È un'osteria inventata nel vecchio emporio di
  Vallolmo, un paese inventato in Piemonte. Davide e Chiara, il menu, i prezzi,
  gli orari, i telefoni e le recensioni sono di fantasia. Le foto vengono da
  Unsplash.

  Il caso è quello di tante osterie di paese: pranzo nei giorni feriali per chi
  lavora in zona, cena qualche sera, il sabato chiuso, le prenotazioni al
  telefono. Un locale che vive di passaparola e che online ha al massimo una
  pagina social.

  Tutte le pagine sono noindex: un locale inesistente non deve comparire nelle
  ricerche della zona.

problema: |
  Chi cerca un'osteria sul telefono vuole sapere tre cose, quasi sempre in
  quest'ordine: è aperta oggi, cosa si mangia, come prenoto. Gli orari a metà
  settimana con il sabato chiuso e la domenica solo a cena sono proprio il tipo
  di informazione che si sbaglia leggendo in fretta.

  Il menu del pranzo poi cambia ogni settimana. Se il sito lo mostra vecchio, fa
  più danni che a non mostrarlo.

ricerca: |
  La prima idea era un sito da ristorante classico: foto grande a tutta pagina,
  slogan, un pulsante «prenota ora» collegato a una piattaforma di prenotazione.

  L'ho scartata per due motivi. Un'osteria così prenota al telefono e vuole
  continuare a farlo: un sistema esterno avrebbe aggiunto un posto in più da
  controllare. E l'impaginazione da ristorante patinato non c'entrava niente con
  un locale dove il menu del giorno è un foglio stampato sulla credenza.

  Ho preso proprio quel foglio come modello. Carta color crema, doppi filetti,
  puntini di guida tra il piatto e il prezzo, una lavagna scura per gli orari.

soluzione: |
  In apertura, sopra il titolo, c'è lo stato di oggi: il giorno della settimana
  e gli orari del pranzo e della sera, oppure «chiuso». Lo calcola il browser
  sul fuso di Roma, quindi è giusto anche alle undici di sera della domenica.
  Senza JavaScript compare il riepilogo della settimana.

  Il menu del pranzo è impaginato come un foglio: portate, piatti con la
  seconda metà del nome in corsivo, puntini fino al prezzo. In home ci sono due
  piatti per portata, nella pagina Menu tutti, con un indice che segue lo
  scorrimento. La data di aggiornamento è scritta sotto, perché un menu senza
  data non si sa se fidarsi.

  Il telefono è ovunque serva: nella testata, nell'apertura, nella lavagna degli
  orari e in una barra fissa in basso su telefono con «Chiama» e «Prenota». Per
  chi preferisce scrivere c'è un modulo di richiesta che controlla il giorno
  (il sabato è chiuso, la domenica solo a cena) e spiega che il tavolo è
  confermato solo quando l'osteria richiama. In questa demo il modulo non invia
  nulla.

tecnica: |
  Il sito è fatto con Astro e CSS nativo, con poco JavaScript: lo stato di oggi,
  il menu mobile, il modulo e qualche animazione che si spegne con
  prefers-reduced-motion.

  Tutto quello che cambia sta in due file di dati. In osteria.ts ci sono nome,
  indirizzo, telefoni, orari e recensioni, e da lì leggono testata, piede, stato
  di oggi, tabella degli orari e dati strutturati. In menu.ts ci sono portate,
  piatti, prezzi e data. Cambiare il menu del pranzo vuol dire cambiare un file e
  pubblicare.

  Le foto passano dalla pipeline di Astro, che genera AVIF e WebP alle misure
  giuste, con un ritaglio diverso per telefono e computer dove serve. I
  caratteri sono ospitati sul sito. Il sito è pubblicato su GitHub Pages con una
  GitHub Action, in una sottocartella: tutti i percorsi interni passano da una
  sola funzione.

risultato:
  - voce: «Aperto oggi» prima di tutto
    dettaglio: Giorno e orari di oggi in apertura, calcolati sul fuso di Roma, con il riepilogo della settimana se JavaScript è spento.
  - voce: Il menu ha la faccia del foglio stampato
    dettaglio: Portate, corsivi e puntini di guida fino al prezzo, con la data di aggiornamento sempre visibile.
  - voce: Il telefono resta il canale principale
    dettaglio: Numero in testata, in apertura e nella lavagna degli orari, più una barra fissa su telefono con Chiama e Prenota.
  - voce: Un modulo che conosce gli orari
    dettaglio: Avvisa se si sceglie il sabato o il pranzo della domenica, e dice chiaramente che il tavolo va confermato.
  - voce: Due file per tutto il contenuto
    dettaglio: Orari e recapiti in osteria.ts, piatti e prezzi in menu.ts. Testata, piede, menu e dati strutturati si aggiornano da soli.
  - voce: Immagini leggere
    dettaglio: AVIF e WebP generati in build, misure responsive e ritagli diversi per telefono e computer.

anteprima: osteria-cantonovo/01-home.jpg
schermate:
  - src: osteria-cantonovo/01-home.jpg
    alt: Home dell'osteria con il foglio crema appoggiato sulla foto di un piatto, lo stato di oggi e il titolo "L'osteria nel vecchio emporio di Vallolmo"
  - src: osteria-cantonovo/02-menu-pranzo.jpg
    alt: Il menu del pranzo impaginato come un foglio stampato, con i puntini di guida tra il piatto e il prezzo
  - src: osteria-cantonovo/03-lavagna.jpg
    alt: La lavagna scura con gli orari della settimana, la riga di oggi evidenziata e il numero per prenotare
  - src: osteria-cantonovo/04-menu.jpg
    alt: La pagina Menu con l'avviso sul menu di fantasia, la data di aggiornamento e una foto di tajarin appena tirati
  - src: osteria-cantonovo/05-prenota.jpg
    alt: Il modulo di richiesta di prenotazione con giorno, pranzo o sera, persone e telefono
  - src: osteria-cantonovo/06-mobile.jpg
    alt: La home su telefono, con la barra fissa in basso per chiamare o prenotare

tecnologie:
  - Astro
  - CSS
  - TypeScript
  - AVIF/WebP
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: Osteria Cantonovo — sito dimostrativo
metaDescrizione: Sito di un'osteria di paese impaginato come il menu stampato, con lo stato «aperto oggi» e il telefono sempre a portata. Attività di fantasia.
---

Il sito non prova a cambiare il modo in cui l'osteria lavora. Prende le sue
abitudini (il foglio del menu, la lavagna, il telefono) e le mette dove chi
cerca da telefono le trova subito. Con un locale vero, il lavoro che resta è
tenere aggiornato menu.ts ogni settimana.
