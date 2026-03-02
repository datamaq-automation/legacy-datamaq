#!/usr/bin/env bash

set -euo pipefail

COMMAND="${1:-}"
TARGET_LABEL="${FTPS_TARGET_LABEL:-unknown}"

RAW_SERVER=""
RAW_REMOTE_DIR=""
SERVER_HOST=""
SERVER_PORT_FROM_HOST=""
MODE=""
PORT=""
REMOTE_DIR=""
ALLOW_INSECURE_DATA_CHANNEL="false"
PRUNE_REMOTE="false"

trim_compact() {
  printf '%s' "${1:-}" | tr -d '\r\n\t '
}

notice() {
  echo "::notice::$1"
}

warning() {
  echo "::warning::$1"
}

error() {
  echo "::error::$1" >&2
  exit 1
}

require_non_empty() {
  local value="$1"
  local message="$2"
  if [[ -z "$value" ]]; then
    error "$message"
  fi
}

print_debug_context() {
  local include_dns="${1:-false}"
  local scheme

  scheme="$(printf '%s' "${RAW_SERVER}" | sed -E 's#^([A-Za-z]+)://.*#\1#')"
  if [[ "$scheme" == "$RAW_SERVER" ]]; then
    scheme="none"
  fi

  echo "::group::FTPS debug"
  echo "raw_server_scheme=${scheme}"
  echo "normalized_host=${SERVER_HOST}"
  echo "normalized_port=${PORT}"
  echo "normalized_remote_dir=${REMOTE_DIR}"
  if [[ "$include_dns" == "true" ]]; then
    getent hosts "${SERVER_HOST}" || true
  fi
  echo "::endgroup::"
}

normalize_inputs() {
  local normalized_server
  local explicit_port

  RAW_SERVER="$(trim_compact "${FTPS_SERVER:-}")"
  RAW_REMOTE_DIR="$(trim_compact "${FTPS_REMOTE_DIR:-}")"
  explicit_port="$(trim_compact "${FTPS_PORT:-}")"

  require_non_empty "$RAW_SERVER" "Missing FTPS server."
  require_non_empty "${FTPS_USERNAME:-}" "Missing FTPS username."
  require_non_empty "${FTPS_PASSWORD:-}" "Missing FTPS password."
  require_non_empty "$RAW_REMOTE_DIR" "Missing FTPS remote dir."

  normalized_server="${RAW_SERVER#ftp://}"
  normalized_server="${normalized_server#ftps://}"
  normalized_server="${normalized_server#http://}"
  normalized_server="${normalized_server#https://}"
  normalized_server="${normalized_server%%/*}"

  SERVER_HOST="${normalized_server%%:*}"
  SERVER_PORT_FROM_HOST=""
  if [[ "$SERVER_HOST" != "$normalized_server" ]]; then
    SERVER_PORT_FROM_HOST="${normalized_server##*:}"
  fi

  MODE="$(trim_compact "${FTPS_MODE:-}" | tr '[:upper:]' '[:lower:]')"
  PORT="${explicit_port:-${SERVER_PORT_FROM_HOST:-}}"
  if [[ -z "$PORT" && "$MODE" == "implicit" ]]; then
    PORT="990"
  fi
  if [[ -z "$PORT" ]]; then
    PORT="21"
  fi

  REMOTE_DIR="$RAW_REMOTE_DIR"
  if [[ "${REMOTE_DIR#/}" == "${REMOTE_DIR}" ]]; then
    REMOTE_DIR="/${REMOTE_DIR}"
  fi

  if [[ -z "$SERVER_HOST" ]]; then
    error "FTPS server is empty after normalization."
  fi
  if printf '%s' "${SERVER_HOST}" | grep -Eq '^(https?|ftps?)$'; then
    print_debug_context
    error "FTPS server host is invalid after normalization (host=${SERVER_HOST}). Use host or URL with real hostname."
  fi
  if ! printf '%s' "${PORT}" | grep -Eq '^[0-9]+$'; then
    error "FTPS port is invalid."
  fi
  if [[ -n "$MODE" ]] && ! printf '%s' "${MODE}" | grep -Eq '^(explicit|implicit)$'; then
    error "FTPS mode is invalid. Use explicit or implicit."
  fi
  if printf '%s' "${REMOTE_DIR}" | grep -q '\\'; then
    error "FTPS remote dir must use Unix-style slashes."
  fi
}

validate_upload_flags() {
  PRUNE_REMOTE="$(trim_compact "${FTPS_PRUNE_REMOTE:-false}" | tr '[:upper:]' '[:lower:]')"

  if ! printf '%s' "${PRUNE_REMOTE}" | grep -Eq '^(true|false)$'; then
    error "FTPS_PRUNE_REMOTE must be true or false."
  fi
}

print_normalized_context() {
  notice "Deploy target=${TARGET_LABEL} host=${SERVER_HOST} port=${PORT} mode=${MODE:-auto} dir=${REMOTE_DIR}"
}

ensure_dns() {
  if getent hosts "${SERVER_HOST}" >/dev/null; then
    return
  fi

  print_debug_context true
  error "FTPS server is not resolvable by DNS (host=${SERVER_HOST})."
}

open_target_for_mode() {
  local ftps_mode="$1"
  if [[ "$ftps_mode" == "implicit" ]]; then
    printf 'ftps://%s' "${SERVER_HOST}"
    return
  fi
  printf '%s' "${SERVER_HOST}"
}

