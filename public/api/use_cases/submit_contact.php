<?php
declare(strict_types=1);

/**
 * @param callable():array{ok:bool,status?:int,code?:string,message?:string,retry_after?:int} $rateLimitGateway
 * @param callable(array):array{ok:bool,status?:int,code?:string,message?:string} $validateContactSubmission
 */
function dmq_use_case_submit_contact(
    array $contactSubmission,
    callable $rateLimitGateway,
    callable $validateContactSubmission
): array {
    $rateLimit = $rateLimitGateway();
    if (($rateLimit['ok'] ?? false) !== true) {
        return [
            'ok' => false,
            'status' => (int)($rateLimit['status'] ?? 429),
            'code' => (string)($rateLimit['code'] ?? 'RATE_LIMITED'),
            'message' => (string)($rateLimit['message'] ?? 'Too many requests'),
            'retry_after' => (int)($rateLimit['retry_after'] ?? 1),
        ];
    }

    $validation = $validateContactSubmission($contactSubmission);
    if (($validation['ok'] ?? false) !== true) {
        return [
            'ok' => false,
            'status' => (int)($validation['status'] ?? 422),
            'code' => (string)($validation['code'] ?? 'VALIDATION_ERROR'),
            'message' => (string)($validation['message'] ?? 'Validation error.'),
        ];
    }

    return [
        'ok' => true,
        'status' => 202,
    ];
}

