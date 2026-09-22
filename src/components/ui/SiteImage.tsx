import type { ImgHTMLAttributes } from 'react';
import { imageProps } from '../../data/imageProps';

export function SiteImage({ src = '', sizes = '(max-width: 768px) 100vw, 50vw', loading = 'lazy', decoding = 'async', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...imageProps(src)} sizes={sizes} loading={loading} decoding={decoding} {...props} />;
}
