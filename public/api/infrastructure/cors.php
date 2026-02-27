<?php
declare(strict_types=1);

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
    header('Access-Control-Allow-Headers: Content-Type, X-Request-Id, Request-Id, X-Correlation-Id');
    header('Access-Control-Expose-Headers: X-Request-Id');
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
