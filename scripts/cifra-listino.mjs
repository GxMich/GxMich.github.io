/**
 * Cifra il listino per la pagina dell'incontro.
 *
 * Il sito è statico e vive su un hosting pubblico: una password controllata
 * da JavaScript si aggira guardando il sorgente della pagina. Qui invece i
 * prezzi nel sorgente non ci sono: ci sono solo cifrati, e la password è la
 * chiave per leggerli (AES-256-GCM, chiave derivata con PBKDF2-SHA256).
 *
 *   scripts/listino-privato.json  →  src/data/listino.cifrato.json
 *
 * Il primo è in chiaro e sta fuori da git (vedi .gitignore): si modifica lì,
 * poi si rilancia `npm run cifra` e si pubblica il secondo. Per cambiare la
 * password basta rilanciarlo con una nuova.
 *
 * La password non si salva da nessuna parte. Se la perdi non si recupera:
 * si rifà il cifrato con una nuova.
 *
 *   npm run cifra                       chiede la password due volte
 *   $env:PASSWORD_INCONTRO='…'; npm run cifra   (PowerShell, senza domande)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';

const ENTRATA = 'scripts/listino-privato.json';
const USCITA = 'src/data/listino.cifrato.json';
const ITERAZIONI = 600_000;

/** Una riga di input senza mostrare quello che si scrive. */
function chiedi(domanda) {
  return new Promise((risolvi) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muto = false;
    rl._writeToOutput = (s) => {
      if (muto && !s.includes('\n')) rl.output.write('*');
      else rl.output.write(s);
    };
    rl.question(domanda, (r) => {
      rl.close();
      process.stdout.write('\n');
      risolvi(r);
    });
    muto = true;
  });
}

if (!existsSync(ENTRATA)) {
  console.error(`Manca ${ENTRATA}: è il listino in chiaro, e sta fuori da git.`);
  process.exit(1);
}

let listino;
try {
  listino = JSON.parse(readFileSync(ENTRATA, 'utf8'));
} catch (e) {
  console.error(`${ENTRATA} non è un JSON valido: ${e.message}`);
  process.exit(1);
}

for (const chiave of ['pacchetti', 'extra']) {
  if (!listino[chiave] || typeof listino[chiave] !== 'object') {
    console.error(`${ENTRATA}: manca la sezione "${chiave}".`);
    process.exit(1);
  }
}

let password = process.env.PASSWORD_INCONTRO;
if (!password && !process.stdin.isTTY) {
  /* Senza tastiera collegata (per esempio dentro la shell di un assistente) la
     domanda resterebbe in sospeso e il comando finirebbe senza scrivere niente. */
  console.error(
    'Qui non posso chiederti la password: apri un terminale tuo (PowerShell) nella cartella del\n' +
      'progetto e lancia `npm run cifra` da lì.'
  );
  process.exit(1);
}
if (!password) {
  password = await chiedi('Nuova password: ');
  const conferma = await chiedi('Ripetila: ');
  if (password !== conferma) {
    console.error('Le due password non coincidono. Non ho scritto niente.');
    process.exit(1);
  }
}

if (password.length < 12) {
  console.error(
    'Almeno 12 caratteri. Il file cifrato è pubblico: chi lo scarica può provare password\n' +
      'all\'infinito sul proprio computer, e una corta cade in fretta. Meglio una frase.'
  );
  process.exit(1);
}

const sale = randomBytes(16);
const iv = randomBytes(12);
const chiave = pbkdf2Sync(password, sale, ITERAZIONI, 32, 'sha256');
const cifrario = createCipheriv('aes-256-gcm', chiave, iv);
const cifrato = Buffer.concat([cifrario.update(JSON.stringify(listino), 'utf8'), cifrario.final()]);
/* WebCrypto si aspetta l'etichetta di autenticazione in coda al testo cifrato. */
const dati = Buffer.concat([cifrato, cifrario.getAuthTag()]);

writeFileSync(
  USCITA,
  JSON.stringify({
    v: 1,
    iter: ITERAZIONI,
    sale: sale.toString('base64'),
    iv: iv.toString('base64'),
    dati: dati.toString('base64'),
  }) + '\n'
);

console.log(`Fatto: ${USCITA}`);
console.log('Ora pubblica il file (commit e push). La password non è stata salvata.');
