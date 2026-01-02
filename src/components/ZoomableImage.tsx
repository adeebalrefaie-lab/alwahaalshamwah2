import { useState, useRef, useEffect, TouchEvent, WheelEvent } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartDistance = useRef<number>(0);
  const lastTouchTime = useRef<number>(0);

  const minScale = 1;
  const maxScale = 4;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, maxScale));
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.5, minScale);
    setScale(newScale);
    if (newScale === minScale) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(minScale);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(minScale, Math.min(maxScale, scale + delta));
    setScale(newScale);
    if (newScale === minScale) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = (e: TouchEvent) => {
    const now = Date.now();
    const timeSinceLastTouch = now - lastTouchTime.current;

    if (e.touches.length === 2) {
      touchStartDistance.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1) {
      if (timeSinceLastTouch < 300 && timeSinceLastTouch > 0) {
        if (scale > minScale) {
          resetZoom();
        } else {
          setScale(2);
        }
      }

      if (scale > minScale) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
    }

    lastTouchTime.current = now;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const currentDistance = getTouchDistance(e.touches);
      const scaleChange = currentDistance / touchStartDistance.current;
      const newScale = Math.max(minScale, Math.min(maxScale, scale * scaleChange));
      setScale(newScale);
      touchStartDistance.current = currentDistance;

      if (newScale === minScale) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && scale > minScale) {
      e.preventDefault();
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      const maxX = (scale - 1) * 150;
      const maxY = (scale - 1) * 150;

      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (scale === minScale) {
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (scale === minScale) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  if (imageError || !src) {
    return (
      <div className="relative bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl overflow-hidden w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-coffee font-semibold text-lg mb-2">{alt}</p>
          <p className="text-coffee/60 text-sm">تعذر تحميل الصورة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl overflow-hidden">
      <div
        ref={imageRef}
        className="relative overflow-hidden touch-none select-none"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: scale > minScale ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="w-full h-auto"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.3s ease',
          }}
          onError={() => setImageError(true)}
          onDoubleClick={() => {
            if (scale > minScale) {
              resetZoom();
            } else {
              setScale(2);
            }
          }}
        />
      </div>

      {scale > minScale && (
        <div className="absolute top-2 left-2 bg-coffee/80 text-white px-2 py-1 rounded text-xs">
          {Math.round(scale * 100)}%
        </div>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          onClick={handleZoomOut}
          disabled={scale === minScale}
          className="bg-coffee/80 text-white p-2 rounded-full hover:bg-coffee disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomIn}
          disabled={scale === maxScale}
          className="bg-coffee/80 text-white p-2 rounded-full hover:bg-coffee disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      <div className="p-2 text-center text-xs text-coffee/60">
        انقر مرتين أو استخدم إيماءة القرص للتكبير
      </div>
    </div>
  );
}
