<?php
/**
 * Ucuzcubakkal - Pi Payment Complete Endpoint
 * Pi SDK onReadyForServerCompletion callback'i bu dosyaya POST atar.
 * Dosyayi public_html/complete.php olarak yukleyin.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$paymentId = isset($input['paymentId']) ? trim($input['paymentId']) : '';
$txid      = isset($input['txid'])      ? trim($input['txid'])      : '';

if (empty($paymentId) || empty($txid)) {
    http_response_code(400);
    echo json_encode(['error' => 'paymentId veya txid eksik']);
    exit;
}

// Pi Platform API ile odemeyi tamamla
$apiKey = 'BURAYA_PI_API_KEY_YAZIN'; // approve.php ile ayni key

$ch = curl_init('https://api.minepi.com/v2/payments/' . $paymentId . '/complete');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['txid' => $txid]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Key ' . $apiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Log kaydet
$logLine = date('Y-m-d H:i:s') . ' | COMPLETE | paymentId: ' . $paymentId . ' | txid: ' . $txid . ' | HTTP: ' . $httpCode . PHP_EOL;
file_put_contents(__DIR__ . '/pi_payments.log', $logLine, FILE_APPEND);

if ($httpCode === 200) {
    echo json_encode(['success' => true, 'paymentId' => $paymentId, 'txid' => $txid]);
} else {
    http_response_code($httpCode);
    echo $response;
}
