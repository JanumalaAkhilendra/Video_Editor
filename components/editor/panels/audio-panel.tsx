'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { 
  addAudioTrack, 
  removeAudioTrack, 
  selectAudioTrack, 
  setTrackVolume, 
  toggleMuteTrack, 
  updateAudioTrack 
} from '@/lib/redux/features/audioSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Plus, Music, Volume2, VolumeX, Trash2, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';

export function AudioPanel() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const audioTracks = useSelector((state: RootState) => state.audio.tracks);
  const selectedTrackId = useSelector((state: RootState) => state.audio.selectedTrackId);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  const duration = useSelector((state: RootState) => state.video.duration);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const selectedTrack = audioTracks.find(track => track.id === selectedTrackId);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => handleAudioUpload(acceptedFiles),
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading
  });
  
  const handleAudioUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate loading audio metadata
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new audio track
      dispatch(addAudioTrack({
        name: file.name.split('.')[0],
        file: file,
        startTime: currentTime,
        duration: 30, // Mock duration - in a real app we'd extract this from the audio file
        volume: 1,
        isMuted: false
      }));
      
      toast({
        title: "Audio added",
        description: "Audio track has been added to your project"
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to add audio track",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleVolumeChange = (values: number[]) => {
    if (selectedTrackId) {
      dispatch(setTrackVolume({
        id: selectedTrackId,
        volume: values[0]
      }));
    }
  };
  
  const handleToggleMute = () => {
    if (selectedTrackId) {
      dispatch(toggleMuteTrack(selectedTrackId));
    }
  };
  
  const handleDeleteTrack = () => {
    if (selectedTrackId) {
      dispatch(removeAudioTrack(selectedTrackId));
      toast({
        title: "Track removed",
        description: "Audio track has been removed from your project"
      });
    }
  };
  
  const handleUpdateTrack = (changes: any) => {
    if (selectedTrackId) {
      dispatch(updateAudioTrack({
        id: selectedTrackId,
        changes
      }));
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Audio</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Audio
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={(e) => e.target.files && handleAudioUpload(Array.from(e.target.files))}
          />
        </div>

        {/* Audio upload zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30 hover:bg-accent/30"
          } ${isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Music className="h-6 w-6 text-primary" />
            </div>
            
            <div>
              <h3 className="font-medium">
                {isUploading ? "Processing audio..." : "Add background music"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isDragActive
                  ? "Drop your audio file here"
                  : "Drag and drop or click to upload"}
              </p>
            </div>
          </div>
        </div>

        {/* Selected track editor */}
        {selectedTrack ? (
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Edit Audio Track</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-destructive" 
                  onClick={handleDeleteTrack}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="track-name">Name</Label>
                <Input 
                  id="track-name"
                  value={selectedTrack.name}
                  onChange={(e) => handleUpdateTrack({ name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Volume</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleToggleMute}
                  >
                    {selectedTrack.isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </Label>
                <Slider
                  value={[selectedTrack.isMuted ? 0 : selectedTrack.volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{Math.round(selectedTrack.volume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Start Time</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="start-time"
                      type="number"
                      min={0}
                      max={duration - 0.1}
                      step={0.1}
                      value={selectedTrack.startTime.toFixed(1)}
                      onChange={(e) => handleUpdateTrack({ 
                        startTime: Math.max(0, Math.min(parseFloat(e.target.value), duration - 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateTrack({ startTime: currentTime })}
                    >
                      Set
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Duration</span>
                  </Label>
                  <Input 
                    id="duration"
                    type="number"
                    min={0.1}
                    max={120}
                    step={0.1}
                    value={selectedTrack.duration.toFixed(1)}
                    onChange={(e) => handleUpdateTrack({ 
                      duration: Math.max(0.1, parseFloat(e.target.value)) 
                    })}
                  />
                </div>
              </div>
              
              {/* Audio waveform visualization (mock) */}
              <div className="mt-2 h-12 bg-muted rounded overflow-hidden">
                <div className="h-full w-full flex items-center justify-center">
                  <svg viewBox="0 0 100 20" width="100%" height="100%" preserveAspectRatio="none">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const height = Math.abs(Math.sin(i * 0.4)) * 15 + 2;
                      return (
                        <rect 
                          key={i} 
                          x={i * 2} 
                          y={(20 - height) / 2} 
                          width="1" 
                          height={height} 
                          fill="currentColor" 
                          className="text-primary opacity-70"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full"
                onClick={() => {
                  dispatch({ type: 'video/setCurrentTime', payload: selectedTrack.startTime });
                }}
              >
                Preview from Start
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        {/* Track List */}
        {audioTracks.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Audio Tracks ({audioTracks.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {audioTracks.map(track => (
                <Card 
                  key={track.id} 
                  className={`bg-card/50 hover:bg-card transition cursor-pointer ${
                    selectedTrackId === track.id ? 'ring-1 ring-primary' : ''
                  } ${track.isMuted ? 'opacity-50' : ''}`}
                  onClick={() => dispatch(selectAudioTrack(track.id))}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 rounded-sm bg-green-500" />
                        <div>
                          <p className="font-medium text-sm flex items-center gap-1">
                            {track.name}
                            {track.isMuted && <VolumeX className="h-3 w-3 text-muted-foreground" />}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(track.startTime)} - {formatTime(track.startTime + track.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-mono">
                        {formatTime(track.duration)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-muted/30 mt-4">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No audio tracks added yet. Upload audio files to enhance your video with music or sound effects.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}