#!/usr/bin/env bash
set -o errexit
set -o nounset

src=$1
duration=$2

if [[ -z $duration ]]; then
  $duration="0.0003"
fi

ffmpeg -i $src -r 60 -filter:v "setpts=$duration*PTS" -vcodec libx264 ${src/.webm/.processed.mp4} -threads 6
