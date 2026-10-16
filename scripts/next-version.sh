#!/usr/bin/env bash
# 前回の v* タグ以降のコミット（Conventional Commits）から次のバージョンを出力する。
# リリース対象（feat / fix / 破壊的変更）が無ければ何も出力しない。
set -euo pipefail

last_tag=$(git describe --tags --abbrev=0 --match 'v[0-9]*' 2>/dev/null || true)
if [ -n "$last_tag" ]; then
  range="${last_tag}..HEAD"
  version="${last_tag#v}"
else
  range="HEAD"
  version="0.0.0"
fi

if ! [[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "semver ではないタグです: $last_tag" >&2
  exit 1
fi

subjects=$(git log "$range" --no-merges --format=%s)
bodies=$(git log "$range" --no-merges --format=%b)

IFS=. read -r major minor patch <<<"$version"

if grep -qE '^[a-z]+(\([^)]*\))?!:' <<<"$subjects" || grep -qE '^BREAKING[ -]CHANGE:' <<<"$bodies"; then
  echo "$((major + 1)).0.0"
elif grep -qE '^feat(\([^)]*\))?:' <<<"$subjects"; then
  echo "${major}.$((minor + 1)).0"
elif grep -qE '^fix(\([^)]*\))?:' <<<"$subjects"; then
  echo "${major}.${minor}.$((patch + 1))"
fi
