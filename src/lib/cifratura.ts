/**
 * Apre il listino cifrato da scripts/cifra-listino.mjs.
 *
 * AES-256-GCM con chiave derivata dalla password (PBKDF2-SHA256). Se la
 * password è sbagliata, GCM rifiuta il testo cifrato: non esiste un "quasi
 * giusta", e non c'è un controllo da aggirare nel sorgente della pagina.
 */
export interface Cifrato {
  v: number;
  iter: number;
  sale: string;
  iv: string;
  dati: string;
}

const daBase64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** WebCrypto esiste solo su https e su localhost: altrove manca del tutto. */
export const cifraturaDisponibile = () => typeof crypto !== 'undefined' && Boolean(crypto.subtle);

export async function apri<T>(cifrato: Cifrato, password: string): Promise<T | null> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveKey',
  ]);
  const chiave = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: daBase64(cifrato.sale), iterations: cifrato.iter, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  try {
    const chiaro = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: daBase64(cifrato.iv) },
      chiave,
      daBase64(cifrato.dati)
    );
    return JSON.parse(new TextDecoder().decode(chiaro)) as T;
  } catch {
    return null;
  }
}
