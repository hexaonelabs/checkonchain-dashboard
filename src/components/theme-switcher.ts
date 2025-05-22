import { AppState, ThemeMode } from '../state/app-state';

export class ThemeSwitcher extends HTMLElement {
  private _state?: AppState;

  set state(state: AppState) {
    this._state = state;
    // Si déjà attaché, on peut re-render
    if (this.isConnected) this.render();
  }

  get state(): AppState | undefined {
    return this._state;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.state!.on('themeChanged', (theme: ThemeMode) => {
      this.updateToggle(theme);
    });
  }

  private updateToggle(theme: ThemeMode) {
    const input = this.shadowRoot?.querySelector('#theme-toggle') as HTMLInputElement;
    if (input) input.checked = theme === 'dark';
  }

  private render() {
    const currentTheme = this.state?.getTheme();
    this.shadowRoot!.innerHTML = `
      <style>
        /* Ajoutez ici le CSS du switcher */
      </style>
      <label class="theme-toggle" for="theme-toggle">
        <input type="checkbox" id="theme-toggle" ${currentTheme === 'dark' ? 'checked' : ''}>
        <span class="slider"></span>
        <span class="icon sun-icon">☀️</span>
        <span class="icon moon-icon">🌙</span>
      </label>
    `;
    const input = this.shadowRoot!.querySelector('#theme-toggle') as HTMLInputElement;
    input.addEventListener('change', () => {
      this.state?.toggleTheme();
    });
  }
}
