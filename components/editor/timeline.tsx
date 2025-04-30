'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setCurrentTime } from '@/lib/redux/features/videoSlice';
import { reorderClips, selectClip } from '@/lib/redux/features/timelineSlice';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { TimelineTrack } from './timeline-track';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { formatTime } from '@/lib/utils';

export function Timeline() {
  const dispatch = useDispatch();
  const duration = useSelector((state: RootState) => state.video.duration);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  const clips = useSelector((state: RootState) => state.timeline.clips);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  
  // Calculate timeline width based on zoom
  const timelineWidth = Math.max(duration * 100 * zoom, 1000);
  
  // Handle seeking in timeline
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      const newTime = percentage * duration;
      dispatch(setCurrentTime(newTime));
    }
  };
  
  const handleZoomChange = (value: number) => {
    setZoom(Math.max(0.5, Math.min(3, zoom + value)));
  };
  
  // Create a mock set of thumbnails
  const thumbnailCount = Math.ceil(duration / 2);
  const thumbnails = Array.from({ length: thumbnailCount }).map((_, i) => ({
    id: i,
    time: i * 2,
    src: `https://picsum.photos/seed/${i}/160/90`, // Placeholder thumbnails from picsum
  }));

  return (
    <div className="flex flex-col border-t border-border bg-background h-44">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleZoomChange(-0.1)}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleZoomChange(0.1)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      {/* Timeline ruler */}
      <div className="relative h-6 border-b border-border px-4 overflow-hidden">
        <div
          className="absolute left-0 h-full"
          style={{ width: `${timelineWidth}px` }}
        >
          {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
            <div 
              key={i} 
              className="absolute h-full flex flex-col items-center"
              style={{ left: `${(i / duration) * 100}%` }}
            >
              <div className="h-2 w-px bg-border" />
              <span className="text-xs text-muted-foreground">{formatTime(i)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline tracks */}
      <div 
        ref={timelineRef}
        className="relative flex-1 overflow-x-auto overflow-y-hidden"
        onClick={handleTimelineClick}
      >
        {/* Current time indicator */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-primary z-10"
          style={{ left: `${(currentTime / duration) * timelineWidth}px` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary transform rotate-45" />
        </div>
        
        {/* Tracks container */}
        <div 
          className="absolute top-0 left-0 h-full"
          style={{ width: `${timelineWidth}px` }}
        >
          {/* Thumbnails track */}
          <div className="h-12 relative border-b border-border bg-card/20">
            {thumbnails.map((thumbnail) => (
              <div
                key={thumbnail.id}
                className="absolute top-1 h-10 border border-border overflow-hidden"
                style={{
                  left: `${(thumbnail.time / duration) * 100}%`,
                  width: `${(2 / duration) * 100}%`,
                }}
              >
                <img
                  src={thumbnail.src}
                  alt={`Thumbnail ${thumbnail.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Clips tracks */}
          <DndProvider backend={HTML5Backend}>
            <TimelineTrack 
              type="video" 
              height={20}
              duration={duration}
              timelineWidth={timelineWidth}
            />
            <TimelineTrack 
              type="audio" 
              height={20}
              duration={duration}
              timelineWidth={timelineWidth}
            />
            <TimelineTrack 
              type="text" 
              height={20}
              duration={duration}
              timelineWidth={timelineWidth}
            />
          </DndProvider>
        </div>
      </div>
    </div>
  );
}