log_peer_close_hint() {
  local log_file="$1"
  if grep -qi "Peer closed connection" "${log_file}"; then
    warning "FTPS peer closed connection. Possible causes: invalid credentials, wrong port, or server FTPS policy mismatch."
    warning "Validate secrets, and verify whether server expects explicit FTPS on port 21 or implicit FTPS on port 990."
  fi
}

run_preflight_attempt() {
  local attempt="$1"
  local attempt_port="$2"
  local ftps_mode="$3"
  local prefer_epsv="$4"
  local fix_pasv_address="$5"
  local log_file
  local open_target
  local lftp_command
  local status

  log_file="$(mktemp)"
  open_target="$(open_target_for_mode "${ftps_mode}")"
  # Always force SSL and Data channel protection
  lftp_command="set cmd:fail-exit true; set net:timeout 25; set net:max-retries 2; set net:persist-retries 0; set ftp:ssl-force true; set ftp:ssl-protect-data true; set ftp:passive-mode true; set ftp:prefer-epsv ${prefer_epsv}; set ftp:fix-pasv-address ${fix_pasv_address}; set ssl:verify-certificate true; set ssl:check-hostname true; debug 4; open -u \"${FTPS_USERNAME}\",\"${FTPS_PASSWORD}\" -p \"${attempt_port}\" \"${open_target}\"; pwd; cls -1; mkdir -p \"${REMOTE_DIR}\"; cd \"${REMOTE_DIR}\"; pwd; cls -1; bye"

  echo "::group::Preflight attempt ${attempt} for target=${TARGET_LABEL} mode=${ftps_mode} port=${attempt_port}"
  set +e
  timeout 90 lftp -e "${lftp_command}" >"${log_file}" 2>&1
  status=$?
  set -e

  cat "${log_file}"
  log_peer_close_hint "${log_file}"
  rm -f "${log_file}"
  echo "::endgroup::"

  [[ "${status}" -eq 0 ]]
}

run_upload_attempt() {
  local attempt="$1"
  local attempt_port="$2"
  local ftps_mode="$3"
  local prefer_epsv="$4"
  local fix_pasv_address="$5"
  local log_file
  local open_target
  local lftp_command
  local mirror_delete_flag=""
  local status

  if [[ "${PRUNE_REMOTE}" == "true" ]]; then
    mirror_delete_flag="--delete"
  fi

  log_file="$(mktemp)"
  open_target="$(open_target_for_mode "${ftps_mode}")"
  # Always force SSL protection
  lftp_command="set cmd:fail-exit true; set net:timeout 25; set net:max-retries 2; set net:persist-retries 0; set ftp:ssl-force true; set ftp:ssl-protect-data true; set ftp:passive-mode true; set ftp:prefer-epsv ${prefer_epsv}; set ftp:fix-pasv-address ${fix_pasv_address}; set ssl:verify-certificate true; set ssl:check-hostname true; debug 3; open -u \"${FTPS_USERNAME}\",\"${FTPS_PASSWORD}\" -p \"${attempt_port}\" \"${open_target}\"; mkdir -p \"${REMOTE_DIR}\"; cd \"${REMOTE_DIR}\"; mirror -R --continue ${mirror_delete_flag} --verbose dist .; bye"

  echo "::group::Upload attempt ${attempt} for target=${TARGET_LABEL} mode=${ftps_mode} port=${attempt_port}"
  set +e
  timeout 120 lftp -e "${lftp_command}" >"${log_file}" 2>&1
  status=$?
  set -e

  cat "${log_file}"
  log_peer_close_hint "${log_file}"
  rm -f "${log_file}"
  echo "::endgroup::"

  [[ "${status}" -eq 0 ]]
}

run_preflight_sequence() {
  if [[ -n "$MODE" ]]; then
    run_preflight_attempt 1 "${PORT}" "${MODE}" false true && return 0
    run_preflight_attempt 2 "${PORT}" "${MODE}" true false && return 0
  else
    # Fallback try both common ports
    run_preflight_attempt 1 21 explicit false true && return 0
    run_preflight_attempt 2 21 explicit true false && return 0
    run_preflight_attempt 3 990 implicit false true && return 0
    run_preflight_attempt 4 990 implicit true false && return 0
  fi

  error "FTPS preflight failed for target=${TARGET_LABEL}."
}

run_upload_sequence() {
  if [[ -n "$MODE" ]]; then
    run_upload_attempt 1 "${PORT}" "${MODE}" false true && return 0
    run_upload_attempt 2 "${PORT}" "${MODE}" true false && return 0
  else
    run_upload_attempt 1 21 explicit false true && return 0
    run_upload_attempt 2 21 explicit true false && return 0
    run_upload_attempt 3 990 implicit false true && return 0
    run_upload_attempt 4 990 implicit true false && return 0
  fi

  error "FTPS upload failed for target=${TARGET_LABEL}."
}

case "${COMMAND}" in
  validate)
    normalize_inputs
    print_normalized_context
    ;;
  preflight)
    normalize_inputs
    print_normalized_context
    ensure_dns
    run_preflight_sequence
    ;;
  upload)
    normalize_inputs
    validate_upload_flags
    print_normalized_context
    run_upload_sequence
    ;;
  *)
    error "Usage: scripts/ftps-deploy.sh <validate|preflight|upload>"
    ;;
esac
 beach
