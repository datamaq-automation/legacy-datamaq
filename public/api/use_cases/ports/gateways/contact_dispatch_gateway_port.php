<?php
declare(strict_types=1);

interface DmqContactDispatchGatewayPort
{
    public function dispatch(array $contactSubmission): array;
}
