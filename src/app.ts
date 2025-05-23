import { Dashboard } from "./components/dashboard";
// import { ThemeSwitcher } from "./components/theme-switcher";
import { ChartAdder } from "./components/chart-adder";
import { AppState } from "./state/app-state";

export class App {
  private dashboard: Dashboard;
  // private themeSwitcher: ThemeSwitcher;
  private chartAdder: ChartAdder;
  private state: AppState;

  constructor() {
    this.state = new AppState();
    this.dashboard = new Dashboard(this.state);
    // this.themeSwitcher = new ThemeSwitcher();
    this.chartAdder = new ChartAdder(this.state);
  }

  public initialize(): void {
    const appElement = document.getElementById("app");

    if (!appElement) {
      console.error("App element not found");
      return;
    }

    // build HTML structure
    appElement.innerHTML = `
      <header class="app-header">
        <h1>CheckOnchain Dashboard</h1>
        <span id="theme-switcher-container"></span>
      </header>
      <main class="app-main">
        <span id="chart-adder-container"></span>
        <span id="dashboard-container"></span>
      </main>
      <footer class="app-footer">
        <p>
          This project is not affiliated with CheckOnchain or any other third-party projects.
          It's an open-source project developed by <a href="https://hexaonelabs.com" target="_blank">HexaOne Labs</a> to help users track data from CheckOnchain inside a single dashboard page. 
          All data are fetched from <a href="https://checkonchain.com" target="_blank">CheckOnchain</a> website and are not stored on our servers. We are not responsible for any losses or damages incurred while using this application. 
          Use at your own risk.
        </p>
      </footer>
    `;

    // dynamic composants injection
    // const themeSwitcherContainer = document.getElementById(
    //   "theme-switcher-container"
    // );
    // if (themeSwitcherContainer) {
    //   // Define webcomponent if not already defined
    //   if (!customElements.get('theme-switcher')) {
    //     customElements.define('theme-switcher', ThemeSwitcher);
    //   }
    //   // Create and append the theme switcher
    //   const themeSwitcher = new ThemeSwitcher();
    //   themeSwitcher.state = this.state;
    //   themeSwitcherContainer.appendChild(themeSwitcher);
    // }

    const chartAdderContainer = document.getElementById(
      "chart-adder-container"
    );
    if (chartAdderContainer) {
      chartAdderContainer.appendChild(this.chartAdder.render());
    }

    const dashboardContainer = document.getElementById("dashboard-container");
    if (dashboardContainer) {
      dashboardContainer.appendChild(this.dashboard.render());
    }

    // Initialize components
    this.dashboard.initialize();
    // this.themeSwitcher.initialize();
    this.chartAdder.initialize();
  }
}
