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
  projCount: number = 0;
  districtProjectCounts: { [districtName: string]: number } = {};
  hoveredDistrict: string = '';
  hoveredProjectCount: number = 0;
  showToolTip: boolean = false;
  projectTitle:any[]=[];
  physicalProgress: any;
  finaancialProgress: any;
  projectStatus: any;
  projectTenderAmount: any;
  projectSanctionedCost: any;
  projTitle: any[]=[];
  constructor(private http: ApiService) {}

  ngOnInit(): void {
    this.map = L.map('map').setView([14.9716, 77.5946], 6.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy;SunplusSoftware'
    }).addTo(this.map);

    // Fetch data and render map
    this.fetchData().then(() => {
      this.renderMap();
    });
  }

  async fetchData() {
    try {
      const res: any = await this.http.fetchData().toPromise();
      console.log(res);
      this.myData = res;
      this.calculateDistrictProjectCounts();
    } catch (err) {
      console.log(err);
    }
  }

  calculateDistrictProjectCounts() {
    this.districtProjectCounts = {};
    this.myData.forEach((item: any) => {
      if (item.projectDTOs) {
        item.projectDTOs.forEach((project: any) => {
          const districtName = project.projectDistrict;
          this.projectTitle[districtName].push(item.projectTitle);
          this.physicalProgress=project.physicalProgress;
          this.finaancialProgress=project.finaancialProgress;
          this.projectStatus=project.projectStatus;
          this.projectTenderAmount=project.projectTenderAmount;
          this.projectSanctionedCost=project.projectSanctionedCost;
          // const districtName = project.projectDistrict;
          console.log("this.",this.projectTitle);
          this.districtProjectCounts[districtName] = (this.districtProjectCounts[districtName] || 0) + 1;
        });
      }
    });
    console.log("districtProjectCounts", this.districtProjectCounts);
  }

  renderMap() {
    fetch('assets/karnataka.json')
      .then((response) => response.json())
      .then((geojson) => {
        L.geoJSON(geojson as any, {
          style: function (feature) {
            const colors: { [key: string]: string } = {
              'Shimoga': 'yellow',
              'Yadgir': '#E41B17',
              'Bidar': '#52D017',
              'Kalaburagi': 'black',
              'Belagavi': '#E41B17',
              'Hassan': 'blue',
              'Bagalkot': '#0041C2',
              "Chitradurga": '#00FFFF',
              "Tumkur": '#FF00FF',
              "Bangalore Urban": '#FFA500',
              "Kolar": '#00FF00',
              "Chikkaballapura": '#7FFFD4',
              "Raichur":'orange'
            };
            const district = feature?.properties?.district;
            const color = colors[district] || 'grey';
            return {
              color: color,
              weight: 1.5,
              opacity: 0.5,
              fillOpacity: 0.8
            };
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.district) {
              const districtName = feature.properties.district;
              const projectCount = this.getDistrictProjectCount(districtName);
              const projectTitle=this.getDistrictProjectTitle(districtName);
              layer.on('mouseover', (e) => {
                this.showToolTip = true;
                
                const tooltip = document.querySelector('.custom-tooltip') as HTMLElement;
                if (tooltip) {
                  const x = e.originalEvent.clientX + 10;
                  const y = e.originalEvent.clientY + 10;
                  tooltip.style.left = `${x}px`;
                  tooltip.style.top = `${y}px`;
                }
                e.target.setStyle({
                  transform: 'scale(1.1)',
                  zIndex: 1000,
                });
                this.hoveredDistrict = districtName;
                this.hoveredProjectCount = projectCount;
              });

              layer.on('mouseout', (e) => {
                this.showToolTip = false;
                e.target.setStyle({
                  transform: 'scale(1)',
                  zIndex: 1,
                });
                this.hoveredDistrict = '';
                this.hoveredProjectCount = 0;
              });

              layer.on('click', () => {
                this.selectedDistrict = districtName;
                this.projCount = projectCount;
                this.projTitle.push(this.getDistrictProjectTitle(this.selectedDistrict));
                this.showTable();
              });

              layer.bindTooltip(projectCount.toString(), {
                permanent: true,
                direction: 'left',
                className: 'indicator',
                opacity: 0.9,
              });
            }
          }
        }).addTo(this.map);
      });
  }

  getDistrictProjectCount(districtName: string): number {
    return this.districtProjectCounts[districtName] || 0;
  }
  getDistrictProjectTitle(districtName: any): any {
    return this.projectTitle[districtName];
  }

  showTable() {
    this.showMapTableFlag = true;
  }

  closeTable() {
    this.showMapTableFlag = false;
  }
}
// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api.service';
// import * as L from 'leaflet';

