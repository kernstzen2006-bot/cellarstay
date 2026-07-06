import type { ImgHTMLAttributes } from "react";

type StaticImageImport = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | StaticImageImport;
  priority?: boolean;
  quality?: number;
  sizes?: string;
};

export function OptimizedImage({
  src,
  alt = "",
  priority = false,
  quality = 90,
  sizes,
  loading,
  decoding = "async",
  fetchPriority,
  className,
  ...props
}: OptimizedImageProps) {
  const resolvedSrc = typeof src === "string" ? src : src.src;
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
  const resolvedFetchPriority = fetchPriority ?? (priority ? "high" : "auto");

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={resolvedLoading}
      decoding={decoding}
      fetchPriority={resolvedFetchPriority}
      sizes={sizes}
      className={className}
      data-quality={quality}
      {...props}
    />
  );
}
