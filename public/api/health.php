<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    dmq_json_response(405, [
        'status' => 'error',
        'error_code' => 'METHOD_NOT_ALLOWED',
        'detail' => 'Method Not Allowed',
    ]);
    exit;
}

$brandId = dmq_resolve_brand_id();
$service = $brandId === 'upp' ? 'upp-api' : 'datamaq-api';

dmq_json_response(200, [
    'status' => 'ok',
    'service' => $service,
    'brand_id' => $brandId,
    'version' => 'v1',
    'timestamp' => gmdate('c'),
]);
