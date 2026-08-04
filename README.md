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
| `--signal` | `#FF4A1C` | **superficie**: bottone, anello di focus | 3,22:1 grafico |
| `--signal-ink` | `#CE320C` | **inchiostro**: link, enfasi | 4,92:1 AA |

I due arancioni non si scambiano mai. Il testo sul bottone è **inchiostro su arancio**
(5,89:1): il bianco dava 3,36:1, sotto la soglia.

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
