import { scaleConfig } from '../config/scale';
import { logError } from '../config/monitoring';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]>;
  private thresholds: Map<string, number>;

  private constructor() {
    this.metrics = new Map();
    this.thresholds = new Map();
    this.setupDefaultThresholds();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupDefaultThresholds() {
    this.thresholds.set('rpc', 1000); // 1 second
    this.thresholds.set('db', 500);   // 500ms
    this.thresholds.set('render', 16); // 16ms (60fps)
  }

  trackOperation(category: string, name: string, duration: number) {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }

    const metrics = this.metrics.get(category)!;
    metrics.push(duration);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }

    // Check if duration exceeds threshold
    const threshold = this.thresholds.get(category);
    if (threshold && duration > threshold) {
      logError(new Error(`Performance threshold exceeded: ${category} - ${name}`), {
        category,
        name,
        duration,
        threshold
      });
    }
  }

  getAverageMetric(category: string): number {
    const metrics = this.metrics.get(category);
    if (!metrics || metrics.length === 0) return 0;

    const sum = metrics.reduce((a, b) => a + b, 0);
    return sum / metrics.length;
  }

  clearMetrics() {
    this.metrics.clear();
  }

  setThreshold(category: string, threshold: number) {
    this.thresholds.set(category, threshold);
  }
}