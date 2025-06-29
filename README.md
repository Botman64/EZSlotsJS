# EZ Slots - JavaScript Slot Machine Display Library

A lightweight, modern JavaScript library for creating animated slot machine displays. Perfect for adding slot machine visuals to any web application with customizable themes, symbols, and animations.

## 🎰 Features

- **Pure Frontend**: JavaScript-only library for slot machine display and animation
- **Zero Dependencies**: Self-contained library with no external requirements
- **Modern UI**: Beautiful themes with smooth animations
- **Responsive Design**: Adapts to any container size automatically
- **Multiple Themes**: Built-in Cartoon, Neon, and Golden themes
- **Customizable**: Full control over symbols, colors, and appearance
- **Multiple Instances**: Create multiple slot machines on the same page
- **Animation Control**: Programmatic control over spin animations and results

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Slot Machine</title>
</head>
<body>
    <div id="slot-container" style="width: 800px; height: 600px;"></div>
    
    <script src="https://cdn.jsdelivr.net/gh/Botman64/EZSlotsJS@main/Slots.js"></script>
    <script>
        const container = document.getElementById('slot-container');
        
        const slotMachine = new SlotMachine(container, {
            reelCount: 5,
            maxBet: 1000,
            minBet: 10,
            betIncrement: 10,
            logoUrl: 'https://example.com/logo.png',
            symbols: {
                cherry: 'https://example.com/cherry.png',
                lemon: 'https://example.com/lemon.png',
                orange: 'https://example.com/orange.png',
                seven: 'https://example.com/seven.png',
                diamond: 'https://example.com/diamond.png'
            },
            theme: Slots.defaultThemes.cartoon // Use built-in theme object
        }).SpinPressed((currentBet) => {
            // Return the spin results for each reel
            return [
                ['cherry', 'lemon', 'orange'],  // Reel 1 (top, middle, bottom)
                ['lemon', 'seven', 'cherry'],   // Reel 2
                ['orange', 'diamond', 'lemon'], // Reel 3
                ['seven', 'cherry', 'orange'],  // Reel 4
                ['diamond', 'orange', 'seven']  // Reel 5
            ];
        }).SpinFinished((results) => {
            // Handle animation completion
            console.log('Spin animation finished:', results);
        });
    </script>
