import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KarnatakaMapAppComponent } from './karnataka-map-app/karnataka-map-app.component';
import { EotChartComponent } from './eot-chart/eot-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { MileComponent } from './mile/mile.component';

@NgModule({
  declarations: [
    AppComponent,
    KarnatakaMapAppComponent,
    EotChartComponent,
    BarChartComponent,
    MileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HighchartsChartModule,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
