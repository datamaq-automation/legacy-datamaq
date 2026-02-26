<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/content_provider.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$brandId = dmq_resolve_brand_id();
$content = dmq_build_app_content($brandId);

dmq_json_response(200, [
    'status' => 'ok',
    'request_id' => dmq_request_id(),
    'brand_id' => $brandId,
    'version' => 'v2',
    'data' => $content,
]);
