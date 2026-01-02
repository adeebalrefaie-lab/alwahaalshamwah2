import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export default function ProductImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackClassName = '',
  onImageLoad,
  onImageError,
}: ProductImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onImageLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  if (imageError || !src) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200 ${fallbackClassName}`}
      >
        <span className="text-center text-coffee font-semibold text-sm">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleImageLoad}
      onError={handleImageError}
      className={className}
      draggable={false}
    />
  );
}
