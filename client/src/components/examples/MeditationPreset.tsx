import { useState } from 'react';
import MeditationPreset, { presets, type Preset } from '../MeditationPreset';

export default function MeditationPresetExample() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const handleSelect = (preset: Preset) => {
    console.log('Selected preset:', preset.name);
    setSelectedPreset(preset);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-thin text-foreground mb-4">Choose Your Practice</h1>
          <p className="text-muted-foreground">Select a meditation or breathing technique to begin</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <MeditationPreset
              key={preset.id}
              preset={preset}
              onSelect={handleSelect}
              isSelected={selectedPreset?.id === preset.id}
            />
          ))}
        </div>
        
        {selectedPreset && (
          <div className="mt-8 p-4 bg-card rounded-lg border text-center">
            <p className="text-sm text-muted-foreground">
              Selected: <span className="text-foreground font-medium">{selectedPreset.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}