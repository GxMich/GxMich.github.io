# Fonti del caso studio La Corte delle 4 Stagioni

Scheda: `src/content/progetti/la-corte-delle-4-stagioni.md`.
Ricognizione e catture: 21 ottobre 2026.

## Versione raccontata

Sito pubblico: https://www.lacortedelle4stagioni.com/.
Le pagine `/camere/`, `/camere/cardinale/`, `/disponibilita/` e `/en/` sono
state aperte nel browser. Il modulo pubblicato prepara un messaggio locale
per email o WhatsApp. La scheda non attribuisce al sito pubblico il
calendario, il checkout, i pagamenti o la coda richieste del vecchio prototipo.

La directory locale più vicina al rilascio è:
`C:/Users/lupos/Documents/clienti/lacortedelle4stagioni.com/la corte/la-corte-botanica-www-aggiornamento`.

File consultati:

- `router.php`: HTML preparato, metadati per pagina, lingue alternative,
  sitemap, robots, vecchi indirizzi e risposte 404.
- `api/admin/index.php`: salvataggio dei contenuti, controllo revisione,
  scritture atomiche, lock e salvataggio delle pagine rigenerate.
- `web.config`: configurazione Windows/IIS.
- `.htaccess` e `LEGGIMI-ARUBA.txt`: pacchetto per hosting PHP, IIS/Apache,
  editor e cartelle di contenuti da preservare durante gli aggiornamenti.
- `pages/config.json`: dominio definitivo e configurazione della build.

L'accesso all'area riservata e i salvataggi sul server cliente non sono stati
eseguiti: le caratteristiche dell'editor sono documentate dal codice locale.

## Storia e scelte

Archivio originale:
`C:/Users/lupos/Documents/Documenti Michele/Siti/codex project/B&B La corte delle 4 stagioni`.

- `PROPOSTE-DESIGN.md`: dieci proposte, confronto visivo, Corte Botanica,
  mockup esplorativi e uso delle fotografie originali nella realizzazione.
- `PROJECT-BLUEPRINT.md`: attività reale, tre camere, requisiti della
  proprietaria, abbandono di prenotazioni/pagamenti online e successivo
  vincolo di conservare l'hosting con contenuti su file.
- `STATO-SVILUPPO.md`: storia del prototipo PHP/MySQL, distinto dal rilascio
  più recente. I suoi conteggi di test non sono usati come prove del live.
- `sito/package.json`, `sito/src/ProposalInquiry.jsx`, `sito/src/inquiry.js`
  e `sito/src/CinematicMotion.jsx`: React/Vite, preparazione locale del
  messaggio, GSAP e preferenza di movimento ridotto.

Repository indicato da Michele:
https://github.com/GxMich/la-corte-delle-4-stagioni.
La connessione GitHub ha restituito 404 durante questa ricognizione. È stata
consultata la copia Git locale sul ramo `progetto-completo`, commit
`7c6487d`, insieme al pacchetto di pubblicazione successivo. Il link al codice
non è inserito nella scheda pubblica finché l'accessibilità non è verificata.

## Schermate

Sette PNG catturati con Playwright dal sito pubblico, senza ritocchi:
home, stagioni, camere, Cardinale, disponibilità, mobile, home inglese.
Desktop 1440 px; telefono 390 px. Consenso facoltativo rifiutato e preferenza
di movimento ridotto attiva per fotografare stati stabili e leggibili.

Sono escluse immagini di amministrazione e dati degli ospiti. Non sono state
inviate email, messaggi WhatsApp o richieste alla struttura.

Il pulsante di preparazione è stato provato con dati sintetici: entrambi i
collegamenti generati contenevano il nome di esempio e il soggiorno di due
notti. Nessuna richiesta HTTP di scrittura è partita dal modulo; i pulsanti
di invio esterno non sono stati attivati.

## Limiti delle affermazioni

Nessun incremento di prenotazioni, traffico, conversioni o prestazioni è
attribuito al progetto senza misurazioni. Le tariffe visibili negli screenshot
appartengono al sito della struttura al momento della cattura e non sono un
listino del portfolio.

## Verifica nel portfolio

Build statica di 26 pagine e `npm run controlli` completati. Il nuovo caso
è il primo nella home e nell'elenco lavori, e compare nella sitemap.
Controllo browser a 1440 e 390 px: sette immagini decodificate, cinque
blocchi presenti, galleria orizzontale su desktop e verticale su telefono,
nessun overflow della pagina, errore JavaScript o risorsa locale fallita.
Verificata anche l'apertura della scheda dal collegamento nell'elenco.
