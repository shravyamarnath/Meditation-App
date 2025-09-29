// Audio manager for meditation sounds and cues
export type BellSound = 'tibetan' | 'temple' | 'nature' | 'silent';

export interface AudioSettings {
  soundEnabled: boolean;
  bellSound: BellSound;
  volume: number; // 0-100
  intervalBells: boolean;
  intervalDuration: number; // minutes
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;

  // Audio frequencies for different bell types (in Hz)
  private readonly bellFrequencies = {
    tibetan: [220, 440, 880], // Low, mid, high harmonics
    temple: [330, 660, 1320],
    nature: [174, 528, 963], // Solfeggio frequencies
    silent: []
  };

  private async initializeAudio(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context (modern browsers)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  private async ensureAudioContext(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initializeAudio();
    }

    // Resume audio context if suspended (required by many browsers)
    if (this.audioContext?.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
        return false;
      }
    }

    return this.audioContext?.state === 'running';
  }

  private createBellTone(
    frequency: number, 
    duration: number, 
    fadeIn: number = 0.1, 
    fadeOut: number = 0.5,
    volume: number = 1
  ): void {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();
    const soundGain = this.audioContext.createGain();
    
    // Set up oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Create envelope for natural bell decay
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
    envelope.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + fadeIn);
    envelope.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    // Set volume for this specific sound
    soundGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    
    // Connect nodes: oscillator -> envelope -> soundGain -> masterGain -> destination
    oscillator.connect(envelope);
    envelope.connect(soundGain);
    soundGain.connect(this.gainNode);
    
    // Play and cleanup
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    
    // Clean up nodes after sound completes
    setTimeout(() => {
      try {
        oscillator.disconnect();
        envelope.disconnect();
        soundGain.disconnect();
      } catch (e) {
        // Ignore disconnect errors if already disconnected
      }
    }, (duration + 0.1) * 1000);
  }

  private playBellSound(bellType: BellSound, volume: number): void {
    if (bellType === 'silent') return;

    const frequencies = this.bellFrequencies[bellType];
    if (!frequencies.length) return;

    // Set master volume (0-1 range)
    const normalizedVolume = volume / 100;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(normalizedVolume, this.audioContext!.currentTime);
    }

    // Play harmonics with slight delays for richer sound
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        // Each harmonic gets progressively quieter
        const harmonicVolume = 1 / (index + 1);
        this.createBellTone(freq, 2 + index * 0.5, 0.05, 1.5, harmonicVolume);
      }, index * 50);
    });
  }

  // Public methods for different meditation events
  async playSessionStartBell(settings: AudioSettings): Promise<void> {
    if (!settings.soundEnabled) return;
    
    const audioReady = await this.ensureAudioContext();
    if (!audioReady) return;

    // Play a gentle start chime
    this.playBellSound(settings.bellSound, settings.volume * 0.8);
  }

  async playSessionEndBell(settings: AudioSettings): Promise<void> {
    if (!settings.soundEnabled) return;
    
    const audioReady = await this.ensureAudioContext();
    if (!audioReady) return;

    // Play a completion chime sequence
    this.playBellSound(settings.bellSound, settings.volume);
    
    // Add a second chime after a delay for completion
    setTimeout(() => {
      this.playBellSound(settings.bellSound, settings.volume * 0.7);
    }, 800);
  }

  async playIntervalBell(settings: AudioSettings): Promise<void> {
    if (!settings.soundEnabled || !settings.intervalBells) return;
    
    const audioReady = await this.ensureAudioContext();
    if (!audioReady) return;

    // Play a subtle interval reminder
    this.playBellSound(settings.bellSound, settings.volume * 0.6);
  }

  async playBreathingCue(
    settings: AudioSettings, 
    type: 'inhale' | 'hold' | 'exhale',
    intensity: number = 0.3
  ): Promise<void> {
    if (!settings.soundEnabled) return;
    
    const audioReady = await this.ensureAudioContext();
    if (!audioReady) return;

    if (!this.audioContext || !this.gainNode) return;

    // Set volume for breathing cues (very subtle)
    this.gainNode.gain.setValueAtTime(
      (settings.volume * intensity) / 100, 
      this.audioContext.currentTime
    );

    // Different tones for different breathing phases
    const frequencies = {
      inhale: 220,   // Lower tone for inhale
      hold: 330,     // Mid tone for hold
      exhale: 174    // Even lower for exhale
    };

    this.createBellTone(frequencies[type], 0.5, 0.1, 0.3);
  }

  // Test audio functionality
  async testAudio(settings: AudioSettings): Promise<boolean> {
    try {
      const audioReady = await this.ensureAudioContext();
      if (!audioReady) return false;

      this.playBellSound(settings.bellSound, settings.volume * 0.5);
      return true;
    } catch (error) {
      console.error('Audio test failed:', error);
      return false;
    }
  }

  // Cleanup
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();