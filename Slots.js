/**
 * Slots CDN Library
 * A modern, theme-based slot machine library for web applications
 *
 * Usage:
 * Slots.Render({
 *   reelCount: 5,
 *   maxBet: 100,
 *   minBet: 1,
 *   betIncrement: 1,
 *   logoUrl: 'https://logo.com',
 *   symbols: {
 *     symbolId: 'imageUrl' // 1:1 ratio
 *   },
 *   theme: {
 *     '--background': 'linear-gradient(135deg, #2a2d3a 0%, #3d4159 50%, #4a5478 100%)',
 *     // ...etc
 *   }
 * }).SpinPressed(() => [
 *   ['row1Item', 'row2Item', 'row3Item'], // column 1 results
 *   ['row1Item', 'row2Item', 'row3Item']  // column 2 results
 * ]).SpinFinished((results, betAmount) => {
 *   // Handle spin completion - display rewards, update balance, etc.
 *   console.log('Spin finished with results:', results, 'bet:', betAmount);
 * });
 */

(function (global) {
  'use strict';

  const Slots = {
    config: null,
    isSpinning: false,
    currentBet: 1000,
    allSymbols: [],
    spinCallback: null,
    spinFinishedCallback: null,
    container: null,

    defaultThemes: {
      cartoon: {
        '--background': 'linear-gradient(135deg, #2a2d3a 0%, #3d4159 50%, #4a5478 100%)',
        '--surface-primary': 'rgba(45, 52, 78, 0.95)',
        '--surface-secondary': 'rgba(55, 62, 88, 0.9)',
        '--surface-tertiary': 'rgba(65, 72, 98, 0.85)',
        '--surface-accent': 'rgba(255, 107, 107, 0.12)',
        '--text-primary': '#f1f3f5',
        '--text-secondary': '#c9cdd4',
        '--text-accent': '#ff6b8a',
        '--text-on-accent': '#1a1d23',
        '--accent-color': '#ff6b8a',
        '--accent-light': '#ff8fa3',
        '--accent-dark': '#e74c71',
        '--accent-gradient': 'linear-gradient(135deg, #ff6b8a, #ff8fa3)',
        '--accent-shadow': 'rgba(255, 107, 138, 0.25)',
        '--border-primary': 'rgba(241, 243, 245, 0.15)',
        '--border-secondary': 'rgba(241, 243, 245, 0.08)',
        '--border-accent': 'rgba(255, 107, 138, 0.3)',
        '--border-glow': 'rgba(255, 107, 138, 0.2)',
        '--border-highlight': 'rgba(241, 243, 245, 0.15)',
        '--symbol-gradient': 'linear-gradient(145deg, rgba(75, 82, 108, 0.8), rgba(65, 72, 98, 0.9))',
        '--symbol-gradient-alt': 'linear-gradient(145deg, rgba(85, 92, 118, 0.8), rgba(75, 82, 108, 0.9))',
        '--symbol-gradient-highlight': 'linear-gradient(145deg, rgba(95, 102, 128, 0.9), rgba(85, 92, 118, 0.95))',
      },
      neon: {
        '--background': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        '--surface-primary': 'rgba(18, 18, 28, 0.95)',
        '--surface-secondary': 'rgba(28, 28, 38, 0.9)',
        '--surface-tertiary': 'rgba(38, 38, 48, 0.85)',
        '--surface-accent': 'rgba(0, 255, 255, 0.08)',
        '--text-primary': '#e8f4fd',
        '--text-secondary': '#b8c5d1',
        '--text-accent': '#00ffff',
        '--text-on-accent': '#0a0a0f',
        '--accent-color': '#00ffff',
        '--accent-light': '#4dffff',
        '--accent-dark': '#00cccc',
        '--accent-gradient': 'linear-gradient(135deg, #00ffff, #4dffff)',
        '--accent-shadow': 'rgba(0, 255, 255, 0.4)',
        '--border-primary': 'rgba(0, 255, 255, 0.2)',
        '--border-secondary': 'rgba(0, 255, 255, 0.1)',
        '--border-accent': 'rgba(0, 255, 255, 0.5)',
        '--border-glow': 'rgba(0, 255, 255, 0.6)',
        '--border-highlight': 'rgba(0, 255, 255, 0.3)',
        '--symbol-gradient': 'linear-gradient(145deg, rgba(28, 28, 38, 0.8), rgba(18, 18, 28, 0.9))',
        '--symbol-gradient-alt': 'linear-gradient(145deg, rgba(38, 38, 48, 0.8), rgba(28, 28, 38, 0.9))',
        '--symbol-gradient-highlight': 'linear-gradient(145deg, rgba(48, 48, 58, 0.9), rgba(38, 38, 48, 0.95))',
      },
      golden: {
        '--background': 'linear-gradient(135deg, #1a1612 0%, #2a241e 50%, #3a332b 100%)',
        '--surface-primary': 'rgba(35, 30, 25, 0.95)',
        '--surface-secondary': 'rgba(45, 40, 35, 0.9)',
        '--surface-tertiary': 'rgba(55, 50, 45, 0.85)',
        '--surface-accent': 'rgba(255, 193, 7, 0.1)',
        '--text-primary': '#f5f2e8',
        '--text-secondary': '#d4c5a9',
        '--text-accent': '#ffc107',
        '--text-on-accent': '#1a1612',
        '--accent-color': '#ffc107',
        '--accent-light': '#ffca2c',
        '--accent-dark': '#e0a800',
        '--accent-gradient': 'linear-gradient(135deg, #ffc107, #ffca2c)',
        '--accent-shadow': 'rgba(255, 193, 7, 0.3)',
        '--border-primary': 'rgba(245, 242, 232, 0.12)',
        '--border-secondary': 'rgba(245, 242, 232, 0.08)',
        '--border-accent': 'rgba(255, 193, 7, 0.3)',
        '--border-glow': 'rgba(255, 193, 7, 0.25)',
        '--border-highlight': 'rgba(245, 242, 232, 0.15)',
        '--symbol-gradient': 'linear-gradient(145deg, rgba(75, 70, 65, 0.8), rgba(55, 50, 45, 0.9))',
        '--symbol-gradient-alt': 'linear-gradient(145deg, rgba(85, 80, 75, 0.8), rgba(65, 60, 55, 0.9))',
        '--symbol-gradient-highlight': 'linear-gradient(145deg, rgba(95, 90, 85, 0.9), rgba(75, 70, 65, 0.95))',
      }
    },

    defaultSymbols: {
      'apple': '🍎',
      'cherry': '🍒',
      'lemon': '🍋',
      'seven': '7️⃣',
      'bell': '🔔',
      'star': '⭐',
      'diamond': '💎',
      'coin': '🪙'
    },

    /**
     * Render the slot machine
     * @param {HTMLElement|string} parentContainer - Parent container element or selector
     * @param {Object} options - Configuration options
     * @returns {Object} - API object with SpinPressed method
     */
    Render: function (parentContainer, options = {}) {
      if (typeof parentContainer !== 'string' && !(parentContainer instanceof HTMLElement)) throw new Error('First parameter must be a valid DOM element or CSS selector');
      this.container = (typeof parentContainer === 'string') ? document.querySelector(parentContainer) : parentContainer;

      if (!this.container) throw new Error('Parent container not found');

      this.config = {
        reelCount: options.reelCount || 5,
        maxBet: options.maxBet || 100,
        minBet: options.minBet || 1,
        betIncrement: options.betIncrement || 1,
        logoUrl: options.logoUrl || '',
        symbols: options.symbols || this.defaultSymbols,
        theme: options.theme || this.defaultThemes.cartoon
      };

      this.currentBet = this.config.minBet;
      this.allSymbols = Object.keys(this.config.symbols);
      this._createHTML();
      this._applyTheme();
      this._generateReels();
      this._initializeReels();
      this._bindEvents();

      return {
        SpinPressed: (callback) => {
          this.spinCallback = callback;
          return this;
        },
        SpinFinished: (callback) => {
          this.spinFinishedCallback = callback;
          return this;
        }
      };
    },

    /**
     * Increase the bet amount
     */
    IncreaseBet: function () {
      if (this.currentBet < this.config.maxBet) {
        this.currentBet = Math.min(this.currentBet + this.config.betIncrement, this.config.maxBet);
        this._updateBetDisplay();
      }
    },

    /**
     * Decrease the bet amount
     */
    DecreaseBet: function () {
      if (this.currentBet > this.config.minBet) {
        this.currentBet = Math.max(this.currentBet - this.config.betIncrement, this.config.minBet);
        this._updateBetDisplay();
      }
    },

    /**
     * Set bet to maximum
     */
    MaxBet: function () {
      this.currentBet = this.config.maxBet;
      this._updateBetDisplay();
    },

    /**
     * Programmatically trigger a spin
     * This allows external control without screen interaction
     */
    Spin: function () {
      if (this.spinCallback && !this.isSpinning) {
        const results = this.spinCallback();
        if (results && Array.isArray(results)) this._spin(results);
      }
    },

    /**
     * Set the money/balance display
     * @param {number} amount - The amount to display
     */
    SetMoney: function (amount) {
      const balanceEl = this.container?.querySelector(`#${this.instanceId}-balance`);
      if (balanceEl) balanceEl.textContent = `💰 ${amount.toLocaleString()}`;
    },

    /**
     * Remove the slot machine from the DOM
     */
    Remove: function () {
      if (!this.container) return;
      this.container.innerHTML = '';
      this.container = null;
      this.config = null;
      this.spinCallback = null;
      this.spinFinishedCallback = null;
      this.instanceId = null;
    },
    _spin: function (results) {
      if (this.isSpinning || !results) return;

      this.isSpinning = true;
      const spinBtn = this.container.querySelector(`#${this.instanceId}-spin-btn`);
      if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.classList.add(`${this.instanceId}-spinning`);
      }

      const reels = this.container.querySelectorAll(`.${this.instanceId}-reel`);

      reels.forEach((reel, reelIndex) => {
        const strip = reel.querySelector(`.${this.instanceId}-reel-strip`);
        const finalSymbols = results[reelIndex] || results[0];
        reel.classList.add('spinning');

        const currentSymbols = [];
        const currentElements = strip.querySelectorAll(`.${this.instanceId}-symbol`);
        Array.from(currentElements).slice(-3).forEach(el => {
          const img = el.querySelector('img');
          currentSymbols.push(`<div class="${this.instanceId}-symbol">${img ? img.outerHTML : el.innerHTML}</div>`);
        });

        strip.innerHTML = '';
        currentSymbols.forEach(symbolHtml => strip.insertAdjacentHTML('beforeend', symbolHtml));

        const totalSpinSymbols = 20;
        for (let i = 0; i < totalSpinSymbols; i++) {
          const randomSymbol = this.allSymbols[Math.floor(Math.random() * this.allSymbols.length)];
          strip.insertAdjacentHTML('beforeend', this._getSymbolHtml(randomSymbol, `${this.instanceId}-symbol spinning-symbol`));
        }

        finalSymbols.forEach(symbolName => strip.insertAdjacentHTML('beforeend', this._getSymbolHtml(symbolName, `${this.instanceId}-symbol final-symbol`)));

        strip.offsetHeight;
        const symbolHeight = strip.querySelector(`.${this.instanceId}-symbol`)?.offsetHeight || 120;
        const totalSymbols = 3 + totalSpinSymbols + 3;
        const finalPosition = -((totalSymbols - 3) * symbolHeight);

        strip.style.transform = 'translateY(0px)';
        strip.style.transition = 'none';

        setTimeout(() => {
          const duration = 2 + reelIndex * 0.2;
          strip.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
          strip.style.transform = `translateY(${finalPosition}px)`;

          setTimeout(() => {
            reel.classList.remove('spinning');
            strip.style.transform = `translateY(${finalPosition}px)`;
            strip.style.transition = 'none';
          }, duration * 1000 + 100);

          if (reelIndex === reels.length - 1) {
            setTimeout(() => {
              this.isSpinning = false;
              if (spinBtn) {
                spinBtn.disabled = false;
                spinBtn.classList.remove(`${this.instanceId}-spinning`);
              }
              this._checkForWins(results);
              if (this.spinFinishedCallback) this.spinFinishedCallback();
            }, duration * 1000 + 500);
          }
        }, 100 + reelIndex * 50);
      });
    },
    _createHTML: function () {
      const instanceId = 'slots-' + Math.random().toString(36).substr(2, 9);

      const html = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          .${instanceId}-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            background: transparent;
          }

          .${instanceId}-main-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            background: var(--surface-primary);
            border: 1px solid var(--border-primary);
            border-radius: min(24px, 2vh);
            backdrop-filter: blur(20px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border-glow);
            z-index: 5;
          }

          .${instanceId}-header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            padding: min(24px, 3vh) min(32px, 4vw);
            background: var(--surface-secondary);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-primary);
            border-radius: min(23px, 2vh) min(23px, 2vh) 0 0;
            z-index: 10;
            position: relative;
            overflow: visible;
          }

          .${instanceId}-logo-section {
            grid-column: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 15;
          }

          .${instanceId}-logo {
            height: min(140px, 15vh);
            width: auto;
            position: relative;
            z-index: 15;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            transition: transform 0.3s ease;
          }

          .${instanceId}-logo:hover {
            transform: scale(1.05);
          }

          .${instanceId}-balance-section {
            grid-column: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .${instanceId}-balance {
            background: var(--accent-gradient);
            color: var(--text-on-accent);
            padding: min(12px, 1.5vh) min(20px, 2.5vw);
            border-radius: min(12px, 1.5vh);
            font-weight: 600;
            font-size: min(18px, 2.2vh);
            box-shadow: 0 4px 12px var(--accent-shadow);
            text-shadow: none;
          }

          .${instanceId}-lobby-section {
            grid-column: 3;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          .${instanceId}-lobby-btn {
            padding: min(12px, 1.5vh) min(20px, 2.5vw);
            border: 1px solid var(--border-accent);
            border-radius: min(12px, 1.5vh);
            background: var(--surface-accent);
            color: var(--text-accent);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: min(18px, 2.2vh);
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px var(--accent-shadow);
          }

          .${instanceId}-lobby-btn:hover {
            background: var(--accent-color);
            color: var(--text-on-accent);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px var(--accent-shadow);
          }

          .${instanceId}-main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: min(20px, 2.5vh);
            gap: min(20px, 2.5vh);
            position: relative;
            z-index: 5;
          }

          .${instanceId}-reels-container {
            flex: 1;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid var(--border-secondary);
            border-radius: min(16px, 2vh);
            padding: min(24px, 3vh);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15);
          }

          .${instanceId}-reels {
            display: flex;
            justify-content: center;
            gap: min(2px, 0.2vw);
            height: auto;
            align-items: center;
            background: rgba(0, 0, 0, 0.4);
            padding: min(12px, 1.5vh);
            border-radius: min(12px, 1.5vh);
            position: relative;
          }

          .${instanceId}-reel {
            background: var(--surface-tertiary);
            border: 1px solid var(--border-secondary);
            border-radius: min(8px, 1vh);
            overflow: hidden;
            position: relative;
            width: min(calc(18vh), calc(15vw));
            height: calc(min(calc(18vh), calc(15vw)) * 3);
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 var(--border-highlight);
          }

          .${instanceId}-reel:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 0;
            right: -1px;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent 0%, var(--border-primary) 50%, transparent 100%);
            z-index: 1;
          }

          .${instanceId}-reel-strip {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            transition: transform 0.1s ease-out;
          }

          .${instanceId}-symbol {
            height: min(calc(18vh), calc(15vw));
            width: min(calc(18vh), calc(15vw));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: min(calc(8vh), calc(6vw));
            border-bottom: 1px solid var(--border-secondary);
            background: var(--symbol-gradient);
            position: relative;
            flex-shrink: 0;
          }

          .${instanceId}-symbol img {
            width: 80%;
            height: 80%;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }

          .${instanceId}-symbol:nth-child(odd) {
            background: var(--symbol-gradient-alt);
          }

          .${instanceId}-symbol:nth-child(2) {
            background: var(--symbol-gradient-highlight);
            border-top: 2px solid var(--accent-color);
            border-bottom: 2px solid var(--accent-color);
            box-shadow: 0 0 20px var(--accent-shadow);
            position: relative;
            z-index: 2;
          }

          .${instanceId}-controls {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            background: var(--surface-secondary);
            border-top: 1px solid var(--border-primary);
            border-radius: 0 0 min(23px, 2vh) min(23px, 2vh);
            padding: min(24px, 3vh) min(32px, 4vw);
            backdrop-filter: blur(15px);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            gap: min(24px, 3vw);
          }

          .${instanceId}-bet-section {
            display: flex;
            gap: min(10px, 1.2vw);
            align-items: center;
            justify-content: center;
          }

          .${instanceId}-bet-label {
            color: var(--text-secondary);
            font-size: min(14px, 1.7vh);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .${instanceId}-bet-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: min(20px, 2.5vw);
          }

          .${instanceId}-bet-display {
            background: var(--surface-tertiary);
            color: var(--text-primary);
            padding: min(12px, 1.5vh) min(18px, 2.2vw);
            border-radius: min(10px, 1.2vh);
            border: 1px solid var(--border-secondary);
            font-weight: 600;
            font-size: min(16px, 2vh);
            min-width: min(120px, 15vw);
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .${instanceId}-bet-btn {
            background: var(--accent-gradient);
            color: var(--text-on-accent);
            border: none;
            padding: min(10px, 1.2vh) min(16px, 2vw);
            border-radius: min(8px, 1vh);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: min(14px, 1.7vh);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px var(--accent-shadow);
          }

          .${instanceId}-bet-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px var(--accent-shadow);
          }

          .${instanceId}-spin-section {
            display: flex;
            align-items: center;
            gap: min(15px, 1.8vw);
          }

          .${instanceId}-control-buttons {
            display: flex;
            flex-direction: row;
            gap: min(15px, 1.8vw);
            align-items: center;
          }

          .${instanceId}-control-btn {
            padding: min(12px, 1.5vh) min(20px, 2.5vw);
            border: 1px solid var(--border-accent);
            border-radius: min(10px, 1.2vh);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: min(14px, 1.7vh);
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            background: var(--surface-accent);
            color: var(--text-accent);
            backdrop-filter: blur(10px);
          }

          .${instanceId}-control-btn:hover {
            background: var(--accent-color);
            color: var(--text-on-accent);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px var(--accent-shadow);
          }

          .${instanceId}-spin-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            font-size: min(18px, 2.2vh);
            font-weight: 600;
            padding: min(16px, 2vh) min(32px, 4vw);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: min(12px, 1.5vh);
            position: relative;
            overflow: hidden;
            transition: all 0.2s ease;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            cursor: pointer;
          }

          .${instanceId}-spin-btn:disabled {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            border-color: #6b7280;
            cursor: not-allowed;
            opacity: 0.7;
            box-shadow: none;
          }

          .${instanceId}-spinning {
            animation: ${instanceId}-spin-glow 0.5s ease-in-out infinite alternate;
          }

          @keyframes ${instanceId}-spin-glow {
            from { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); }
            to { box-shadow: 0 8px 35px rgba(16, 185, 129, 0.6); }
          }

          .${instanceId}-win-line {
            position: absolute;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
            animation: ${instanceId}-win-pulse 1s ease-in-out infinite;
            z-index: 3;
            box-shadow: 0 0 15px var(--accent-color);
            border-radius: 2px;
          }

          @keyframes ${instanceId}-win-pulse {
            0%, 100% {
              opacity: 0.5;
              transform: scaleY(1);
            }
            50% {
              opacity: 1;
              transform: scaleY(1.5);
            }
          }

          @container (max-width: 900px) {
            .${instanceId}-header {
              padding: min(15px, 2vh) min(20px, 3vw);
              grid-template-columns: 1fr auto 1fr;
            }

            .${instanceId}-logo {
              height: min(100px, 12vh);
            }

            .${instanceId}-balance, .${instanceId}-lobby-btn {
              font-size: min(16px, 2vh);
              padding: min(10px, 1.3vh) min(16px, 2vw);
            }

            .${instanceId}-controls {
              flex-direction: column;
              align-items: stretch;
              gap: min(15px, 2vh);
              padding: min(15px, 2vh) min(20px, 3vw);
              text-align: center;
            }

            .${instanceId}-reels {
              gap: min(8px, 1vw);
            }
          }

          @container (max-width: 600px) {
            .${instanceId}-main-container {
              border-width: 1px;
            }

            .${instanceId}-reels {
              gap: min(6px, 1vw);
            }

            .${instanceId}-header {
              padding: min(10px, 1.5vh) min(15px, 2.5vw);
            }

            .${instanceId}-controls {
              padding: min(10px, 1.5vh) min(15px, 2.5vw);
            }

            .${instanceId}-logo {
              height: min(80px, 10vh);
            }

            .${instanceId}-balance, .${instanceId}-lobby-btn {
              font-size: min(14px, 1.8vh);
              padding: min(8px, 1vh) min(12px, 1.8vw);
            }
          }
        </style>

        <div class="${instanceId}-container">
          <div class="${instanceId}-main-container">
            <div class="${instanceId}-header">
              <div class="${instanceId}-balance-section">
                <div class="${instanceId}-balance" id="${instanceId}-balance">💰 0</div>
              </div>
              <div class="${instanceId}-logo-section">
                ${this.config.logoUrl ? `<img class="${instanceId}-logo" src="${this.config.logoUrl}" alt="Logo">` : ''}
              </div>
              <div class="${instanceId}-lobby-section">
                <button class="${instanceId}-lobby-btn" onclick="Slots.Remove()">Leave Machine</button>
              </div>
            </div>

            <div class="${instanceId}-main-content">
              <div class="${instanceId}-reels-container">
                <div class="${instanceId}-reels" id="${instanceId}-reels-container"></div>
              </div>

              <div class="${instanceId}-controls">
                <div class="${instanceId}-bet-section">
                  <div class="${instanceId}-bet-label">Current Bet</div>
                  <div class="${instanceId}-bet-controls">
                    <button class="${instanceId}-bet-btn" onclick="Slots.DecreaseBet()">−</button>
                    <div class="${instanceId}-bet-display" id="${instanceId}-bet-amount">${this.currentBet}</div>
                    <button class="${instanceId}-bet-btn" onclick="Slots.IncreaseBet()">+</button>
                  </div>
                </div>

                <div class="${instanceId}-spin-section">
                  <div class="${instanceId}-control-buttons">
                    <button class="${instanceId}-control-btn" onclick="Slots.MaxBet()">Max Bet</button>
                  </div>
                  <button class="${instanceId}-control-btn ${instanceId}-spin-btn" id="${instanceId}-spin-btn">SPIN</button>
                </div>

                <div class="${instanceId}-bet-section">
                  <div class="${instanceId}-bet-label">Max Bet</div>
                  <div class="${instanceId}-bet-display">${this.config.maxBet.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.instanceId = instanceId;
      this.container.innerHTML = html;
    },
    _applyTheme: function () {
      const theme = this.config.theme;
      Object.entries(theme).forEach(([property, value]) => document.documentElement.style.setProperty(property, value));
    },
    _generateReels: function () {
      const container = this.container.querySelector(`#${this.instanceId}-reels-container`);
      container.innerHTML = '';

      for (let i = 0; i < this.config.reelCount; i++) {
        const reelHtml = `<div class="${this.instanceId}-reel" data-reel="${i}"><div class="${this.instanceId}-reel-strip"></div></div>`;
        container.insertAdjacentHTML('beforeend', reelHtml);
      }
    },
    _initializeReels: function () {
      const reels = this.container.querySelectorAll(`.${this.instanceId}-reel`);
      reels.forEach(reel => {
        const strip = reel.querySelector(`.${this.instanceId}-reel-strip`);
        strip.innerHTML = '';

        for (let i = 0; i < 3; i++) {
          const randomSymbol = this.allSymbols[Math.floor(Math.random() * this.allSymbols.length)];
          strip.insertAdjacentHTML('beforeend', this._getSymbolHtml(randomSymbol));
        }
      });
    },
    _getSymbolHtml: function (symbolName, className = `${this.instanceId}-symbol`) {
      const symbolValue = this.config.symbols[symbolName];
      if (typeof symbolValue === 'string' && (symbolValue.startsWith('http') || symbolValue.includes('.'))) return `<div class="${className}"><img src="${symbolValue}" alt="${symbolName}" /></div>`;
      return `<div class="${className}">${symbolValue}</div>`;
    },
    _bindEvents: function () {
      const spinBtn = this.container.querySelector(`#${this.instanceId}-spin-btn`);
      if (!spinBtn) return;
      spinBtn.addEventListener('click', () => {
        if (this.spinCallback && !this.isSpinning) {
          const results = this.spinCallback();
          if (results && Array.isArray(results)) this._spin(results);
        }
      });
    },
    _updateBetDisplay: function () {
      const betDisplay = this.container?.querySelector(`#${this.instanceId}-bet-amount`);
      if (betDisplay) betDisplay.textContent = this.currentBet.toLocaleString();
    },
    _checkForWins: function (results) {
      const middleRow = results.map(reel => reel[1]);
      if (middleRow.every(symbol => symbol === middleRow[0])) this._showWinAnimation();
    },
    _showWinAnimation: function () {
      const reelsContainer = this.container.querySelector(`.${this.instanceId}-reels-container`);
      const winLine = document.createElement('div');
      winLine.className = `${this.instanceId}-win-line`;
      winLine.style.top = '50%';
      reelsContainer.appendChild(winLine);

      setTimeout(() => {
        if (winLine.parentNode) winLine.parentNode.removeChild(winLine);
      }, 4000);
    }
  };

  // Expose to global scope
  global.Slots = Slots;

})(typeof window !== 'undefined' ? window : this);
