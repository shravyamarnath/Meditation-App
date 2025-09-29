# Zen Meditation Timer

A minimalist meditation app designed for distraction-free practice. Features guided breathing exercises, meditation timers, and comprehensive audio feedback with a zen-inspired design that fades to black during active sessions.

## ✨ Features

### 🧘 Meditation Presets
- **Box Breathing** - 4-4-4-4 breathing pattern for focus and calm
- **4-7-8 Breathing** - Relaxation technique for stress relief  
- **Body Scan** - Progressive mindfulness meditation
- **Loving-Kindness** - Compassion and self-love practice

### ⏱️ Reliable Timer System
- Web Worker-based timer that continues running in background browser tabs
- Precise timing using Date.now() for accuracy across all devices
- Auto-fade interface during sessions for distraction-free meditation

### 🔔 Comprehensive Audio System
- **Session Bells** - Start and end chimes with multiple sound options
- **Interval Chimes** - Optional periodic reminders during meditation
- **Breathing Cues** - Subtle audio guides for breathing exercises
- **Sound Options** - Tibetan Bowl, Temple Bell, Nature Chime, or Silent mode
- **Volume Control** - Fine-tuned audio levels from 0-100%

### 🎨 Zen Minimalist Design
- Clean, distraction-free interface
- Light/dark mode support
- Responsive design for desktop and mobile
- Interface automatically fades during active sessions
- Carefully crafted color palette using earth tones

### 📊 Progress Tracking
- Anonymous session tracking (no account required)
- Total meditation time and session counts
- Streak tracking for consistency
- Favorite technique identification
- Weekly meditation statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/zen-meditation-timer.git
cd zen-meditation-timer
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **In-memory storage** for development (easily extensible)
- **RESTful API** design
- **Zod** for runtime type validation

### Audio System
- **Web Audio API** for synthesized meditation bells
- **Web Workers** for background timer reliability
- **Custom audio manager** with envelope shaping and harmonic generation

## 📱 Usage

1. **Select a Preset** - Choose from breathing exercises or meditation techniques
2. **Configure Settings** - Adjust audio preferences, volume, and interval bells
3. **Start Practice** - Click "Start Practice" to begin your session
4. **Meditate** - The interface will fade to minimize distractions
5. **Complete** - Session ends with completion chimes and progress tracking

## ⚙️ Configuration

### Audio Settings
- Enable/disable sound feedback
- Choose from 4 different bell sounds
- Adjust volume levels
- Configure interval bell timing
- Test audio with preview button

### Visual Settings  
- Toggle breathing visual cues
- Enable/disable auto-fade interface
- Adjust fade duration timing

## 🏗️ Project Structure

```
zen-meditation-timer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and managers
│   │   └── styles/         # Global styles and themes
├── server/                 # Express backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data persistence layer
│   └── index.ts           # Server entry point
├── shared/                # Shared TypeScript types
└── package.json
```

## 🎯 Key Features Explained

### Background Timer Reliability
The app uses Web Workers to ensure meditation timers continue running even when:
- Browser tab is in the background
- Computer goes to sleep (on most devices)
- User switches to other applications

### Audio System Architecture
- Synthesized bell sounds using oscillators and envelope shaping
- Master volume control with per-sound mixing
- Automatic audio context initialization on user interaction
- Graceful degradation when audio is disabled

### Privacy-First Design
- No user accounts or personal data collection
- Anonymous session tracking using local storage
- All meditation data stays on your device
- Optional data export for personal backup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Inspired by traditional meditation practices and zen philosophy
- Audio frequencies based on traditional Tibetan and temple bell tunings
- Design principles follow minimalist meditation app best practices

---

*Find peace within. Start your meditation journey today.* 🧘‍♀️
