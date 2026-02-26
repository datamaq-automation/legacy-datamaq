<?php
declare(strict_types=1);

function dmq_request_id(): string
{
    static $requestId = null;
    if (is_string($requestId) && $requestId !== '') {
        return $requestId;
    }

    $requestId = 'req-' . gmdate('YmdHis') . '-' . bin2hex(random_bytes(4));
    header('X-Request-Id: ' . $requestId);
    return $requestId;
}

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
    dmq_request_id();
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function dmq_error_response(int $statusCode, string $errorCode, string $detail): void
{
    dmq_json_response($statusCode, [
        'status' => 'error',
        'request_id' => dmq_request_id(),
        'error_code' => $errorCode,
        'detail' => $detail,
    ]);
}
