<?php
declare(strict_types=1);

function dmq_service_validate_contact_like_payload(array $payload): array
{
    /** @var array{ok:bool,status?:int,code?:string,message?:string} $validation */
    $validation = dmq_validate_contact_payload($payload);
    if (($validation['ok'] ?? false) !== true) {
        return [
            'ok' => false,
            'status' => (int)($validation['status'] ?? 422),
            'code' => (string)($validation['code'] ?? 'VALIDATION_ERROR'),
            'message' => (string)($validation['message'] ?? 'Validation error.')
        ];
    }

    return ['ok' => true];
}

function dmq_service_enforce_bucket_rate_limit(string $bucket, int $limit, int $windowSeconds): array
{
    $rl = dmq_get_rate_limit_config($bucket, $limit, $windowSeconds);
    $retryAfter = dmq_enforce_rate_limit(
        $bucket,
        (int)($rl['limit'] ?? $limit),
        (int)($rl['window_seconds'] ?? $windowSeconds)
    );
    if (!is_int($retryAfter)) {
        return ['ok' => true];
    }

    return [
        'ok' => false,
        'status' => 429,
        'code' => 'RATE_LIMITED',
        'message' => 'Too many requests',
        'retry_after' => $retryAfter
    ];
}

function dmq_service_build_diagnostic_quote(array $payload): array
{
    $requiredFields = ['company', 'contact_name', 'locality'];
    foreach ($requiredFields as $field) {
        $value = trim((string) ($payload[$field] ?? ''));
        if ($value === '') {
            return [
                'ok' => false,
                'status' => 422,
                'code' => 'VALIDATION_ERROR',
                'message' => sprintf('%s is required.', $field)
            ];
        }
    }

    $quoteId = 'Q-' . gmdate('Ymd') . '-' . str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
    $finalPrice = 275000;
    $depositPct = 50;
    $depositArs = (int) round($finalPrice * ($depositPct / 100));

    return [
        'ok' => true,
        'quote_id' => $quoteId,
        'list_price_ars' => $finalPrice,
        'discounts' => [],
        'discount_pct' => 0,
        'discount_total_ars' => 0,
        'final_price_ars' => $finalPrice,
        'deposit_pct' => $depositPct,
        'deposit_ars' => $depositArs,
        'valid_until' => gmdate('Y-m-d\TH:i:s\Z', time() + (7 * 24 * 60 * 60)),
        'whatsapp_message' => 'Hola, quiero confirmar la cotizacion ' . $quoteId,
        'whatsapp_url' => 'https://wa.me/5491100000000?text=' . rawurlencode('Hola, quiero confirmar la cotizacion ' . $quoteId),
    ];
}
