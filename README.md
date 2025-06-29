# EZ Slots - Modern Slot Machine Library

A modern, theme-based, CDN-ready slot machine library designed specifically for FiveM and web applications. Features responsive design, dark mode themes, and comprehensive programmatic control.

## 🎰 Features

- **Modern UI**: Dark, vibrant themes with transparent backgrounds
- **FiveM Ready**: Optimized for FiveM CEF integration
- **Responsive Design**: Scales perfectly to any container size
- **Multiple Themes**: Cartoon, Neon, and Golden themes included
- **CDN Ready**: Drop-in library with zero dependencies
- **Programmatic Control**: Full API for keyboard/controller integration
- **Multiple Instances**: Run multiple slot machines simultaneously
- **Customizable**: Complete control over symbols, themes, and behavior

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Slot Machine</title>
</head>
<body>
    <div id="slot-container" style="width: 100vw; height: 100vh;"></div>
    
    <script src="https://cdn.jsdelivr.net/gh/Botman64/EZSlotsJS@main/Slots.js"></script>
    <script>
        const container = document.getElementById('slot-container');
        
        const slots = Slots.Render(container, {
            reelCount: 5,
            maxBet: 1000,
            minBet: 10,
            betIncrement: 10,
            logoUrl: 'https://example.com/logo.png',
            symbols: {
                cherry: '🍒',
                lemon: '🍋', 
                orange: '🍊',
                seven: '7️⃣',
                diamond: '💎'
            },
            theme: 'cartoon' // or 'neon', 'golden', or custom theme object
        }).SpinPressed((currentBet) => {
            // Return the spin results for each reel
            return [
                ['cherry', 'lemon', 'orange'],  // Reel 1
                ['lemon', 'lemon', 'seven'],    // Reel 2
                ['orange', 'diamond', 'cherry'], // Reel 3
                ['seven', 'cherry', 'lemon'],   // Reel 4
                ['diamond', 'orange', 'seven']  // Reel 5
            ];
        }).SpinFinished((results, betAmount) => {
            // Handle spin completion
            console.log('Spin finished!', results, betAmount);
            // Update player balance, show rewards, etc.
        });
    </script>
</body>
</html>
```

## 📖 API Reference

### Slots.Render(container, options)

Creates a new slot machine instance in the specified container.

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
        symbolId: 'emoji|url'  // Can be emoji, text, or image URL
    },
    theme: 'cartoon'           // Theme name or custom theme object
}
```

**Returns:** Slots instance with chainable methods

### Instance Methods

#### .SpinPressed(callback)
Sets the callback function for when the spin button is pressed or `Slots.Spin()` is called.

```javascript
.SpinPressed((currentBet) => {
    // Your server/game logic here
    // Return array of arrays representing each reel's symbols
    return [
        ['symbol1', 'symbol2', 'symbol3'],  // Reel 1 (top to bottom)
        ['symbol1', 'symbol2', 'symbol3'],  // Reel 2
        // ... more reels
    ];
})
```

#### .SpinFinished(callback)
Sets the callback function for when a spin animation completes.

```javascript
.SpinFinished((results, betAmount) => {
    // Handle spin completion
    // results: the same array returned from SpinPressed
    // betAmount: the current bet amount when spin started
    
    // Example: Check for wins and update balance
    if (isWinningCombination(results)) {
        updatePlayerBalance(calculateWinnings(results, betAmount));
        showWinAnimation();
    }
})
```

### Global Methods

#### Slots.IncreaseBet()
Increases the current bet by the increment amount.

#### Slots.DecreaseBet()
Decreases the current bet by the increment amount.

#### Slots.MaxBet()
Sets the bet to the maximum allowed amount.

#### Slots.SetMoney(amount)
Updates the money/balance display.

```javascript
Slots.SetMoney(50000); // Shows "💰 50,000"
```

#### Slots.Spin()
Programmatically triggers a spin (for keyboard/controller support).

```javascript
// Example: Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':      // Spacebar to spin
            Slots.Spin();
            break;
        case 'ArrowUp':   // Increase bet
            Slots.IncreaseBet();
            break;
        case 'ArrowDown': // Decrease bet
            Slots.DecreaseBet();
            break;
        case 'Enter':     // Max bet
            Slots.MaxBet();
            break;
    }
});
```

#### Slots.Remove()
Removes the slot machine from the DOM and cleans up all references.

## 🎨 Built-in Themes

### Cartoon Theme
```javascript
theme: 'cartoon'
```
Dark purple/blue gradient with pink accents.

### Neon Theme  
```javascript
theme: 'neon'
```
Dark background with bright cyan/magenta neon colors.

### Golden Theme
```javascript
theme: 'golden'
```
Dark background with gold and amber luxury colors.

### Custom Theme
```javascript
theme: {
    '--background': 'linear-gradient(135deg, #your-colors)',
    '--surface-primary': 'rgba(45, 52, 78, 0.95)',
    '--text-primary': '#ffffff',
    '--accent-color': '#ff6b8a',
    // ... see source for all available CSS variables
}
```

## 🎮 UI Button Behavior

The slot machine UI includes several interactive buttons that automatically call the corresponding API methods:

