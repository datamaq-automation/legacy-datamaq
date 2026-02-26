<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

dmq_handle_preflight();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$payload = dmq_read_json_body();
if ($payload === null) {
    dmq_error_response(422, 'INVALID_JSON', 'Body must be a valid JSON object.');
    exit;
}

$email = trim((string)($payload['email'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));

if ($email === '' || $message === '') {
    dmq_error_response(422, 'VALIDATION_ERROR', 'email and message are required.');
    exit;
}
if (!dmq_validate_email($email)) {
    dmq_error_response(422, 'VALIDATION_ERROR', 'email format is invalid.');
    exit;
}
if (!dmq_validate_text_length($message, 10, 2000)) {
    dmq_error_response(422, 'VALIDATION_ERROR', 'message must contain between 10 and 2000 characters.');
    exit;
}

dmq_json_response(202, [
    'status' => 'ok',
    'request_id' => dmq_request_id(),
]);
