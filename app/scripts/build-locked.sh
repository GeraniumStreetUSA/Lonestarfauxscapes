#!/bin/sh
# Runs `npm run build` one at a time when several builders share this
# checkout: concurrent builds would overwrite each other's dist/.
LOCK="${TMPDIR:-/tmp}/lsfs-app-build.lock"
until mkdir "$LOCK" 2>/dev/null; do sleep 3; done
trap 'rmdir "$LOCK"' EXIT INT TERM
npm run build "$@"
