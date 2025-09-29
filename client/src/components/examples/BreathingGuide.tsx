import { useState } from 'react';
import BreathingGuide from '../BreathingGuide';
import { Button } from '@/components/ui/button';

export default function BreathingGuideExample() {
  const [isActive, setIsActive] = useState(false);
  const [pattern, setPattern] = useState<'box' | '4-7-8' | 'equal'>('box');

  const handleCycleComplete = () => {
    console.log('Breathing cycle completed');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <div className="flex gap-2 mb-8 justify-center">
          <Button
            variant={pattern === 'box' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPattern('box')}
            data-testid="button-pattern-box"
          >
            Box
          </Button>
          <Button
            variant={pattern === '4-7-8' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPattern('4-7-8')}
            data-testid="button-pattern-478"
          >
            4-7-8
          </Button>
          <Button
            variant={pattern === 'equal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPattern('equal')}
            data-testid="button-pattern-equal"
          >
            Equal
          </Button>
        </div>
        
        <BreathingGuide
          pattern={pattern}
          isActive={isActive}
          onCycleComplete={handleCycleComplete}
        />
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setIsActive(!isActive)}
            data-testid="button-toggle-breathing"
          >
            {isActive ? 'Stop' : 'Start'} Breathing
          </Button>
        </div>
      </div>
    </div>
  );
}