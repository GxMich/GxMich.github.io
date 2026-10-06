/**
 * Un archivio ZIP senza compressione ("store"), scritto a mano.
 *
 * Serve per un solo lavoro: impacchettare le registrazioni di un incontro con le
 * risposte e le trascrizioni, da dare a un'AI. L'audio è già compresso (opus), quindi
 * comprimerlo ancora non fa guadagnare niente e una libreria in più pesa più
 * di queste cinquanta righe.
 */

const TABELLA = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(dati: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < dati.length; i += 1) c = TABELLA[(c ^ dati[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export interface FileZip {
  /** percorso nell'archivio, con "/" per le cartelle */
  nome: string;
  dati: Uint8Array;
}

export function creaZip(files: FileZip[], quando = new Date()): Uint8Array {
  const codifica = new TextEncoder();
  const ora = (quando.getHours() << 11) | (quando.getMinutes() << 5) | (quando.getSeconds() >> 1);
  const giorno = ((quando.getFullYear() - 1980) << 9) | ((quando.getMonth() + 1) << 5) | quando.getDate();

  const blocchi: Uint8Array[] = [];
  const indice: Uint8Array[] = [];
  let posizione = 0;

  for (const f of files) {
    const nome = codifica.encode(f.nome);
    const crc = crc32(f.dati);

    const testa = new DataView(new ArrayBuffer(30));
    testa.setUint32(0, 0x04034b50, true);
    testa.setUint16(4, 20, true);
    testa.setUint16(6, 0x0800, true); // nomi in UTF-8
    testa.setUint16(8, 0, true); // nessuna compressione
    testa.setUint16(10, ora, true);
    testa.setUint16(12, giorno, true);
    testa.setUint32(14, crc, true);
    testa.setUint32(18, f.dati.length, true);
    testa.setUint32(22, f.dati.length, true);
    testa.setUint16(26, nome.length, true);
    testa.setUint16(28, 0, true);

    const voce = new DataView(new ArrayBuffer(46));
    voce.setUint32(0, 0x02014b50, true);
    voce.setUint16(4, 20, true);
    voce.setUint16(6, 20, true);
    voce.setUint16(8, 0x0800, true);
    voce.setUint16(10, 0, true);
    voce.setUint16(12, ora, true);
    voce.setUint16(14, giorno, true);
    voce.setUint32(16, crc, true);
    voce.setUint32(20, f.dati.length, true);
    voce.setUint32(24, f.dati.length, true);
    voce.setUint16(28, nome.length, true);
    voce.setUint32(42, posizione, true);

    blocchi.push(new Uint8Array(testa.buffer), nome, f.dati);
    indice.push(new Uint8Array(voce.buffer), nome);
    posizione += 30 + nome.length + f.dati.length;
  }

  const dimIndice = indice.reduce((n, b) => n + b.length, 0);
  const fine = new DataView(new ArrayBuffer(22));
  fine.setUint32(0, 0x06054b50, true);
  fine.setUint16(8, files.length, true);
  fine.setUint16(10, files.length, true);
  fine.setUint32(12, dimIndice, true);
  fine.setUint32(16, posizione, true);

  const tutti = [...blocchi, ...indice, new Uint8Array(fine.buffer)];
  const fuori = new Uint8Array(tutti.reduce((n, b) => n + b.length, 0));
  let i = 0;
  for (const b of tutti) {
    fuori.set(b, i);
    i += b.length;
  }
  return fuori;
}
