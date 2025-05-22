type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: Record<string, EventCallback[]> = {};
  
  public on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
  }
  
  public off(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      return;
    }
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
  
  public emit(event: string, ...args: any[]): void {
    if (!this.events[event]) {
      return;
    }
    
    this.events[event].forEach(callback => callback(...args));
  }
}