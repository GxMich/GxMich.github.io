---
titolo: Podere Vallescura
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
stato: Concept online — non è una struttura reale
riassunto: Un agriturismo con sei camere non compete con altri agriturismi, compete con la propria scheda su un portale. Il sito prova a dire quello che la scheda non riesce a dire.
link: https://gxmich.github.io/agriturismo-concept/
codice: https://github.com/GxMich/agriturismo-concept

contesto: |
  Podere Vallescura non ha un cliente dietro: è un concept che mi sono dato
  da solo per un agriturismo immaginario sulle colline di Todi, in Umbria —
  sei camere, diciotto ettari, una cucina che dipende dall'orto e dalle
  stagioni. Non esiste, non è prenotabile, e nessuno me l'ha commissionato.

  L'ho costruito per rispondere a una domanda concreta: come si presenta
  online un'attività ricettiva piccola, isolata e senza un reparto
  marketing — completando da solo l'intero percorso, dalla direzione
  visiva allo sviluppo, prima di proporlo a un cliente vero.

problema: |
  Un agriturismo con sei camere non compete con altri agriturismi: compete
  con la propria scheda su un portale di prenotazione. Quella scheda fa
  bene alcune cose — prezzo, fotografie, distanza, disponibilità in tempo
  reale — ma fa male sempre la stessa cosa per tutti: non riesce a
  spiegare com'è passare due giorni in quel posto, né perché la strada
  finisca proprio lì.

  Un sito che si limita a ripetere le stesse informazioni con una
  fotografia più grande non aggiunge niente al portale. Ha senso solo se
  dice quello che il portale non può dire.

ricerca: |
  La direzione ovvia per un agriturismo in campagna è calda ed editoriale:
  tipografia grande, luce del tramonto, molto respiro, il registro che si
  vede su quasi ogni sito del settore. L'ho scartata perché parte dal
  presupposto sbagliato — che chi guarda debba essere sedotto.

  Non è così: chi guarda sta per decidere dove dormire due notti,
  spendendo qualche centinaio di euro. Una decisione ha bisogno di
  orientamento e di precisione, non di atmosfera — dov'è, quanto dista,
  quanto costa, quali mesi, quanto è messa male la strada. Un registro
  caldo ed editoriale può nascondere l'assenza di queste risposte dietro
  una fotografia ben scelta; qui avrebbe fatto lo stesso.

soluzione: |
  Ho scelto di trattare il posto come un documento, non come una brochure:
  griglia visibile, filetti sottili, dati in tabella, numeri in
  monospaziato, fondo scuro che lascia al paesaggio il compito di
  emozionare invece di affidarlo all'impaginazione.

  Il sito apre sull'orizzonte — una veduta della valle — prima che su
  qualsiasi dettaglio ravvicinato, perché chi deve scegliere dove dormire
  ha bisogno di sapere dove si trova prima di sapere cosa gli viene
  venduto. I diciotto ettari sono presentati in tabella, come un registro
  catastale: superficie, numero di piante, mese di raccolta — la
  precisione è la forma che prende l'onestà, e un elenco di aggettivi si
  può scrivere per qualsiasi podere.

  Le quattro stagioni sono uno stato comandato dal visitatore, non uno
  scroll: stessa cornice, una dissolvenza, l'accento cromatico che cambia
  con la stagione. Niente si muove da solo — il posto resta fermo, è
  l'anno che gira. La giornata tipo diventa un registro orario dalle 06:40
  alle 22:30, con la carta che cambia temperatura dal freddo dell'alba al
  buio della sera, per rispondere alla domanda che un portale di
  prenotazione non affronta mai: cosa succede davvero in quel posto.

  Prezzi, metri quadri e scomodità restano in chiaro — la scala ripida
  della Torre, gli ultimi 1,2 km di strada bianca, la piscina che non c'è.
  La credibilità si costruisce su quello che un sito è disposto ad
  ammettere, non su quello che nasconde.

