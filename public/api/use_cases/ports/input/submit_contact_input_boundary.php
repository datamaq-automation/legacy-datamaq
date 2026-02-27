<?php
declare(strict_types=1);

interface DmqSubmitContactInputBoundary
{
    /**
     * @param array{email:string,message:string} $contactSubmission
     * @return array{ok:bool,status:int,code?:string,message?:string,retry_after?:int}
     */
    public function handle(array $contactSubmission): array;
}

