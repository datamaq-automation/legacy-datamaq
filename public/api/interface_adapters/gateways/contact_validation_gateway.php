<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/use_cases/ports/gateways/contact_validation_gateway_port.php';

final class DmqContactValidationGateway implements DmqContactValidationGatewayPort
{
    public function validate(array $contactSubmission): array
    {
        return dmq_service_validate_contact_like_payload($contactSubmission);
    }
}

