<?php
declare(strict_types=1);

function dmq_read_json_body(): ?array
{
    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody ?: '', true);
    return is_array($payload) ? $payload : null;
}

function dmq_get_max_body_bytes(): int
{
    $configured = getenv('API_MAX_BODY_BYTES');
    if (is_string($configured) && preg_match('/^\d+$/', trim($configured))) {
        $value = (int) trim($configured);
        if ($value > 0) {
            return $value;
        }
    }

    return 32768;
}

function dmq_validate_json_request_headers_and_size(int $maxBytes): ?array
{
    $contentType = trim((string)($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? ''));
    if ($contentType === '' || stripos($contentType, 'application/json') !== 0) {
        return [
            'status' => 415,
            'code' => 'UNSUPPORTED_MEDIA_TYPE',
            'message' => 'Content-Type must be application/json.'
        ];
    }

    $contentLengthRaw = trim((string)($_SERVER['CONTENT_LENGTH'] ?? ''));
    if ($contentLengthRaw !== '' && preg_match('/^\d+$/', $contentLengthRaw)) {
        $contentLength = (int) $contentLengthRaw;
        if ($contentLength > $maxBytes) {
            return [
                'status' => 413,
                'code' => 'PAYLOAD_TOO_LARGE',
                'message' => 'Payload exceeds allowed size.'
            ];
        }
    }

    return null;
}

function dmq_read_json_body_with_limit(int $maxBytes): array
{
    $rawBody = file_get_contents('php://input');
    if (!is_string($rawBody)) {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'INVALID_JSON',
            'message' => 'Body must be a valid JSON object.'
        ];
    }

    if (strlen($rawBody) > $maxBytes) {
        return [
            'ok' => false,
            'status' => 413,
            'code' => 'PAYLOAD_TOO_LARGE',
            'message' => 'Payload exceeds allowed size.'
        ];
    }

    $payload = json_decode($rawBody, true);
    if (!is_array($payload)) {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'INVALID_JSON',
            'message' => 'Body must be a valid JSON object.'
        ];
    }

    return [
        'ok' => true,
        'payload' => $payload
    ];
}

function dmq_validate_contact_payload(array $payload): array
{
    $email = trim((string)($payload['email'] ?? ''));
    $message = trim((string)($payload['message'] ?? ''));

    if ($email === '' || $message === '') {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'VALIDATION_ERROR',
            'message' => 'email and message are required.'
        ];
    }
    if (!dmq_validate_email($email)) {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'VALIDATION_ERROR',
            'message' => 'email format is invalid.'
        ];
    }
    if (!dmq_validate_text_length($message, 10, 2000)) {
        return [
            'ok' => false,
            'status' => 422,
            'code' => 'VALIDATION_ERROR',
            'message' => 'message must contain between 10 and 2000 characters.'
        ];
    }

    return [
        'ok' => true,
        'email' => $email,
        'message' => $message
    ];
}

function dmq_validate_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function dmq_validate_text_length(string $value, int $min, int $max): bool
{
    $length = mb_strlen(trim($value));
    return $length >= $min && $length <= $max;
}
