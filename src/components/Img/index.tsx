'use client';

import { type ImgHTMLAttributes, useState } from 'react';
import Image from 'next/image';
import { cx } from '@/utils';

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: any
  width?: number
  height?: number
  draggable?: boolean
  fill?: boolean
  priority?: boolean
  onLoadingComplete?: () => void
}

export const Img = ({
  src,
  alt,
  width,
  height,
  draggable = false,
  fill,
  priority,
  className,
  onLoadingComplete
}: ImgProps) => {
  const [isLoading, setLoading] = useState(true);

  const loadingComplete = () => {
    setLoading(false);
    onLoadingComplete?.();
  }

  return (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={width}
      height={height}
      draggable={!draggable ? false : undefined}
      fill={fill}
      priority={priority}
      className={cx(isLoading && "bg-gray-200", className)}
      onLoadingComplete={loadingComplete}
    />
  );
};

