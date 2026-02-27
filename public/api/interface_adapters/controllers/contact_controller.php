<?php
declare(strict_types=1);

function dmq_controller_submit_contact(): array
{
    $request = dmq_infra_validate_json_request_and_read_body();
    if (($request['ok'] ?? false) !== true) {
        return [
            'ok' => false,
            'status' => (int)($request['status'] ?? 422),
            'code' => (string)($request['code'] ?? 'INVALID_JSON'),
            'message' => (string)($request['message'] ?? 'Body must be a valid JSON object.'),
        ];
    }

    $contactSubmission = dmq_entity_contact_submission((array)($request['payload'] ?? []));
    return dmq_use_case_submit_contact(
        $contactSubmission,
        'dmq_gateway_contact_rate_limit',
        'dmq_service_validate_contact_like_payload'
    );
}

