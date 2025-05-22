import { AppState, Chart } from '../state/app-state';
import { ChartContainer } from './chart-container';

export class Dashboard {
  private element: HTMLElement;
  private state: AppState;
  private chartContainers: Map<string, ChartContainer> = new Map();
  
  constructor(state: AppState) {
    this.state = state;
    this.element = document.createElement('div');
    this.element.className = 'dashboard';
  }
  
  public initialize(): void {
    // Listen for state changes
    this.state.on('chartAdded', (chart: Chart) => this.addChartContainer(chart));
    this.state.on('chartRemoved', (id: string) => this.removeChartContainer(id));
    this.state.on('chartContentLoaded', (id: string) => this.updateChartContainer(id));
    this.state.on('chartError', ({ id }: { id: string }) => this.updateChartContainer(id));
    this.state.on('themeChanged', () => this.updateAllCharts());
    
    // Create initial chart containers
    this.state.getCharts().forEach(chart => {
      this.addChartContainer(chart);
    });
  }
  
  private addChartContainer(chart: Chart): void {
    const container = new ChartContainer(chart, this.state);
    this.chartContainers.set(chart.id, container);
    this.element.appendChild(container.render());
    
    // Add animation class for smooth appearance
    setTimeout(() => {
      container.getElement().classList.add('visible');
    }, 10);
  }
  
  private removeChartContainer(id: string): void {
    const container = this.chartContainers.get(id);
    
    if (container) {
      // Add animation class for smooth removal
      container.getElement().classList.remove('visible');
      
      // Remove after animation completes
      setTimeout(() => {
        container.getElement().remove();
        this.chartContainers.delete(id);
      }, 300);
    }
  }
  
  private updateChartContainer(id: string): void {
    const container = this.chartContainers.get(id);
    const chart = this.state.getCharts().find(c => c.id === id);
    
    if (container && chart) {
      container.update(chart);
    }
  }
  
  private updateAllCharts(): void {
    this.chartContainers.forEach(container => {
      const chart = this.state.getCharts().find(c => c.id === container.getId());
      
      if (chart) {
        container.update(chart);
      }
    });
  }
  
  public render(): HTMLElement {
    return this.element;
  }
}