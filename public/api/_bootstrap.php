<?php
declare(strict_types=1);

function dmq_get_allowed_origins(): array
{
    return [
        'https://datamaq.com.ar',
        'https://www.datamaq.com.ar',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];
}

function dmq_apply_cors_headers(): void
{
    $origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
    if ($origin === '') {
        return;
    }

    if (!in_array($origin, dmq_get_allowed_origins(), true)) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Request-Id');
}

function dmq_apply_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('X-Frame-Options: DENY');
}

function dmq_handle_preflight(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'OPTIONS') {
        return;
    }

    dmq_apply_cors_headers();
    dmq_apply_security_headers();
    http_response_code(204);
    exit;
}

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
    dmq_apply_cors_headers();
    dmq_apply_security_headers();
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

function dmq_read_json_body(): ?array
{
    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody ?: '', true);
    return is_array($payload) ? $payload : null;
}

function dmq_validate_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function dmq_validate_text_length(string $value, int $min, int $max): bool
{
    $length = mb_strlen(trim($value));
    return $length >= $min && $length <= $max;
}
