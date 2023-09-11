import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-mile',
  templateUrl: './mile.component.html',
  styleUrls: ['./mile.component.css']
})
export class MileComponent implements OnInit {
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
    const dataPoints = this.myData.flatMap((item: { projectAbstractDTOs: any[]; departmentName: any; projectDTOs:any;milestonesOverviewDTOz:any }) =>
      item.projectAbstractDTOs.map(project => ({
        name: item.milestonesOverviewDTOz.length>0?project.projectTitleAbstract:'',
        y:  item.milestonesOverviewDTOz.length>0?item.milestonesOverviewDTOz[0].subCompOverviewDTOs[0].subCompMonitoredDuration:0,
        abc: project.hasEOT,
        
      }))
    );

    console.log(dataPoints);

    this.chartOptions = {
      chart: { type: 'container', style: { fontFamily: 'Rubik' } },
      title: { text: 'Project Milestone Data' },
      xAxis: { type: 'category', title: { text: 'Department' } },
      yAxis: { labels: { format: '{value} Days' }, title: { text: 'Duration in days ' } },
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
                    tableContent += `
                      <tr><td>${point.name}</td><td>${point.y} Cr</td><td>${point.abc}</td></tr>
                    
                    `;
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
          type: 'bar',
          stacking: 'normal',
          colors: [
            '#8085e9',
            '#f15c80',
            '#2b908f',
            '#90be6d',
            '#577590',
            '#212f45',
            '#6a040f',
            '#17a2b8',
            '#dc3545',
            '#8AC926'
          ],
          colorByPoint: true,
          name: 'Milestone(s)',
          data: dataPoints,
          showInLegend: true
        }
      ]
    };
  }
  
}
