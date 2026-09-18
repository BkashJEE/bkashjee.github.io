#!/usr/bin/env bash
# Collects and optimizes real screenshots from local project checkouts into
# public/assets. Idempotent; re-run whenever a source image changes.
# Sources live outside this repo (local machine only) — see paths below.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$ROOT/public/assets/work"
LAB="$ROOT/public/assets/lab"
mkdir -p "$WORK" "$LAB" "$ROOT/public/assets"

# Captured shots staged by the capture session (grim / ffmpeg / playwright).
STAGE="${ASSET_STAGE:-$ROOT/asset-staging}"

work() { # src dst
  magick "$1" -resize '1600x>' -strip -quality 82 "$WORK/$2"
  echo "work/$2"
}
lab() { # src dst
  magick "$1" -resize '800x>' -strip -quality 78 "$LAB/$2"
  echo "lab/$2"
}

[ -f "$STAGE/sp-editor.png" ] && work "$STAGE/sp-editor.png" screenpolish-app.webp
[ -f "$STAGE/sp-output.jpg" ] && work "$STAGE/sp-output.jpg" screenpolish-output.webp
[ -f "$STAGE/mc-today.png" ] && work "$STAGE/mc-today.png" missioncontrol.webp

BF=/home/bkash86/hermes-bot-forge/docs
[ -f "$BF/banner.png" ] && work "$BF/banner.png" botforge-banner.webp
[ -f "$BF/demo-create.png" ] && work "$BF/demo-create.png" botforge-demo.webp

OW=/home/bkash86/.openclaw/workspace
[ -f "$OW/hermes-island/preview-work.png" ] && lab "$OW/hermes-island/preview-work.png" hermes-island.webp
[ -f "$OW/hermes-studio/preview.png" ] && lab "$OW/hermes-studio/preview.png" hermes-studio.webp
[ -f "$OW/window-pets/fox-preview.png" ] && lab "$OW/window-pets/fox-preview.png" window-pets.webp
[ -f "$OW/git-repo-widget/preview.png" ] && lab "$OW/git-repo-widget/preview.png" git-repo-widget.webp
[ -f "$OW/github-watch/panel-preview.png" ] && lab "$OW/github-watch/panel-preview.png" github-watch.webp
[ -f "$OW/hermes-cursor/preview.png" ] && lab "$OW/hermes-cursor/preview.png" hermes-cursor.webp

PROFILE=/home/bkash86/.openclaw/workspace/personal-portfolio/dist/assets/profile.jpg
[ -f "$PROFILE" ] && magick "$PROFILE" -resize 400x400 -strip -quality 84 "$ROOT/public/assets/profile.webp" && echo profile.webp

du -sh "$ROOT/public/assets"
