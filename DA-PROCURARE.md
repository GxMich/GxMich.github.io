# Cosa serve per portare il sito a 10

File privato, non fa parte del sito. Serve a te per spuntare le cose man mano.
Quando hai qualcosa, anche solo un pezzo, dimmelo e lo integro — non serve
aspettare di avere tutto.

**Legenda priorità:** 🔴 blocca il 10 · 🟠 sposta molto · 🟡 rifinitura

---

# ✅ Risolto il 03/08 — non serve più farci niente

- [x] **SuiteFit riscritto.** Non è la piattaforma 3D: è pianificafit.it,
      gestionale PHP+MySQL per personal trainer e nutrizionisti. Quattro ruoli,
      due tabelle di relazione separate, gestione GDPR seria.
- [x] **Nuovo progetto: Banco olografico.** Il 3D con le mani esisteva davvero,
      ma è `amazon/progetti/script gesti/stark-lab` — un progetto a sé che il
      documento aveva fuso dentro SuiteFit per errore. Ora ha la sua scheda.
- [x] **LightenUp riscritto.** Diario emotivo, non fitness tracker. Versione
      buona: `Siti/idee/lightenup2.0` (29/06/2026, la più recente delle nove).
      Stack vero: **Next.js 15 + Supabase**, non Firebase.
- [x] **Sede spostata su Trino** (VC, 13039, coordinate corrette). Titoli e
      testi puntano su Vercelli, dove c'è volume di ricerca.
- [x] **Foto col cliente scartata** — non era Michele.
- [x] Chiave Firebase: mai finita su GitHub, nessuna azione.

**Numeri cancellati perché inventati dal documento:** "500+ utenti attivi",
"50.000 workout", "accuracy 95%", i fattori di esplosione "0,81–4,04", il
"filtro esponenziale anti-tremolio" (nel codice c'è un'isteresi a due soglie,
0,40 e 0,52), "sotto i 100 ms", "120 MB di memoria", "60 fps".

⚠️ **Da qui in poi non fidarsi di `01_PROGETTI_LAVORO_AMAZON.md` e
`02_PROGETTI_PERSONALI.md`.** Ogni dato va verificato nel codice.

---

# ✅ Fatto anche questo (03/08, seconda tornata)

- [x] **Screenshot integrati.** Nove schermate vere al posto delle foto
      Unsplash: SuiteFit (costruttore schede, cruscotto, clienti, scadenze),
      LightenUp (home, profilo, mobile), Carnevale (dediche, lettera).
- [x] **Email personale coperta.** Negli screenshot di LightenUp compariva
      `mchlmdc98@gmail.com` nella barra laterale: l'ho coperta con un
      rettangolo del colore del fondo. I nickname sono rimasti, come volevi.
- [x] **Watermark ✦ ritagliato** da `iochelavoro al pc.jpeg` → ora è
      `src/assets/me/scrivania.jpg`, sta nella sezione percorso di chi-sono.
- [x] **Scorrimento con inerzia** (Lenis, caricato solo se il movimento è
      consentito, e in modo differito: non pesa sul primo caricamento).
- [x] **Timeline del percorso** su chi-sono: 2023 → 2024-26 → 2026, con la
      linea che si riempie scorrendo. Zero JavaScript.
- [x] **Chi sono riscritto**: "Tre anni di codice. Non venti, e non provo a
      farteli sembrare tali." Più il paragrafo sul perché conviene adesso.
- [x] **Dimensioni immagini** nelle schede progetto: prima la pagina
      sobbalzava quando arrivavano le schermate.

---

# ⛔ Ancora aperto

### Teatro 26
- [ ] Resta da anonimizzare: nome, dati e foto reali. Finché non lo modifichi,
      la scheda resta senza screenshot. Le foto in `Downloads/foto/teatro`
      non le ho toccate.

### Testimonianze
- [ ] Sempre zero. È l'unica cosa che separa la conversione dal 10.
      Il messaggio da mandare è più sotto, nella sezione 4.

### Video di SuiteFit / Banco olografico
- [ ] Il banco olografico che smonta un motore a gesti è la cosa più
      impressionante che hai e non c'è nessun video. 15-25 secondi.

---

---

## 0. Decisioni — servono a me prima di toccare i testi

Due minuti, ma senza queste non posso riscrivere le pagine.

