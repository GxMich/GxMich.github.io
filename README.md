# Portfolio — Michele Modica

Sito statico costruito con [Astro](https://astro.build). Niente CMS, niente pannello di
amministrazione: i contenuti sono file di testo nel progetto, e ogni modifica passa da una
build.

```bash
npm install
npm run dev        # sviluppo su http://localhost:4321
npm run build      # genera il sito in dist/ (rigenera anche le immagini social)
npm run preview    # controlla il risultato finale prima di pubblicare
```

Tre controlli che si possono rilanciare in qualsiasi momento:

```bash
npm run contrasti  # rapporti di contrasto dei token — esce in errore se uno scende sotto soglia
npm run peso       # budget di JavaScript per pagina — distingue carico iniziale e su richiesta
npm run caratteri  # riduce i woff2 in public/fonts al latino (già fatto: rilanciarlo è idempotente)
```

La direzione precedente è conservata per intero in `archive/`, insieme a uno snapshot
completo del progetto prima del redesign.

---

## 1. Le cose da cambiare prima di pubblicare

Sono tutte in un file solo: **`src/config.js`** — dominio, email, WhatsApp, chiave del
modulo contatti, zone servite, orari, profili. Poi due file fuori da lì: **`public/robots.txt`**
(il dominio vero nella riga della sitemap) e **`src/pages/privacy.astro`**, che è ancora una
traccia marcata come da completare.

Il modulo dei contatti è predisposto per [Web3Forms](https://web3forms.com): access key
gratuita in `formAccessKey` e funziona. Funziona anche senza JavaScript — fa un POST normale
— e con JavaScript mostra la conferma sul posto, rimandando a email e WhatsApp se qualcosa
va storto. C'è una trappola anti-robot nascosta.

---

## 2. Aggiungere un progetto

Un file markdown in `src/content/progetti/`. Il nome del file diventa l'indirizzo:
`teatro-26.md` → `/progetti/teatro-26`. I campi obbligatori sono controllati alla build: se
ne manca uno, `npm run build` si ferma e dice quale.

**Il campo `tipo` decide il template.**

| `tipo` | Come si presenta | Dove finisce in `/progetti` |
|---|---|---|
| `sito` | apre con la schermata a piena larghezza sul palco scuro; le altre schermate scorrono di lato | famiglia **Siti**, in alto |
| `tool` | apre senza immagine, perché non c'è un'interfaccia da mostrare; le schermate restano impilate | famiglia **Sistemi**, sotto |

I siti stanno sempre sopra i sistemi, anche quando sono uno solo e i sistemi cinque: l'ordine
segue chi paga, non la quantità.

### I cinque blocchi

| Campo | Blocco | Obbligatorio |
|---|---|---|
| `contesto` + `problema` | 01 · Problema | sì |
| `ricerca` | 02 · Ricerca — **la strada scartata e perché non reggeva** | no |
| `soluzione` | 03 · UX/UI — la direzione scelta, dal lato di chi la usa | sì |
| `tecnica` | 04 · Codice — la decisione tecnica, separata da quella di prodotto | no |
| `risultato[]` | 05 · Risultati | no |

I numeri contano i blocchi che quella scheda ha davvero: una senza `ricerca` fa 01→04, non
salta da 01 a 03.

**`ricerca` è il campo che conviene riempire per primo.** Mostrare il tentativo sbagliato è
l'unica prova di competenza che non si può fingere, e senza quel blocco il racconto salta dal
problema alla soluzione come se la soluzione fosse ovvia. SuiteFit è l'esempio già fatto.

Una voce dei risultati che contenga «Cosa manca» prende automaticamente il contorno
tratteggiato: il limite dichiarato è un elemento di interfaccia, non una nota in fondo.

### Le immagini

Vanno in **`src/assets/progetti/`** (non in `public/`). Astro le converte in WebP e le
ridimensiona; il percorso nel markdown è relativo a quella cartella. Gli SVG passano senza
essere convertiti in pixel.

```yaml
anteprima: teatro-26/vetrina.jpg
schermate:
  - src: teatro-26/menu.jpg
    alt: La pagina del menù sul telefono
```

Il testo di `alt` non è un dettaglio: è quello che leggono i lettori di schermo e Google, ed
è anche la didascalia che compare sotto l'immagine.

---

## 3. Il design

Il sistema sta in **`src/styles/token.css`**, che è l'unica fonte di verità. Se un colore o
una misura compare scritto a mano da qualche altra parte, è un errore.
La guida viva è su **`/stile`** (noindex, fuori dalla sitemap).

### Colore

Superficie chiara, un solo accento, e l'accento significa **azione**.

| Token | Valore | Ruolo | Contrasto |
|---|---|---|---|
| `--paper` | `#FAFAFA` | fondo | — |
| `--paper-sunk` | `#F1F1F0` | tabelle, strisce | — |
| `--ink` | `#0A0A0B` | titoli, testo pieno | 18,96:1 AAA |
| `--ink-2` | `#55565A` | corpo secondario | 7,02:1 AAA |
| `--ink-3` | `#686A70` | etichette, meta | 5,18:1 AA |
| `--rule` | `#E2E2E1` | filetti | decorativo |
| `--signal` | `#FF5C33` | **superficie**: bottone, riempimenti, fili d'accento | 6,44:1 col testo sopra |
| `--signal-ink` | `#CE320C` | **inchiostro**: link, enfasi | 4,92:1 AA |

I due arancioni non si scambiano mai: `--signal` è superficie, `--signal-ink` è
inchiostro. Il testo sul bottone è **inchiostro su arancio** (6,44:1): il bianco dava
3,36:1, sotto la soglia.

`--signal` è **identico nei due temi**. `--signal-ink` no, e non è una svista: `#FF5C33`
come *testo* su carta chiara farebbe 2,95:1, cioè illeggibile — il testo ha bisogno di più
contrasto di una superficie, sempre.

L'anello di messa a fuoco è **inchiostro con un alone arancione**, non arancione pieno:
l'arancio da solo su carta chiara dà 2,95:1, appena sotto il 3:1 richiesto agli indicatori,
e quello è l'unico segno che dice a chi naviga da tastiera dove si trova.

Le sezioni scure non sono un tema: la classe `.su-palco` ridefinisce i nomi dei token, e i
componenti dentro si ricolorano da soli senza una variante ciascuno.

**Gli stati dei progetti non hanno colore.** Pieno = in uso, vuoto = in corso, tratteggiato =
beta. La distinzione regge anche in bianco e nero, e l'accento resta libero di significare
una cosa sola.

### Caratteri

Ospitati in locale, nessuna chiamata a terzi. Tutti con licenza aperta.

| Ruolo | Famiglia | Peso |
|---|---|---|
| Display e interfaccia | **Geist** variabile | 27 KB |
| Dati, etichette, numeri | **Geist Mono** variabile | 29 KB |
| Voce — le frasi di Michele | **Instrument Serif** tondo e corsivo | 17 + 18 KB |

I file in `public/fonts/` sono già i sottoinsiemi latini: 180 KB ridotti a 91. Il corsivo
serif è riservato alle frasi sue e a una riga sola per volta — è la misura in cui quel
carattere funziona. Su un paragrafo intero è illeggibile.

---

## 4. Il movimento

Regola unica: **scorrimento → GSAP; micro-interazioni → CSS.** Non ci sono altre librerie di
animazione, e nessun componente usa due motori per lo stesso lavoro.

| Meccanica | Dove | Sotto 768px |
|---|---|---|
| Scorrimento orizzontale agganciato | vetrina in home | elenco verticale |
| Carte impilate (`scale: 0.95`) | i quattro passi del metodo | elenco |
| Parallasse | due strade, ritratto | ferma |
| Sfocatura in entrata | paragrafi, ovunque | invariata |
| Otturatore `clip-path` | solo H1 e H2 | invariato |
| Menu a schermo intero | sotto 1024px | è il suo posto |

**GSAP entra con un import dinamico**: le pagine senza sezioni agganciate non lo scaricano
mai. Il carico iniziale è 6,7 KB compressi su tutte le pagine tranne la home, che ne fa 8,3.

Tre cose che non sono ovvie e che conviene non disfare:

- **Il contenuto si nasconde solo se qualcuno può rivelarlo.** La classe `puo-animare` la
  mette uno script in linea prima del primo disegno: se quello script non gira, il testo è
  già al suo posto. C'è anche una rete di sicurezza a tre secondi, perché in una scheda di
  sfondo l'osservatore non scatta affatto.
- **La vetrina parte con lo scorrimento nativo**, `tabindex` e `role`. L'aggancio glieli
  toglie solo dopo aver montato davvero: senza, un errore di GSAP renderebbe irraggiungibile
  metà della sezione.
- **Niente Lenis.** `scrub: 1` interpola già il movimento senza prendere il controllo dello
  scorrimento della pagina, che è la parte che su telefono dà fastidio.

Con `prefers-reduced-motion` tutto parte già nello stato finale: il sito resta completo,
solo fermo.

---

## 5. Prestazioni

| Pagina | JavaScript iniziale | Su richiesta | Totale |
|---|---|---|---|
| Home | 8,3 KB | 45,1 KB (GSAP) | 53,5 KB |
| Tutte le altre | 6,7 KB | 45,1 KB solo se serve | ≤ 51,9 KB |

`npm run peso` lo verifica a ogni build e esce in errore se una pagina sfora. I due numeri
vanno tenuti separati: sommarli dà una risposta sbagliata, perché su `/servizi` GSAP è
referenziato ma non viene mai scaricato.

---

## 6. Pubblicare

`npm run build` produce `dist/`, che è tutto il sito. Va bene qualunque hosting statico.

- comando di build: `npm run build`
- cartella da pubblicare: `dist`

Le immagini social vengono rigenerate a ogni build da `scripts/generate-og.mjs`, che usa gli
stessi token e gli stessi caratteri del sito, senza scaricare niente da internet.

---

## 7. Cosa manca ancora

- **Altri siti nel portfolio.** Ne c'è uno solo, e non è commissionato. Chi cerca un sito per
  la sua attività vuole vederne tre o quattro: è la cosa che sblocca la conversione, e nessuna
  scelta di design può sostituirla.
- **Il video del banco olografico.** Lo slot esiste già nello schema (`video`), la scheda
  regge anche senza.
- **Testimonianze.** Zero, per scelta: meglio nessuna che una inventata.
- **Teatro 26**, congelato in `.md.rimosso` finché non è anonimizzato.
- **`/stile`** si toglie quando il lavoro è chiuso. Finché si tocca il sistema, serve.

---

## 8. Le pagine riservate dei preventivi

Cinque pagine che non raggiunge nessun collegamento del sito: sono fuori dalla sitemap, hanno
`noindex` e non caricano le misure di traffico (Clarity non può registrarle). Non vanno in
`robots.txt`, perché elencarle lì le renderebbe pubbliche.

| Indirizzo | A chi serve | Cosa fa |
|---|---|---|
| `/preventivo-richiesta` | il cliente | questionario dettagliato; compone il messaggio e apre WhatsApp o la posta |
| `/incontro-cliente` | solo a me | appunti dell'incontro, richiesta, calcolo del prezzo, stampa. **Con password** |
| `/incontro-cliente-v2` | solo a me | la versione nuova: questionario di scoperta, microfono con audio su ogni domanda, calcolo del prezzo con la suddivisione dei soldi. **Con password**, stessa del listino |
| `/preventivo-proposta#…` | il cliente, dopo la demo | il preventivo: versione di prova, pacchetti, extra, totale che si aggiorna, pulsanti per rispondere |
| `/preventivo-casa-di-nonna` | quel cliente | la versione già fatta per Casa di Nonna |

Le domande stanno in **`src/data/richiesta.js`**, una volta sola: il cliente le compila nella
sua pagina, io le riempio all'incontro nella mia, e il messaggio che il cliente manda si
rilegge con «Importa» senza ricopiare niente. Cambiare l'etichetta breve (`corta`) di una
domanda cambia anche come si legge il messaggio.

### Il link del preventivo

Dalla pagina dell'incontro, «Copia il link» o «Mandagli il link su WhatsApp» generano
l'indirizzo della pagina del preventivo. **Tutti i dati stanno nell'indirizzo, dopo il `#`**
(compressi): il browser non li manda mai al server, quindi i prezzi di un cliente non finiscono
in nessun archivio. Nel link ci sono solo cose che il cliente può vedere: niente ore, tariffa
o appunti. Un link tagliato da un'app mostra «Questo link non è completo».

Il pulsante «Accetto» manda a WhatsApp il messaggio con **pacchetto scelto e totale**: se
qualcuno modificasse i prezzi nel link, li confronti con i tuoi e lo vedi subito. Il pulsante
resta spento finché non sceglie un pacchetto, e sotto c'è la riga che dice che un clic non è
un contratto. Il testo si adatta a tu, lei o voi (campo «Come ci si parla» nell'incontro).

### La password, e cosa protegge davvero

Il sito è statico e pubblico: una password controllata da JavaScript si aggira leggendo il
sorgente. Per questo i **prezzi non sono nel codice**: sono in `src/data/listino.cifrato.json`,
cifrati (AES-256-GCM, chiave derivata dalla password con PBKDF2, 600.000 giri). Senza password
non si leggono, nemmeno guardando il sorgente. La password non è scritta da nessuna parte.

- Il **listino in chiaro** è `scripts/listino-privato.json`, fuori da git. Modifica i prezzi lì
  e rilancia `npm run cifra`: chiede la password (almeno 12 caratteri) e rigenera il file
  cifrato, che poi si pubblica. Per cambiare la password basta rilanciarlo con una nuova.
  **Tienine una copia di sicurezza**: se si perde, i prezzi si rileggono solo con la password.
- Il file cifrato è pubblico, quindi chi lo scarica può provare password sul proprio computer
  quanto vuole: la password deve essere lunga, non una parola.
- La pagina funziona da `https` e da `localhost`. Su un indirizzo `http` della rete locale
  il browser non offre la cifratura e la pagina lo dice.

### Dove stanno gli appunti

Nel `localStorage` del browser, su quel dispositivo, **in chiaro**: non vanno da nessuna parte e
la password non li protegge, perché protegge la pagina e i prezzi, non un dispositivo già
sbloccato. «Esporta» scarica una copia (un file JSON con gli appunti in chiaro, **senza gli
audio**), «Importa» la rimette. Svuotare i dati del sito dal browser cancella gli incontri e le
registrazioni.

### Il questionario di scoperta (solo v2)

Le domande di `/incontro-cliente-v2` sono quelle del modulo del cliente **più** quelle del questionario
universale (obiettivi, pubblico, offerta, SEO locale, gestione futura, commerciale…). Stanno tutte
in `src/data/richiesta.js`: quelle con `solo: true` esistono solo nell'incontro, il cliente non le
vede nel suo modulo e la v1 le ignora. Con `se: [[campo, valore]]` una domanda compare solo quando serve (per
esempio i dettagli sulle prenotazioni, solo se le ha chieste).

Nel riepilogo ci sono tre aiuti: **«Prepara il preventivo dalle risposte»** sceglie il pacchetto e
accende gli extra che le risposte richiedono (non spegne mai niente), **«Prima di andare via»**
elenca cosa non hai ancora chiesto, e la **complessità** interna (semplice, media, complessa,
avanzata) dà il punteggio del questionario. Le frasi pronte e le cose da non promettere stanno in
«Frasi pronte» nella sezione 01.

### Il microfono e l'audio (solo v2)

Ogni domanda ha un microfono. Registra l'audio e, dove il browser lo permette, lo trascrive nel
campo; sulle domande a caselle il testo detto va in «Cosa ha detto». C'è anche la registrazione
dell'intero incontro, con l'interruttore «Parla il cliente / Parlo io».

- **Si registra solo dopo aver spuntato il consenso** del cliente (sezione 01): senza, il
  microfono non parte.
- L'audio sta in **IndexedDB**, su questo dispositivo, in chiaro. Il sito non lo manda da nessuna
  parte. Fa eccezione la trascrizione in diretta, che la fa il servizio del browser (Google in
  Chrome ed Edge, Apple in Safari).
- **L'audio ha la precedenza sulla trascrizione**: se la trascrizione cade, l'audio continua. Su
  telefono la trascrizione in diretta parte spenta, perché può contendersi il microfono con la
  registrazione; si accende con «Trascrivi mentre registro».
- **«Pacchetto per l'AI»** scarica uno ZIP con gli audio (uno per domanda), `incontro.md`,
  `incontro.json` e un `LEGGIMI.md` con il prompt da dare all'AI. È l'unica strada da cui l'audio
  esce, e parte solo quando premi.
- «Elimina gli audio di questo incontro» li cancella; eliminando l'incontro si cancellano anche
  loro.
- Non è stato provato su un telefono vero: in Chrome desktop sì, anche con microfono finto. Se
  l'audio su telefono esce con dei buchi, la pagina lo segna sulla registrazione.

### La prestazione occasionale (solo v2)

Con regime «Prestazione occasionale» il riepilogo mostra **«Come si divide il pagamento»**, per
acconto e saldo: quanto arriva a me, quanto il cliente versa allo Stato (ritenuta 20%, F24 codice
1040), il rimborso della marca da bollo (2 € per ricevuta sopra 77,47 €) e, se in
«Già incassato quest'anno» c'è abbastanza da superare i 5.000 €, i contributi INPS (2/3 al cliente,
1/3 trattenuto a me). Le stesse cifre vanno nel preventivo stampato e nel testo. Le regole stanno
nelle costanti `BOLLO` e `INPS` di `richiesta.js`: ricontrollale ogni anno.

**La guida per capire e spiegare tutto questo è in `docs/prestazione-occasionale.md`.**

### Perché due versioni dell'incontro

`/incontro-cliente` è rimasta com'era. La v2 ha file propri (`incontro-cliente-v2.astro`,
`lib/incontro-v2.ts`, `components/preventivo/CampiV2.astro`) e un **archivio separato**
(`incontri-v2` nel localStorage): la v1 riscrive solo i campi che conosce e cancellerebbe quelli
della v2. Per portare un incontro dall'una all'altra c'è «Esporta» / «Importa». Quello che le due
pagine condividono (`richiesta.js`, `preventivo.ts`, `modulo.css`) è solo additivo.

### Il listino, in breve

Prezzi di partenza pensati per un lavoro svolto da un junior con l'aiuto dell'AI: **Essenziale
300 €, Completo 600 €**, extra da 50 a 200 €, assistenza annuale 120 € (facoltativa). Sono una
proposta: ogni prezzo si corregge al volo durante l'incontro, e il campo vuoto usa il listino.
Il calcolo mostra anche le **ore stimate e la tariffa effettiva**, solo per te: non compaiono
mai nel preventivo.

Le diciture fiscali (prestazione occasionale, forfettario, IVA), la ritenuta d'acconto del 20%,
il bollo e la soglia INPS sono proposte da far vedere al commercialista prima di usarle.

