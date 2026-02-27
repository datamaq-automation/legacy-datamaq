<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';
require_once __DIR__ . '/_services.php';
require_once __DIR__ . '/_resources.php';
require_once __DIR__ . '/entities/contact_submission.php';
require_once __DIR__ . '/use_cases/submit_contact.php';
require_once __DIR__ . '/infrastructure/http_request.php';
require_once __DIR__ . '/interface_adapters/gateways/contact_rate_limit_gateway.php';
require_once __DIR__ . '/interface_adapters/presenters/contact_presenter.php';
require_once __DIR__ . '/interface_adapters/controllers/contact_controller.php';

dmq_handle_preflight();

$method = dmq_infra_request_method();
if ($method !== 'POST') {
    dmq_error_response(405, 'METHOD_NOT_ALLOWED', 'Method Not Allowed');
    exit;
}

$result = dmq_controller_submit_contact();
if (($result['ok'] ?? false) !== true) {
    if (isset($result['retry_after'])) {
        header('Retry-After: ' . (string)($result['retry_after']));
    }
    dmq_error_response(
        (int)($result['status'] ?? 422),
        (string)($result['code'] ?? 'VALIDATION_ERROR'),
        (string)($result['message'] ?? 'Validation error.')
    );
    exit;
}

dmq_json_response(202, dmq_presenter_contact_accepted());
