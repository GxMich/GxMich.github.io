# Fonti del caso studio Ronin Karate Vigevano

Scheda: `src/content/progetti/ronin-karate-vigevano.md`.
Ricognizione e catture: 5 novembre 2026.

## Versione raccontata

Sito pubblico: https://roninkaratevigevano.vercel.app/.
Progetto locale: `C:/Users/lupos/Documents/clienti/roninkarate/sito`
(Astro 5.18, commit `159e3d1`, 2 novembre 2026).

File consultati: `README.md`, `src/data/sito.ts`, `src/pages/index.astro`,
`src/components/Cercatore.astro`, `src/layouts/Base.astro`,
`scripts/importa-wordpress.mjs`, `vercel.json`, `docs/verifica-pubblicazione.md`,
`docs/revisione-legale.md`, `../consegna-google/GUIDA-GOOGLE.md`.

Proposte grafiche: `../prove/index.html` (Insegna, Tatami, Cintura, Sumi) e
`../prove2/index.html` (Kime, Sumi, Energia, Ronin consigliata).
Vecchio sito: `../originale/dati` (WordPress.com, 7 pagine esportate, 98 articoli).

## Stato verificato il 5 novembre 2026

- Il sito live risponde 200; `robots.txt` live contiene ancora `Disallow: /`.
- `/2019/10/24/1-novembre-2/` risponde 404: i 204 redirect di `vercel.json`
  e l'indicizzazione sono preparati (pacchetto `consegna-google`) ma non
  ancora pubblicati. La scheda lo dice nel risultato «Cosa manca ancora».
- Le pagine legali sono bozze da validare con l'associazione: la scheda
  non afferma conformità, descrive solo il comportamento del codice.

## Schermate

Otto PNG catturati con Playwright dal sito pubblico, senza ritocchi.
Desktop 1440 px, telefono 390 px, movimento ridotto, cookie rifiutati.
Il modulo contatti è stato compilato con dati di prova (Laura, figlio di 9
anni): nessun pulsante di invio premuto, nessuna richiesta POST registrata.

## Limiti delle affermazioni

Nessun dato su visite, iscrizioni o posizionamento. «Quasi 90 allievi» e
gli otto insegnanti vengono da `src/data/sito.ts`. `natura: cliente`
va confermata da Michele se il lavoro non è stato commissionato.