</body>
</html>
```

## 📖 API Reference

### SlotMachine Constructor

Creates a new slot machine display instance.

```javascript
const slotMachine = new SlotMachine(container, options);
```

**Parameters:**
- `container` (HTMLElement): The parent container element
- `options` (Object): Configuration options

**Options:**
```javascript
{
    reelCount: 5,              // Number of reels (1-10)
    maxBet: 1000,              // Maximum bet amount
    minBet: 10,                // Minimum bet amount
    betIncrement: 10,          // Bet increment/decrement amount
    logoUrl: 'logo.png',       // Optional logo URL
    symbols: {                 // Symbol definitions
        symbolId: 'content'    // Can be emoji, text, or image URL
    },
    theme: SlotMachine.defaultThemes.cartoon  // Theme object
}
```

### Instance Methods

#### .SpinPressed(callback)
Sets the callback function that defines what symbols appear when a spin is triggered.

```javascript
slotMachine.SpinPressed(() => {
    // Return array of arrays representing each reel's symbols
    return [
        ['symbol1', 'symbol2', 'symbol3'],  // Reel 1 (top, middle, bottom)
        ['symbol1', 'symbol2', 'symbol3'],  // Reel 2
        // ... more reels based on reelCount
    ];
});
```

**Returns:** SlotMachine instance (chainable)

#### .SpinFinished(callback)
Sets the callback function for when a spin animation completes.

```javascript
slotMachine.SpinFinished((results) => {
    // Handle animation completion
    // results: the same array returned from SpinPressed
    console.log('Animation finished with results:', results);
});
```

**Returns:** SlotMachine instance (chainable)

#### .MachineLeft(callback)
Sets the callback function for when the "Leave Machine" button is clicked.

```javascript
slotMachine.MachineLeft(() => {
    console.log('User left the machine');
    // Clean up, redirect, etc.
});
```

**Returns:** SlotMachine instance (chainable)

### Instance Properties & Methods

#### .Spin()
Programmatically triggers a spin animation.

#### .Remove()
Removes the slot machine from the DOM and cleans up all references.

## 🎨 Built-in Themes

All themes are objects containing CSS custom properties that define the visual appearance. Access them via `Slots.defaultThemes`.

### Cartoon Theme
```javascript
theme: Slots.defaultThemes.cartoon
```

| Property | Value | Description |
|----------|-------|-------------|
| `--background` | `linear-gradient(135deg, #2a2d3a 0%, #3d4159 50%, #4a5478 100%)` | Main background gradient |
| `--surface-primary` | `rgba(45, 52, 78, 0.95)` | Primary surface color |
| `--surface-secondary` | `rgba(55, 62, 88, 0.9)` | Secondary surface color |
| `--surface-tertiary` | `rgba(65, 72, 98, 0.85)` | Tertiary surface color |
| `--text-primary` | `#f1f3f5` | Primary text color |
| `--text-secondary` | `#c9cdd4` | Secondary text color |
| `--text-accent` | `#ff6b8a` | Accent text color |
| `--accent-color` | `#ff6b8a` | Main accent color (pink) |
| `--accent-gradient` | `linear-gradient(135deg, #ff6b8a, #ff8fa3)` | Accent gradient |
| `--border-primary` | `rgba(241, 243, 245, 0.15)` | Primary border color |
| `--border-accent` | `rgba(255, 107, 138, 0.3)` | Accent border color |

### Neon Theme  
```javascript
theme: Slots.defaultThemes.neon
```

| Property | Value | Description |
|----------|-------|-------------|
| `--background` | `linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)` | Dark background gradient |
| `--surface-primary` | `rgba(18, 18, 28, 0.95)` | Primary surface color |
| `--text-primary` | `#e8f4fd` | Primary text color |
| `--text-accent` | `#00ffff` | Cyan accent text |
| `--accent-color` | `#00ffff` | Main accent color (cyan) |
| `--accent-gradient` | `linear-gradient(135deg, #00ffff, #4dffff)` | Cyan gradient |
| `--border-glow` | `rgba(0, 255, 255, 0.6)` | Glowing border effect |
| `--accent-shadow` | `rgba(0, 255, 255, 0.4)` | Neon glow shadow |

### Golden Theme
```javascript
theme: Slots.defaultThemes.golden
```

| Property | Value | Description |
|----------|-------|-------------|
| `--background` | `linear-gradient(135deg, #1a1612 0%, #2a241e 50%, #3a332b 100%)` | Dark brown background |
| `--surface-primary` | `rgba(35, 30, 25, 0.95)` | Primary surface color |
| `--text-primary` | `#f5f2e8` | Warm text color |
| `--text-accent` | `#ffc107` | Gold accent text |
| `--accent-color` | `#ffc107` | Main accent color (gold) |
| `--accent-gradient` | `linear-gradient(135deg, #ffc107, #ffca2c)` | Gold gradient |
| `--border-accent` | `rgba(255, 193, 7, 0.3)` | Gold border color |

### Custom Theme
```javascript
theme: {
    '--background': 'linear-gradient(135deg, #your-colors)',
    '--surface-primary': 'rgba(45, 52, 78, 0.95)',
    '--text-primary': '#ffffff',
    '--accent-color': '#ff6b8a',
    // ... see Slots.defaultThemes for all available properties
}
```

## 🎮 User Interface

The slot machine includes an interactive interface:

- **Spin Button**: Triggers the spin animation and calls your `SpinPressed` callback
- **Leave Machine Button**: Calls your `MachineLeft` callback and removes the slot machine
- **Logo Area**: Displays your custom logo if provided
- **Balance Display**: Shows "💰 0" by default (decorative only)

## 📱 Responsive Design

The slot machine automatically adapts to different screen sizes and containers:

- **Large Screens**: Full-featured layout with all elements clearly visible
- **Medium Screens**: Optimized spacing and proportions
- **Small Containers**: Compact layout with adjusted element sizes
- **Very Small Containers**: Minimal layout prioritizing the reels

## 🔧 Advanced Usage

### Multiple Instances
```javascript
// Create multiple slot machines on the same page
const machine1 = new SlotMachine(document.getElementById('slot1'), {
    symbols: { cherry: '🍒', lemon: '🍋' },
    theme: SlotMachine.defaultThemes.cartoon
});

const machine2 = new SlotMachine(document.getElementById('slot2'), {
    symbols: { diamond: '💎', star: '⭐' },
    theme: SlotMachine.defaultThemes.neon
});

// Each instance operates independently
```

### Symbol Types
```javascript
symbols: {
    // Emoji symbols
    cherry: '🍒',
    lemon: '🍋',
    
    // Text symbols  
    seven: '7',
    jackpot: 'JP',
    
    // Image URLs
    logo: 'https://example.com/logo.png',
    bonus: './assets/bonus-symbol.png'
}
```

### Animation Control
```javascript
const machine = new SlotMachine(container, options)
    .SpinPressed(() => {
        // Your logic to determine results
        const results = generateRandomResults();
        
        // Show loading or disable UI during spin
        showSpinning(true);
        
        return results;
    })
    .SpinFinished((results) => {
        // Re-enable UI after animation
        showSpinning(false);
        
        // Process results (check for wins, update UI, etc.)
        processResults(results);
    });

// Trigger spins programmatically
machine.Spin();
```

### Integration Example
```javascript
// Example integration with your application
class SlotGameManager {
    constructor() {
        this.machine = new SlotMachine(document.getElementById('game'), {
            symbols: this.getSymbols(),
            theme: SlotMachine.defaultThemes.golden
        })
        .SpinPressed(() => this.handleSpin())
        .SpinFinished((results) => this.handleSpinComplete(results))
        .MachineLeft(() => this.handleExit());
    }
    
    getSymbols() {
        return {
            cherry: '🍒',
            bell: '🔔', 
            seven: '7️⃣',
            diamond: '💎'
        };
    }
    
    handleSpin() {
        // Your game logic here
        return this.generateResults();
    }
    
    generateResults() {
        // Generate random or predetermined results
        const symbols = Object.keys(this.machine.config.symbols);
        return Array.from({ length: 5 }, () => 
            Array.from({ length: 3 }, () => 
                symbols[Math.floor(Math.random() * symbols.length)]
            )
        );
    }
    
    handleSpinComplete(results) {
        // Check for winning combinations
        if (this.isWinning(results)) {
            this.showWinEffect();
        }
    }
    
    handleExit() {
        // Clean up and return to main menu
        this.cleanup();
    }
}

## 🛠 Development

### Installation & Setup
```bash
# Clone or download the repository
git clone https://github.com/your-username/EZSlotsJS.git

# Include in your project
<script src="path/to/Slots.js"></script>

# Or use directly
<script src="Slots.js"></script>
```

### File Structure
```
EZSlotsJS/
├── Slots.js          # Main library file
├── README.md         # Documentation
└── LICENSE           # License file
```

### Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+ 
- **Safari**: 14+
- **Edge**: 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+

## 🐛 Troubleshooting

### Common Issues

**Slot machine not appearing:**
- Ensure the container element has explicit width and height
- Verify `Slots.js` is loaded before creating the SlotMachine instance
- Check browser console for JavaScript errors

**Animations not working:**
- Ensure your `SpinPressed` callback returns an array of arrays
- Each reel array must contain exactly 3 symbol names
- Symbol names must match keys defined in the `symbols` option

**Styling conflicts:**
- The library uses CSS custom properties - avoid overriding slot-specific styles
- Container should allow the slot machine to size itself properly
- Avoid CSS that might conflict with internal animations

### Debug Tips
```javascript
// Check if results format is correct
const machine = new SlotMachine(container, options)
    .SpinPressed(() => {
        const results = [
            ['cherry', 'lemon', 'orange'],
            ['lemon', 'seven', 'cherry'], 
            ['orange', 'diamond', 'lemon'],
            ['seven', 'cherry', 'orange'],
            ['diamond', 'orange', 'seven']
        ];
        console.log('Spin results:', results);
        return results;
    })
    .SpinFinished((results) => {
        console.log('Animation completed with:', results);
    });
```

## ⚡ Performance Notes

- The library is optimized for smooth 60fps animations
- Multiple instances can run simultaneously without performance issues
- CSS animations are GPU-accelerated where supported
- Memory usage is minimal with automatic cleanup on removal

## 📄 License

Apache 2.0 License - See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! We encourage contributions in several areas:

### Code Improvements
- **Bug fixes**: Help us identify and fix issues
- **Performance optimizations**: Improve animation smoothness and memory usage
- **Feature enhancements**: Add new functionality while maintaining simplicity
- **Code quality**: Refactoring, documentation improvements, and best practices

### Theme Contributions
- **New themes**: Create additional visual themes (e.g., retro, futuristic, minimalist)
- **Theme improvements**: Enhance existing themes with better colors, gradients, or effects
- **Accessibility**: Improve themes for better contrast and readability

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-theme`)
3. Make your changes
4. Test thoroughly across different browsers and screen sizes
5. Submit a pull request with a clear description

For theme contributions, please include:
- Screenshots or demos of your theme
- Clear theme name and description
- Proper CSS custom property definitions
- Cross-browser compatibility testing

### Issues & Feature Requests
Feel free to open issues for:
- Bug reports with reproduction steps
- Feature requests with use case descriptions
- Theme suggestions
- Performance concerns

---

**EZ Slots JS - Simple slot machine display library for web applications**
