# Media originals

Full-size source files kept out of `public/` so they are not deployed with the site.

- `* Ride Arcs.gif` — animated city ride maps. Only Brampton's is used: the home page plays
  `public/assets/mainPage/ride-trips.webm` / `.mp4` (plus `ride-trips-poster.webp`), built from it by
  `ride-trips.py` (labels removed, graded, seamless loop at 25 fps). To rebuild (with ffmpeg installed):

      python3 ride-trips.py work
      ffmpeg -f rawvideo -pix_fmt rgb24 -s 1280x720 -r 25 -i work/out.rgb -vf format=yuv420p -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 -an ride-trips.webm
      ffmpeg -f rawvideo -pix_fmt rgb24 -s 1280x720 -r 25 -i work/out.rgb -vf format=yuv420p -c:v libx264 -preset slow -crf 28 -movflags +faststart -an ride-trips.mp4
      ffmpeg -i work/poster.png -c:v libwebp -quality 78 ride-trips-poster.webp

- `scooty-rides.gif` — the earlier combined four-city map; no longer used on the site.
