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
LFTP_DEBUG_LEVEL="4"
ATTEMPT_SUMMARY=()

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

record_attempt_summary() {
  local phase="$1"
  local attempt="$2"
  local ftps_mode="$3"
  local attempt_port="$4"
  local status="$5"
  local diagnosis="$6"
  ATTEMPT_SUMMARY+=("${phase}|${attempt}|${ftps_mode}|${attempt_port}|${status}|${diagnosis}")
}

print_attempt_summary() {
  local phase="$1"
  local found="false"
  echo "::group::${phase^} summary"
  for item in "${ATTEMPT_SUMMARY[@]:-}"; do
    IFS='|' read -r row_phase row_attempt row_mode row_port row_status row_diagnosis <<< "$item"
    if [[ "$row_phase" != "$phase" ]]; then
      continue
    fi
    found="true"
    echo "attempt=${row_attempt} mode=${row_mode} port=${row_port} status=${row_status} diagnosis=${row_diagnosis}"
  done
  if [[ "$found" != "true" ]]; then
    echo "No attempts recorded."
  fi
  echo "::endgroup::"
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
  echo "normalized_mode=${MODE:-auto}"
  echo "normalized_remote_dir=${REMOTE_DIR}"
  echo "allow_insecure_data_channel=${ALLOW_INSECURE_DATA_CHANNEL}"
  echo "lftp_debug_level=${LFTP_DEBUG_LEVEL}"
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
  ALLOW_INSECURE_DATA_CHANNEL="$(trim_compact "${FTPS_ALLOW_INSECURE_DATA_CHANNEL:-false}" | tr '[:upper:]' '[:lower:]')"
  LFTP_DEBUG_LEVEL="$(trim_compact "${FTPS_LFTP_DEBUG_LEVEL:-4}")"
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
  if ! printf '%s' "${ALLOW_INSECURE_DATA_CHANNEL}" | grep -Eq '^(true|false)$'; then
    error "FTPS_ALLOW_INSECURE_DATA_CHANNEL must be true or false."
  fi
  if ! printf '%s' "${LFTP_DEBUG_LEVEL}" | grep -Eq '^[0-9]+$'; then
    error "FTPS_LFTP_DEBUG_LEVEL must be numeric."
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

print_tool_versions() {
  echo "::group::FTPS tool versions"
  command -v lftp >/dev/null && lftp --version | head -n 1 || true
  command -v openssl >/dev/null && openssl version || true
  echo "::endgroup::"
}

print_tls_probe() {
  local ftps_mode="$1"
  local attempt_port="$2"
  local connect_target="${SERVER_HOST}:${attempt_port}"
  local starttls_args=()

  if ! command -v openssl >/dev/null; then
    return
  fi

  if [[ "$ftps_mode" == "explicit" ]]; then
    starttls_args=(-starttls ftp)
  fi

  echo "::group::TLS probe mode=${ftps_mode} port=${attempt_port}"
  timeout 20 openssl s_client -connect "${connect_target}" -servername "${SERVER_HOST}" "${starttls_args[@]}" < /dev/null 2>&1 || true
  echo "::endgroup::"
}

log_peer_close_hint() {
  local log_file="$1"
  if grep -qi "Peer closed connection" "${log_file}"; then
    warning "FTPS peer closed connection. Possible causes: invalid credentials, wrong port, or server FTPS policy mismatch."
    warning "Validate secrets, and verify whether server expects explicit FTPS on port 21 or implicit FTPS on port 990."
  fi
}

build_failure_diagnosis() {
  local log_file="$1"
  local diagnoses=()

  if grep -Eqi '(530[[:space:]].*(Login|authentication)|Login failed|Authentication failed|incorrect password)' "${log_file}"; then
    diagnoses+=("auth-failed: verify FTPS username/password and account permissions")
  fi
  if grep -Eqi '(Name or service not known|Temporary failure in name resolution|getaddrinfo|Could not resolve host)' "${log_file}"; then
    diagnoses+=("dns-failed: verify FTPS_DATAMAQ_SERVER host and DNS availability")
  fi
  if grep -Eqi '(Connection refused|No route to host|Operation timed out|Network is unreachable|Connection timed out)' "${log_file}"; then
    diagnoses+=("network-failed: verify host reachability, port, firewall and FTPS mode")
  fi
  if grep -Eqi '(certificate|SSL certificate|certificate verify failed|hostname does not match|handshake failed)' "${log_file}"; then
    diagnoses+=("tls-verify-failed: verify certificate chain, hostname and FTPS mode/port")
  fi
  if grep -Eqi '(425|426|Data connection|PASV|EPSV)' "${log_file}"; then
    diagnoses+=("data-channel-failed: try FTPS_ALLOW_INSECURE_DATA_CHANNEL=true and validate passive mode policy")
  fi
  if grep -Eqi '(550|Permission denied|Access denied)' "${log_file}"; then
    diagnoses+=("remote-path-permission: verify FTPS remote dir and user write permissions")
  fi

  if [[ "${#diagnoses[@]}" -eq 0 ]]; then
    diagnoses+=("unknown: inspect raw lftp output and TLS probe in this attempt")
  fi

  printf '%s' "${diagnoses[*]}"
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
  local diagnosis

  log_file="$(mktemp)"
  open_target="$(open_target_for_mode "${ftps_mode}")"
  # Always force SSL and Data channel protection unless explicitly relaxed for broken servers.
  lftp_command="set cmd:fail-exit true; set net:timeout 25; set net:max-retries 2; set net:persist-retries 0; set ftp:ssl-force true; set ftp:ssl-protect-data $( [[ "${ALLOW_INSECURE_DATA_CHANNEL}" == "true" ]] && printf false || printf true ); set ftp:passive-mode true; set ftp:prefer-epsv ${prefer_epsv}; set ftp:fix-pasv-address ${fix_pasv_address}; set ssl:verify-certificate true; set ssl:check-hostname true; debug ${LFTP_DEBUG_LEVEL}; open -u \"${FTPS_USERNAME}\",\"${FTPS_PASSWORD}\" -p \"${attempt_port}\" \"${open_target}\"; pwd; cls -1; mkdir -p \"${REMOTE_DIR}\"; cd \"${REMOTE_DIR}\"; pwd; cls -1; bye"

  echo "::group::Preflight attempt ${attempt} for target=${TARGET_LABEL} mode=${ftps_mode} port=${attempt_port}"
  echo "prefer_epsv=${prefer_epsv}"
  echo "fix_pasv_address=${fix_pasv_address}"
  set +e
  timeout 90 lftp -e "${lftp_command}" >"${log_file}" 2>&1
  status=$?
  set -e

  cat "${log_file}"
  log_peer_close_hint "${log_file}"
  if [[ "${status}" -ne 0 ]]; then
    diagnosis="$(build_failure_diagnosis "${log_file}")"
    warning "Preflight attempt ${attempt} failed: ${diagnosis}"
    print_tls_probe "${ftps_mode}" "${attempt_port}"
    record_attempt_summary "preflight" "${attempt}" "${ftps_mode}" "${attempt_port}" "failed" "${diagnosis}"
  else
    record_attempt_summary "preflight" "${attempt}" "${ftps_mode}" "${attempt_port}" "ok" "connected-and-authenticated"
  fi
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
  local diagnosis

  if [[ "${PRUNE_REMOTE}" == "true" ]]; then
    mirror_delete_flag="--delete"
  fi

  log_file="$(mktemp)"
  open_target="$(open_target_for_mode "${ftps_mode}")"
  # Always force SSL protection unless explicitly relaxed for broken servers.
  lftp_command="set cmd:fail-exit true; set net:timeout 25; set net:max-retries 2; set net:persist-retries 0; set ftp:ssl-force true; set ftp:ssl-protect-data $( [[ "${ALLOW_INSECURE_DATA_CHANNEL}" == "true" ]] && printf false || printf true ); set ftp:passive-mode true; set ftp:prefer-epsv ${prefer_epsv}; set ftp:fix-pasv-address ${fix_pasv_address}; set ssl:verify-certificate true; set ssl:check-hostname true; debug ${LFTP_DEBUG_LEVEL}; open -u \"${FTPS_USERNAME}\",\"${FTPS_PASSWORD}\" -p \"${attempt_port}\" \"${open_target}\"; mkdir -p \"${REMOTE_DIR}\"; cd \"${REMOTE_DIR}\"; mirror -R --continue ${mirror_delete_flag} --verbose dist .; bye"

  echo "::group::Upload attempt ${attempt} for target=${TARGET_LABEL} mode=${ftps_mode} port=${attempt_port}"
  echo "prefer_epsv=${prefer_epsv}"
  echo "fix_pasv_address=${fix_pasv_address}"
  set +e
  timeout 120 lftp -e "${lftp_command}" >"${log_file}" 2>&1
  status=$?
  set -e

  cat "${log_file}"
  log_peer_close_hint "${log_file}"
  if [[ "${status}" -ne 0 ]]; then
    diagnosis="$(build_failure_diagnosis "${log_file}")"
    warning "Upload attempt ${attempt} failed: ${diagnosis}"
    print_tls_probe "${ftps_mode}" "${attempt_port}"
    record_attempt_summary "upload" "${attempt}" "${ftps_mode}" "${attempt_port}" "failed" "${diagnosis}"
  else
    record_attempt_summary "upload" "${attempt}" "${ftps_mode}" "${attempt_port}" "ok" "transfer-completed"
  fi
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

  print_attempt_summary "preflight"
  error "FTPS preflight failed for target=${TARGET_LABEL}. Review attempt diagnosis above and set FTPS_DATAMAQ_MODE/PORT explicitly if needed."
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

  print_attempt_summary "upload"
  error "FTPS upload failed for target=${TARGET_LABEL}. Review attempt diagnosis above for auth/TLS/network/root-dir hints."
}

case "${COMMAND}" in
  validate)
    normalize_inputs
    print_normalized_context
    ;;
  preflight)
    normalize_inputs
    print_normalized_context
    print_tool_versions
    print_debug_context true
    ensure_dns
    run_preflight_sequence
    ;;
  upload)
    normalize_inputs
    validate_upload_flags
    print_normalized_context
    print_tool_versions
    run_upload_sequence
    ;;
  *)
    error "Usage: scripts/ftps-deploy.sh <validate|preflight|upload>"
    ;;
esac
