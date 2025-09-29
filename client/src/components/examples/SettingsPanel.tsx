import { useState } from 'react';
import SettingsPanel, { type MeditationSettings } from '../SettingsPanel';

export default function SettingsPanelExample() {
  const [settings, setSettings] = useState<MeditationSettings>({
    intervalBells: false,
    intervalDuration: 5,
    soundEnabled: true,
    bellSound: 'tibetan',
    volume: 50,
    visualCues: true,
    autoFadeInterface: true,
    fadeDuration: 10
  });

  const handleSettingsChange = (newSettings: MeditationSettings) => {
    setSettings(newSettings);
    console.log('Settings updated:', newSettings);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-thin text-foreground mb-4">Settings</h1>
          <p className="text-muted-foreground">Customize your meditation experience</p>
        </div>
        
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  );
}