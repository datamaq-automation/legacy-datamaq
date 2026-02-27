<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/use_cases/ports/output/submit_contact_output_boundary.php';

final class DmqSubmitContactPresenter implements DmqSubmitContactOutputBoundary
{
    public function presentAccepted(): array
    {
        return dmq_resource_contact_accepted();
    }
}