- [ ] **P.IVA — quale strada?**
  - [ ] A · Portfolio, non vetrina (tolgo listino e spinta commerciale, resti occasionale)
  - [ ] B · Vetrina piena + apro P.IVA forfettaria
  - [ ] C · Ibrido, con "prendo pochi progetti" scritto esplicitamente
- [ ] **Il prezzo 800–1.400 € resta pubblico?**  ☐ sì  ☐ no  ☐ diventa "a partire da"
- [ ] **Ho parlato con un commercialista** (anche solo una consulenza da mezz'ora — le
      cifre e la questione abitualità vanno confermate da chi le fa di mestiere)
- [ ] **Teatro 26**: me l'ha commissionato qualcuno o resta "progetto su iniziativa"?
- [ ] **Le tre date della timeline** (mese + anno):
  - LightenUp, prima versione online: ______
  - Inizio lavoro sui tool di logistica: ______
  - Teatro 26: ______
- [ ] **Tool di logistica**: posso fare i diagrammi SVG del flusso? (opzione consigliata,
      niente da procurare per te) ☐ sì ☐ preferisco ricostruire una demo con dati finti

---

## 1. ✅ Dati per mettere online il sito — FATTO 03/08

Tutti inseriti in `src/config.js` e verificati nella build: zero segnaposto residui.

- [x] **Dominio** → `https://www.modicamichele.it`
- [x] **Email** → `modicamichelework@gmail.com`
- [x] **WhatsApp** → `393490595725`
- [x] **Access key Web3Forms** → inserita, il modulo ora invia davvero
- [x] **Privacy** → Michele Modica, senza P.IVA, dichiarata prestazione occasionale
- [x] **LinkedIn** → `linkedin.com/in/michele-modica98`
- [x] **GitHub** → `github.com/GxMich`
- [x] **Orari** → tutti i giorni 08:00–22:00
- [x] **P.IVA rimossa** dal footer e dalla pagina privacy

⚠️ Resta aperto solo il comune: vedi il punto 2 in cima al file.

---

## 2. 🔴 Screenshot dei progetti

È il buco più grande. Adesso le anteprime sono foto Unsplash: fanno atmosfera ma
**non mostrano il tuo lavoro**.

### Come si fanno (Chrome, gratis, 5 minuti a progetto)

1. Apri il progetto in Chrome
2. `Ctrl + Shift + M` → modalità responsive
3. Imposta **1280 × 800** e, in alto a destra, **DPR = 2**
4. `Ctrl + Shift + P` → scrivi `screenshot` → **"Capture full size screenshot"**
5. Salva in **PNG** (non JPEG: sul testo delle interfacce si vedono gli artefatti).
   Al peso ci penso io — Astro li converte in WebP

### Dove metterli

```
src/assets/progetti/teatro26/01-home.png
src/assets/progetti/teatro26/02-menu.png
...
```

### Teatro 26 — 5 scatti
- [ ] `01-home.png` — la home col sipario
- [ ] `02-menu.png` — menù con **un filtro attivo** (es. "senza glutine" selezionato)
- [ ] `03-galleria.png` — lightbox aperta su una foto
- [ ] `04-prenotazioni.png` — form compilato a metà
- [ ] `05-mobile.png` — home a **375 × 812, DPR 2**

### SuiteFit — 4 scatti
- [ ] `01-motore.png` — modello intero
- [ ] `02-esploso.png` — slider di smontaggio a circa metà
- [ ] `03-crea.png` — modalità costruzione con 8–10 blocchi posati
- [ ] `04-mani.png` — **con l'overlay dello scheletro della mano visibile**
      ← questo è lo scatto che fa fermare chi guarda

### LightenUp — 3 scatti
- [ ] `01-dashboard.png`
- [ ] `02-registrazione.png` — schermata di inserimento allenamento
- [ ] `03-progressi.png` — grafico con qualche mese di dati veri

### Carnevale di Trino — 2 scatti
- [ ] `01-home.png`
- [ ] `02-programma.png`

### Pallet + SLA — ⚠️ non fare screenshot
Sono dati aziendali reali, non vanno pubblicati nemmeno sfocati.
- [ ] Confermami che procedo coi **diagrammi SVG** (li faccio io, tu non prepari niente)

---

## 3. 🟠 Video di SuiteFit

Un motore da 115 pezzi che si smonta muovendo le mani davanti alla webcam.
**È la cosa più impressionante che hai.** In video ferma lo scroll.

