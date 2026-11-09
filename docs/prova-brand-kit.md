# Prova del brand kit nel portfolio

21 ottobre 2026. Integrazione locale richiesta da Michele per valutazione.

## Impieghi

- Intestazione: simbolo e nome originali in tracciati, con nome completo su
  desktop e monogramma nella barra compatta e su telefono.
- Menu mobile: firma orizzontale chiara sul fondo scuro.
- Footer: firma orizzontale e sottotitolo HTML leggibile anche su telefono.
- Schede del browser e icone del dispositivo: SVG, ICO, PNG, Apple e Android.
- Anteprime social delle cinque pagine principali: marchio del kit inserito
  nella composizione esistente, conservando i titoli delle singole pagine.
- Stampa delle pagine riservate: firma monocromatica sopra il documento.

I tre SVG in `src/assets/brand` derivano dai tracciati del kit esterno,
con inquadratura adattata agli spazi web e riempimento `currentColor`.
I riferimenti ai glifi sono espansi in tracciati per consentire più istanze
nella stessa pagina senza duplicare gli identificatori SVG.
Le icone in `public` sono copie dei file originali del kit.

L'identità segue il colore effettivo del contenitore: al cambio tema e
nella barra invertita rimane coerente con lo sfondo. L'arancione resta
riservato alle interazioni e agli accenti del sito.

## Confronto e ripristino

Una copia dei componenti, del generatore social, delle precedenti immagini
social, della favicon e dello ZIP è conservata nella cartella esterna
`.backup-prova-brand-kit` alla radice dello spazio di lavoro.

Le immagini destinate ai profili Google, WhatsApp, Instagram e LinkedIn e
i biglietti rimangono nel kit originale. Nessun profilo esterno è modificato.
