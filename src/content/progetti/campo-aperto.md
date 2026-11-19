---
titolo: Campo Aperto
cliente: Progetto su iniziativa
tipo: sito
anno: 2026
natura: iniziativa
demo: true
stato: Demo online — l'attività non esiste, i dati sono di fantasia
sfida: Un centro cinofilo con undici corsi diversi e un pubblico che non sa da quale cominciare.
riassunto: Il sito di un centro cinofilo dove i corsi si filtrano per tipo, i servizi stanno su una pagina sola e il primo messaggio si scrive da solo.
link: https://gxmich.github.io/campo-aperto-demo/
codice: https://github.com/GxMich/campo-aperto-demo

contesto: |
  Campo Aperto non esiste. È un centro cinofilo inventato a Roverasca, un
  paese piemontese di fantasia. L'educatrice «Irene», l'indirizzo, il
  telefono e l'email sono inventati, e il logo l'ho disegnato per la demo.
  Le foto vengono da Unsplash e tutte le pagine hanno noindex.

  Il tipo di attività invece è reale e diffuso: un centro in campagna con
  campi recintati, corsi di educazione, sport cinofili come agility e rally
  obedience, e qualche servizio extra come la vasca estiva e il dog sitter.

problema: |
  Un centro così offre molte cose diverse. Chi ha appena preso un cucciolo
  cerca una cosa, chi ha un cane che tira al guinzaglio un'altra, chi vuole
  provare l'agility un'altra ancora. Messi in fila, undici corsi diventano un
  muro di testo e la gente si ferma prima di trovare il suo.

  Il secondo problema è il primo contatto. Chi scrive a un centro cinofilo
  spesso non sa cosa dire, e il messaggio arriva senza le informazioni utili:
  l'età del cane, il nome, cosa interessa davvero.

ricerca: |
  Ho pensato prima a una pagina per ogni corso, come fanno molti centri. È
  ordinato, ma costringe a entrare e uscire da undici pagine per confrontare
  due percorsi, e da telefono diventa faticoso.

  Ho scartato anche un modulo di contatto con tutti i campi obbligatori.
  Chi scrive per la prima volta vuole solo una risposta, non compilare una
  scheda. Ho tenuto obbligatorio solo il nome.

soluzione: |
  I corsi stanno tutti in una griglia, ognuno con un'etichetta di tipo, due
  righe di descrizione e l'età o il livello. Sopra ci sono quattro filtri:
  tutti, educazione, sport, attività di gruppo. Le schede filtrate rientrano
  con una piccola animazione. La scheda «Non sai quale scegliere?» resta sempre
  visibile, qualunque filtro sia attivo.

  I servizi extra hanno una griglia a parte, con dimensioni diverse: la vasca
  estiva più grande, il dog sitter e l'area svago con la foto, la sala coperta
  e l'asilo diurno solo testo. L'asilo è segnato come sospeso, così si vede
  anche cosa non è disponibile.

  Il modulo chiede nome, nome del cane, età, corso di interesse e una nota
  libera. Con questi dati compone un messaggio completo. Nella demo il
  messaggio appare sotto il pulsante e un avviso dice che non parte niente.

tecnica: |
  HTML, CSS e JavaScript senza framework e senza build. Il filtro dei corsi
  usa attributi data e una classe per nascondere le schede, con un reflow
  forzato per far ripartire l'animazione d'ingresso. Le comparse allo scroll e
  la voce di menu attiva usano IntersectionObserver.

  Il menu mobile blocca lo scorrimento della pagina mentre è aperto e si chiude
  con Esc, con un tocco fuori o quando la finestra torna larga. Il pulsante
  flottante porta al modulo e sparisce quando il modulo è già sullo schermo.

risultato:
  - voce: Undici corsi filtrabili in un clic
    dettaglio: Quattro filtri sopra la griglia, schede che rientrano animate e un invito a chiedere consiglio sempre visibile.
  - voce: Servizi su una griglia a misura
    dettaglio: Cinque servizi con pesi diversi, foto dove serve e un servizio segnato come sospeso.
  - voce: Primo messaggio già completo
    dettaglio: Il modulo compone il testo con nome, cane, età e corso scelto. Solo il nome è obbligatorio.
  - voce: Menu mobile che non perde lo scroll
    dettaglio: Lo sfondo resta fermo mentre il menu è aperto, e il menu si chiude con Esc, con un tocco fuori o allargando la finestra.
  - voce: Nessun dato reale
    dettaglio: Centro, persona, indirizzo e recapiti inventati, logo disegnato apposta, mappa sostituita da un segnaposto e noindex su tutto il sito.

anteprima: campo-aperto/01-home.jpg
schermate:
  - src: campo-aperto/01-home.jpg
    alt: Apertura su fondo crema con il titolo "Spazio per correre, tempo per capirsi" e la foto di un cane nero che guarda un premio
  - src: campo-aperto/02-corsi.jpg
    alt: Griglia dei corsi con i filtri Tutti, Educazione, Sport cinofili e Attività di gruppo
  - src: campo-aperto/03-servizi.jpg
    alt: Griglia dei servizi con la vasca estiva in grande, il dog sitter e l'area svago con foto
  - src: campo-aperto/04-staff.jpg
    alt: Sezione staff su fondo marrone scuro con la foto rotonda dell'educatrice e il suo golden retriever
  - src: campo-aperto/05-contatti.jpg
    alt: Modulo di contatto con il messaggio composto mostrato sotto il pulsante
  - src: campo-aperto/06-mobile.jpg
    alt: L'apertura su telefono con il titolo, i pulsanti e la foto del cane

tecnologie:
  - HTML
  - CSS
  - JavaScript
  - IntersectionObserver

inEvidenza: false
ordine: 50

metaTitolo: Campo Aperto — sito dimostrativo
metaDescrizione: Sito per un centro cinofilo di fantasia con undici corsi filtrabili, servizi su prenotazione e un modulo che compone il primo messaggio. Senza build.
---

In un centro cinofilo la domanda più frequente è «da dove comincio?». Ho
costruito la pagina per rispondere a quella: i corsi si restringono con un
filtro, e se il filtro non basta c'è sempre una scheda che invita a chiedere.
