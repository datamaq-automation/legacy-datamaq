<?php
declare(strict_types=1);

interface DmqContactValidationGatewayPort
{
    /**
     * @param array{email:string,message:string} $contactSubmission
     * @return array{ok:bool,status?:int,code?:string,message?:string}
     */
    public function validate(array $contactSubmission): array;
}

