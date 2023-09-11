import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-eot-chart',
  templateUrl: './eot-chart.component.html',
  styleUrls: ['./eot-chart.component.css']
})
export class EotChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  isLoading: boolean = true;
  myData: any[] = [];
  HasEot:any="HasEot";
  departmentName = ""
  constructor(private http: ApiService) {}

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
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  renderChart() {
    const dataPoints = this.myData.flatMap((item: { projectAbstractDTOs: any[]; departmentName: any; projectDTOs:any }) =>
    item.projectAbstractDTOs.map(project => ({
      name: item.projectDTOs[0].delayedDays >0.1? item.departmentName:'',
      y: item.projectDTOs[0].delayedDays,
      abc: project.hasEOT
    }))
  );
  const filteredDataPoints = dataPoints.filter(point => point.y !== 0&&point.name !== '');

  console.log(filteredDataPoints);

    console.log(dataPoints);

    this.chartOptions = {
      chart: { type: 'container', style: { fontFamily: 'Rubik' } },
      title: { text: 'EOt vs department chart' },
      xAxis: { type: 'category', title: { text: 'Department' } },
      yAxis: { labels: { format: '{value} Days' }, title: { text: 'project delayedDays ' } },
      tooltip: {
        animation: true,
        pointFormat: '{series.name}: <b>{point.y}</b> <br> HasEot: {point.abc}',
        valueSuffix: ' Days'
      },
      credits: { enabled: false },
      plotOptions: {
        series: {
          cursor: 'pointer',
          borderWidth: 0.2,
          dataLabels: { enabled: false },
          point: {
            events: {
              click: function () {
                const tableContainer = document.getElementById('tableContainer');
                if (tableContainer) {
                  tableContainer.style.display = 'block';
                 
                  // Generate and populate the table content based on projectDetails
                  let tableContent = `
                 
                    <table>
                      <tr><th>Department Name</th><th>Sanctioned Cost</th><th>Has EOT</th></tr>
                  `;
  
                  // Loop through dataPoints and add rows for each item
                  for (const point of dataPoints) {
                    if (typeof point !== 'undefined' && point !== null) {
                      tableContent += `
                        <tr><td>${point.name}</td><td>${point.y} days</td><td>${point.abc}</td></tr>
                      `;
                    }
                  }
                  
                  
                  
                  
                  
                  
  
                  tableContent += `</table>`;
                  tableContainer.innerHTML = tableContent;
                }
              }
            }
          }
        },
        bar: {
          pointPadding: -0.2,
          colorByPoint: true
        }
      },
      series: [
        {
          type: 'column',
          colors: [
            '#8085e9',
            '#f15c80',
            '#2b908f',
            '#90be6d',
            '#577590',
            '#212f45'
          ],
          colorByPoint: true,
          name: 'Department(s)',
          data: filteredDataPoints,
          showInLegend: true
        }
      ]
    };
  }
  
}