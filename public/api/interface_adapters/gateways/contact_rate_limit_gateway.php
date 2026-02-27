<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/use_cases/ports/gateways/contact_rate_limit_gateway_port.php';

final class DmqContactRateLimitGateway implements DmqContactRateLimitGatewayPort
{
    public function check(): array
    {
        return dmq_service_enforce_bucket_rate_limit('contact', 5, 60);
    }
}
