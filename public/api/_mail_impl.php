<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_services.php';
require_once __DIR__ . '/_resources.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$rateLimit = dmq_service_enforce_bucket_rate_limit('mail', 5, 60);
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

/** @var array{ok:bool,status?:int,code?:string,message?:string} $validation */
$validation = dmq_service_validate_contact_like_payload($payload);
if (($validation['ok'] ?? false) !== true) {
    dmq_error_response(
        (int)($validation['status'] ?? 422),
        (string)($validation['code'] ?? 'VALIDATION_ERROR'),
        (string)($validation['message'] ?? 'Validation error.')
    );
    exit;
}

dmq_json_response(202, dmq_resource_contact_accepted());
