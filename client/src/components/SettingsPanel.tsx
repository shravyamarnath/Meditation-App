import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Bell, Volume2, Eye, Timer, Play } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

export interface MeditationSettings {
  intervalBells: boolean;
  intervalDuration: number; // in minutes
  soundEnabled: boolean;
  bellSound: 'tibetan' | 'temple' | 'nature' | 'silent';
  volume: number;
  visualCues: boolean;
  autoFadeInterface: boolean;
  fadeDuration: number; // in seconds
}

interface SettingsPanelProps {
  settings: MeditationSettings;
  onSettingsChange: (settings: MeditationSettings) => void;
}

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  
  const updateSetting = <K extends keyof MeditationSettings>(
    key: K,
    value: MeditationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
    console.log(`Setting ${key} changed to:`, value);
  };

  const testAudio = async () => {
    setIsTestingAudio(true);
    try {
      await audioManager.testAudio({
        soundEnabled: settings.soundEnabled,
        bellSound: settings.bellSound,
        volume: settings.volume,
        intervalBells: settings.intervalBells,
        intervalDuration: settings.intervalDuration
      });
    } catch (error) {
      console.error('Audio test failed:', error);
    } finally {
      setIsTestingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="h-5 w-5" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="text-sm font-medium">
              Enable Sound
            </Label>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
              data-testid="switch-sound-enabled"
            />
          </div>
          
          {settings.soundEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Bell Sound</Label>
                <Select
                  value={settings.bellSound}
                  onValueChange={(value: 'tibetan' | 'temple' | 'nature' | 'silent') => 
                    updateSetting('bellSound', value)
                  }
                >
                  <SelectTrigger data-testid="select-bell-sound">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tibetan">Tibetan Bowl</SelectItem>
                    <SelectItem value="temple">Temple Bell</SelectItem>
                    <SelectItem value="nature">Nature Chime</SelectItem>
                    <SelectItem value="silent">Silent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Volume</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={[settings.volume]}
                    onValueChange={([value]) => updateSetting('volume', value)}
                    onValueCommit={([value]) => updateSetting('volume', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                    data-testid="slider-volume"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {settings.volume}%
                  </span>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={testAudio}
                    disabled={!settings.soundEnabled || isTestingAudio}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid="button-test-audio"
                  >
                    <Play className="h-4 w-4" />
                    {isTestingAudio ? 'Testing...' : 'Test Sound'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Interval Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Interval Bells
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="interval-bells" className="text-sm font-medium">
              Enable Interval Bells
            </Label>
            <Switch
              id="interval-bells"
              checked={settings.intervalBells}
              onCheckedChange={(checked) => updateSetting('intervalBells', checked)}
              data-testid="switch-interval-bells"
            />
          </div>
          
          {settings.intervalBells && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Interval Duration</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[settings.intervalDuration]}
                  onValueChange={([value]) => updateSetting('intervalDuration', value)}
                  min={1}
                  max={20}
                  step={1}
                  className="flex-1"
                  data-testid="slider-interval-duration"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {settings.intervalDuration}m
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5" />
            Visual Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="visual-cues" className="text-sm font-medium">
              Visual Breathing Cues
            </Label>
            <Switch
              id="visual-cues"
              checked={settings.visualCues}
              onCheckedChange={(checked) => updateSetting('visualCues', checked)}
              data-testid="switch-visual-cues"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-fade" className="text-sm font-medium">
              Auto-fade Interface
            </Label>
            <Switch
              id="auto-fade"
              checked={settings.autoFadeInterface}
              onCheckedChange={(checked) => updateSetting('autoFadeInterface', checked)}
              data-testid="switch-auto-fade"
            />
          </div>
          
          {settings.autoFadeInterface && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Fade Duration</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[settings.fadeDuration]}
                  onValueChange={([value]) => updateSetting('fadeDuration', value)}
                  min={5}
                  max={30}
                  step={5}
                  className="flex-1"
                  data-testid="slider-fade-duration"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {settings.fadeDuration}s
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Timer className="h-5 w-5" />
            Reset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              const defaultSettings: MeditationSettings = {
                intervalBells: false,
                intervalDuration: 5,
                soundEnabled: true,
                bellSound: 'tibetan',
                volume: 50,
                visualCues: true,
                autoFadeInterface: true,
                fadeDuration: 10
              };
              onSettingsChange(defaultSettings);
              console.log('Settings reset to defaults');
            }}
            data-testid="button-reset-settings"
          >
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}