/**
 * Controllo dei contrasti sui token del sistema.
 *
 * Non è documentazione: è una verifica che si può rieseguire. Tre valori sono
 * già stati corretti una volta perché sembravano a posto a occhio e non lo
 * erano — --ink-3 dava 2,83:1 sul fondo incassato e il bianco sul bottone
 * arancio 3,36:1. Se un token cambia, `npm run contrasti` dice subito se il
 * cambio è ammissibile.
 *
 * Esce con codice 1 se una coppia scende sotto la sua soglia.
 */

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const luminanza = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};

const rapporto = (a, b) => {
  const [alto, basso] = [luminanza(a), luminanza(b)].sort((x, y) => y - x);
  return (alto + 0.05) / (basso + 0.05);
};

const T = {
  paper: '#FAFAFA',
  paperSunk: '#F1F1F0',
  ink: '#0A0A0B',
  ink2: '#55565A',
  ink3: '#686A70',
  signal: '#FF4A1C',
  signalInk: '#CE320C',
  stage: '#08080A',
  stage2: '#101014',
  light: '#F4F4F5',
  light2: '#A1A1A8',
};

/** Gli stessi ruoli, nel tema scuro. */
const S = {
  paper: '#0B0B0D',
  paperSunk: '#131317',
  ink: '#F4F4F5',
  ink2: '#A8A8B0',
  ink3: '#8B8B94',
  signal: '#FF5C33',
  signalInk: '#FF8259',
  stage: '#000000',
  stage2: '#0B0B0D',
};

/**
 * soglia 4.5 → testo normale (AA)
 * soglia 3.0 → testo grande, icone, anelli di messa a fuoco
 */
const coppie = [
  ['--ink su carta', T.ink, T.paper, 4.5],
  ['--ink-2 su carta', T.ink2, T.paper, 4.5],
  ['--ink-3 su carta', T.ink3, T.paper, 4.5],
  ['--ink-3 su incassato', T.ink3, T.paperSunk, 4.5],
  ['--signal-ink su carta', T.signalInk, T.paper, 4.5],
  ['--signal-ink su incassato', T.signalInk, T.paperSunk, 4.5],
  ['testo del bottone su --signal', T.ink, T.signal, 4.5],
  ['anello di focus su carta', T.signal, T.paper, 3.0],
  ['--light sul palco', T.light, T.stage, 4.5],
  ['--light-2 sul palco', T.light2, T.stage, 4.5],
  ['--light-2 su palco sollevato', T.light2, T.stage2, 4.5],
  ['--signal sul palco (testo)', T.signal, T.stage, 4.5],
  ['anello di focus sul palco', T.signal, T.stage, 3.0],

  ['scuro · --ink su carta', S.ink, S.paper, 4.5],
  ['scuro · --ink-2 su carta', S.ink2, S.paper, 4.5],
  ['scuro · --ink-3 su carta', S.ink3, S.paper, 4.5],
  ['scuro · --ink-3 su incassato', S.ink3, S.paperSunk, 4.5],
  ['scuro · --signal-ink su carta', S.signalInk, S.paper, 4.5],
  ['scuro · --signal-ink su incassato', S.signalInk, S.paperSunk, 4.5],
  ['scuro · testo del bottone', T.ink, S.signal, 4.5],
  ['scuro · anello di focus', S.signal, S.paper, 3.0],
  ['scuro · --ink sul palco', S.ink, S.stage, 4.5],
  ['scuro · --ink-2 sul palco', S.ink2, S.stage, 4.5],
  ['scuro · --ink-2 su palco sollevato', S.ink2, S.stage2, 4.5],
];

let bocciate = 0;

for (const [nome, fg, bg, soglia] of coppie) {
  const r = rapporto(fg, bg);
  const passa = r >= soglia;
  if (!passa) bocciate++;
  const livello = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA grande' : '—';
  console.log(
    `${passa ? 'ok  ' : 'NO  '}${nome.padEnd(32)} ${fg} / ${bg}  ${r
      .toFixed(2)
      .padStart(6)}:1  (min ${soglia.toFixed(1)})  ${livello}`
  );
}

console.log(
  bocciate === 0
    ? `\nTutte le ${coppie.length} coppie passano.`
    : `\n${bocciate} coppie su ${coppie.length} sotto soglia.`
);

process.exit(bocciate === 0 ? 0 : 1);
