'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { addClip, removeClip, selectClip, updateClip } from '@/lib/redux/features/timelineSlice';
import { Scissors, Trash2, Plus, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export function TimelinePanel() {
  const dispatch = useDispatch();
  const clips = useSelector((state: RootState) => state.timeline.clips);
  const selectedClipId = useSelector((state: RootState) => state.timeline.selectedClipId);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  const duration = useSelector((state: RootState) => state.video.duration);
  const [clipName, setClipName] = useState('New Clip');

  const selectedClip = clips.find(clip => clip.id === selectedClipId);

  // Handle adding a new clip at current position
  const handleAddClip = (type: 'video' | 'text' | 'image') => {
    const endTime = Math.min(currentTime + 5, duration);
    
    dispatch(addClip({
      startTime: currentTime,
      endTime: endTime,
      type: type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Clip`,
    }));
  };

  // Handle updating selected clip
  const handleUpdateClip = (changes: any) => {
    if (selectedClipId) {
      dispatch(updateClip({
        id: selectedClipId,
        changes
      }));
    }
  };

  // Handle deleting selected clip
  const handleDeleteClip = () => {
    if (selectedClipId) {
      dispatch(removeClip(selectedClipId));
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Timeline</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAddClip('video')}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Clip</span>
            </Button>
          </div>
        </div>

        {/* Current time indicator */}
        <Card className="bg-card/50">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium">Current Position</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex items-center justify-between">
              <div className="text-xl font-mono">{formatTime(currentTime)}</div>
              <div className="text-sm text-muted-foreground">
                / {formatTime(duration)}
              </div>
            </div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.01}
              className="mt-2"
              onValueChange={(values) => {
                dispatch({ type: 'video/setCurrentTime', payload: values[0] });
              }}
            />
          </CardContent>
        </Card>

        {/* Selected clip editor */}
        {selectedClip ? (
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Edit {selectedClip.type} Clip</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-destructive" 
                  onClick={handleDeleteClip}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="clip-name">Name</Label>
                <Input 
                  id="clip-name"
                  value={selectedClip.name}
                  onChange={(e) => handleUpdateClip({ name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Start</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="start-time"
                      type="number"
                      min={0}
                      max={selectedClip.endTime - 0.1}
                      step={0.1}
                      value={selectedClip.startTime.toFixed(1)}
                      onChange={(e) => handleUpdateClip({ 
                        startTime: Math.max(0, Math.min(parseFloat(e.target.value), selectedClip.endTime - 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateClip({ startTime: currentTime })}
                    >
                      Set
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-time" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>End</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="end-time"
                      type="number"
                      min={selectedClip.startTime + 0.1}
                      max={duration}
                      step={0.1}
                      value={selectedClip.endTime.toFixed(1)}
                      onChange={(e) => handleUpdateClip({ 
                        endTime: Math.min(duration, Math.max(parseFloat(e.target.value), selectedClip.startTime + 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateClip({ endTime: currentTime })}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Label className="mb-2 block">Clip Duration</Label>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono">
                    {formatTime(selectedClip.endTime - selectedClip.startTime)}
                  </span>
                  <span className="text-muted-foreground">
                    {((selectedClip.endTime - selectedClip.startTime) / duration * 100).toFixed(1)}% of video
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  dispatch({ type: 'video/setCurrentTime', payload: selectedClip.startTime });
                }}
              >
                Go to Start
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  dispatch({ type: 'video/setPlaying', payload: true });
                  dispatch({ type: 'video/setCurrentTime', payload: selectedClip.startTime });
                }}
              >
                Play Clip
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Select a clip from the timeline to edit its properties, or create a new clip using the buttons above.
              </p>
              <div className="mt-4 flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddClip('video')}
                >
                  Add Video Clip
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddClip('text')}
                >
                  Add Text
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddClip('image')}
                >
                  Add Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clip List */}
        {clips.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">All Clips ({clips.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {clips.map(clip => (
                <Card 
                  key={clip.id} 
                  className={`bg-card/50 hover:bg-card transition cursor-pointer ${
                    selectedClipId === clip.id ? 'ring-1 ring-primary' : ''
                  }`}
                  onClick={() => dispatch(selectClip(clip.id))}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-8 rounded-sm ${
                          clip.type === 'video' ? 'bg-blue-500' : 
                          clip.type === 'text' ? 'bg-purple-500' : 
                          'bg-amber-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{clip.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-mono">
                        {formatTime(clip.endTime - clip.startTime)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}