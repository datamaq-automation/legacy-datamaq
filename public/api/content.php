<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$brandId = dmq_resolve_brand_id();

$heroTitleByBrand = [
    'datamaq' => 'Diagnostico e instalacion electrica para pymes',
    'upp' => 'Diagnostico e instalacion electrica para pymes',
];

$heroTitle = $heroTitleByBrand[$brandId] ?? 'Diagnostico e instalacion electrica para pymes';

dmq_json_response(200, [
    'status' => 'ok',
    'request_id' => dmq_request_id(),
    'brand_id' => $brandId,
    'version' => 'v1',
    'data' => [
        'hero' => [
            'title' => $heroTitle,
        ],
    ],
]);
