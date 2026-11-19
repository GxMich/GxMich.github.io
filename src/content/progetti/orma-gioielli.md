---
titolo: Orma Gioielli
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Una piccola boutique di gioielli che vende soprattutto un servizio, l'incisione, e non riusciva a mostrarlo.
riassunto: Il sito di una boutique di gioielli dove si prova l'incisione prima di uscire di casa, con l'anteprima che cambia mentre scrivi.
link: https://gxmich.github.io/orma-gioielli-demo/
codice: https://github.com/GxMich/orma-gioielli-demo

contesto: |
  Orma Gioielli non esiste. È una boutique inventata a Roverasca, un paese
  piemontese di fantasia, e nome, indirizzo, telefono, collezioni e prodotti
  servono solo a far funzionare il sito. Il caso però è comune: un negozio
  piccolo che vende gioielli in acciaio e argento e li incide al banco, in
  pochi minuti, davanti al cliente.

  Le foto vengono da Unsplash, l'email è su un dominio .example e tutte le
  pagine hanno noindex. Un negozio finto non deve finire nelle ricerche locali.

problema: |
  In un negozio così il pezzo più venduto non è un gioiello. È la scritta
  sopra. Chi entra ha in testa un nome o una data e vuole capire come verrà:
  in corsivo o in stampatello, su un cuore o su una piastrina, se ci sta tutto.

  Una foto del gioiello non risponde a queste domande. Il cliente le fa in
  negozio o in chat, una alla volta, e spesso rimanda la visita perché non sa
  cosa chiedere.

ricerca: |
  Ho pensato prima a un catalogo con la scheda di ogni prodotto e una riga
  «personalizzabile su richiesta». È la struttura di quasi tutti i negozi di
  bijoux online. L'ho scartata perché trattava l'incisione come una nota a
  margine, quando è il motivo per cui la gente entra.

  Ho scartato anche un vero configuratore con carrello e prezzi. Per un negozio
  che incide al banco sarebbe stato un lavoro enorme da mantenere, e avrebbe
  promesso una vendita online che il negozio non fa.

soluzione: |
  Al centro della pagina c'è l'anteprima dell'incisione. Si sceglie la forma
  (tonda, cuore, barretta, piastrina), il colore del metallo, il carattere e un
  simbolo, e la medaglietta si ridisegna mentre scrivi. Il testo si rimpicciolisce
  da solo se è troppo lungo, così si vede subito se un nome ci sta.

  Tutto il resto porta lì. I prodotti incidibili hanno il pulsante «Prova
  l'incisione», le idee regalo partono da chi riceve il regalo e riempiono il
  modulo con un testo già pronto. Ci sono anche cinque idee rapide, come «Per la
  mamma» o «Una data».

  Alla fine c'è un riepilogo in una frase, quella che il cliente manderebbe al
  negozio. Nella demo il pulsante la copia negli appunti e spiega con un avviso
  che in un sito vero si aprirebbe la chat. Non parte nessun messaggio.

tecnica: |
  HTML, CSS e JavaScript senza framework e senza build. La medaglietta è un SVG
  generato in JavaScript: sfumature per il metallo, una texture di spazzolatura
  fatta con feTurbulence e due strati di testo sfalsati di un pixel per dare
  l'effetto inciso. La larghezza del testo si misura con getComputedTextLength,
  dopo aver aspettato il caricamento dei tre font dell'incisione.

  Font e libreria di scorrimento sono in locale, quindi il sito non fa richieste
  a servizi esterni. Testi e foto dei prodotti stanno in un solo blocco JSON in
  fondo alla pagina. Le animazioni si spengono con prefers-reduced-motion.

risultato:
  - voce: Anteprima dell'incisione in tempo reale
    dettaglio: Quattro forme, tre colori, tre caratteri e cinque simboli. Il testo si adatta da solo alla larghezza della medaglietta.
  - voce: Ogni sezione porta all'anteprima
    dettaglio: Prodotti incidibili, idee regalo e idee rapide riempiono il modulo con un clic e scorrono fino alla medaglietta.
  - voce: Stato della boutique sull'ora italiana
    dettaglio: In alto e nella sezione orari compare «Aperto ora» o «Chiuso ora», con l'orario di riapertura giusto per il giorno.
  - voce: Anteprima compatta su telefono
    dettaglio: Mentre si scelgono le opzioni, una piccola medaglietta resta visibile in basso. Un tocco riporta all'anteprima grande.
  - voce: Nessuna richiesta a servizi esterni
    dettaglio: Font e script in locale, mappa disattivata, contatti simulati. Aprire la pagina non contatta nessun altro server.

anteprima: orma-gioielli/01-home.jpg
schermate:
  - src: orma-gioielli/01-home.jpg
    alt: Hero con una donna in camicia bianca e collana dorata, titolo "Il tuo segno, da portare addosso" e due pulsanti
  - src: orma-gioielli/02-incisione.jpg
    alt: Anteprima dell'incisione su fondo nero, un cuore color oro rosa con la scritta Mamma e le opzioni di forma, colore e carattere a destra
  - src: orma-gioielli/03-collezioni.jpg
    alt: Tre collezioni affiancate, Natura, Legami e Ogni giorno, con foto verticali di gioielli
  - src: orma-gioielli/04-selezione.jpg
    alt: Selezione della collezione Legami, quattro gioielli con il pulsante Prova l'incisione sotto ciascuno
  - src: orma-gioielli/05-regali.jpg
    alt: Idee regalo per destinatario, per lei, per la mamma, per un'amica e per un nuovo arrivo
  - src: orma-gioielli/06-mobile.jpg
    alt: La home su telefono, con barra degli avvisi, logo centrato e il titolo sopra la foto

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - SVG
  - Lenis

inEvidenza: false
ordine: 50

metaTitolo: Orma Gioielli — sito dimostrativo
metaDescrizione: Sito per una boutique di gioielli di fantasia con anteprima dell'incisione in tempo reale, idee regalo e contatti simulati. Senza build.
---

In un negozio che incide i gioielli il cliente compra una frase prima ancora
del metallo. Ho costruito la pagina attorno a quella frase: si scrive, si
guarda, si cambia. Il catalogo viene dopo e serve a scegliere su cosa scriverla.
