import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { ApiService } from '../api.service';
HC_exporting(Highcharts);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  isLoading: boolean = true;
  myData: any[] = [];

  constructor(private http: ApiService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.http.fetchData().subscribe(
      (res: any) => {
        console.log(res);
        this.myData = res;
        this.isLoading = false;
        this.renderChart();
      }
    );
  }

  renderChart() {
    const physicalProgressData = [];
    const financialProgressData = [];

    for (let i = 0; i < this.myData.length; i++) {
      const item = this.myData[i];
      for (let j = 0; j < item.projectDTOs.length; j++) {
        const project = item.projectDTOs[j];
        if (project.physicalProgressCompleted !== 0) {
          physicalProgressData.push({
            name: project.physicalProgressCompleted > 0 ? item.projectTitle : '',
            y: project.physicalProgressCompleted
          });
        }

        if (project.financialProgress !== 0) {
          financialProgressData.push({
            name: item.projectTitle,
            y: project.financialProgress
          });
        }
      }
    }

    console.log("physicalProgressData", physicalProgressData);
    console.log("financialProgressData", financialProgressData);

    this.chartOptions = {
      chart: { type: 'bar', style: { fontFamily: 'Rubik' } },
      title: { text: 'Project Progress Data' },
      xAxis: { type: 'category', title: { text: 'Department' } },
      yAxis: { labels: { format: '{value} %' }, title: { text: 'Progress' } },
      tooltip: { animation: true, pointFormat: '{series.name}: <b>{point.y}</b>', valueSuffix: '%' },
      // credits: { enabled: false },
      legend: {
        // layout: 'vertical',
        // align: 'right',
        // verticalAlign: 'top',
        // x: -40,

        floating: false,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          borderWidth: 0.2,
          dataLabels: {
            enabled: true,
            formatter: (): string => {
              
              return '';
            }
            
          }
        },
        bar: {
          pointPadding: 0.2,
          colorByPoint: true
        }
      },
      series: [
        {
          type: 'column',
          colors: ['#2b908f'],
          colorByPoint: true,
          name: 'Physical Progress',
          data: physicalProgressData,
          showInLegend: true
        },
        {
          type: 'column',
          colors: ['##90ee90'],
          colorByPoint: true,
          name: 'Financial Progress',
          data: financialProgressData,
          showInLegend: true
        }
      ]
    };
  }
}