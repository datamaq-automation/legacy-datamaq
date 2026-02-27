<?php
declare(strict_types=1);

interface DmqContactRateLimitGatewayPort
{
    /**
     * @return array{ok:bool,status?:int,code?:string,message?:string,retry_after?:int}
     */
    public function check(): array;
}

