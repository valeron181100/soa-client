import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as internal from 'stream';
import { json2xml, xml2json } from 'xml-js';
import { Car, Coordinates, FuelType, Vehicle, VehicleFiels, VehicleType } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private baseUrl: string = environment.baseUrl;
  private vehiclesUrl: string = this.baseUrl + 'vehicles';
  private deleteByFuelTypeUrl: string = this.baseUrl + 'delete_by_fuel_type';
  private wheelsAvgUrl: string = this.baseUrl + 'wheels_avg_count';

  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml',
      'Response-Type': 'text'
    })
  };


  constructor(private http: HttpClient) { }

  getVehicles(startIndex?: number, maxResults?: number, sortState?: Sort, filters?: Car): Observable<any> {
    let url = this.vehiclesUrl;
    if (startIndex || maxResults || sortState) {
      url += `?`;
      if (startIndex)
        url += `from_index=${startIndex}&`;
      if (maxResults)
        url += `max_results=${maxResults}&`;
      if (sortState) {
        if (sortState.direction === 'asc')
          url += `sort_by=${VehicleFiels[sortState.active]}&`
        else if (sortState.direction === 'desc') {
          url += `sort_by=${VehicleFiels[sortState.active]}&order_desc&`
        }
      }
      if (filters) {
        let coords;
        if (filters.coordinates)
          coords = Coordinates.toString(filters.coordinates);
        let filterFake = {
          ...filters,
          coordinates: coords
        };
        url += `filters=${encodeURIComponent( JSON.stringify(filterFake))}`
      }
    }
    return this.http.get(url, { responseType: 'text' });
  }

  buildBodyXml(vehicle: Vehicle): string {
    let body = JSON.parse(JSON.stringify(vehicle));
    delete body.vehicleType;
    body.type = VehicleType[VehicleType[vehicle.vehicleType]];
    body.fuelType = FuelType[FuelType[vehicle.fuelType]];
    let xmlStr =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><vehicle>' +
      json2xml(JSON.stringify(body), { compact: true, ignoreComment: true, spaces: 4 }) +
      '</vehicle>';
    return xmlStr;
  }

  postVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.post(this.vehiclesUrl, this.buildBodyXml(vehicle), this.httpOptions);
  }

  updateVehicle(vehicle: Vehicle): Observable<any> {
    return this.http.patch(this.vehiclesUrl, this.buildBodyXml(vehicle), this.httpOptions);
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete(this.vehiclesUrl + '/' + vehicleId);
  }
  
  deleteVehicleByFuelType(fuelType: FuelType): Observable<any> {
    return this.http.delete(this.deleteByFuelTypeUrl + `?q=${fuelType}`);
  }
  
  getAvgNumberOfWheels(): Observable<any> {
    return this.http.get(this.wheelsAvgUrl, { responseType: 'text' }).pipe(
      map(data => JSON.parse(xml2json(data, {compact: true, spaces: 4})).avg._text)
    );
  }
}
