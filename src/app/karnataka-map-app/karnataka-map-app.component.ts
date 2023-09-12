import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-karnataka-map-app',
  templateUrl: './karnataka-map-app.component.html',
  styleUrls: ['./karnataka-map-app.component.css']
})
export class KarnatakaMapAppComponent implements OnInit {
  map: any;
  showMapTableFlag: boolean = false;
  selectedDistrict: string = '';
  myData: any[] = [];
  districtProjectCounts: { [districtName: string]: number } = {};

  constructor(private http: ApiService) {}

  ngOnInit(): void {
    this.map = L.map('map').setView([14.9716, 77.5946], 6.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.fetchData();
    fetch('assets/karnataka.json')
      .then((response) => response.json())
      .then((geojson) => {
        L.geoJSON(geojson as any, {
          style: function (feature) {
            const colors: { [key: string]: string } = {
              'Shivamogga': 'yellow',
              'Mysuru': '#E41B17',
              'Bidar': '#52D017',
              'Kalaburagi': 'black',
              'Belagavi': '#E41B17',
              'Hassan': 'blue',
              'Bagalkote': '#0041C2'
            };
            const district = feature?.properties?.district;
            const color = colors[district] || 'grey';
            return {
              color: color,
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.5
            };
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.district) {
              layer.on('click', () => {
                this.selectedDistrict = feature.properties.district;
                this.showTable();
              });
              layer.bindTooltip(`District: ${feature.properties.district}<br/>projects: ${this.getDistrictProjectCount(feature.properties.district)}`, { permanent: false, direction: 'center', className: 'district-tooltip' });
            console.log(this.getDistrictProjectCount(feature.properties.district));
            
            }
          }
        }).addTo(this.map);
      });

   
  }

  fetchData() {
    this.http.fetchData().subscribe(
      (res: any) => {
        console.log(res);
        this.myData = res;
        this.calculateDistrictProjectCounts();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  calculateDistrictProjectCounts() {
    this.districtProjectCounts = {};
    this.myData.forEach((item: any) => {
      if (item.projectTalukViewDTOs) {
        item.projectTalukViewDTOs.forEach((project: any) => {
          const districtName = project.districtName;
          this.districtProjectCounts[districtName] = (this.districtProjectCounts[districtName] || 0) + 1;
        });
      }
    });
    console.log("districtProjectCounts", this.districtProjectCounts);
  }

  getDistrictProjectCount(districtName: string): number {
    return this.districtProjectCounts[districtName] || 0;
  }
  
  showTable() {
    this.showMapTableFlag = true;
  }

  closeTable() {
    this.showMapTableFlag = false;
  }
}
