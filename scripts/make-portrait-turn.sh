#!/usr/bin/env bash
# Turn a head-turn clip (made in Kling from portfolio-kling/kling-input-green.jpg,
# on a flat #00B140 background), or a folder of pose stills in name order (made
# by Codex from the same image), into the hero's cursor-scrubbed frames:
# key out the green, apply the portrait's duotone, crop back to the cutout's
# box, and write N evenly spaced transparent WebP frames plus src/content/portrait-turn.json.
#
#   scripts/make-portrait-turn.sh clip.mp4 [frames=24] [width=720]
#   scripts/make-portrait-turn.sh poses/ [ignored] [width=720]
set -euo pipefail
clip=$1; n=${2:-24}; w=${3:-720}
out=public/assets/portrait-turn
rm -rf "$out" && mkdir -p "$out"
# The input image placed the 860x930 cutout bottom-centre on a 1080 square.
key="chromakey=0x00B140:0.13:0.06,despill=type=green"
# Duotone measured from portrait-cut-color.webp -> portrait-cut-duo.webp:
# out = luma x (0.887, 0.724, 0.44) + (0, 0, 9), midtones slightly deepened.
duo="eq=gamma=0.93,colorchannelmixer=rr=.189:rg=.634:rb=.064:gr=.154:gg=.518:gb=.052:br=.094:bg=.315:bb=.032,lutrgb=b='val+9'"
vf="scale=1080:1080,crop=860:930:110:150,format=rgba,$key,$duo,scale=$w:-2"
if [[ -d $clip ]]; then
  # Pose stills: one frame each; the site cross-fades between neighbours.
  mapfile -t poses < <(find "$clip" -maxdepth 1 -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.webp' \) | sort)
  n=${#poses[@]}
  for i in "${!poses[@]}"; do
    ffmpeg -v error -y -i "${poses[$i]}" -frames:v 1 -vf "$vf" -c:v libwebp -quality 70 -lossless 0 "$out/$(printf '%02d' "$i").webp"
  done
else
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$clip")
  for i in $(seq 0 $((n - 1))); do
    t=$(awk -v d="$dur" -v i="$i" -v n="$n" 'BEGIN { printf "%.3f", (d - 0.05) * i / (n - 1) }')
    ffmpeg -v error -y -ss "$t" -i "$clip" -frames:v 1 -vf "$vf" -c:v libwebp -quality 70 -lossless 0 "$out/$(printf '%02d' "$i").webp"
  done
fi
h=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 "$out/00.webp")
printf '{ "frames": %d, "width": %d, "height": %d }\n' "$n" "$w" "$h" > src/content/portrait-turn.json
du -ch "$out"/*.webp | tail -1
