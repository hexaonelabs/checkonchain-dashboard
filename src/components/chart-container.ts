import { AppState, Chart } from "../state/app-state";

export class ChartContainer {
  private element: HTMLElement;
  private state: AppState;
  private chart: Chart;

  constructor(chart: Chart, state: AppState) {
    this.chart = chart;
    this.state = state;
    this.element = document.createElement("div");
    this.element.className = "chart-container";
    this.element.dataset.id = chart.id;
  }

  public getId(): string {
    return this.chart.id;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public update(chart: Chart): void {
    this.chart = chart;
    this.render();
  }

  public render(): HTMLElement {
    // Clear previous content
    this.element.innerHTML = `
    <div class="chart-header">
      <h3 class="chart-title">${this.chart.title}</h3>
      <button class="chart-close" title="Remove chart">&times;</button>
    </div>
    <div class="chart-content"></div>
  `;

    // Manage button close event
    const closeButton = this.element.querySelector(
      ".chart-close"
    ) as HTMLButtonElement;
    closeButton.addEventListener("click", () => {
      this.state.removeChart(this.chart.id);
    });

    // Manage chart content
    const content = this.element.querySelector(".chart-content") as HTMLElement;
    if (this.chart.isLoading) {
      content.innerHTML = `
      <div class="chart-loader">
        <div class="spinner"></div>
        <p>Loading chart...</p>
      </div>
    `;
    } else if (this.chart.error) {
      content.innerHTML = `
      <div class="chart-error">
        <span class="error-icon">!</span>
        <p>Failed to load chart: ${this.chart.error}</p>
        <button class="retry-btn">Retry</button>
      </div>
    `;
    const retryButton = content.querySelector(
      ".retry-btn"
    ) as HTMLButtonElement;
    retryButton.addEventListener("click", () => {
      // TODO: Implement retry logic
      console.log("Retry loading chart:", this.chart.id);
    });
    } else {
      this.renderChartContent(content);
    }
    return this.element;
  }

  private renderChartContent(container: HTMLElement): void {
    // For security, we'll extract just the chart parts from the HTML
    // This is a simple implementation - a more robust solution would use a proper HTML parser

    try {
      // Create a temporary element to parse the HTML
      const tempElement = document.createElement("div");
      tempElement.innerHTML = this.chart.content;
      // Find the chart element - this will depend on the actual structure of the HTML
      // For this example, we'll assume the chart is in a <div> with a specific class or id
      // const chartElement = tempElement.querySelector('script[type="text/javascript"]');
      const chartDivContent = tempElement.querySelector(
        "div.plotly-graph-div"
      )!;
      const chartJS = tempElement.querySelector("div.plotly-graph-div")
        ?.nextElementSibling!;

      // if (chartElement) {
      //   // Extract the chart script
      const chartScript = document.createElement("script");
      chartScript.type = "text/javascript";
      chartScript.textContent = chartJS.textContent;

      // Create a container for the chart
      const chartContainer = document.createElement("div");
      chartContainer.className = "chart-visualization";
      chartContainer.id = `chart-${this.chart.id}`;
      chartContainer.innerHTML = chartDivContent.outerHTML;

      // Append the chart container and script to the main container
      container.appendChild(chartContainer);
      container.appendChild(chartScript);
    } catch (error) {
      console.error("Error rendering chart content:", error);
      const errorMessage = document.createElement("p");
      errorMessage.className = "chart-render-error";
      errorMessage.textContent = "Error rendering chart content";
      container.appendChild(errorMessage);
    }
  }
}
