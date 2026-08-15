---
titolo: Banco olografico
cliente: Progetto di ricerca
tipo: tool
anno: 2026
natura: iniziativa
stato: In corso — nucleo funzionante, resa grafica da rifinire
durata: In lavorazione dal 2026
sfida: Un motore da 115 pezzi da far smontare a chi non ce l'ha davanti.
riassunto: Un motore a due cilindri da 115 pezzi che si smonta nel browser muovendo le mani davanti alla webcam, senza installare niente.

contesto: |
  Chi insegna meccanica ha due possibilità: il disegno esploso stampato, che è
  fermo, o il pezzo vero sul banco, che c'è in un esemplare solo e si smonta a
  turno. In mezzo non c'è quasi niente, perché i visualizzatori CAD seri costano
  come licenza e chiedono un'installazione.

  Volevo capire quanto ci si può avvicinare stando dentro una pagina web, con
  geometria CAD vera e non con un modellino fatto apposta per sembrare leggero.

problema: |
  I modelli veri sono pesanti e disordinati. Il motore bicilindrico che uso come
  banco di prova ha 115 componenti separati e nessuna informazione su cosa sta
  dentro cosa: è geometria convertita da CAD industriale, non una scena
  costruita per il web.

  Il problema difficile non è caricarlo. È che un'esplosione uniforme — tutti i
  pezzi che si allontanano della stessa quantità — non spiega niente, perché il
  perno dell'albero finisce alla stessa distanza del carter che lo conteneva. E
  con le mani sporche o occupate, che è la condizione normale di un'officina, il
  mouse è lo strumento sbagliato.

soluzione: |
  Per l'esploso ho legato la corsa di ogni pezzo alla sua distanza dal centro
  del gruppo, non a un valore fisso. Il modello si apre a strati, dall'esterno
  verso l'interno, e l'ordine di smontaggio si legge da solo.

  Per i comandi ho usato il tracciamento delle mani dalla webcam con MediaPipe.
  Il pizzico fra indice e pollice seleziona, il pizzico trascinato ruota, due
  pizzichi che si allargano smontano, il pugno rimonta tutto.

  Il dettaglio che ha richiesto più tentativi è la soglia del pizzico. Con una
  soglia sola, tenendo le dita quasi chiuse il gesto si apriva e chiudeva da
  solo decine di volte al secondo. Ho messo due soglie diverse: si chiude a
  0,40 e si riapre solo sopra 0,52. La mano ferma resta ferma.

  La modalità costruzione l'ho riscritta due volte. Piazzare i blocchi dove
  colpisce il raggio sembrava la cosa ovvia e produceva blocchi conficcati nel
  pavimento: sono passato a un reticolo a celle intere, lo stesso principio di
  Minecraft. Meno elegante sulla carta, corretto sempre.

risultato:
  - voce: Modelli CAD veri nel browser
    dettaglio: Tre assiemi dai modelli campione ufficiali Khronos — motore bicilindrico da 115 componenti (1,8 MB), seghetto alternativo (3,5 MB), riduttore a ingranaggi (5,0 MB). Scaricati a runtime, niente da installare.
  - voce: Esploso che spiega l'ordine di smontaggio
    dettaglio: La corsa di ogni pezzo è proporzionale alla sua distanza dal centro, quindi il gruppo si apre a strati invece che a nuvola.
  - voce: Comandi a mani libere
    dettaglio: Pizzico, pizzico trascinato, doppio pizzico e pugno. Doppia soglia sul pizzico per evitare che il gesto sfarfalli quando la mano è quasi chiusa.
  - voce: Esportazione
    dettaglio: Quello che si costruisce esce in .glb standard e si riapre in Blender senza conversioni.
  - voce: Cosa manca
    dettaglio: La resa grafica — luci, materiali, ombre — è stata verificata via codice ma non ancora giudicata a occhio. Il tracciamento delle mani non è provato su telefono. Non ho misurato fotogrammi al secondo né memoria occupata su macchine diverse dalla mia.

anteprima: banco-olografico/copertina.jpg
schermate:
  - src: banco-olografico/copertina.jpg
    alt: Componenti metallici di un motore in primo piano

tecnologie:
  - Three.js
  - WebGL2
  - MediaPipe Hands
  - glTF 2.0
  - JavaScript

inEvidenza: true
ordine: 2

metaTitolo: Banco olografico — smontare un motore CAD nel browser con le mani
metaDescrizione: "Visualizzatore CAD nel browser: 115 componenti veri, esploso a strati e comandi con le mani da webcam. Three.js e MediaPipe."
---

I modelli non sono miei: sono i campioni ufficiali del consorzio Khronos,
geometria CAD industriale convertita da JT e COLLADA da Okino Computer
Graphics. Mio è quello che ci gira attorno — il caricamento, l'esploso, la
selezione, i gesti. Lo scrivo perché "115 componenti" suona come se avessi
modellato un motore, e non è così.

Il bug che mi ha fatto perdere più tempo non era nel tracciamento delle mani ma
nel posizionamento dei blocchi. Il raggio leggeva una matrice di trasformazione
non ancora aggiornata e usava il punto d'impatto grezzo: se colpivi la faccia
laterale di un cubo, il blocco nuovo nasceva sotto il pavimento.

La correzione non è stata sistemare il calcolo ma cambiare domanda: invece di
chiedere *dove ha colpito il raggio*, chiedere *in quale cella del reticolo*.
Il problema di precisione sparisce perché non c'è più precisione da avere.
