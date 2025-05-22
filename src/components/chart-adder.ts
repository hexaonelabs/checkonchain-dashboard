import { AppState } from '../state/app-state';

export class ChartAdder {
  private element: HTMLElement;
  private state: AppState;
  
  constructor(state: AppState) {
    this.state = state;
    this.element = document.createElement('div');
    this.element.className = 'chart-adder';
  }
  
  public initialize(): void {
    // No initialization needed for now
  }
  
  public render(): HTMLElement {
    this.element.innerHTML = `
      <form class="add-chart-form">
        <div class="input-container">
          <label for="chart-url">CheckOnchain Chart URL:</label>
          <input type="text" id="chart-url" placeholder="https://charts.checkonchain.com/btconchain/..." required />
        </div>
        <div class="input-container">
          <label for="chart-title">Chart Title:</label>
          <input type="text" id="chart-title" placeholder="Enter a title for the chart" required />
        </div>
        <button type="submit" class="add-chart-button">Add Chart</button>
      </form>
    `;

    const form = this.element.querySelector('form') as HTMLFormElement;
    const urlInput = this.element.querySelector('#chart-url') as HTMLInputElement;
    const titleInput = this.element.querySelector('#chart-title') as HTMLInputElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const url = urlInput.value.trim();
      const title = titleInput.value.trim();

      if (url && title) {
        const id = `chart-${Date.now()}`;
        this.state.addChart(id, url, title);
        form.reset();
      }
    });

    return this.element;
  }
}