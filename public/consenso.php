<?php
/**
 * Registro dei consensi alle misure di traffico.
 *
 * La fascia del consenso (src/components/comuni/Consenso.astro) manda qui
 * ogni scelta. Una riga per scelta, in un file per mese:
 *
 *   2026-11-19T18:04:12+01:00  si  ga4+clarity  /contatti  3f9c0a1b2d4e5f60
 *
 * Cosa NON si salva: indirizzo IP, browser, cookie. L'id è un numero a caso
 * generato nel browser, che non dice chi è la persona: serve solo a
 * dimostrare che quella scelta è stata chiesta e data, e quando.
 *
 * I file stanno in registro-consensi/, chiusa al web da un suo .htaccess (e
 * i .log sono comunque bloccati da quello principale). Si conservano 24 mesi:
 * a ogni scrittura i mesi più vecchi vengono cancellati.
 */

date_default_timezone_set('Europe/Rome');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

$grezzo = file_get_contents('php://input', false, null, 0, 1024);
$dati = json_decode($grezzo ?: '', true);

$id = $dati['id'] ?? '';
$scelta = $dati['scelta'] ?? '';
$versione = $dati['versione'] ?? '';
$pagina = $dati['pagina'] ?? '';

$valido =
    is_string($id) && preg_match('/^[a-f0-9]{16}$/', $id) &&
    in_array($scelta, ['si', 'no'], true) &&
    is_string($versione) && preg_match('/^[a-z0-9+]{1,40}$/', $versione) &&
    is_string($pagina) && preg_match('#^/[a-z0-9/_\-]{0,120}$#', $pagina);

if (!$valido) {
    http_response_code(400);
    exit;
}

$cartella = __DIR__ . '/registro-consensi';
if (!is_dir($cartella)) {
    @mkdir($cartella, 0750, true);
}
$chiusura = $cartella . '/.htaccess';
if (!file_exists($chiusura)) {
    @file_put_contents($chiusura, "Require all denied\n");
}

$riga = implode("\t", [date('c'), $scelta, $versione, $pagina, $id]) . "\n";
$file = $cartella . '/consensi-' . date('Y-m') . '.log';
$ok = @file_put_contents($file, $riga, FILE_APPEND | LOCK_EX);

/* Conservazione: 24 mesi, poi via. */
$limite = date('Y-m', strtotime('-24 months'));
foreach (glob($cartella . '/consensi-*.log') ?: [] as $vecchio) {
    if (preg_match('/consensi-(\d{4}-\d{2})\.log$/', $vecchio, $m) && $m[1] < $limite) {
        @unlink($vecchio);
    }
}

http_response_code($ok === false ? 500 : 204);
