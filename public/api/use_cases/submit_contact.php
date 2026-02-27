<?php
declare(strict_types=1);

require_once __DIR__ . '/ports/input/submit_contact_input_boundary.php';
require_once __DIR__ . '/ports/gateways/contact_rate_limit_gateway_port.php';
require_once __DIR__ . '/ports/gateways/contact_validation_gateway_port.php';

final class DmqSubmitContactInteractor implements DmqSubmitContactInputBoundary
{
    public function __construct(
        private DmqContactRateLimitGatewayPort $rateLimitGateway,
        private DmqContactValidationGatewayPort $validationGateway
    ) {}

    public function handle(array $contactSubmission): array
    {
        $rateLimit = $this->rateLimitGateway->check();
        if (($rateLimit['ok'] ?? false) !== true) {
            return [
                'ok' => false,
                'status' => (int)($rateLimit['status'] ?? 429),
                'code' => (string)($rateLimit['code'] ?? 'RATE_LIMITED'),
                'message' => (string)($rateLimit['message'] ?? 'Too many requests'),
                'retry_after' => (int)($rateLimit['retry_after'] ?? 1),
            ];
        }

        $validation = $this->validationGateway->validate($contactSubmission);
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
}
