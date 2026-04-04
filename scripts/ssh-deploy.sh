#!/usr/bin/env bash

set -euo pipefail

COMMAND="${1:-}"
SSH_HOST="${SSH_HOST:-}"
SSH_PORT="${SSH_PORT:-}"
SSH_USER="${SSH_USER:-}"
SSH_REMOTE_DIR="${SSH_REMOTE_DIR:-}"
SSH_PRIVATE_KEY="${SSH_PRIVATE_KEY:-}"
SSH_KEY_FILE=""

notice() {
  echo "::notice::$1"
}

error() {
  echo "::error::$1" >&2
  exit 1
}

cleanup() {
  if [[ -n "${SSH_KEY_FILE}" && -f "${SSH_KEY_FILE}" ]]; then
    rm -f "${SSH_KEY_FILE}"
  fi
}

trap cleanup EXIT

require_non_empty() {
  local value="$1"
  local message="$2"
  if [[ -z "$value" ]]; then
    error "$message"
  fi
}

validate_inputs() {
  require_non_empty "${SSH_HOST}" "Missing SSH_HOST."
  require_non_empty "${SSH_PORT}" "Missing SSH_PORT."
  require_non_empty "${SSH_USER}" "Missing SSH_USER."
  require_non_empty "${SSH_REMOTE_DIR}" "Missing SSH_REMOTE_DIR."
  require_non_empty "${SSH_PRIVATE_KEY}" "Missing SSH_PRIVATE_KEY."

  if ! printf '%s' "${SSH_PORT}" | grep -Eq '^[0-9]+$'; then
    error "SSH_PORT must be numeric."
  fi
}

require_dist() {
  if [[ ! -d dist ]]; then
    error "dist/ directory is missing."
  fi
}

install_ssh_key() {
  umask 077
  mkdir -p "${HOME}/.ssh"
  SSH_KEY_FILE="$(mktemp "${HOME}/.ssh/ssh-deploy-key.XXXXXX")"
  printf '%s\n' "${SSH_PRIVATE_KEY}" > "${SSH_KEY_FILE}"
  chmod 600 "${SSH_KEY_FILE}"
}

ssh_base_command() {
  printf 'ssh -i "%s" -p "%s" -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=15 -o ServerAliveCountMax=3 "%s@%s"' \
    "${SSH_KEY_FILE}" "${SSH_PORT}" "${SSH_USER}" "${SSH_HOST}"
}

run_preflight() {
  local ssh_command
  ssh_command="$(ssh_base_command)"
  notice "SSH preflight host=${SSH_HOST} port=${SSH_PORT} user=${SSH_USER} dir=${SSH_REMOTE_DIR}"
  bash -lc "${ssh_command} 'pwd; hostname; test -d \"${SSH_REMOTE_DIR}\" && echo \"remote_dir_exists=yes\" || mkdir -p \"${SSH_REMOTE_DIR}\"'"
}

run_upload() {
  local ssh_command
  local log_file=".tmp-ssh-upload.log"
  ssh_command="$(ssh_base_command)"
  notice "Deploying dist/ to ${SSH_USER}@${SSH_HOST}:${SSH_REMOTE_DIR}"
  rsync -az --delete \
    -e "ssh -i ${SSH_KEY_FILE} -p ${SSH_PORT} -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=15 -o ServerAliveCountMax=3" \
    dist/ "${SSH_USER}@${SSH_HOST}:${SSH_REMOTE_DIR}/" | tee "${log_file}"
  bash -lc "${ssh_command} 'find \"${SSH_REMOTE_DIR}\" -maxdepth 1 -type f | sed -n \"1,20p\"'"
}

validate_inputs

case "${COMMAND}" in
  validate)
    notice "SSH deploy inputs validated."
    ;;
  preflight)
    install_ssh_key
    run_preflight
    ;;
  upload)
    install_ssh_key
    require_dist
    run_preflight
    run_upload
    ;;
  *)
    error "Usage: scripts/ssh-deploy.sh <validate|preflight|upload>"
    ;;
esac
