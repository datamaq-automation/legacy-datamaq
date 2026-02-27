<?php
declare(strict_types=1);

function dmq_infra_request_method(): string
{
    return (string)($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function dmq_infra_validate_json_request_and_read_body(): array
{
    $maxBodyBytes = dmq_get_max_body_bytes();
    $requestValidation = dmq_validate_json_request_headers_and_size($maxBodyBytes);
    if (is_array($requestValidation)) {
        return [
            'ok' => false,
            'status' => (int)($requestValidation['status'] ?? 415),
            'code' => (string)($requestValidation['code'] ?? 'UNSUPPORTED_MEDIA_TYPE'),
            'message' => (string)($requestValidation['message'] ?? 'Unsupported media type.'),
        ];
    }

    $body = dmq_read_json_body_with_limit($maxBodyBytes);
    if (($body['ok'] ?? false) !== true) {
        return [
            'ok' => false,
            'status' => (int)($body['status'] ?? 422),
            'code' => (string)($body['code'] ?? 'INVALID_JSON'),
            'message' => (string)($body['message'] ?? 'Body must be a valid JSON object.'),
        ];
    }

    return [
        'ok' => true,
        'payload' => (array)($body['payload'] ?? []),
    ];
}

