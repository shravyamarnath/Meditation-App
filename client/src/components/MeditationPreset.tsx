import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Heart, Scan, Clock } from 'lucide-react';

export interface Preset {
  id: string;
  name: string;
  description: string;
  type: 'breathing' | 'meditation';
  duration: number; // in minutes
  technique?: 'box' | '4-7-8' | 'equal' | 'body-scan' | 'loving-kindness' | 'mindfulness';
  icon: React.ReactNode;
  benefits: string[];
}

interface MeditationPresetProps {
  preset: Preset;
  onSelect: (preset: Preset) => void;
  isSelected?: boolean;
}

export default function MeditationPreset({ preset, onSelect, isSelected }: MeditationPresetProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover-elevate ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(preset)}
      data-testid={`card-preset-${preset.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              {preset.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{preset.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {preset.duration} min
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {preset.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed">
          {preset.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Benefits</div>
            <div className="flex flex-wrap gap-1">
              {preset.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            variant={isSelected ? 'default' : 'outline'}
            data-testid={`button-select-${preset.id}`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Preset data
export const presets: Preset[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Equal 4-count breathing pattern used by military and first responders for stress relief and focus.',
    type: 'breathing',
    duration: 10,
    technique: 'box',
    icon: <Wind className="h-5 w-5" />,
    benefits: ['Stress Relief', 'Focus', 'Calm']
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Dr. Andrew Weil\'s "natural tranquilizer" technique for anxiety and sleep improvement.',
    type: 'breathing',
    duration: 8,
    technique: '4-7-8',
    icon: <Wind className="h-5 w-5" />,
    benefits: ['Sleep', 'Anxiety Relief', 'Relaxation']
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Progressive awareness meditation moving through each part of your body systematically.',
    type: 'meditation',
    duration: 20,
    technique: 'body-scan',
    icon: <Scan className="h-5 w-5" />,
    benefits: ['Body Awareness', 'Relaxation', 'Stress Relief']
  },
  {
    id: 'loving-kindness',
    name: 'Loving-Kindness',
    description: 'Cultivate compassion and positive emotions toward yourself and others.',
    type: 'meditation',
    duration: 15,
    technique: 'loving-kindness',
    icon: <Heart className="h-5 w-5" />,
    benefits: ['Compassion', 'Positivity', 'Relationships']
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Present moment awareness meditation focusing on breath and observing thoughts.',
    type: 'meditation',
    duration: 15,
    technique: 'mindfulness',
    icon: <Clock className="h-5 w-5" />,
    benefits: ['Awareness', 'Focus', 'Emotional Regulation']
  }
];