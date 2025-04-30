'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { selectClip, TimelineClip } from '@/lib/redux/features/timelineSlice';
import { useDrag, useDrop } from 'react-dnd';
import { cn } from '@/lib/utils';

interface TimelineTrackProps {
  type: 'video' | 'audio' | 'text' | 'image';
  height: number;
  duration: number;
  timelineWidth: number;
}

export function TimelineTrack({ type, height, duration, timelineWidth }: TimelineTrackProps) {
  const dispatch = useDispatch();
  const allClips = useSelector((state: RootState) => state.timeline.clips);
  const selectedClipId = useSelector((state: RootState) => state.timeline.selectedClipId);
  
  // Filter clips by type
  const clips = allClips.filter((clip) => clip.type === type);
  
  // Get color for track type
  const getTrackColor = () => {
    switch (type) {
      case 'video':
        return 'bg-blue-900 border-blue-700 text-blue-300';
      case 'audio':
        return 'bg-green-900 border-green-700 text-green-300';
      case 'text':
        return 'bg-purple-900 border-purple-700 text-purple-300';
      case 'image':
        return 'bg-amber-900 border-amber-700 text-amber-300';
      default:
        return 'bg-gray-800 border-gray-700 text-gray-300';
    }
  };
  
  // Get title for track
  const getTrackTitle = () => {
    switch (type) {
      case 'video':
        return 'Video Track';
      case 'audio':
        return 'Audio Track';
      case 'text':
        return 'Text Track';
      case 'image':
        return 'Image Track';
      default:
        return 'Track';
    }
  };

  return (
    <div 
      className="relative border-b border-border"
      style={{ height: `${height}px` }}
    >
      {/* Track label */}
      <div className="absolute left-0 top-0 z-10 h-full bg-background border-r border-border px-2 flex items-center">
        <span className="text-xs font-medium whitespace-nowrap">
          {getTrackTitle()}
        </span>
      </div>

      {/* Track content area */}
      <div className="ml-24 h-full relative">
        {clips.map((clip) => (
          <TimelineClipItem
            key={clip.id}
            clip={clip}
            duration={duration}
            timelineWidth={timelineWidth}
            isSelected={clip.id === selectedClipId}
            trackColor={getTrackColor()}
            onSelect={() => dispatch(selectClip(clip.id))}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineClipItemProps {
  clip: TimelineClip;
  duration: number;
  timelineWidth: number;
  isSelected: boolean;
  trackColor: string;
  onSelect: () => void;
}

function TimelineClipItem({
  clip,
  duration,
  timelineWidth,
  isSelected,
  trackColor,
  onSelect,
}: TimelineClipItemProps) {
  // Calculate position and width based on timeline
  const left = (clip.startTime / duration) * timelineWidth;
  const width = ((clip.endTime - clip.startTime) / duration) * timelineWidth;
  
  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CLIP',
    item: { id: clip.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "absolute top-0 h-full border rounded-sm cursor-move overflow-hidden flex items-center px-1",
        trackColor,
        isSelected && "ring-2 ring-primary",
        isDragging && "opacity-50"
      )}
      style={{
        left: `${left}px`,
        width: `${Math.max(width, 20)}px`, // Minimum width for small clips
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <span className="text-xs font-medium truncate">
        {clip.name}
      </span>
    </div>
  );
}