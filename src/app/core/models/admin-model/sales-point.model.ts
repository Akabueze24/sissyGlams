// Library-agnostic chart data shape.
// Deliberately NOT a Chart.js or ngx-charts specific structure —
// both (or any future library) can be fed from this same shape via
// a small adapter inside SalesChartComponent when it's implemented.
export interface SalesDataPoint {
  label: string;
  value: number;
}