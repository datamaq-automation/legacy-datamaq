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
    'datamaq' => 'Diagnóstico e instalación eléctrica para cooperativas',
    'upp' => 'Diagnóstico e instalación eléctrica para pymes',
];

$heroTitle = $heroTitleByBrand[$brandId] ?? 'Diagnóstico e instalación eléctrica para pymes';

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