- [ ] Registrazione da **15–25 secondi**, senza audio, che possa girare in loop
- [ ] Risoluzione **1280 × 800** a 30 fps (non serve 4K)
- [ ] Sequenza consigliata: modello intero → pizzico e ruota → due pizzichi che
      allargano → esploso completo → pugno che annulla
- [ ] **Bonus che vale il doppio:** riquadro con la webcam che mostra le mani vere
      accanto all'effetto sullo schermo

**Come registrare (gratis su Windows):**
- **OBS Studio** — il migliore, permette schermo + webcam insieme
- Oppure `Win + G` (Xbox Game Bar) → più veloce, ma niente webcam in sovrimpressione

Dammi il file grezzo, alla compressione penso io (MP4 + WebM sotto i 2 MB, con
fermo immagine per il telefono).

- [ ] *Facoltativo:* Teatro 26, 10 secondi di scorrimento dalla home al menù

---

## 4. 🟠 Testimonianze

La sezione esiste già nel codice ma **resta invisibile finché è vuota** — non
pubblico frasi inventate. Anche una sola vera cambia la pagina.

Per ognuna mi serve:

```
testo:     la frase esatta, come l'ha detta
autore:    Nome Cognome        ← veri; "M.R., imprenditore" vale zero
ruolo:     Titolare / Responsabile / …
attivita:  nome dell'attività
luogo:     città
```

**A chi puoi chiederlo adesso, realisticamente:**
- [ ] Un collega o un responsabile del lavoro in logistica, sui tool che hai fatto
      (anonimizziamo l'azienda, ma il nome della persona serve vero)
- [ ] Qualcuno che usa LightenUp — gira da tre anni, un utente c'è
- [ ] Chiunque ti abbia visto lavorare e possa dire una frase sincera

**Messaggio da mandare (copia e incolla):**

> Ciao, sto mettendo in piedi il sito del mio lavoro. Mi scriveresti due righe su
> com'è stato lavorare con me? Anche brevissime, dette come parli tu. Mi servirebbero
> nome, cognome e cosa fai, e le metterei pubbliche sul sito — se preferisci di no
> nessun problema.

---

## 5. 🟡 Foto

Il ritratto ce l'ho già ed è perfetto per il tono. ✅

- [ ] 2–3 **scatti ambientati**: mani sulla tastiera con luce laterale; scrivania in
      campo largo; se possibile te dentro un locale mentre parli con qualcuno
- [ ] Lato lungo almeno **2400 px**, JPEG alta qualità
- [ ] Luce naturale, sfondo non caotico
- [ ] **Non convertirle in bianco e nero** — lo fa il sito via CSS, e a colori mi
      lasci la possibilità di cambiare idea

Non serve un fotografo. Un telefono recente vicino a una finestra basta: con un
obiettivo da 5.000 € l'anno, spendere 300 € di servizio fotografico è un cattivo affare.

---

## 6. 🟡 Prima/dopo di Teatro 26

Serve solo se ce l'hai. Alimenterebbe un cursore trascinabile fra le due versioni —
la storia di quel case study *è* un prima/dopo.

- [ ] Screenshot della **prima versione**, quella con le didascalie sbagliate

Se l'hai persa, saltiamo il componente. Non ricostruisco un "prima" finto.

---

## Riepilogo: cosa sblocca cosa

| Se mi dai… | Sale a 10 |
|---|---|
| Solo le decisioni della sezione 0 | (niente, ma sblocca la riscrittura dei testi) |
| Screenshot dei progetti | **Design** |
| Video di SuiteFit | **Animazioni** |
| Testimonianze | **Conversione** |
| Dati della sezione 1 | (niente, ma senza il sito non va online) |

---

## Già fatto — non ti serve procurare niente

- ✅ Sei case study reali scritti, solo dati verificabili
- ✅ Ritratto integrato e ottimizzato (da 2,2 MB a 97 KB)
- ✅ Dati strutturati completi: LocalBusiness, breadcrumb, FAQ
- ✅ Otto domande e risposte sulla pagina servizi
- ✅ Accessibilità verificata (contrasti, bersagli tattili, gerarchia dei titoli)
- ✅ Form rapido in fondo a ogni pagina
- ✅ Sezione garanzie in home
- ✅ Transizioni fra pagine, navigazione senza ricaricamento
- ✅ Testo che si accende parola per parola allo scorrimento (0 KB di JavaScript)
- ✅ Contatore sui numeri
- ✅ Peso JavaScript: /servizi, /contatti e /privacy da 65 KB a **8,5 KB**
