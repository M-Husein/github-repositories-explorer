"use client";
import { type ImgHTMLAttributes, useState } from 'react';
import Image from 'next/image';
import { cx } from '@/utils';

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number
  height?: number
  draggable?: boolean
  fill?: boolean
  onLoadingComplete?: () => void
}

export const Img = ({
  src,
  alt,
  width,
  height,
  draggable,
  fill,
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
      draggable={draggable}
      fill={fill}
      className={cx(isLoading && "bg-gray-200", className)}
      onLoadingComplete={loadingComplete}
    />
  );
};

