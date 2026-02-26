<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

dmq_handle_preflight();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$brandId = dmq_resolve_brand_id();
$service = $brandId === 'upp' ? 'upp-api' : 'datamaq-api';

dmq_json_response(200, [
    'status' => 'ok',
    'request_id' => dmq_request_id(),
    'service' => $service,
    'brand_id' => $brandId,
    'version' => 'v1',
    'timestamp' => gmdate('c'),
]);
