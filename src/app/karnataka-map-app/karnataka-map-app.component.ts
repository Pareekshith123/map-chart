import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-karnataka-map-app',
  templateUrl: './karnataka-map-app.component.html',
  styleUrls: ['./karnataka-map-app.component.css']
})
export class KarnatakaMapAppComponent implements OnInit {
  map: any;
  showMapTableFlag: boolean = false;

  ngOnInit() {
    // Initialize the map
    this.map = L.map('map').setView([14.9716, 77.5946], 6.5); // Centered around Bangalore

    // Add a grayscale tile layer
    // L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    //   attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, ' +
    //     'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
    //     'Data by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
    //     'under <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    // }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Load Karnataka GeoJSON data and add it to the map with different colors for each district
    fetch('assets/karnataka.json')
      .then((response) => response.json())
      .then((geojson) => {
        L.geoJSON(geojson as any, { // Use 'as any' to suppress type errors
          style: function (feature) {
            const colors: { [key: string]: string } = {
              'Shivamogga': 'yellow',
              'Mysuru': '#E41B17',
               "Bidar":"#52D017",
               "Kalaburagi":"black",
               "Belagavi":"#E41B17",
               "Hassan":"blue",
               "Bagalkote":"#0041C2"

            
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
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.district) {
              layer.bindTooltip(`District:${feature.properties.district}<br/>projects:6`, { permanent: false, direction: 'center', className: 'district-tooltip' });
            }
          }
        }).addTo(this.map);
      });
  }
  showTable() {
    // Toggle the boolean variable to show/hide the table
    this.showMapTableFlag = !this.showMapTableFlag;
  }
  closeTable() {
    // Close the popup card by setting the boolean variable to false
    this.showMapTableFlag = false;
  }
}