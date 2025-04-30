'use client';

import { Header } from '@/components/editor/header';
import { Timeline } from '@/components/editor/timeline';
import { VideoPreview } from '@/components/editor/video-preview';
import { RightPanel } from '@/components/editor/right-panel';
import { UploadZone } from '@/components/editor/upload-zone';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { ExportDialog } from '@/components/editor/export-dialog';
import { useState } from 'react';

export function Editor() {
  const videoUrl = useSelector((state: RootState) => state.video.videoUrl);
  const showTimeline = useSelector((state: RootState) => state.ui.showTimeline);
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Header onExport={() => setShowExportDialog(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {!videoUrl ? (
            <UploadZone />
          ) : (
            <>
              <VideoPreview />
              {showTimeline && <Timeline />}
            </>
          )}
        </div>
        
        {/* Right panel */}
        {videoUrl && <RightPanel />}
      </div>

      <ExportDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog} 
      />
    </div>
  );
}