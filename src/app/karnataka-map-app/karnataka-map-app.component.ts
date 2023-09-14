import { Component, EventEmitter, OnInit } from '@angular/core';
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
  data: any[] = [];
  projCount: number = 0;
  districtProjectCounts: { [districtName: string]: number } = {};
  hoveredDistrict: string = '';
  hoveredProjectCount: number = 0;
  showToolTip: boolean = false;
  projectTitle:{ [districtName: string]: string }={};
  physicalProgress: any;
  finaancialProgress: any;
  projectStatus: any;
  projectTenderAmount: any;
  projectSanctionedCost: any;
  projTitle: any[]=[];
  selectedDistrictProjects: any[] = [];
  projectDistTitle:any[]=[];
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
      this.data = res;
      this.calculateDistrictProjectCounts();
    } catch (err) {
      console.log(err);
    }
  }

  calculateDistrictProjectCounts() {
    this.districtProjectCounts = {};
    this.data.forEach((item: any) => {
      if (item.projectDTOs) {
        item.projectDTOs.forEach((project: any) => {
          const districtName = project.projectDistrict;
          this.projectTitle[districtName] =item.projectTitle; 
          this.physicalProgress = project.physicalProgress;
          this.finaancialProgress = project.finaancialProgress;
          this.projectStatus = project.projectStatus;
          this.projectTenderAmount = project.projectTenderAmount;
          this.projectSanctionedCost = project.projectSanctionedCost;
  
          // const districtName = project.projectDistrict;
          console.log("this.", this.projectTitle);
          this.districtProjectCounts[districtName] = (this.districtProjectCounts[districtName] || 0) + 1;
        });
      }
    });
    console.log("districtProjectCounts", this.districtProjectCounts);
  }
  getProjectDetails( dist: string) {
    let arrval: any = [];
    for (let i = 0; i < this.data.length; i++) {

      // if (dept === this.data[i].departmentId && line === this.data[i].lineDepartmentId) {
        for (let j = 0; j < this.data[i].projectDTOs.length; j++) {
          if (dist === this.data[i].projectDTOs[j].projectDistrict) {
            let json: any = {};
            json.districtName= (this.data[i].projectDTOs[j].projectDistrict) ? (this.data[i].projectDTOs[j].projectDistrict) : ''
            json.proId = this.data[i].projectId;
            json.line = this.data[i].lineDepartmentId;
            json.project = this.data[i].projectTitle;
            json.tenderAmount = (this.data[i].projectDTOs[j].projectTenderAmount) ? (this.data[i].projectDTOs[j].projectTenderAmount) : 0;
            json.milestone = (this.data[i].projectDTOs[j].milestoneCount) ? this.data[i].projectDTOs[j].milestoneCount : 0;
            json.physical = (this.data[i].projectDTOs[j].physicalProgressCompleted) ? this.data[i].projectDTOs[j].physicalProgressCompleted + '%' : 0 + '%';
            json.financial = this.data[i].projectDTOs[j].financialProgress + '%';
            json.delayDay = (this.data[i].projectDTOs[j].delayedDays) ? this.data[i].projectDTOs[j].delayedDays : 0;
            json.damageCost = (this.data[i].projectDTOs[j].damageCost) ? (this.data[i].projectDTOs[j].damageCost) : 0;
            arrval.push(json);
          } else if (dist === '--') {
            let json: any = {};
            json.proId = this.data[i].projectId;
            json.line = this.data[i].lineDepartmentId;
            json.project = this.data[i].projectTitle;
            json.tenderAmount = (this.data[i].projectDTOs[j].projectTenderAmount) ? (this.data[i].projectDTOs[j].projectTenderAmount) : 0;
            json.milestone = (this.data[i].projectDTOs[j].milestoneCount) ? this.data[i].projectDTOs[j].milestoneCount : 0;
            json.physical = (this.data[i].projectDTOs[j].physicalProgressCompleted) ? this.data[i].projectDTOs[j].physicalProgressCompleted + '%' : 0 + '%';
            json.financial = this.data[i].projectDTOs[j].financialProgress + '%';
            json.delayDay = (this.data[i].projectDTOs[j].delayedDays) ? this.data[i].projectDTOs[j].delayedDays : 0;
            json.damageCost = (this.data[i].projectDTOs[j].damageCost) ? (this.data[i].projectDTOs[j].damageCost) : 0;
            arrval.push(json);
          }
        }
        
        console.log("arrava",arrval)
      // }
    }
    return arrval;
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
              "Raichur":'orange',
              "Vijayapura":'palegreen',
              "Gadag":'palepurple',
              "Uttara Kannada":'#00008B',
              "Davanagere":'#FF00FF',
              "Dakshina Kannada":'orange',
              "Chikmagalur":'#800000',
              "Mysore":'#006A4E',
              "Mandya":'#3A5F0B',
              "Ramanagara":'#08A04B',
              "Chamarajanagara":'#DAEE01',
              "Kodagu":'#FFA0500',
              "Udupi":'#EB5406',
              "Chikkaballapur":'#EB5406',
              "Dharwad":'#FC6C85',
              "Koppal":'#C45AEC',
              "Ballari":'#C21E56'

            };
            const district = feature?.properties?.district;
            const color = colors[district] || 'grey';
            return {
              color: color,
              weight: 1.5,
              opacity: 0,
              fillOpacity: 1.5
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
                
                this.projTitle = [];
            
                
                
                for (let i = 0; i<=this.projCount; i++) {
                    this.getProjectDetails(this.selectedDistrict);
                    this.projTitle.push(this.getProjectDetails(this.selectedDistrict));
                }  
                console.log(this.projTitle,"lily")
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
  getDistrictProjectTitles(districtName: string): any[] {
  const projects: any[] = [];
  this.data.forEach((item: any) => {
    if (item.projectDTOs) {
      item.projectDTOs.forEach((project: any) => {
        if (project.projectDistrict === districtName) {
          projects.push(project.projectTitle);
        }
      });
    }
  });
  return projects;
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
