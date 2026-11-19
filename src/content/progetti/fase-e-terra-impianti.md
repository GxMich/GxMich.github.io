---
titolo: Fase e Terra Impianti
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un elettricista che lavora da solo e doveva sembrare affidabile senza foto di cantiere.
riassunto: Il sito di un elettricista che monta anche fotovoltaico, con le schede degli interventi al posto della galleria e un'identità presa dai colori dei cavi elettrici.
link: https://gxmich.github.io/fase-e-terra-impianti-demo/
codice: https://github.com/GxMich/fase-e-terra-impianti-demo

contesto: |
  Fase e Terra Impianti è una ditta di fantasia. Il titolare, l'indirizzo a
  Montebrina, il telefono, l'email, la partita IVA e i lavori descritti sono
  inventati. Le pagine hanno noindex e il dominio è .example.

  Il caso è quello di tanti artigiani di provincia: una ditta individuale, un
  elettricista che fa impianti civili, illuminazione, guasti e da qualche anno
  anche fotovoltaico. Lavora quasi solo su passaparola e non ha foto dei suoi
  cantieri.

problema: |
  I siti degli elettricisti si somigliano tutti: blu notte, giallo, un fulmine,
  quattro card di servizi e una galleria di foto prese da internet. Chi li
  visita non riesce a distinguerne uno dall'altro.

  Il secondo problema è la fiducia. Senza foto vere dei lavori la galleria è
  vuota, e una galleria di foto di repertorio si riconosce subito. Per il
  fotovoltaico la diffidenza è ancora più forte: tutti promettono la bolletta a
  zero.

ricerca: |
  La prima versione era proprio quella classica, con fondo scuro, giallo per le
  azioni e una griglia di card. Funzionava, ma sembrava il sito di chiunque.

  Ho cambiato due cose. I colori vengono dai conduttori elettrici italiani: rame
  per la fase, giallo-verde per la terra, un grigio caldo da intonaco per il
  fondo. E al posto della galleria ho messo le schede degli interventi, perché a
  un elettricista si chiede cosa ha fatto, non come era venuta la foto.

soluzione: |
  Ogni lavoro è una scheda con cinque righe: dove, com'era, cosa è stato fatto,
  quanto è durato e cosa è stato consegnato al cliente. La prima compare già in
  apertura, accanto al titolo. Nella pagina dei lavori si filtrano per tipo.

  La home ha una griglia di servizi con celle diverse fra loro. Il fotovoltaico
  ha un esempio di dimensionamento con potenza, produzione, autoconsumo e anni
  di rientro. Gli impianti elettrici hanno l'elenco delle lavorazioni, poi ci
  sono l'illuminazione, le zone servite e una fascia scura per chi ha un guasto
  e deve solo telefonare.

  La pagina del fotovoltaico spiega il percorso in quattro passi e dice anche
  quando non conviene e cosa non viene promesso. Il sito parla in prima persona,
  perché in una ditta di una persona sola il titolare è il servizio.

tecnica: |
  React e Vite in modalità multipagina: sette file HTML, ognuno con il suo
  titolo e la sua descrizione, senza router. I file di ingresso li genera uno
  script a partire da un elenco, così aggiungere una pagina richiede poche righe.

  La prima schermata ha una luce che scorre su un muro di calce, disegnata con
  un canvas WebGL scritto a mano in circa 2,5 KB. Ho scartato Three.js, che
  avrebbe pesato più del resto del sito. Le sezioni compaiono allo scroll con
  IntersectionObserver e senza librerie.

  Colori, misure e raggi sono token di Tailwind 4 in un solo file CSS. Il modulo
  del preventivo valida i campi e mostra gli errori accanto a ciascuno; nella
  demo mostra la conferma senza inviare niente. Il sito è pubblicato su GitHub
  Pages con GitHub Actions.

risultato:
  - voce: Schede intervento al posto della galleria
    dettaglio: Cinque righe per lavoro, da com'era a cosa è stato consegnato, filtrabili per tipo nella pagina dei lavori.
  - voce: Un'identità che non è il solito blu e giallo
    dettaglio: Rame, giallo-verde e calce, presi dai colori dei cavi elettrici. Per regola il rame non copre più del dieci per cento della pagina.
  - voce: Il fotovoltaico spiegato con i numeri
    dettaglio: Un esempio di dimensionamento in home e una pagina che dice anche quando l'impianto non conviene.
  - voce: Urgenze separate dal preventivo
    dettaglio: Chi ha un guasto trova il telefono in una fascia dedicata, in home e in cima alla pagina contatti, prima del modulo.
  - voce: Sette pagine leggere
    dettaglio: Sito multipagina senza router, canvas WebGL in 2,5 KB e comparsa allo scroll senza dipendenze.
  - voce: Dati inventati, dichiarati
    dettaglio: Avviso nel footer di ogni pagina, modulo simulato, noindex e robots.txt che blocca i motori di ricerca.

anteprima: fase-e-terra-impianti/01-home.jpg
schermate:
  - src: fase-e-terra-impianti/01-home.jpg
    alt: Apertura su fondo color calce con il titolo "Prima l'impianto sotto, poi i pannelli sul tetto" e a destra una scheda intervento
  - src: fase-e-terra-impianti/02-servizi.jpg
    alt: Griglia dei servizi con la cella grande del fotovoltaico e l'esempio di dimensionamento, gli impianti elettrici, l'illuminazione e le zone servite
  - src: fase-e-terra-impianti/03-lavori.jpg
    alt: Pagina dei lavori con i filtri per tipo e le schede intervento in due colonne
  - src: fase-e-terra-impianti/04-fotovoltaico.jpg
    alt: Pagina del fotovoltaico con il titolo "Prima leggo le bollette, poi guardo il tetto" e i numeri di un impianto di esempio
  - src: fase-e-terra-impianti/05-preventivo.jpg
    alt: Pagina contatti con la fascia rossa per i guasti e il modulo di preventivo che mostra gli errori accanto ai campi
  - src: fase-e-terra-impianti/06-mobile.jpg
    alt: La stessa apertura su telefono, con il monogramma, il titolo e i due pulsanti per il preventivo e la chiamata

tecnologie:
  - React
  - Vite
  - Tailwind CSS
  - WebGL
  - GitHub Actions

inEvidenza: false
ordine: 50

metaTitolo: Fase e Terra Impianti — sito dimostrativo
metaDescrizione: Sito di un elettricista di fantasia con le schede degli interventi al posto della galleria, i colori dei cavi elettrici e il fotovoltaico spiegato con i numeri.
---

Un elettricista non vende foto, vende impianti che funzionano e carte in
regola. Per questo il sito mostra quello che resta in mano al cliente: una
scheda per ogni lavoro, i numeri del fotovoltaico e un telefono sempre
raggiungibile quando salta la corrente.
