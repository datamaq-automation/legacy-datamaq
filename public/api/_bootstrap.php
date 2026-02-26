<?php
declare(strict_types=1);

$GLOBALS['dmq_request_started_at'] = microtime(true);

function dmq_get_allowed_origins(): array
{
    $configured = getenv('CORS_ALLOWED_ORIGINS');
    if (is_string($configured) && trim($configured) !== '') {
        $items = array_values(array_filter(array_map(
            static fn(string $value): string => trim($value),
            explode(',', $configured)
        ), static fn(string $value): bool => $value !== ''));

        if (count($items) > 0) {
            return array_values(array_unique($items));
        }
    }

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

    $requestId = dmq_extract_incoming_request_id();
    if (!is_string($requestId) || $requestId === '') {
        $requestId = 'req-' . gmdate('YmdHis') . '-' . bin2hex(random_bytes(4));
    }

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
    $requestId = dmq_request_id();
    http_response_code($statusCode);
    dmq_apply_cors_headers();
    dmq_apply_security_headers();
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    dmq_log_response($statusCode, $requestId);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

function dmq_extract_incoming_request_id(): ?string
{
    $candidates = [
        $_SERVER['HTTP_X_REQUEST_ID'] ?? null,
        $_SERVER['HTTP_REQUEST_ID'] ?? null,
        $_SERVER['HTTP_X_CORRELATION_ID'] ?? null,
    ];

    foreach ($candidates as $candidate) {
        if (!is_string($candidate)) {
            continue;
        }
        $normalized = trim($candidate);
        if ($normalized === '' || strlen($normalized) > 128) {
            continue;
        }
        if (!preg_match('/^[A-Za-z0-9._:-]+$/', $normalized)) {
            continue;
        }
        return $normalized;
    }

    return null;
}

function dmq_request_duration_ms(): int
{
    $startedAt = $GLOBALS['dmq_request_started_at'] ?? null;
    if (!is_float($startedAt)) {
        return 0;
    }

    $duration = (int) round((microtime(true) - $startedAt) * 1000);
    return max(0, $duration);
}

function dmq_log_response(int $statusCode, string $requestId): void
{
    $payload = [
        'ts' => gmdate('c'),
        'level' => $statusCode >= 500 ? 'error' : ($statusCode >= 400 ? 'warn' : 'info'),
        'event' => 'api.response',
        'request_id' => $requestId,
        'method' => (string)($_SERVER['REQUEST_METHOD'] ?? 'GET'),
        'path' => (string)($_SERVER['REQUEST_URI'] ?? ''),
        'status' => $statusCode,
        'duration_ms' => dmq_request_duration_ms(),
        'client_ip' => (string)($_SERVER['REMOTE_ADDR'] ?? ''),
    ];

    error_log((string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

function dmq_read_json_body(): ?array
{
    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody ?: '', true);
    return is_array($payload) ? $payload : null;
}

function dmq_validate_contact_payload(array $payload): array
{
    $email = trim((string)($payload['email'] ?? ''));
    $message = trim((string)($payload['message'] ?? ''));

    if ($email === '' || $message === '') {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'VALIDATION_ERROR',
            'message' => 'email and message are required.'
        ];
    }
    if (!dmq_validate_email($email)) {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'VALIDATION_ERROR',
            'message' => 'email format is invalid.'
        ];
    }
    if (!dmq_validate_text_length($message, 10, 2000)) {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'VALIDATION_ERROR',
            'message' => 'message must contain between 10 and 2000 characters.'
        ];
    }

    return [
        'ok' => true,
        'email' => $email,
        'message' => $message
    ];
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

function dmq_get_client_fingerprint(): string
{
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $userAgent = trim((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));
    return hash('sha256', $ip . '|' . $userAgent);
}

function dmq_enforce_rate_limit(string $bucket, int $limit, int $windowSeconds): ?int
{
    if ($limit <= 0 || $windowSeconds <= 0) {
        return null;
    }

    $now = time();
    $windowStart = $now - $windowSeconds;
    $fingerprint = dmq_get_client_fingerprint();
    $stateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'dmq_rl_' . md5($bucket) . '.json';

    $fp = fopen($stateFile, 'c+');
    if ($fp === false) {
        return null;
    }

    try {
        if (!flock($fp, LOCK_EX)) {
            return null;
        }

        $raw = stream_get_contents($fp);
        $decoded = json_decode($raw ?: '{}', true);
        $state = is_array($decoded) ? $decoded : [];

        $entries = $state[$fingerprint] ?? [];
        if (!is_array($entries)) {
            $entries = [];
        }

        $entries = array_values(array_filter($entries, static fn($ts): bool => is_int($ts) && $ts >= $windowStart));
        if (count($entries) >= $limit) {
            $oldest = (int) ($entries[0] ?? $now);
            $retryAfter = max(1, ($oldest + $windowSeconds) - $now);
            return $retryAfter;
        }

        $entries[] = $now;
        $state[$fingerprint] = $entries;

        foreach ($state as $key => $timestamps) {
            if (!is_array($timestamps)) {
                unset($state[$key]);
                continue;
            }
            $filtered = array_values(array_filter($timestamps, static fn($ts): bool => is_int($ts) && $ts >= $windowStart));
            if (count($filtered) === 0) {
                unset($state[$key]);
                continue;
            }
            $state[$key] = $filtered;
        }

        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($fp);
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    return null;
}
