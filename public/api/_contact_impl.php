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

$maxBodyBytes = dmq_get_max_body_bytes();
$requestValidation = dmq_validate_json_request_headers_and_size($maxBodyBytes);
if (is_array($requestValidation)) {
    dmq_error_response(
        (int)($requestValidation['status'] ?? 415),
        (string)($requestValidation['code'] ?? 'UNSUPPORTED_MEDIA_TYPE'),
        (string)($requestValidation['message'] ?? 'Unsupported media type.')
    );
    exit;
}

$rateLimit = dmq_service_enforce_bucket_rate_limit('contact', 5, 60);
if (($rateLimit['ok'] ?? false) !== true) {
    header('Retry-After: ' . (string)($rateLimit['retry_after'] ?? '1'));
    dmq_error_response(
        (int)($rateLimit['status'] ?? 429),
        (string)($rateLimit['code'] ?? 'RATE_LIMITED'),
        (string)($rateLimit['message'] ?? 'Too many requests')
    );
    exit;
}

$body = dmq_read_json_body_with_limit($maxBodyBytes);
if (($body['ok'] ?? false) !== true) {
    dmq_error_response(
        (int)($body['status'] ?? 422),
        (string)($body['code'] ?? 'INVALID_JSON'),
        (string)($body['message'] ?? 'Body must be a valid JSON object.')
    );
    exit;
}
$payload = (array)($body['payload'] ?? []);

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