tecnica: |
  Next.js 16 con App Router, Server Component come impostazione
  predefinita: sono client solo i quattro punti che hanno davvero bisogno
  del browser — selettore stagioni, registro camere, richiesta di
  disponibilità, navigazione mobile.

  Tre dipendenze di produzione in tutto — next, react, react-dom. Nessuna
  libreria di animazione: dissolvenze e cambi di luce sono transizioni
  CSS. Nessuna libreria di date: la validazione del form confronta due
  stringhe ISO. Il moto non usa un solo listener di scroll — gli stati
  passano tutti da IntersectionObserver, così le sezioni fuori campo non
  lavorano.

  Export statico su GitHub Pages, con il ridimensionamento delle immagini
  delegato a un loader Unsplash personalizzato, così `sizes` e il srcset
  responsive continuano a funzionare senza un server dietro.

risultato:
  - voce: Le stagioni come stato, non come scroll
    dettaglio: Quattro fotografie nella stessa cornice a altezza fissa, comandate dal visitatore. Cambiare stagione non sposta di un pixel il resto della pagina.
  - voce: La terra come documento
    dettaglio: Diciotto ettari in tabella — superficie, numero di piante, mese di raccolta — invece di un elenco di aggettivi che andrebbe bene per qualsiasi podere.
  - voce: Prezzi e scomodità in chiaro
    dettaglio: Scala ripida, strada bianca, piscina assente dichiarati apertamente. La credibilità si costruisce su quello che il sito ammette.
  - voce: CLS a zero
    dettaglio: Rapporti d'immagine riservati e cornici ad altezza fissa in ogni stato, verificato sulla build di produzione a 390px.
  - voce: Tre dipendenze di produzione
    dettaglio: Solo next, react, react-dom. Nessuna libreria di animazione, di date o di icone, nessuno script di terze parti.
  - voce: Zero listener di scroll
    dettaglio: Ogni stato di motion passa da IntersectionObserver, così una sezione fuori campo non fa lavorare la pagina.
  - voce: Non è una struttura reale
    dettaglio: Nessuna prenotazione, camera o dato del podere è reale. Il modulo di richiesta disponibilità è simulato e lo dichiara.

anteprima: podere-vallescura/01-home.jpg
schermate:
  - src: podere-vallescura/01-home.jpg
    alt: Apertura del sito sulla valle all'alba, con la prima riga di dati — comune, altitudine, ettari, camere — sopra il fold
  - src: podere-vallescura/02-stagioni.jpg
    alt: Il selettore delle quattro stagioni, con la fotografia dell'autunno, l'accento cromatico e le liste di raccolto e lavori
  - src: podere-vallescura/03-camere.jpg
    alt: Il registro delle sei camere in griglia, con metratura, letti e prezzo indicativo per ciascuna
  - src: podere-vallescura/04-terra.jpg
    alt: La sezione del podere con i diciotto ettari presentati in tabella, come un registro catastale
  - src: podere-vallescura/05-mobile.jpg
    alt: La stessa home su telefono, con la navigazione a pannello intero e i dati impilati in colonna

tecnologie:
  - Next.js 16
  - React 19
  - TypeScript
  - Tailwind CSS v4
  - next/image

inEvidenza: true
ordine: 2

metaTitolo: Podere Vallescura — concept per un agriturismo sulle colline di Todi
metaDescrizione: Un sito che tratta il posto letto come un documento invece che come una brochure — stagioni come stato, terra in tabella, prezzi e scomodità in chiaro. Next.js 16 e Tailwind v4.
---

Anche qui il cliente ero io, come in [Pizzeria Moderna](/progetti/pizzeria-moderna):
tenerlo fuori dal resto del portfolio serve a non confondere un'iniziativa
con una commessa. La cosa che mi interessava dimostrare non era il
paesaggio — le fotografie sono segnaposto da Unsplash e lo dichiaro nel
progetto — ma il metodo: come si trasforma un problema reale (una scheda
di prenotazione che non basta) in un sistema di design coerente, dalla
prima decisione tipografica fino al numero di dipendenze in produzione.
