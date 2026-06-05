#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
./node_modules/.bin/hexo server --hostname 0.0.0.0 --port 4000
