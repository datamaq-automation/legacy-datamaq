<?php
declare(strict_types=1);

$GLOBALS['dmq_request_started_at'] = microtime(true);

require_once __DIR__ . '/infrastructure/security_headers.php';
require_once __DIR__ . '/infrastructure/cors.php';
require_once __DIR__ . '/infrastructure/request_context.php';
require_once __DIR__ . '/infrastructure/request_validation.php';
require_once __DIR__ . '/infrastructure/rate_limit.php';

function dmq_resolve_brand_id(): string
{
    $brandFromEnv = getenv('BRAND_ID');
    if (is_string($brandFromEnv)) {
        $normalized = strtolower(trim($brandFromEnv));
        if ($normalized === 'datamaq' || $normalized === 'upp' || $normalized === 'example') {
            return $normalized;
        }
    }

    $host = $_SERVER['HTTP_HOST'] ?? '';
    $host = strtolower(trim((string) $host));
    $host = preg_replace('/:\d+$/', '', $host) ?? $host;

    if ($host === '') {
        return 'datamaq';
    }

    $hostBrandMap = [
        'www.datamaq.com.ar' => 'datamaq',
        'datamaq.com.ar' => 'datamaq',
        'www.upp.example' => 'upp',
        'upp.example' => 'upp',
        'www.example.com' => 'example',
        'example.com' => 'example',
    ];

    return $hostBrandMap[$host] ?? 'datamaq';
}

function dmq_json_response(int $statusCode, array $payload): void
{
    $requestId = dmq_request_id();
    http_response_code($statusCode);
    dmq_apply_cors_headers();
    dmq_apply_security_headers();
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    dmq_log_response($statusCode, $requestId);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function dmq_binary_response(
    int $statusCode,
    string $contentType,
    string $body,
    array $extraHeaders = []
): void {
    $requestId = dmq_request_id();
    http_response_code($statusCode);
    dmq_apply_cors_headers();
    dmq_apply_security_headers();
    header('Content-Type: ' . $contentType);
    header('Cache-Control: no-store');
    foreach ($extraHeaders as $name => $value) {
        if (!is_string($name) || !is_string($value) || trim($name) === '') {
            continue;
        }
        header($name . ': ' . $value);
    }
    dmq_log_response($statusCode, $requestId);
    echo $body;
}

function dmq_error_response(int $statusCode, string $errorCode, string $detail): void
{
    $requestId = dmq_request_id();
    dmq_json_response($statusCode, [
        'status' => 'error',
        'request_id' => $requestId,
        'code' => $errorCode,
        'message' => $detail,
        'details' => [],
        'error_code' => $errorCode,
        'detail' => $detail,
    ]);
}
