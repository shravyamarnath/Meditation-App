import { useState } from 'react';
import MeditationPreset, { presets, type Preset } from '@/components/MeditationPreset';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface PresetsProps {
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset) => void;
  onStartSession: () => void;
}

export default function Presets({ selectedPreset, onSelectPreset, onStartSession }: PresetsProps) {
  const [filter, setFilter] = useState<'all' | 'breathing' | 'meditation'>('all');

  const filteredPresets = presets.filter(preset => 
    filter === 'all' || preset.type === filter
  );

  const handlePresetSelect = (preset: Preset) => {
    onSelectPreset(preset);
    console.log('Selected preset:', preset.name);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-thin text-foreground mb-4">Choose Your Practice Today</h1>
          <p className="text-muted-foreground text-lg">Select a meditation or breathing technique to begin your journey</p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            data-testid="filter-all"
          >
            All
          </Button>
          <Button
            variant={filter === 'breathing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('breathing')}
            data-testid="filter-breathing"
          >
            Breathing
          </Button>
          <Button
            variant={filter === 'meditation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('meditation')}
            data-testid="filter-meditation"
          >
            Meditation
          </Button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPresets.map((preset) => (
            <MeditationPreset
              key={preset.id}
              preset={preset}
              onSelect={handlePresetSelect}
              isSelected={selectedPreset?.id === preset.id}
            />
          ))}
        </div>

        {/* Selected preset actions */}
        {selectedPreset && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-primary">
                  {selectedPreset.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">{selectedPreset.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {selectedPreset.duration} min
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedPreset.type}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{selectedPreset.description}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedPreset.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
              
              <Button 
                size="lg"
                onClick={onStartSession}
                data-testid="button-start-session"
                className="px-8"
              >
                Begin Practice
              </Button>
            </div>
          </div>
        )}

        {/* Quick start suggestions */}
        {!selectedPreset && (
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-medium text-foreground mb-4">New to meditation?</h3>
            <p className="text-muted-foreground mb-6">
              Start with <strong>Box Breathing</strong> for focus, or try <strong>Mindfulness</strong> for present moment awareness.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Start with 5-10 minutes</Badge>
              <Badge variant="secondary">Find a quiet space</Badge>
              <Badge variant="secondary">Sit comfortably</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}