import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Create a new image to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src]);

  return (
    <div
      style={{
        width: width || 'auto',
        height: height || 'auto',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
      className={className}
    >
      {!isLoaded && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
          }}
        />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
