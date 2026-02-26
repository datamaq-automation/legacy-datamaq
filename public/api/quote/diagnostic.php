<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);
if (!is_array($payload)) {
    dmq_error_response(422, 'INVALID_JSON', 'Body must be a valid JSON object.');
    exit;
}

$requiredFields = ['company', 'contact_name', 'locality'];
foreach ($requiredFields as $field) {
    $value = trim((string) ($payload[$field] ?? ''));
    if ($value === '') {
        dmq_error_response(422, 'VALIDATION_ERROR', sprintf('%s is required.', $field));
        exit;
    }
}

$quoteId = 'Q-' . gmdate('Ymd') . '-' . str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
$finalPrice = 275000;
$depositPct = 50;
$depositArs = (int) round($finalPrice * ($depositPct / 100));

dmq_json_response(200, [
    'request_id' => dmq_request_id(),
    'quote_id' => $quoteId,
    'list_price_ars' => $finalPrice,
    'discounts' => [],
    'discount_pct' => 0,
    'discount_total_ars' => 0,
    'final_price_ars' => $finalPrice,
    'deposit_pct' => $depositPct,
    'deposit_ars' => $depositArs,
    'valid_until' => gmdate('Y-m-d\TH:i:s\Z', time() + (7 * 24 * 60 * 60)),
    'whatsapp_message' => 'Hola, quiero confirmar la cotizacion ' . $quoteId,
    'whatsapp_url' => 'https://wa.me/5491100000000?text=' . rawurlencode('Hola, quiero confirmar la cotizacion ' . $quoteId),
]);
