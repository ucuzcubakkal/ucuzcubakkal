<?php
/**
 * Ucuzcubakkal - Pi Payment Approve Endpoint
 * Pi SDK onReadyForServerApproval callback'i bu dosyaya POST atar.
 * Dosyayi public_html/approve.php olarak yukleyin.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// OPTIONS preflight icin
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Sadece POST kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Gelen veriyi oku
$input = json_decode(file_get_contents('php://input'), true);
$paymentId = isset($input['paymentId']) ? trim($input['paymentId']) : '';

if (empty($paymentId)) {
    http_response_code(400);
    echo json_encode(['error' => 'paymentId eksik']);
    exit;
}

// Pi Platform API ile odemeyi onayla
$apiKey = 'BURAYA_PI_API_KEY_YAZIN'; // Pi Developer Portal'dan alin

$ch = curl_init('https://api.minepi.com/v2/payments/' . $paymentId . '/approve');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, '{}');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Key ' . $apiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Onayi kaydet (basit log dosyasi)
$logLine = date('Y-m-d H:i:s') . ' | APPROVE | paymentId: ' . $paymentId . ' | HTTP: ' . $httpCode . PHP_EOL;
file_put_contents(__DIR__ . '/pi_payments.log', $logLine, FILE_APPEND);

if ($httpCode === 200) {
    echo json_encode(['success' => true, 'paymentId' => $paymentId]);
} else {
    http_response_code($httpCode);
    echo $response;
}
