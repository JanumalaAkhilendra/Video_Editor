'use client';

import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setActivePanel, toggleRightPanel, toggleTimeline } from '@/lib/redux/features/uiSlice';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Layers, Music, PanelRight, Text, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
  const dispatch = useDispatch();
  const videoUrl = useSelector((state: RootState) => state.video.videoUrl);
  const activePanel = useSelector((state: RootState) => state.ui.activePanel);
  const isRightPanelOpen = useSelector((state: RootState) => state.ui.isRightPanelOpen);
  const showTimeline = useSelector((state: RootState) => state.ui.showTimeline);

  const handleTabChange = (value: string) => {
    dispatch(setActivePanel(value as any));
    if (!isRightPanelOpen) {
      dispatch(toggleRightPanel());
    }
  };

  return (
    <div className="flex items-center px-4 h-14 border-b border-border bg-card">
      <div className="flex items-center">
        <h1 className="font-semibold text-xl mr-6 text-primary">VideoForge</h1>
      </div>

      {videoUrl && (
        <>
          <Tabs value={activePanel} onValueChange={handleTabChange} className="mx-auto">
            <TabsList>
              <TabsTrigger value="timeline" className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-1">
                <Text className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTimeline())}
              className={cn(showTimeline ? "text-primary" : "text-muted-foreground")}
            >
              <Layers className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleRightPanel())}
              className={cn(isRightPanelOpen ? "text-primary" : "text-muted-foreground")}
            >
              <PanelRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="ml-2"
              onClick={onExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </>
      )}
    </div>
  );
}