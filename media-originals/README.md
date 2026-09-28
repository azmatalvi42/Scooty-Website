# Media originals

Full-size source files kept out of `public/` so they are not deployed with the site.

- `* Ride Arcs.gif` — the home page's animated city ride maps. The site plays looping videos encoded
  from these (`public/assets/mainPage/ride-arcs-<city>.webm` / `.mp4`, plus a `-poster.webp` first frame).
  To re-encode after changing a GIF (with ffmpeg installed):

      ffmpeg -i "Brampton Ride Arcs.gif" -vf "scale=720:-2:flags=lanczos,format=yuv420p" -c:v libvpx-vp9 -crf 38 -b:v 0 -an ride-arcs-brampton.webm
      ffmpeg -i "Brampton Ride Arcs.gif" -vf "scale=720:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 25 -movflags +faststart -an ride-arcs-brampton.mp4
      ffmpeg -i "Brampton Ride Arcs.gif" -vf "scale=720:-2:flags=lanczos" -frames:v 1 -c:v libwebp -quality 72 ride-arcs-brampton-poster.webp

- `scooty-rides.gif` — the earlier combined four-city map; no longer used on the site.
