'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Settings, Film, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const { toast } = useToast();
  const videoFile = useSelector((state: RootState) => state.video.videoFile);
  const duration = useSelector((state: RootState) => state.video.duration);
  
  const [activeTab, setActiveTab] = useState('settings');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportCompleted, setExportCompleted] = useState(false);
  
  // Export settings
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('medium');
  const [resolution, setResolution] = useState('720p');
  const [filename, setFilename] = useState(videoFile?.name?.split('.')[0] || 'video-export');
  
  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setActiveTab('progress');
    
    // Simulate export process
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
    
    // Close dialog after download starts
    setTimeout(() => {
      onOpenChange(false);
      // Reset state for next export
      setTimeout(() => {
        setExportCompleted(false);
        setActiveTab('settings');
      }, 500);
    }, 1000);
  };
  
  const handleClose = () => {
    if (isExporting) {
      // Show confirmation before closing during export
      if (confirm("Export in progress. Are you sure you want to cancel?")) {
        onOpenChange(false);
        setTimeout(() => {
          setIsExporting(false);
          setExportCompleted(false);
          setActiveTab('settings');
          setExportProgress(0);
        }, 500);
      }
    } else {
      onOpenChange(false);
      setTimeout(() => {
        setExportCompleted(false);
        setActiveTab('settings');
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Video</DialogTitle>
          <DialogDescription>
            Export your video project with custom settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="settings" disabled={isExporting}>Settings</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="export-filename">File Name</Label>
              <Input 
                id="export-filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Format</Label>
                <Select
                  value={format}
                  onValueChange={setFormat}
                >
                  <SelectTrigger id="export-format">
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
                <Label htmlFor="export-resolution">Resolution</Label>
                <Select
                  value={resolution}
                  onValueChange={setResolution}
                >
                  <SelectTrigger id="export-resolution">
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
              <Label htmlFor="export-quality">Quality</Label>
              <Select
                value={quality}
                onValueChange={setQuality}
              >
                <SelectTrigger id="export-quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Faster export, smaller file)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best quality, larger file)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4">
            {exportCompleted ? (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Export Complete!</h3>
                  <p className="text-muted-foreground mt-1">
                    Your video has been successfully processed and is ready to download.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  {isExporting ? (
                    <Film className="h-10 w-10 text-primary animate-pulse" />
                  ) : (
                    <Settings className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {isExporting ? "Exporting Video..." : "Ready to Export"}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {isExporting 
                      ? "Please wait while we process your video." 
                      : "Click the export button below to start processing."}
                  </p>
                </div>
                
                {isExporting && (
                  <div className="w-full space-y-2">
                    <Progress value={exportProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Processing...</span>
                      <span>{Math.round(exportProgress)}%</span>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground bg-muted/30 rounded-md px-3 py-2 w-full">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="font-medium">{resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="font-medium">{quality}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {exportCompleted ? (
            <Button
              className="w-full"
              size="lg"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </Button>
          ) : isExporting ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClose}
            >
              Cancel Export
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="sm:flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="sm:flex-1"
                onClick={handleStartExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Video
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}