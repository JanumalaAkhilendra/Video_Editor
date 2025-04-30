'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setCurrentTime, setDuration, setPlaying } from '@/lib/redux/features/videoSlice';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Maximize2, MinusCircle, PlusCircle, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import { ImageOverlayPreview } from './image-overlay-preview';
import { SubtitlePreview } from './subtitle-preview';

export function VideoPreview() {
  const dispatch = useDispatch();
  const videoUrl = useSelector((state: RootState) => state.video.videoUrl);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  const isPlaying = useSelector((state: RootState) => state.video.isPlaying);
  const isFullscreen = useSelector((state: RootState) => state.ui.isPreviewFullscreen);
  const subtitles = useSelector((state: RootState) => state.subtitle.subtitles);
  const imageOverlays = useSelector((state: RootState) => state.image.overlays);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync video current time
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Handle video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      dispatch(setCurrentTime(videoRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      dispatch(setDuration(videoRef.current.duration));
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    dispatch(setPlaying(!isPlaying));
  };

  const handleZoom = (delta: number) => {
    setZoom(Math.max(0.5, Math.min(2, zoom + delta)));
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex flex-col bg-black/90",
        isFullscreen ? "fixed inset-0 z-50" : "h-[calc(100%-180px)]"
      )}
    >
      {/* Video container */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {videoUrl && (
          <>
            <div 
              className="relative" 
              style={{ 
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                className="max-h-full max-w-full"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              
              {/* Subtitles layer */}
              <SubtitlePreview />
              
              {/* Image overlays layer */}
              <ImageOverlayPreview />
            </div>
            
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                onClick={() => handleZoom(-0.1)}
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              <span className="text-xs text-white/80 w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                onClick={() => handleZoom(0.1)}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Video controls */}
      <div className="flex flex-col bg-background/10 backdrop-blur-md border-t border-white/10 p-2">
        <div className="flex items-center px-2 py-1 space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-white/90 hover:text-white hover:bg-white/10"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </Button>
          
          <div className="text-sm text-white/90 font-mono w-16">
            {videoRef.current ? formatTime(currentTime) : '00:00'}
          </div>
          
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={videoRef.current?.duration || 100}
              step={0.01}
              onValueChange={(values) => {
                dispatch(setCurrentTime(values[0]));
              }}
              className="cursor-pointer"
            />
          </div>
          
          <div className="text-sm text-white/90 font-mono w-16 text-right">
            {videoRef.current ? formatTime(videoRef.current.duration) : '00:00'}
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
            onClick={() => dispatch({ type: 'ui/togglePreviewFullscreen' })}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}