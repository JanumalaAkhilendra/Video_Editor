'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Image from 'next/image';

export function ImageOverlayPreview() {
  const imageOverlays = useSelector((state: RootState) => state.image.overlays);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  
  // Filter image overlays that should be displayed at current time
  const visibleOverlays = imageOverlays.filter(
    (overlay) => overlay.url && currentTime >= overlay.startTime && currentTime <= overlay.endTime
  );
  
  if (!visibleOverlays.length) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleOverlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute"
          style={{
            left: `${overlay.position.x * 100}%`,
            top: `${overlay.position.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${overlay.style.rotation}deg)`,
            opacity: overlay.style.opacity,
            border: overlay.style.borderWidth ? `${overlay.style.borderWidth}px solid ${overlay.style.borderColor}` : 'none',
            borderRadius: `${overlay.style.borderRadius}px`,
            overflow: 'hidden',
            width: `${overlay.size.width}px`,
            height: `${overlay.size.height}px`,
          }}
        >
          {overlay.url && (
            // Next Image component doesn't work well with blob URLs in static export mode,
            // so we use a regular img tag
            <img
              src={overlay.url}
              alt="Overlay"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}