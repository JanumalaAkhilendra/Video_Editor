'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Film } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLoading, setVideoFile } from '@/lib/redux/features/videoSlice';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export function UploadZone() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a valid video file.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Error",
        description: "The selected file is not a video. Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload progress
    setIsUploading(true);
    dispatch(setLoading(true));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          setIsUploading(false);
          dispatch(setVideoFile(file));
          dispatch(setLoading(false));
          toast({
            title: "Success",
            description: "Video uploaded successfully!",
          });
        }, 500);
      }
      setUploadProgress(progress);
    }, 200);
  }, [dispatch, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="flex items-center justify-center w-full h-full p-6">
      <div className="w-full max-w-xl">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30 hover:bg-accent/30"
          } ${isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              {isUploading ? (
                <Film className="h-10 w-10 text-primary animate-pulse" />
              ) : (
                <Upload className="h-10 w-10 text-primary" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium">
                {isUploading ? "Uploading video..." : "Upload your video"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isDragActive
                  ? "Drop your video here"
                  : isUploading
                  ? "Please wait while we process your video"
                  : "Drag and drop your video here, or click to browse"}
              </p>
            </div>

            {isUploading ? (
              <div className="w-full mt-4 space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
              </div>
            ) : (
              <Button variant="outline" className="mt-4">
                Select Video
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <h4 className="font-medium">Supported formats</h4>
          <p className="text-sm text-muted-foreground mt-1">
            MP4, MOV, AVI, WEBM (Max size: 1GB)
          </p>
        </div>
      </div>
    </div>
  );
}