<?php
declare(strict_types=1);

function dmq_get_rate_limit_config(string $bucket, int $defaultLimit, int $defaultWindowSeconds): array
{
    $envPrefix = strtoupper($bucket);
    $envPrefix = preg_replace('/[^A-Z0-9]+/', '_', $envPrefix) ?? $envPrefix;
    $envPrefix = trim($envPrefix, '_');

    $limit = dmq_parse_positive_int_env("API_RL_{$envPrefix}_LIMIT", $defaultLimit);
    $window = dmq_parse_positive_int_env("API_RL_{$envPrefix}_WINDOW_SECONDS", $defaultWindowSeconds);

    return [
        'limit' => $limit,
        'window_seconds' => $window
    ];
}

function dmq_parse_positive_int_env(string $key, int $fallback): int
{
    $configured = getenv($key);
    if (!is_string($configured)) {
        return $fallback;
    }
    $trimmed = trim($configured);
    if (!preg_match('/^\d+$/', $trimmed)) {
        return $fallback;
    }
    $value = (int) $trimmed;
    return $value > 0 ? $value : $fallback;
}

function dmq_get_client_fingerprint(): string
{
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $userAgent = trim((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));
    return hash('sha256', $ip . '|' . $userAgent);
}

function dmq_enforce_rate_limit(string $bucket, int $limit, int $windowSeconds): ?int
{
    if ($limit <= 0 || $windowSeconds <= 0) {
        return null;
    }

    $now = time();
    $windowStart = $now - $windowSeconds;
    $fingerprint = dmq_get_client_fingerprint();
    $stateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'dmq_rl_' . md5($bucket) . '.json';

    $fp = fopen($stateFile, 'c+');
    if ($fp === false) {
        return null;
    }

    try {
        if (!flock($fp, LOCK_EX)) {
            return null;
        }

        $raw = stream_get_contents($fp);
        $decoded = json_decode($raw ?: '{}', true);
        $state = is_array($decoded) ? $decoded : [];

        $entries = $state[$fingerprint] ?? [];
        if (!is_array($entries)) {
            $entries = [];
        }

        $entries = array_values(array_filter($entries, static fn($ts): bool => is_int($ts) && $ts >= $windowStart));
        if (count($entries) >= $limit) {
            $oldest = (int) ($entries[0] ?? $now);
            $retryAfter = max(1, ($oldest + $windowSeconds) - $now);
            return $retryAfter;
        }

        $entries[] = $now;
        $state[$fingerprint] = $entries;

        foreach ($state as $key => $timestamps) {
            if (!is_array($timestamps)) {
                unset($state[$key]);
                continue;
            }
            $filtered = array_values(array_filter($timestamps, static fn($ts): bool => is_int($ts) && $ts >= $windowStart));
            if (count($filtered) === 0) {
                unset($state[$key]);
                continue;
            }
            $state[$key] = $filtered;
        }

        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        fflush($fp);
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    return null;
}