// @Component({
//   selector: 'app-karnataka-map-app',
//   templateUrl: './karnataka-map-app.component.html',
//   styleUrls: ['./karnataka-map-app.component.css']
// })
// export class KarnatakaMapAppComponent implements OnInit {
//   map: any;
//   showMapTableFlag: boolean = false;
//   selectedDistrict: string = '';
//   myData: any[] = [];
//   projCount: number = 0;
//   districtProjectCounts: { [districtName: string]: number } = {};
//   // Add these variables to your component class
// hoveredDistrict: string = '';
// hoveredProjectCount: number = 0;
// showToolTip:boolean=false;


//   constructor(private http: ApiService) {}

//   ngOnInit(): void {
//     this.map = L.map('map').setView([14.9716, 77.5946], 6.5);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy;SunplusSoftware'
//     }).addTo(this.map);

//     // Fetch data and render map
//     this.fetchData().then(() => {
//       this.renderMap();
//     });
//   }

//   async fetchData() {
//     try {
//       const res: any = await this.http.fetchData().toPromise();
//       console.log(res);
//       this.myData = res;
//       this.calculateDistrictProjectCounts();
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   calculateDistrictProjectCounts() {
//     this.districtProjectCounts = {};
//     this.myData.forEach((item: any) => {
//       if (item.projectDTOs) {
//         item.projectDTOs.forEach((project: any) => {
//           const districtName = project.projectDistrict;
//           this.districtProjectCounts[districtName] = (this.districtProjectCounts[districtName] || 0) + 1;
//         });
//       }
//     });
//     console.log("districtProjectCounts", this.districtProjectCounts);
//   }

//   renderMap() {
//     fetch('assets/karnataka.json')
//       .then((response) => response.json())
//       .then((geojson) => {
//         L.geoJSON(geojson as any, {
//           style: function (feature) {
//             const colors: { [key: string]: string } = {
//               'Shimoga': 'yellow',
//               'Yadgir': '#E41B17',
//               'Bidar': '#52D017',
//               'Kalaburagi': 'black',
//               'Belagavi': '#E41B17',
//               'Hassan': 'blue',
//               'Bagalkot': '#0041C2',
//               "Chitradurga": '#00FFFF',
//               "Tumkur": '#FF00FF',
//               "Bangalore Urban": '#FFA500',
//               "Kolar": '#00FF00',
//               "Chikkaballapura": '#7FFFD4'
//             };
//             const district = feature?.properties?.district;
//             const color = colors[district] || 'grey';
//             return {
//               color: color,
//               weight: 1.5,
//               opacity: 1,
//               fillOpacity: 0.5
//             };
//           },
//           onEachFeature: (feature, layer) => {
//             if (feature.properties && feature.properties.district) {
//               const districtName = feature.properties.district;
//               const projectCount = this.getDistrictProjectCount(districtName);
//               layer.on('mouseover', (e) => {
//                 // Access the target layer (the district) and apply the scaling style
//                 this.showToolTip=true;
//                 e.target.setStyle({
//                   transform: 'scale(1.1)', // Increase the scale as needed
//                   zIndex: 1000, // Bring the district to the front when hovered
//                 });
              
//                 // Set the hovered district and project count
//                 this.hoveredDistrict = districtName;
//                 this.hoveredProjectCount = projectCount;
//               });
              
//               layer.on('mouseout', (e) => {
//                 // Reset the style when the mouse leaves the district

//                 this.showToolTip=false;
//                 e.target.setStyle({
//                   transform: 'scale(1)', // Reset the scale
//                   zIndex: 1, // Reset the zIndex
//                 });
              
//                 // Clear the hovered district and project count
//                 this.hoveredDistrict = '';
//                 this.hoveredProjectCount = 0;
//               });
              

//               layer.on('click', () => {
//                 this.selectedDistrict = districtName;
//                 this.projCount = projectCount; // Update projCount when a district is clicked
//                 this.showTable();
//               });
//               layer.bindTooltip(projectCount.toString(), {
//                 permanent: true,
//                 direction: 'left',
//                 className: 'indicator',
//                 opacity: 0.9,
           

//               });
          
//       //         layer.bindTooltip(`${projectCount}`, {  permanent: true, // Make the tooltip permanent
//       //         direction: 'center', // Set the direction of the tooltip
//       //         className: 'district-tooltip', // Apply a custom CSS class to the tooltip
//       //         opacity: 0.5, // Set the opacity of the tooltip
//       //         // offset: [0, -10], // Adjust the tooltip's position relative to the layer
//       //         //  // Adjust the zIndex of the tooltip
//       //         // interactive: false, // Make the tooltip non-interactive (won't respond to mouse events)
//       //         // sticky: true, // Make the tooltip sticky (won't close on mouseout)
//       //         // pane: 'overlayPane', // Specify the map pane where the tooltip should be added
//       //          // Make the tooltip non-permanent (closes on mouseout)
//       //  // Disable automatic panning of the map to keep the tooltip visible
//       //       });

//             }
//           }
//         }).addTo(this.map);
//       });
//   }

//   getDistrictProjectCount(districtName: string): number {
//     return this.districtProjectCounts[districtName] || 0;
//   }

//   showTable() {
//     this.showMapTableFlag = true;
//   }

//   closeTable() {
//     this.showMapTableFlag = false;
//   }
// }



//with complex tool tip 

// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api.service';
// import * as L from 'leaflet';

// @Component({
//   selector: 'app-karnataka-map-app',
//   templateUrl: './karnataka-map-app.component.html',
//   styleUrls: ['./karnataka-map-app.component.css']
// })
// export class KarnatakaMapAppComponent implements OnInit {
//   map: any;
//   showMapTableFlag: boolean = false;
//   selectedDistrict: string = '';
//   myData: any[] = [];
//   projCount: number = 0;
//   districtProjectCounts: { [districtName: string]: number } = {};
//   hoveredDistrict: string = '';
//   hoveredProjectCount: number = 0;
//   showToolTip: boolean = false;

//   constructor(private http: ApiService) {}

//   ngOnInit(): void {
//     this.map = L.map('map').setView([14.9716, 77.5946], 6.5);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy;SunplusSoftware'
//     }).addTo(this.map);

//     // Fetch data and render map
//     this.fetchData().then(() => {
//       this.renderMap();
//     });
//   }

//   async fetchData() {
//     try {
//       const res: any = await this.http.fetchData().toPromise();
//       console.log(res);
//       this.myData = res;
//       this.calculateDistrictProjectCounts();
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   calculateDistrictProjectCounts() {
//     this.districtProjectCounts = {};
//     this.myData.forEach((item: any) => {
//       if (item.projectDTOs) {
//         item.projectDTOs.forEach((project: any) => {
//           const districtName = project.projectDistrict;
//           this.districtProjectCounts[districtName] = (this.districtProjectCounts[districtName] || 0) + 1;
//         });
//       }
//     });
//     console.log("districtProjectCounts", this.districtProjectCounts);
//   }

//   renderMap() {
//     fetch('assets/karnataka.json')
//       .then((response) => response.json())
//       .then((geojson) => {
//         L.geoJSON(geojson as any, {
//           style: function (feature) {
//             const colors: { [key: string]: string } = {
//               'Shimoga': 'yellow',
//               'Yadgir': '#E41B17',
//               'Bidar': '#52D017',
//               'Kalaburagi': 'black',
//               'Belagavi': '#E41B17',
//               'Hassan': 'blue',
//               'Bagalkot': '#0041C2',
//               "Chitradurga": '#00FFFF',
//               "Tumkur": '#FF00FF',
//               "Bangalore Urban": '#FFA500',
//               "Kolar": '#00FF00',
//               "Chikkaballapura": '#7FFFD4'
//             };
//             const district = feature?.properties?.district;
//             const color = colors[district] || 'grey';
//             return {
//               color: color,
//               weight: 1.5,
//               opacity: 1,
//               fillOpacity: 0.5
//             };
//           },
//           onEachFeature: (feature, layer) => {
//             if (feature.properties && feature.properties.district) {
//               const districtName = feature.properties.district;
//               const projectCount = this.getDistrictProjectCount(districtName);
//               layer.on('mouseover', (e) => {
//                 this.showToolTip = true;
//                 layer.bindTooltip(`District: ${districtName}<br/>projects: ${projectCount}`, { permanent: false, direction: 'center', className: 'district-tooltip' });

//                 const tooltip = document.querySelector('.custom-tooltip') as HTMLElement;
//                 if (tooltip) {
//                   const x = e.originalEvent.clientX + 10;
//                   const y = e.originalEvent.clientY + 10;
//                   tooltip.style.left = `${x}px`;
//                   tooltip.style.top = `${y}px`;
//                 }
//                 e.target.setStyle({
//                   transform: 'scale(1.1)',
//                   zIndex: 1000,
//                 });
//                 this.hoveredDistrict = districtName;
//                 this.hoveredProjectCount = projectCount;
//               });

//               layer.on('mouseout', (e) => {
//                 this.showToolTip = false;
//                 layer.bindTooltip(projectCount.toString(), {
//                   permanent: true,
//                   direction: 'left',
//                   className: 'indicator',
//                   opacity: 0.7,
//                 });
//                 e.target.setStyle({
//                   transform: 'scale(1)',
//                   zIndex: 1,
//                 });
//                 this.hoveredDistrict = '';
//                 this hoveredProjectCount = 0;
//               });

//               layer.on('click', () => {
//                 this.selectedDistrict = districtName;
//                 this.projCount = projectCount;
//                 this.showTable();
//               });

//               layer.bindTooltip(projectCount.toString(), {
//                 permanent: true,
//                 direction: 'left',
//                 className: 'indicator',
//                 opacity: 0.7,
//               });
//             }
//           }
//         }).addTo(this.map);
//       });
//   }

//   getDistrictProjectCount(districtName: string): number {
//     return this.districtProjectCounts[districtName] || 0;
//   }

//   showTable() {
//     this.showMapTableFlag = true;
//   }

//   closeTable() {
//     this.showMapTableFlag = false;
//   }
// }
