#!/usr/bin/env zsh
# Import photos and videos from ~/Desktop/claude/photos/<slug>/ into public/notes/<slug>/.
#
# Walks the source recursively and mirrors any subfolder structure into the
# destination, so you can organise originals by section (e.g. family/, the-team/)
# and reference them in MDX as /notes/<slug>/<section>/<name>.jpg.
#
# Transforms:
#   HEIC/JPG/JPEG/PNG/WEBP -> web JPEG (max 1600px wide, q65)
#   MOV/MP4                -> h264 mp4 (CRF 32, AAC 80k mono, faststart) + poster
#
# Originals stay untouched outside the repo. The destination is wiped first so
# removing a source photo also removes it from public/.
#
# Usage:
#   scripts/import-photos.sh <slug>
#   e.g. scripts/import-photos.sh grad-2026

set -eu
setopt NULL_GLOB EXTENDED_GLOB

SLUG="${1:?usage: import-photos.sh <slug>}"
SRC="$HOME/Desktop/claude/photos/$SLUG"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/notes/$SLUG"

if [ ! -d "$SRC" ]; then
  echo "no source folder: $SRC" >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"

img_count=0
vid_count=0
fail_count=0

cd "$SRC"

# zsh recursive glob — case-insensitive extension match, regular files only.
for rel in **/*.(#i)(heic|jpg|jpeg|png|webp|mov|mp4)(.N); do
  dir="${rel:h}"        # subfolder (or "." if at root)
  base="${rel:t:r}"     # filename without extension
  ext="${rel:e:l}"      # extension, lowercased
  base_lc="${(L)base}"  # zsh: lowercase

  if [ "$dir" = "." ]; then
    out_dir="$DEST"
    log_prefix=""
  else
    out_dir="$DEST/$dir"
    log_prefix="$dir/"
    mkdir -p "$out_dir"
  fi

  case "$ext" in
    heic|jpg|jpeg|png|webp)
      out="$out_dir/${base_lc}.jpg"
      if sips -s format jpeg -s formatOptions 65 -Z 1600 "$rel" --out "$out" >/dev/null 2>&1; then
        img_count=$((img_count + 1))
        echo "  $rel -> notes/$SLUG/${log_prefix}${base_lc}.jpg"
      else
        fail_count=$((fail_count + 1))
        echo "  FAIL: $rel (sips could not read it)" >&2
      fi
      ;;
    mov|mp4)
      if ! command -v ffmpeg >/dev/null; then
        echo "  SKIP: $rel (ffmpeg not installed)" >&2
        fail_count=$((fail_count + 1))
        continue
      fi
      out="$out_dir/${base_lc}.mp4"
      poster="$out_dir/${base_lc}-poster.jpg"
      if ffmpeg -y -i "$rel" \
        -vcodec libx264 -crf 32 -preset slow -pix_fmt yuv420p \
        -vf "scale='min(1280,iw)':-2" \
        -movflags +faststart \
        -acodec aac -b:a 80k -ac 1 \
        "$out" >/dev/null 2>&1; then
        ffmpeg -y -ss 2 -i "$rel" -frames:v 1 -q:v 3 \
          -vf "scale='min(1280,iw)':-2" "$poster" >/dev/null 2>&1 || true
        vid_count=$((vid_count + 1))
        echo "  $rel -> notes/$SLUG/${log_prefix}${base_lc}.mp4 (+ poster)"
      else
        fail_count=$((fail_count + 1))
        echo "  FAIL: $rel (ffmpeg error)" >&2
      fi
      ;;
  esac
done

echo "imported $img_count image(s) and $vid_count video(s) into public/notes/$SLUG/"
if [ "$fail_count" -gt 0 ]; then
  echo "$fail_count file(s) failed — see FAIL lines above" >&2
  exit 1
fi
