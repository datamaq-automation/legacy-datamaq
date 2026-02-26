<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$retryAfter = dmq_enforce_rate_limit('contact', 5, 60);
if (is_int($retryAfter)) {
    header('Retry-After: ' . $retryAfter);
    dmq_error_response(429, 'RATE_LIMITED', 'Too many requests');
    exit;
}

$payload = dmq_read_json_body();
if ($payload === null) {
    dmq_error_response(422, 'INVALID_JSON', 'Body must be a valid JSON object.');
    exit;
}

/** @var array{ok:bool,status?:int,code?:string,message?:string} $validation */
$validation = dmq_validate_contact_payload($payload);
if (($validation['ok'] ?? false) !== true) {
    dmq_error_response(
        (int)($validation['status'] ?? 422),
        (string)($validation['code'] ?? 'VALIDATION_ERROR'),
        (string)($validation['message'] ?? 'Validation error.')
    );
    exit;
}

dmq_json_response(202, [
    'status' => 'ok',
    'request_id' => dmq_request_id(),
]);
