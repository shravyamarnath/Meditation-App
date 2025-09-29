import { useState, useEffect } from 'react';
import SettingsPanel, { type MeditationSettings } from '@/components/SettingsPanel';

export default function Settings() {
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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('meditationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        console.log('Loaded settings from localStorage');
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const handleSettingsChange = (newSettings: MeditationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('meditationSettings', JSON.stringify(newSettings));
    console.log('Settings updated and saved:', newSettings);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-thin text-foreground mb-4">Settings</h1>
          <p className="text-muted-foreground text-lg">Customize your meditation experience to suit your preferences</p>
        </div>
        
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
        
        {/* Help text */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Tips</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Interval bells can help maintain focus during longer sessions</p>
              <p>• Visual cues assist with breathing exercises and rhythm</p>
              <p>• Auto-fade interface creates a distraction-free environment</p>
              <p>• Start with moderate volume and adjust based on your environment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}