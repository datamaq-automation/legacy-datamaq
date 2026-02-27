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
    $interactor = new DmqSubmitContactInteractor(
        new DmqContactRateLimitGateway(),
        new DmqContactValidationGateway()
    );

    return $interactor->handle($contactSubmission);
}
