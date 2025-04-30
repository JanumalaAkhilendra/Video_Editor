'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Download,
  Film,
  CheckCircle2,
  Settings,
  FileVideo
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { formatTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ExportPanel() {
  const { toast } = useToast();
  const duration = useSelector((state: RootState) => state.video.duration);
  const videoFile = useSelector((state: RootState) => state.video.videoFile);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportCompleted, setExportCompleted] = useState(false);
  
  // Export settings
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('medium');
  const [resolution, setResolution] = useState('720p');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [filename, setFilename] = useState(videoFile?.name?.split('.')[0] || 'video-export');
  
  // Quality presets
  const qualityPresets = {
    low: { bitrateVideo: '1 Mbps', bitrateAudio: '128 Kbps', size: '~7.5 MB/min' },
    medium: { bitrateVideo: '4 Mbps', bitrateAudio: '192 Kbps', size: '~30 MB/min' },
    high: { bitrateVideo: '8 Mbps', bitrateAudio: '256 Kbps', size: '~60 MB/min' }
  };
  
  // Resolution options
  const resolutionOptions = {
    '480p': { width: 854, height: 480 },
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 }
  };
  
  const handleExport = () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    setExportCompleted(false);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setExportCompleted(true);
            toast({
              title: "Export complete",
              description: `Your video has been exported as ${filename}.${format}`
            });
          }, 500);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 300);
  };
  
  const handleDownload = () => {
    // Mock download functionality
    toast({
      title: "Download started",
      description: `Your file ${filename}.${format} is being downloaded`
    });
    
    // Reset state for next export
    setTimeout(() => {
      setExportCompleted(false);
    }, 2000);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Export Video</h3>
        </div>

        {exportCompleted ? (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Export Complete!</h3>
                  <p className="text-muted-foreground mt-1">
                    Your video has been successfully exported as {filename}.{format}
                  </p>
                </div>
                <Button 
                  onClick={handleDownload}
                  className="w-full mt-4"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setExportCompleted(false)}
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Adjust Export Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isExporting ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Film className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Exporting Your Video</h3>
                  <p className="text-muted-foreground mt-1">
                    Please wait while we render your video...
                  </p>
                </div>
                <div className="w-full space-y-2">
                  <Progress value={exportProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processing...</span>
                    <span>{Math.round(exportProgress)}%</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  <p>
                    {resolution} • {format.toUpperCase()} • {qualityPresets[quality as keyof typeof qualityPresets].bitrateVideo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filename">File Name</Label>
                  <Input 
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Enter filename"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select
                      value={format}
                      onValueChange={setFormat}
                    >
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                        <SelectItem value="mov">MOV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select
                      value={resolution}
                      onValueChange={setResolution}
                    >
                      <SelectTrigger id="resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="quality">Quality</Label>
                    <span className="text-xs text-muted-foreground">
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </span>
                  </div>
                  <Select
                    value={quality}
                    onValueChange={setQuality}
                  >
                    <SelectTrigger id="quality">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (1 Mbps)</SelectItem>
                      <SelectItem value="medium">Medium (4 Mbps)</SelectItem>
                      <SelectItem value="high">High (8 Mbps)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground mt-1 space-y-1">
                    <div className="flex justify-between">
                      <span>Video bitrate:</span>
                      <span>{qualityPresets[quality as keyof typeof qualityPresets].bitrateVideo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audio bitrate:</span>
                      <span>{qualityPresets[quality as keyof typeof qualityPresets].bitrateAudio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated size:</span>
                      <span>{qualityPresets[quality as keyof typeof qualityPresets].size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="include-audio" className="cursor-pointer">Include Audio</Label>
                  <Switch
                    id="include-audio"
                    checked={includeAudio}
                    onCheckedChange={setIncludeAudio}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Video Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Duration: {formatTime(duration)}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileVideo className="h-4 w-4 mr-1" />
                    <span>{resolution}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button
              className="w-full"
              size="lg"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Video
            </Button>
          </>
        )}
      </div>
    </div>
  );
}