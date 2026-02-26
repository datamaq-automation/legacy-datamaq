<?php
declare(strict_types=1);

function dmq_resolve_brand_id(): string
{
    $brandFromEnv = getenv('BRAND_ID');
    if (is_string($brandFromEnv)) {
        $normalized = strtolower(trim($brandFromEnv));
        if ($normalized === 'datamaq' || $normalized === 'upp') {
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
    ];

    return $hostBrandMap[$host] ?? 'datamaq';
}

function dmq_json_response(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
