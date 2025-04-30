'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
  addImageOverlay,
  removeImageOverlay,
  selectImageOverlay,
  updateImageOverlay,
  updateImagePosition,
  updateImageSize
} from '@/lib/redux/features/imageSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Plus, Image, RotateCcw, Trash2, Clock, Move, Maximize } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';

export function ImagePanel() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const imageOverlays = useSelector((state: RootState) => state.image.overlays);
  const selectedOverlayId = useSelector((state: RootState) => state.image.selectedOverlayId);
  const currentTime = useSelector((state: RootState) => state.video.currentTime);
  const duration = useSelector((state: RootState) => state.video.duration);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectedOverlay = imageOverlays.find(overlay => overlay.id === selectedOverlayId);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => handleImageUpload(acceptedFiles),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading
  });

  const handleImageUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create new image overlay with default values
      dispatch(addImageOverlay({
        file: file,
        startTime: currentTime,
        endTime: Math.min(currentTime + 5, duration),
        position: { x: 0.5, y: 0.5 },
        size: { width: 200, height: 200 },
        style: {
          opacity: 1,
          rotation: 0,
          borderWidth: 0,
          borderColor: '#ffffff',
          borderRadius: 0
        }
      }));

      toast({
        title: "Image added",
        description: "Image has been added to your video"
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to add image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateOverlay = (changes: any) => {
    if (selectedOverlayId) {
      dispatch(updateImageOverlay({
        id: selectedOverlayId,
        changes
      }));
    }
  };

  const handleDeleteOverlay = () => {
    if (selectedOverlayId) {
      dispatch(removeImageOverlay(selectedOverlayId));
      toast({
        title: "Image removed",
        description: "Image has been removed from your video"
      });
    }
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number[]) => {
    if (selectedOverlayId && selectedOverlay) {
      const position = { ...selectedOverlay.position };
      position[axis] = value[0];
      dispatch(updateImagePosition({
        id: selectedOverlayId,
        position
      }));
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    if (selectedOverlayId && selectedOverlay) {
      const size = { ...selectedOverlay.size };
      size[dimension] = parseInt(value);
      dispatch(updateImageSize({
        id: selectedOverlayId,
        size
      }));
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Images</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(Array.from(e.target.files))}
          />
        </div>

        {/* Image upload zone */}
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
              <Image className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-medium">
                {isUploading ? "Processing image..." : "Add image overlay"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isDragActive
                  ? "Drop your image here"
                  : "Drag and drop or click to upload"}
              </p>
            </div>
          </div>
        </div>

        {/* Selected image editor */}
        {selectedOverlay ? (
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Edit Image</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-destructive" 
                  onClick={handleDeleteOverlay}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Image preview */}
              <div className="bg-muted/30 rounded-md p-3 flex justify-center">
                {selectedOverlay.url && (
                  <div 
                    style={{
                      maxWidth: '100%',
                      border: selectedOverlay.style.borderWidth ? 
                        `${selectedOverlay.style.borderWidth}px solid ${selectedOverlay.style.borderColor}` : 
                        'none',
                      borderRadius: `${selectedOverlay.style.borderRadius}px`,
                      transform: `rotate(${selectedOverlay.style.rotation}deg)`,
                      opacity: selectedOverlay.style.opacity,
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={selectedOverlay.url} 
                      alt="Selected overlay"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '150px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}
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
                      max={selectedOverlay.endTime - 0.1}
                      step={0.1}
                      value={selectedOverlay.startTime.toFixed(1)}
                      onChange={(e) => handleUpdateOverlay({ 
                        startTime: Math.max(0, Math.min(parseFloat(e.target.value), selectedOverlay.endTime - 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateOverlay({ startTime: currentTime })}
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
                      min={selectedOverlay.startTime + 0.1}
                      max={duration}
                      step={0.1}
                      value={selectedOverlay.endTime.toFixed(1)}
                      onChange={(e) => handleUpdateOverlay({ 
                        endTime: Math.min(duration, Math.max(parseFloat(e.target.value), selectedOverlay.startTime + 0.1)) 
                      })}
                    />
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleUpdateOverlay({ endTime: currentTime })}
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
                    X: {Math.round(selectedOverlay.position.x * 100)}%,
                    Y: {Math.round(selectedOverlay.position.y * 100)}%
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Move className="h-3 w-3 mr-1" />
                      <span className="text-xs">Horizontal (Left to Right)</span>
                    </div>
                    <Slider
                      value={[selectedOverlay.position.x]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(values) => handlePositionChange('x', values)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Move className="h-3 w-3 mr-1" />
                      <span className="text-xs">Vertical (Top to Bottom)</span>
                    </div>
                    <Slider
                      value={[selectedOverlay.position.y]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(values) => handlePositionChange('y', values)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Maximize className="h-3 w-3 mr-1" />
                  <span>Size</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="img-width" className="text-xs">Width</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        id="img-width"
                        type="number"
                        min={10}
                        max={1000}
                        value={selectedOverlay.size.width}
                        onChange={(e) => handleSizeChange('width', e.target.value)}
                      />
                      <span className="text-xs">px</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="img-height" className="text-xs">Height</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        id="img-height"
                        type="number"
                        min={10}
                        max={1000}
                        value={selectedOverlay.size.height}
                        onChange={(e) => handleSizeChange('height', e.target.value)}
                      />
                      <span className="text-xs">px</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rotation" className="flex items-center">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  <span>Rotation</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {selectedOverlay.style.rotation}°
                  </span>
                </Label>
                <Slider
                  id="rotation"
                  value={[selectedOverlay.style.rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(values) => handleUpdateOverlay({ 
                    style: { ...selectedOverlay.style, rotation: values[0] } 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="opacity">
                  <span>Opacity</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {Math.round(selectedOverlay.style.opacity * 100)}%
                  </span>
                </Label>
                <Slider
                  id="opacity"
                  value={[selectedOverlay.style.opacity]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => handleUpdateOverlay({ 
                    style: { ...selectedOverlay.style, opacity: values[0] } 
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="border-width">Border Width</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      id="border-width"
                      type="number"
                      min={0}
                      max={20}
                      value={selectedOverlay.style.borderWidth}
                      onChange={(e) => handleUpdateOverlay({ 
                        style: { ...selectedOverlay.style, borderWidth: parseInt(e.target.value) } 
                      })}
                    />
                    <span className="text-xs">px</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="border-radius">Rounded Corners</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      id="border-radius"
                      type="number"
                      min={0}
                      max={100}
                      value={selectedOverlay.style.borderRadius}
                      onChange={(e) => handleUpdateOverlay({ 
                        style: { ...selectedOverlay.style, borderRadius: parseInt(e.target.value) } 
                      })}
                    />
                    <span className="text-xs">px</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="border-color">Border Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: selectedOverlay.style.borderColor }}
                  />
                  <Input
                    id="border-color"
                    type="color"
                    value={selectedOverlay.style.borderColor}
                    onChange={(e) => handleUpdateOverlay({ 
                      style: { ...selectedOverlay.style, borderColor: e.target.value } 
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex gap-2 justify-end">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  dispatch({ type: 'video/setCurrentTime', payload: selectedOverlay.startTime });
                }}
              >
                Preview
              </Button>
            </CardFooter>
          </Card>
        ) : null}

        {/* Image List */}
        {imageOverlays.length > 0 ? (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Image Overlays ({imageOverlays.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {imageOverlays.map(overlay => (
                <Card 
                  key={overlay.id} 
                  className={`bg-card/50 hover:bg-card transition cursor-pointer ${
                    selectedOverlayId === overlay.id ? 'ring-1 ring-primary' : ''
                  }`}
                  onClick={() => dispatch(selectImageOverlay(overlay.id))}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 rounded-sm bg-amber-500" />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[100px]">
                            Image {overlay.id.slice(0, 4)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(overlay.startTime)} - {formatTime(overlay.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-card rounded overflow-hidden border border-border">
                        {overlay.url && (
                          <img 
                            src={overlay.url} 
                            alt="Thumbnail" 
                            className="h-full w-full object-cover"
                          />
                        )}
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
                No image overlays added yet. Upload images to enhance your video with logos, photos, or graphics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}