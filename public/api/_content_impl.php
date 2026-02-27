<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/content_provider.php';
require_once __DIR__ . '/_resources.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$brandId = dmq_resolve_brand_id();
$content = dmq_build_app_content($brandId);
$resource = dmq_resource_content($brandId, $content);

if (dmq_should_log_level('info')) {
    error_log((string) json_encode([
        'ts' => gmdate('c'),
        'level' => 'info',
        'event' => 'api.content.response',
        'request_id' => dmq_request_id(),
        'brand_id' => $brandId,
        'content_revision' => (string)($resource['content_revision'] ?? ''),
        'status' => 200,
        'duration_ms' => dmq_request_duration_ms(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

dmq_json_response(200, $resource);
