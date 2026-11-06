import { createContext, useContext } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { imageProps } from '../../data/imageProps';

/** Lets a parent start loading the images under it ahead of time, however deep they are rendered. */
export const EagerImagesContext = createContext(false);

export function SiteImage({ src = '', sizes = '(max-width: 768px) 100vw, 50vw', loading = 'lazy', decoding = 'async', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const eager = useContext(EagerImagesContext);
  return <img {...imageProps(src)} sizes={sizes} loading={eager ? 'eager' : loading} decoding={decoding} {...props} />;
}
