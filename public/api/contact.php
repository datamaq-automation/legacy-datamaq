<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload)) {
    dmq_error_response(422, 'INVALID_JSON', 'Body must be a valid JSON object.');
    exit;
}

$email = trim((string)($payload['email'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));

if ($email === '' || $message === '') {
    dmq_error_response(422, 'VALIDATION_ERROR', 'email and message are required.');
    exit;
}

dmq_json_response(202, [
    'status' => 'ok',
    'request_id' => 'test-contact-' . gmdate('YmdHis'),
]);
