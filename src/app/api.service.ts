import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  public fetchData() {
    // return this.http.get('https://ppmsserver.sunplussoftware.com/pmms/services/overall-dashboard/getAllProjectDetails');
    return this.http.get('assets/dataSrc.json');
  }
}