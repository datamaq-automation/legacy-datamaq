<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/_bootstrap.php';
require_once dirname(__DIR__) . '/_services.php';
require_once dirname(__DIR__) . '/_resources.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$rateLimit = dmq_service_enforce_bucket_rate_limit('quote_diagnostic', 8, 60);
if (($rateLimit['ok'] ?? false) !== true) {
    header('Retry-After: ' . (string)($rateLimit['retry_after'] ?? '1'));
    dmq_error_response(
        (int)($rateLimit['status'] ?? 429),
        (string)($rateLimit['code'] ?? 'RATE_LIMITED'),
        (string)($rateLimit['message'] ?? 'Too many requests')
    );
    exit;
}

$payload = dmq_read_json_body();
if ($payload === null) {
    dmq_error_response(422, 'INVALID_JSON', 'Body must be a valid JSON object.');
    exit;
}

$quoteResult = dmq_service_build_diagnostic_quote($payload);
if (($quoteResult['ok'] ?? false) !== true) {
    dmq_error_response(
        (int)($quoteResult['status'] ?? 422),
        (string)($quoteResult['code'] ?? 'VALIDATION_ERROR'),
        (string)($quoteResult['message'] ?? 'Validation error.')
    );
    exit;
}

unset($quoteResult['ok']);
dmq_json_response(200, dmq_resource_quote($quoteResult));
