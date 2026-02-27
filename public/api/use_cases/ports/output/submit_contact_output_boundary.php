<?php
declare(strict_types=1);

interface DmqSubmitContactOutputBoundary
{
    /**
     * @return array{status:string,request_id:string}
     */
    public function presentAccepted(): array;
}

