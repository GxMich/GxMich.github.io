# Portfolio — versione cinematica

Sito statico costruito con [Astro](https://astro.build). Niente CMS, niente pannello di
amministrazione: i contenuti sono file di testo nel progetto, e ogni modifica passa da una
build.

```bash
npm install
npm run dev      # sviluppo su http://localhost:4321
npm run build    # genera il sito in dist/ (rigenera anche le immagini social)
npm run preview  # controlla il risultato finale prima di pubblicare
```

La direzione precedente — quella chiara, "gesso e inchiostro" — è conservata per intero in
`.backup-gesso-inchiostro/`. Non serve alla build: è lì solo se un giorno vuoi rivederla.

---

## 1. Le cose da cambiare prima di pubblicare

Sono tutte in un file solo: **`src/config.js`**.

| Valore | Cosa metterci |
|---|---|
| `url` | Il dominio finale, senza slash finale. Serve a canonical, sitemap e anteprime social. |
| `email` | L'indirizzo dove vuoi ricevere i contatti. |
| `whatsapp` / `whatsappLabel` | Numero con prefisso internazionale, solo cifre, e la versione leggibile. |
| `vat` | Partita IVA per il piè di pagina. |
| `formAccessKey` | La chiave del servizio che riceve il form (vedi sotto). |

Poi due file fuori da lì: **`public/robots.txt`** (metti il dominio vero nella riga della
sitemap) e **`src/pages/privacy.astro`**, che ora è una traccia marcata come da completare.

### Il form dei contatti

Il sito è statico, quindi il modulo ha bisogno di un servizio esterno che riceva il POST e
ti giri la mail. È già predisposto per **[Web3Forms](https://web3forms.com)**: crei una
access key gratuita col tuo indirizzo, la incolli in `formAccessKey`, e funziona.

Il form funziona anche senza JavaScript. Con JavaScript attivo mostra la conferma sul posto
e, in caso di errore, propone email e WhatsApp. C'è una trappola anti-robot nascosta.

---

## 2. Aggiungere un progetto

Crea un file markdown in `src/content/progetti/`. Il nome del file diventa l'indirizzo:
`teatro-26.md` → `/progetti/teatro-26`.

Copia `progetto-dimostrativo.md` e sostituisci i contenuti. I campi obbligatori sono
controllati alla build: se ne dimentichi uno, `npm run build` si ferma e ti dice quale. È
voluto — evita che fra un anno i progetti siano raccontati in cinque modi diversi.

I cinque blocchi del racconto sono sempre gli stessi: contesto, problema, direzione scelta
e **perché quella**, risultato in fatti concreti, e la chiamata all'azione finale che è già
nel template.

**Il campo `tipo` decide come si vede il risultato.** Con `tipo: sito` la prima schermata
finisce dentro il mockup del laptop che si apre mentre scorri. Con `tipo: tool` no: dentro
un portatile un'automazione racconterebbe la cosa sbagliata, quindi le schermate restano
schermate.

Quando aggiungi un progetto vero: togli `segnaposto: true`, elimina
`progetto-dimostrativo.md` insieme alla cartella `src/assets/progetti/dimostrativo/`, e
togli il filtro `progetto-dimostrativo` da `astro.config.mjs`.

### Le immagini

Vanno in **`src/assets/progetti/`** (non in `public/`). Astro le converte in WebP e le
ridimensiona; il percorso nel markdown è relativo a quella cartella.

```yaml
anteprima: teatro-26/vetrina.jpg
schermate:
  - src: teatro-26/menu.jpg
    alt: La pagina del menù sul telefono
```

Il testo di `alt` non è un dettaglio: è quello che leggono i lettori di schermo e Google.

---

## 3. Il design

Monocromatico, senza eccezioni. **Non esiste un colore d'accento**: se qualcosa deve
emergere, emerge per luminosità, contrasto o dimensione.

| Token | Valore | Dove |
|---|---|---|
| `--bg` | `#050505` | fondo di tutto |
| `--bg-elevated` | `#0D0D0D` | card, bande sollevate |
| `--text` | `#FAFAFA` | testo e superfici piene |
| `--text-muted` | `#8A8A8A` | testo secondario |
| `--border` | `#1F1F1F` | hairline |
| `--glow` | `rgba(255,255,255,0.08)` | bagliori radiali |

Il muted è `#8A8A8A` e non `#7A7A7A` come nella prima stesura: sul fondo delle card il
primo dà **5.63:1** contro **4.53:1**, cioè AA con margine invece che AA per tre centesimi.
Resta un grigio, quindi il vincolo monocromatico è intatto. Bianco su nero è **19.5:1**.

**Caratteri**, ospitati sul sito, nessuna chiamata a terzi:

- **General Sans** (Fontshare, gratuito anche per uso commerciale) — titoli e marchio, pesi
  400/500/700, tracking molto stretto sulle dimensioni grandi.
- **Inter** — corpo del testo.
- **JetBrains Mono** — etichette, numeri, contatore del preloader.

> Neue Montreal, citato come alternativa, è un font commerciale di Pangram Pangram: non è
> installato. Se compri la licenza, i file vanno in `public/fonts/` e basta cambiare
> `--font-display` in `global.css`.

---

## 4. Gli effetti, dove stanno e come degradano

I cinque componenti di [Aceternity UI](https://ui.aceternity.com) sono installati davvero
dalla loro registry (`npx shadcn@latest add https://ui.aceternity.com/registry/<nome>.json`)
e vivono in `src/components/ui/`. Sono stati **neutralizzati**: i demo originali usano
ciano, indaco, viola, smeraldo e azzurro, qui è tutta luce bianca. Le modifiche sono
commentate riga per riga nei file.

I miei involucri stanno in `src/components/react/` e servono a una cosa sola: decidere
quando l'effetto pesante non deve partire.

| Effetto | Dove | Su mobile / con "riduci animazioni" |
|---|---|---|
| **Preloader** con contatore e linea che cade | solo home, una volta per sessione | non parte affatto |
| **Background Beams** (50 tracciati animati) | hero | sostituiti da due bagliori radiali statici |
| **Titolo parola per parola** | hero | compare senza animazione |
| **Cursore custom** | tutto il sito | non esiste (serve un mouse vero) |
| **3D Card tilt** | card progetto | solo un cedimento al tocco |
| **Moving Border** | CTA principali | invariato, è leggero |
| **Tracing Beam** | chi sono, progetti | nascosto sotto i 768px |
| **Macbook Scroll** | dettaglio progetto, solo `tipo: sito` | schermata in cornice |
| **Comparsa allo scroll** | tutto il resto | contenuto già visibile |

Tre scelte che vale la pena conoscere, perché non sono ovvie:

**Il preloader sta solo in home.** Chi arriva da una ricerca su `/servizi` o `/progetti`
vuole leggere, non guardare un contatore — e misurando si vedeva anche il costo: montarlo
su `/progetti` portava l'LCP a 3,3 secondi su mobile rallentato, contro 2,6 senza.

**Il titolo dell'hero parte quando la linea inizia a cadere, non quando il preloader è
sparito.** Le parole si compongono dietro la caduta invece che dopo. Non è solo estetica:
aspettare la fine dell'uscita spostava l'LCP avanti di mezzo secondo.

**Il Macbook Scroll sparisce sotto i 768px.** L'originale occupa due schermate intere di
scorrimento per disegnare un laptop ridotto al 35%: si paga tutto lo scroll e non si vede
niente. Al suo posto va la schermata in una cornice, che su un telefono è esattamente ciò
che si voleva mostrare.

### Cosa ho corretto nei componenti originali

- **Tracing Beam** misurava l'altezza del contenuto una volta sola al montaggio: su una
  pagina lunga, con font e immagini che arrivano dopo, la linea restava della lunghezza
  sbagliata per sempre. Ora c'è un `ResizeObserver`.
- **3D Card** non aveva alcun controllo sul tipo di puntatore: su touch il tilt seguiva
  eventi mouse emulati e scattava. Ora si attiva solo con `(pointer: fine)`.
- Le varianti `dark:` dei componenti sono legate alla classe sull'`<html>`, non alle
  preferenze di sistema: altrimenti chi ha il sistema operativo in tema chiaro vedrebbe il
  mockup del laptop grigio chiaro in mezzo a una pagina nera.

### Accessibilità

Il cursore custom **non sostituisce mai** il contorno di messa a fuoco: chi naviga da
tastiera vede l'outline nativo, sempre, sopra ogni effetto. Il cursore di sistema viene
nascosto solo dove esiste un mouse e solo se l'utente non ha chiesto meno movimento.

---

## 5. Prestazioni

Misurate su Chrome vero, viewport 390px, rete 4G lenta e CPU rallentata 4×:

| Pagina | Prima visita | Visita successiva |
|---|---|---|
| Home | 1,5 s | 2,3 s |
| Progetti | 2,7 s | 1,6 s |

Il costo di questa direzione è il JavaScript: circa **100 KB compressi** sulle pagine con
isole (React, Motion e i componenti), contro i 24 KB della versione precedente. È il
prezzo dichiarato degli effetti richiesti. Dove le isole non servono — piè di pagina,
privacy, 404 — React non viene caricato affatto, e la comparsa allo scroll gira in vanilla
(`src/scripts/ui.ts`) proprio per non trascinare React su ogni pagina.

Altre scelte a favore della velocità: caratteri ospitati in locale con `preload` sui due
che si vedono per primi, immagini in WebP con la prima card in `eager`, e il titolo
dell'hero animato in CSS invece che in JavaScript, così l'elemento che Google misura non
aspetta nessuna libreria.

---

## 6. Pubblicare

`npm run build` produce la cartella `dist/`, che è tutto il sito. Va bene qualunque hosting
statico — Netlify, Vercel, Cloudflare Pages, o anche uno spazio FTP.

- comando di build: `npm run build`
- cartella da pubblicare: `dist`

Le immagini social vengono rigenerate a ogni build da `scripts/generate-og.mjs`, che usa
gli stessi colori e caratteri del sito. La prima volta scarica JetBrains Mono in
`scripts/fonts/`; se la rete non c'è, avvisa e lascia proseguire la build.
