import manifest from './image-manifest.json';

type ImageAsset = { src: string; srcSet: string; width: number; height: number };

/** Responsive exports preserve the original photo; layout owns the crop. */
export function imageProps(src: string) {
  return (manifest as Record<string, ImageAsset>)[src] ?? { src };
}
