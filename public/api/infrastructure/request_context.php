<?php
declare(strict_types=1);

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

function dmq_should_log_level(string $level): bool
{
    $priority = [
        'debug' => 10,
        'info' => 20,
        'warn' => 30,
        'error' => 40,
    ];

    $configured = strtolower(trim((string) (getenv('API_LOG_LEVEL') ?: 'info')));
    if (!isset($priority[$configured])) {
        $configured = 'info';
    }

    return ($priority[$level] ?? 20) >= $priority[$configured];
}

function dmq_log_response(int $statusCode, string $requestId): void
{
    $level = $statusCode >= 500 ? 'error' : ($statusCode >= 400 ? 'warn' : 'info');
    if (!dmq_should_log_level($level)) {
        return;
    }

    $payload = [
        'ts' => gmdate('c'),
        'level' => $level,
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
