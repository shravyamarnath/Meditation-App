import { useState } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { type Preset } from '@/components/MeditationPreset';

// Pages
import Presets from '@/pages/Presets';
import Timer from '@/pages/Timer';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/not-found';

function Router() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [, setLocation] = useLocation();

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    console.log('Preset selected:', preset.name);
  };

  const handleStartSession = () => {
    if (selectedPreset) {
      setLocation('/timer');
      console.log('Starting session with:', selectedPreset.name);
    }
  };

  const handleBackToPresets = () => {
    setLocation('/');
  };

  return (
    <Switch>
      <Route path="/" component={() => (
        <Presets 
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          onStartSession={handleStartSession}
        />
      )} />
      <Route path="/timer" component={() => (
        <Timer 
          selectedPreset={selectedPreset}
          onBackToPresets={handleBackToPresets}
        />
      )} />
      <Route path="/progress" component={Progress} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Custom sidebar width for meditation app
  const style = {
    '--sidebar-width': '18rem',       // 288px for good content width
    '--sidebar-width-icon': '4rem',   // default icon width
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="text-xs text-muted-foreground">
                  Find your center
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
