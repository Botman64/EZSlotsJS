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
 * ]).SpinFinished(() => {
 *   // Handle spin completion - display rewards, update balance, etc.
 *   console.log('Spin finished');
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
            container-type: size;
            min-height: 400px;
            min-width: 320px;
          }

          .${instanceId}-main-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            max-width: 1200px;
            max-height: 800px;
            background: var(--surface-primary);
            border: 1px solid var(--border-primary);
            border-radius: clamp(8px, 2cqh, 24px);
            backdrop-filter: blur(20px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border-glow);
            z-index: 5;
          }

          .${instanceId}-header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            padding: clamp(12px, 3cqh, 32px) clamp(16px, 4cqw, 48px);
            background: var(--surface-secondary);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-primary);
            border-radius: clamp(8px, 2cqh, 24px) clamp(8px, 2cqh, 24px) 0 0;
            z-index: 10;
            position: relative;
            overflow: visible;
            min-height: clamp(60px, 12cqh, 120px);
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
            height: clamp(60px, 12cqh, 140px);
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
            padding: clamp(8px, 1.5cqh, 16px) clamp(12px, 2.5cqw, 24px);
            border-radius: clamp(6px, 1.5cqh, 12px);
            font-weight: 600;
            font-size: clamp(12px, 2.2cqh, 20px);
            box-shadow: 0 4px 12px var(--accent-shadow);
            text-shadow: none;
            white-space: nowrap;
          }

          .${instanceId}-lobby-section {
            grid-column: 3;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          .${instanceId}-lobby-btn {
            padding: clamp(8px, 1.5cqh, 16px) clamp(12px, 2.5cqw, 24px);
            border: 1px solid var(--border-accent);
            border-radius: clamp(6px, 1.5cqh, 12px);
            background: var(--surface-accent);
            color: var(--text-accent);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: clamp(12px, 2.2cqh, 20px);
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px var(--accent-shadow);
            white-space: nowrap;
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
            padding: clamp(12px, 2.5cqh, 24px);
            gap: clamp(12px, 2.5cqh, 24px);
            position: relative;
            z-index: 5;
            min-height: 0;
          }

          .${instanceId}-reels-container {
            flex: 1;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid var(--border-secondary);
            border-radius: clamp(8px, 2cqh, 16px);
            padding: clamp(12px, 3cqh, 32px);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15);
            min-height: 0;
          }

          .${instanceId}-reels {
            display: flex;
            justify-content: center;
            gap: clamp(2px, 0.5cqw, 8px);
            height: auto;
            align-items: center;
            background: rgba(0, 0, 0, 0.4);
            padding: clamp(8px, 1.5cqh, 16px);
            border-radius: clamp(6px, 1.5cqh, 12px);
            position: relative;
          }

          .${instanceId}-reel {
            background: var(--surface-tertiary);
            border: 1px solid var(--border-secondary);
            border-radius: clamp(4px, 1cqh, 8px);
            overflow: hidden;
            position: relative;
            width: clamp(60px, calc(15cqw - 10px), 120px);
            height: calc(clamp(60px, calc(15cqw - 10px), 120px) * 3);
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 var(--border-highlight);
            flex-shrink: 0;
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
            height: clamp(60px, calc(15cqw - 10px), 120px);
            width: clamp(60px, calc(15cqw - 10px), 120px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(24px, calc(8cqw - 5px), 48px);
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
            border-radius: 0 0 clamp(8px, 2cqh, 24px) clamp(8px, 2cqh, 24px);
            padding: clamp(12px, 3cqh, 32px) clamp(16px, 4cqw, 48px);
            backdrop-filter: blur(15px);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            gap: clamp(12px, 3cqw, 32px);
            flex-wrap: wrap;
            min-height: clamp(80px, 16cqh, 140px);
          }

          .${instanceId}-bet-section {
            display: flex;
            gap: clamp(8px, 1.5cqw, 16px);
            align-items: center;
            justify-content: center;
            flex-direction: column;
            min-width: 0;
          }

          .${instanceId}-bet-label {
            color: var(--text-secondary);
            font-size: clamp(10px, 1.4cqh, 16px);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }

          .${instanceId}-bet-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(12px, 2.5cqw, 24px);
          }

          .${instanceId}-bet-display {
            background: var(--surface-tertiary);
            color: var(--text-primary);
            padding: clamp(8px, 1.5cqh, 16px) clamp(12px, 2.2cqw, 20px);
            border-radius: clamp(6px, 1.2cqh, 12px);
            border: 1px solid var(--border-secondary);
            font-weight: 600;
            font-size: clamp(12px, 2cqh, 18px);
            min-width: clamp(80px, 12cqw, 140px);
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            white-space: nowrap;
          }

          .${instanceId}-bet-btn {
            background: var(--accent-gradient);
            color: var(--text-on-accent);
            border: none;
            padding: clamp(8px, 1.2cqh, 14px) clamp(12px, 2cqw, 20px);
            border-radius: clamp(4px, 1cqh, 8px);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: clamp(12px, 1.7cqh, 16px);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px var(--accent-shadow);
            min-width: clamp(32px, 5cqw, 44px);
            height: clamp(32px, 5cqh, 44px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .${instanceId}-bet-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px var(--accent-shadow);
          }

          .${instanceId}-spin-section {
            display: flex;
            align-items: center;
            gap: clamp(8px, 1.8cqw, 20px);
            flex-direction: column;
          }

          .${instanceId}-control-buttons {
            display: flex;
            flex-direction: row;
            gap: clamp(8px, 1.8cqw, 20px);
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
          }

          .${instanceId}-control-btn {
            padding: clamp(8px, 1.5cqh, 16px) clamp(12px, 2.5cqw, 24px);
            border: 1px solid var(--border-accent);
            border-radius: clamp(6px, 1.2cqh, 12px);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: clamp(10px, 1.4cqh, 16px);
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            background: var(--surface-accent);
            color: var(--text-accent);
            backdrop-filter: blur(10px);
            white-space: nowrap;
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
            font-size: clamp(14px, 2.2cqh, 20px);
            font-weight: 600;
            padding: clamp(12px, 2cqh, 20px) clamp(20px, 4cqw, 40px);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: clamp(8px, 1.5cqh, 16px);
            position: relative;
            overflow: hidden;
            transition: all 0.2s ease;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            cursor: pointer;
            min-height: clamp(40px, 6cqh, 56px);
            white-space: nowrap;
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

          @container (max-width: 700px) {
            .${instanceId}-controls {
              flex-direction: column;
              align-items: stretch;
              gap: clamp(8px, 2cqh, 16px);
              text-align: center;
            }

            .${instanceId}-bet-section {
              flex-direction: row;
              align-items: center;
              gap: clamp(8px, 2cqw, 16px);
            }

            .${instanceId}-spin-section {
              flex-direction: row;
              justify-content: center;
            }

            .${instanceId}-header {
              grid-template-columns: 1fr;
              grid-template-rows: auto auto auto;
              gap: clamp(8px, 1.5cqh, 12px);
              text-align: center;
            }

            .${instanceId}-balance-section {
              grid-column: 1;
              grid-row: 1;
              justify-content: center;
            }

            .${instanceId}-logo-section {
              grid-column: 1;
              grid-row: 2;
            }

            .${instanceId}-lobby-section {
              grid-column: 1;
              grid-row: 3;
              justify-content: center;
            }
          }

          @container (max-width: 500px) {
            .${instanceId}-reels {
              gap: clamp(1px, 0.5cqw, 4px);
            }

            .${instanceId}-bet-section {
              flex-direction: column;
              gap: clamp(6px, 1cqh, 10px);
            }

            .${instanceId}-control-buttons {
              flex-direction: column;
              gap: clamp(6px, 1cqh, 10px);
            }

            .${instanceId}-spin-section {
              flex-direction: column;
              gap: clamp(6px, 1cqh, 10px);
            }
          }

          @container (max-height: 500px) {
            .${instanceId}-header {
              padding: clamp(8px, 2cqh, 16px) clamp(12px, 3cqw, 24px);
            }

            .${instanceId}-main-content {
              padding: clamp(8px, 2cqh, 16px);
              gap: clamp(8px, 2cqh, 16px);
            }

            .${instanceId}-controls {
              padding: clamp(8px, 2cqh, 16px) clamp(12px, 3cqw, 24px);
              gap: clamp(8px, 2cqw, 16px);
            }

            .${instanceId}-logo {
              height: clamp(40px, 8cqh, 80px);
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
