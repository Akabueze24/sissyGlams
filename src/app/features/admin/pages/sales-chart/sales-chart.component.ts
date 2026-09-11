import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { SalesDataPoint } from '../../../../core/models/admin-model/sales-point.model';

Chart.register(...registerables);

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent implements AfterViewInit, OnChanges {
  @Input() data: SalesDataPoint[] = [];

  @ViewChild('salesChart')
  salesChart!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    console.log('Sales data:', this.data);
    console.log('Canvas:', this.salesChart.nativeElement);

    const configuration: ChartConfiguration<'line'> = {
      type: 'line',

      data: {
        labels: this.data.map((point) => point.label),

        datasets: [
          {
            label: 'Sales',
            data: this.data.map((point) => point.value),

            borderColor: '#e8558c',
            backgroundColor: 'rgba(232, 85, 140, 0.12)',

            pointBackgroundColor: '#e8558c',
            pointBorderColor: '#ffffff',

            pointRadius: 4,
            pointHoverRadius: 6,

            tension: 0.4,
            fill: true,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true,
          },

          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#333333',
            bodyColor: '#555555',
            borderColor: '#e8558c',
            borderWidth: 1,

            padding: 12,

            callbacks: {
              title: (items) => {
                return items[0].label;
              },

              label: (context) => {
                const value = context.parsed.y;

                return `Sales: $${value?.toLocaleString()}`;
              },
            },
          },
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              callback: (value) => `$${Number(value).toLocaleString()}`,
            },
          },
        },
      },
    };

    this.chart = new Chart(this.salesChart.nativeElement, configuration);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.updateChart();
    }
  }


  private updateChart(): void {
  this.chart.data.labels = this.data.map(point => point.label);

  this.chart.data.datasets[0].data = this.data.map(point => point.value);

  this.chart.update();
}
}
