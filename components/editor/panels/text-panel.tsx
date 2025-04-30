'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { 
  addSubtitle, 
  removeSubtitle, 
  selectSubtitle, 
  updateSubtitle 
} from '@/lib/redux/features/subtitleSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { 
  Plus, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  Trash2, 
  Clock 
} from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export function TextPanel() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const subtitles = useSelector((state: RootState) => state.subtitle.subtitles);
  const selectedSubtitleId = useSelector((state: RootState) => state.subtitle.selectedSubtitleId);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  const duration = useSelector((state: RootState) => state.video.duration);
  
  const selectedSubtitle = subtitles.find(subtitle => subtitle.id === selectedSubtitleId);
  
  const fontFamilies = [
    'Arial', 
    'Helvetica', 
    'Times New Roman', 
    'Georgia', 
    'Courier New', 
    'Verdana', 
    'Impact'
  ];
  
  const handleAddSubtitle = () => {
    dispatch(addSubtitle({
      text: 'New subtitle',
      startTime: currentTime,
      endTime: Math.min(currentTime + 3, duration),
      position: { x: 0.5, y: 0.9 },
      style: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        opacity: 1,
        bold: false,
        italic: false,
        underline: false
      }
    }));
    
    toast({
      title: "Subtitle added",
      description: "New subtitle has been added at the current position"
    });
  };
  
  const handleUpdateSubtitle = (changes: any) => {
    if (selectedSubtitleId) {
      dispatch(updateSubtitle({
        id: selectedSubtitleId,
        changes
      }));
    }
  };
  
  const handleDeleteSubtitle = () => {
    if (selectedSubtitleId) {
      dispatch(removeSubtitle(selectedSubtitleId));
      toast({
        title: "Subtitle removed",
        description: "Subtitle has been removed from your project"
      });
    }
  };
  
  const handlePositionChange = (axis: 'x' | 'y', value: number[]) => {
    if (selectedSubtitleId) {
      const position = { ...selectedSubtitle?.position };
      position[axis] = value[0];
      handleUpdateSubtitle({ position });
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Text & Subtitles</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSubtitle}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Text
          </Button>
        </div>

        {/* Selected subtitle editor */}
        {selectedSubtitle ? (
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Edit Text</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-destructive" 
                  onClick={handleDeleteSubtitle}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subtitle-text">Text Content</Label>
                <Textarea
                  id="subtitle-text"
                  value={selectedSubtitle.text}
                  rows={2}
                  onChange={(e) => handleUpdateSubtitle({ text: e.target.value })}
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
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
                      max={selectedSubtitle.endTime - 0.1}
                      step={0.1}
                      value={selectedSubtitle.startTime.toFixed(1)}
                      onChange={(e) => handleUpdateSubtitle({ 
                        startTime: Math.max(0, Math.min(parseFloat(e.target.value), selectedSubtitle.endTime - 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateSubtitle({ startTime: currentTime })}
                    >
                      Set
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-time" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>End Time</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="end-time"
                      type="number"
                      min={selectedSubtitle.startTime + 0.1}
                      max={duration}
                      step={0.1}
                      value={selectedSubtitle.endTime.toFixed(1)}
                      onChange={(e) => handleUpdateSubtitle({ 
                        endTime: Math.min(duration, Math.max(parseFloat(e.target.value), selectedSubtitle.startTime + 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateSubtitle({ endTime: currentTime })}
                    >
                      Set
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Position</Label>
                  <div className="text-xs text-muted-foreground">
                    X: {Math.round(selectedSubtitle.position.x * 100)}%,
                    Y: {Math.round(selectedSubtitle.position.y * 100)}%
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Left</span>
                      <span>Right</span>
                    </div>
                    <Slider
                      value={[selectedSubtitle.position.x]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(values) => handlePositionChange('x', values)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Top</span>
                      <span>Bottom</span>
                    </div>
                    <Slider
                      value={[selectedSubtitle.position.y]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(values) => handlePositionChange('y', values)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font</Label>
                  <Select
                    value={selectedSubtitle.style.fontFamily}
                    onValueChange={(value) => handleUpdateSubtitle({ 
                      style: { ...selectedSubtitle.style, fontFamily: value } 
                    })}
                  >
                    <SelectTrigger id="font-family">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map(font => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Size</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="font-size"
                      type="number"
                      min={8}
                      max={72}
                      value={selectedSubtitle.style.fontSize}
                      onChange={(e) => handleUpdateSubtitle({ 
                        style: { ...selectedSubtitle.style, fontSize: parseInt(e.target.value) } 
                      })}
                    />
                    <span className="text-sm">px</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedSubtitle.style.bold ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdateSubtitle({ 
                      style: { ...selectedSubtitle.style, bold: !selectedSubtitle.style.bold } 
                    })}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedSubtitle.style.italic ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdateSubtitle({ 
                      style: { ...selectedSubtitle.style, italic: !selectedSubtitle.style.italic } 
                    })}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedSubtitle.style.underline ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdateSubtitle({ 
                      style: { ...selectedSubtitle.style, underline: !selectedSubtitle.style.underline } 
                    })}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedSubtitle.style.color }}
                    />
                    <Input
                      id="text-color"
                      type="color"
                      value={selectedSubtitle.style.color}
                      onChange={(e) => handleUpdateSubtitle({ 
                        style: { ...selectedSubtitle.style, color: e.target.value } 
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: selectedSubtitle.style.backgroundColor }}
                    />
                    <Input
                      id="bg-color"
                      type="color"
                      value={selectedSubtitle.style.backgroundColor.replace(/[^#\d]/g, '#000000')}
                      onChange={(e) => {
                        // Convert hex to rgba
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        const a = selectedSubtitle.style.backgroundColor.match(/[\d.]+(?=\))/)?.[0] || "0.5";
                        handleUpdateSubtitle({ 
                          style: { 
                            ...selectedSubtitle.style, 
                            backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})` 
                          } 
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="opacity" className="flex justify-between">
                  <span>Opacity</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(selectedSubtitle.style.opacity * 100)}%
                  </span>
                </Label>
                <Slider
                  id="opacity"
                  value={[selectedSubtitle.style.opacity]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => handleUpdateSubtitle({ 
                    style: { ...selectedSubtitle.style, opacity: values[0] } 
                  })}
                />
              </div>
              
              <div>
                <div className="p-3 rounded bg-muted/30 text-center">
                  <p 
                    className="break-words"
                    style={{
                      fontFamily: selectedSubtitle.style.fontFamily,
                      fontSize: `${selectedSubtitle.style.fontSize / 2}px`,
                      color: selectedSubtitle.style.color,
                      backgroundColor: selectedSubtitle.style.backgroundColor,
                      opacity: selectedSubtitle.style.opacity,
                      fontWeight: selectedSubtitle.style.bold ? 'bold' : 'normal',
                      fontStyle: selectedSubtitle.style.italic ? 'italic' : 'normal',
                      textDecoration: selectedSubtitle.style.underline ? 'underline' : 'none',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      maxWidth: '100%'
                    }}
                  >
                    {selectedSubtitle.text || 'Preview Text'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex gap-2 justify-end">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  dispatch({ type: 'video/setCurrentTime', payload: selectedSubtitle.startTime });
                }}
              >
                Preview
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        {/* Subtitle List */}
        {subtitles.length > 0 ? (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Text Elements ({subtitles.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {subtitles.map(subtitle => (
                <Card 
                  key={subtitle.id} 
                  className={`bg-card/50 hover:bg-card transition cursor-pointer ${
                    selectedSubtitleId === subtitle.id ? 'ring-1 ring-primary' : ''
                  }`}
                  onClick={() => dispatch(selectSubtitle(subtitle.id))}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 rounded-sm bg-purple-500" />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[120px]">
                            {subtitle.text || 'Empty text'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="h-6 w-6 rounded"
                        style={{ 
                          backgroundColor: subtitle.style.backgroundColor,
                          border: `1px solid ${subtitle.style.color}`
                        }}
                      ></div>
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
                No text elements added yet. Click the "Add Text" button to add subtitles or text overlays to your video.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}