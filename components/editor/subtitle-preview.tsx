'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

export function SubtitlePreview() {
  const subtitles = useSelector((state: RootState) => state.subtitle.subtitles);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  
  // Filter subtitles that should be displayed at current time
  const visibleSubtitles = subtitles.filter(
    (subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
  );
  
  if (!visibleSubtitles.length) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleSubtitles.map((subtitle) => (
        <div
          key={subtitle.id}
          className="absolute"
          style={{
            left: `${subtitle.position.x * 100}%`,
            top: `${subtitle.position.y * 100}%`,
            fontFamily: subtitle.style.fontFamily,
            fontSize: `${subtitle.style.fontSize}px`,
            color: subtitle.style.color,
            backgroundColor: subtitle.style.backgroundColor,
            opacity: subtitle.style.opacity,
            fontWeight: subtitle.style.bold ? 'bold' : 'normal',
            fontStyle: subtitle.style.italic ? 'italic' : 'normal',
            textDecoration: subtitle.style.underline ? 'underline' : 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            maxWidth: '80%',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {subtitle.text}
        </div>
      ))}
    </div>
  );
}