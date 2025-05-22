import { EventEmitter } from "../utils/event-emitter";

export interface Chart {
  id: string;
  url: string;
  title: string;
  content: string;
  isLoading: boolean;
  error: string | null;
}

export type ThemeMode = "light" | "dark";

export interface State {
  charts: Chart[];
  theme: ThemeMode;
}

export class AppState extends EventEmitter {
  private state: State = {
    charts: [],
    theme: this.getPreferredTheme(),
  }

  constructor() {
    super();

    // Try to load state from localStorage
    const savedState = localStorage.getItem("dashboardState");

    if (savedState) {
      try {
        const chartsConfig = JSON.parse(savedState);
        console.log("savedState:", chartsConfig);
        for (let index = 0; index < chartsConfig.length; index++) {
          const chart = chartsConfig[index];
          console.log("Parsed chartsConfig:", chart);
          if (!chart.id || !chart.url || !chart.title) {
            console.warn(
              `Invalid chart configuration found in localStorage: ${JSON.stringify(
                chart
              )}`
            );
            
          } else {
            this.addChart(
              chart.id,
              chart.url,
              chart.title
            );
          }
        }
      } catch (e) {
        console.error("Failed to parse saved state:", e);
        
        this.initializeDefaultState();
      }
    } else {
      this.initializeDefaultState();
    }

    // Add default charts if none exist
    if (this.state.charts.length === 0) {
      this.addDefaultCharts();
    }
  }

  private initializeDefaultState(): void {
    this.state = {
      charts: [],
      theme: this.getPreferredTheme(),
    };
  }

  private getPreferredTheme(): ThemeMode {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  private addDefaultCharts(): void {
    console.log("Adding default charts...");
    
    // Add default charts from the repository
    this.addChart(
      "active-addresses",
      "https://charts.checkonchain.com/btconchain/adoption/actaddress_momentum/actaddress_momentum_light.html",
      "Active Addresses"
    );

    this.addChart(
      "sell-side-risk-ratio",
      "https://charts.checkonchain.com/btconchain/realised/sellsideriskratio_all/sellsideriskratio_all_light.html",
      "Sell Side Risk Ratio"
    );

    this.addChart(
      "active-sopr",
      "https://charts.checkonchain.com/btconchain/realised/sopr/sopr_light.html",
      "Spent Out Profit Ratio (SOPR)"
    );

    this.addChart(
      "active-mvrv-all-zscore",
      "https://charts.checkonchain.com/btconchain/unrealised/mvrv_all_zscore/mvrv_all_zscore_light.html",
      "MVRV Ratio Z-Score"
    );
  }

  public getState(): State {
    return { ...this.state };
  }

  public getCharts(): Chart[] {
    return [...this.state.charts];
  }

  public getTheme(): ThemeMode {
    return this.state.theme;
  }

  public toggleTheme(): void {
    this.state.theme = this.state.theme === "light" ? "dark" : "light";
    this.saveState();
    this.emit("themeChanged", this.state.theme);
  }

  public addChart(id: string, url: string, title: string): void {
    // Check if chart with this ID already exists
    if (this.state.charts.some((chart) => chart.id === id)) {
      console.warn(`Chart with ID ${id} already exists`);
      return;
    }

    const newChart: Chart = {
      id,
      url,
      title,
      content: "",
      isLoading: true,
      error: null,
    };

    this.state.charts.push(newChart);
    this.saveState();
    this.emit("chartAdded", newChart);

    // Fetch the chart content
    this.fetchChartContent(id, url);
  }

  public removeChart(id: string): void {
    const chartIndex = this.state.charts.findIndex((chart) => chart.id === id);

    if (chartIndex === -1) {
      console.warn(`Chart with ID ${id} not found`);
      return;
    }

    this.state.charts.splice(chartIndex, 1);
    this.saveState();
    this.emit("chartRemoved", id);
  }

  private async fetchChartContent(id: string, url: string): Promise<void> {
    try {
      // Convert GitHub URL to raw content URL
      const rawUrl = this.convertToRawUrl(url);

      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch chart content: ${response.statusText}`
        );
      }

      const content = (await response.text())
        .replace('"showlegend":true', '"showlegend":false').trim();

      const chartIndex = this.state.charts.findIndex(
        (chart) => chart.id === id
      );

      if (chartIndex !== -1) {
        this.state.charts[chartIndex].content = content;
        this.state.charts[chartIndex].isLoading = false;
        this.saveState();
        this.emit("chartContentLoaded", id);
      }
    } catch (error) {
      console.error(`Error fetching chart content:`, error);

      // Update chart with error
      const chartIndex = this.state.charts.findIndex(
        (chart) => chart.id === id
      );

      if (chartIndex !== -1) {
        this.state.charts[chartIndex].isLoading = false;
        this.state.charts[chartIndex].error =
          error instanceof Error ? error.message : "Unknown error";
        this.saveState();
        this.emit("chartError", { id, error });
      }
    }
  }

  private convertToRawUrl(url: string): string {
    // Convert GitHub URL to raw content URL
    // Example: https://github.com/user/repo/blob/branch/path/to/file.html
    // To: https://raw.githubusercontent.com/user/repo/branch/path/to/file.html
    return url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  }

  private saveState(): void {
    // extract all charts url & title from the state
    const chart = this.state.charts.map(({content, ...chart}) => ({
      ...chart
    }));
    localStorage.setItem('dashboardState', JSON.stringify(chart));
  }
}