- **Increase Bet (+)**: Calls `Slots.IncreaseBet()`
- **Decrease Bet (-)**: Calls `Slots.DecreaseBet()`  
- **Max Bet**: Calls `Slots.MaxBet()`
- **Spin Button**: Calls `Slots.Spin()` internally, which triggers your `SpinPressed` callback
- **Lobby Button**: Currently decorative, can be customized

## 🎯 FiveM Integration

### Client-Side (HTML/JS)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; padding: 0; background: transparent; }
        #slots { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <div id="slots"></div>
    <script src="slots-cdn.js"></script>
    <script>
        const slots = Slots.Render(document.getElementById('slots'), {
            reelCount: 5,
            maxBet: 1000,
            minBet: 10,
            betIncrement: 10,
            symbols: {
                cherry: 'symbols/cherry.png',
                seven: 'symbols/seven.png',
                diamond: 'symbols/diamond.png'
            },
            theme: 'neon'
        }).SpinPressed((bet) => {
            // Send bet to server
            fetch('https://your-server/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bet: bet })
            }).then(r => r.json()).then(data => {
                return data.results;
            });
        }).SpinFinished((results, bet) => {
            // Handle winnings
            fetch('https://your-server/complete', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results, bet })
            });
        });

        // Keyboard controls for FiveM
        window.addEventListener('message', (event) => {
            if (event.data.type === 'keydown') {
                switch(event.data.key) {
                    case 'space':
                        Slots.Spin();
                        break;
                    case 'arrowUp':
                        Slots.IncreaseBet();
                        break;
                    case 'arrowDown':
                        Slots.DecreaseBet();
                        break;
                }
            }
        });
    </script>
</body>
</html>
```

### Server-Side (Lua)
```lua
-- Register NUI callbacks
RegisterNUICallback('spin', function(data, cb)
    local player = source
    local bet = data.bet
    
    -- Validate bet and player money
    if not CanPlayerAfford(player, bet) then
        cb({ error = "Insufficient funds" })
        return
    end
    
    -- Generate random results
    local results = GenerateSpinResults()
    
    -- Calculate winnings
    local winnings = CalculateWinnings(results, bet)
    
    cb({ results = results, winnings = winnings })
end)

RegisterNUICallback('complete', function(data, cb)
    local player = source
    local winnings = CalculateWinnings(data.results, data.bet)
    
    -- Update player money
    AddPlayerMoney(player, winnings - data.bet)
    
    cb({ success = true })
end)
```

## 📱 Responsive Design

The slot machine automatically adapts to different screen sizes:

- **Desktop**: Full-featured layout with all controls visible
- **Tablet**: Optimized button sizes and spacing
- **Mobile**: Stacked controls layout for better touch interaction

## 🔧 Advanced Usage

### Multiple Instances
```javascript
// Create multiple slot machines
const casino = document.getElementById('casino-floor');

const slots1 = Slots.Render(casino.querySelector('#machine1'), options1);
const slots2 = Slots.Render(casino.querySelector('#machine2'), options2);
const slots3 = Slots.Render(casino.querySelector('#machine3'), options3);

// Each instance operates independently
```

### Custom Symbol Loading
```javascript
// Mix of emojis, text, and images
symbols: {
    cherry: '🍒',                           // Emoji
    seven: '7',                             // Text  
    diamond: 'https://cdn.com/diamond.png', // Image URL
    logo: './assets/logo.png'               // Local image
}
```

### Win Detection Example
```javascript
.SpinFinished((results, bet) => {
    // Check middle row for matches
    const middleRow = results.map(reel => reel[1]);
    
    if (middleRow.every(symbol => symbol === middleRow[0])) {
        const winAmount = bet * getMultiplier(middleRow[0]);
        showWinMessage(`You won $${winAmount}!`);
        updateBalance(winAmount);
    }
})
```

## 🛠 Development

### Building from Source
```bash
# Clone the repository
git clone https://github.com/your-username/ezslots.git
cd ezslots

# Open in VS Code
code .

# Run build task (if MSBuild configured)
# Or serve files with a local server
python -m http.server 8000
```

### File Structure
```
ezslots/
├── web/
│   ├── slots-cdn.js      # Main CDN library
│   ├── slots-demo.html   # Demo page
│   ├── index.html        # Development page
│   ├── script.js         # Development script
│   └── styles.css        # Development styles
└── README.md
```

## 📋 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **FiveM CEF**: Full support

## 🐛 Troubleshooting

### Common Issues

**Slot machine not appearing:**
- Ensure container has explicit width/height
- Check that slots-cdn.js is loaded before calling Slots.Render()

**Spins not working:**
- Verify SpinPressed callback returns an array of arrays
- Each reel array should have exactly 3 symbols
- Symbol names must match those defined in config.symbols

**Styling issues:**
- Container should have `position: relative`
- Avoid conflicting CSS that might override slot styles

### Debug Mode
```javascript
// Enable console logging
const slots = Slots.Render(container, {
    ...options,
    debug: true
}).SpinPressed((bet) => {
    console.log('Spin requested with bet:', bet);
    return results;
}).SpinFinished((results, bet) => {
    console.log('Spin completed:', results, bet);
});
```

## 📄 License

MIT License - feel free to use in your projects.

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests for any improvements.

---

**Made with ❤️ for the FiveM community**
