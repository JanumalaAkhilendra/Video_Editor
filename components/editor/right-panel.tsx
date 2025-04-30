'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TimelinePanel } from './panels/timeline-panel';
import { AudioPanel } from './panels/audio-panel';
import { TextPanel } from './panels/text-panel';
import { ImagePanel } from './panels/image-panel';
import { ExportPanel } from './panels/export-panel';

export function RightPanel() {
  const activePanel = useSelector((state: RootState) => state.ui.activePanel);
  const isRightPanelOpen = useSelector((state: RootState) => state.ui.isRightPanelOpen);
  
  if (!isRightPanelOpen) {
    return null;
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <Tabs value={activePanel} className="flex-1 flex flex-col overflow-hidden">
        <TabsContent value="timeline" className="flex-1 overflow-auto p-0 m-0">
          <TimelinePanel />
        </TabsContent>
        
        <TabsContent value="audio" className="flex-1 overflow-auto p-0 m-0">
          <AudioPanel />
        </TabsContent>
        
        <TabsContent value="text" className="flex-1 overflow-auto p-0 m-0">
          <TextPanel />
        </TabsContent>
        
        <TabsContent value="image" className="flex-1 overflow-auto p-0 m-0">
          <ImagePanel />
        </TabsContent>
        
        <TabsContent value="export" className="flex-1 overflow-auto p-0 m-0">
          <ExportPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}