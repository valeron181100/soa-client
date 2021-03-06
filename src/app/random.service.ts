import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, timer } from 'rxjs';
import { switchMap, elementAt, map, debounceTime, debounce, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { xml2json } from 'xml-js';
import { Vehicle, VehicleType, FuelType } from './utils';

@Injectable({
  providedIn: 'root'
})
export class RandomService {

  private baseUrl: string = environment.baseUrl;
  private imagesUrl: string = this.baseUrl + 'images'
  private randomCarUrl: string = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/car_brand';
  private randomCarToken: string = '34cb2d65ccdca2cad2dd678a5fea9640bce222d1';
  private wikiApiUrl: string = 'https://ru.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=';

  private httpCarHeaders: any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Token ' + this.randomCarToken
  }

  constructor(private http: HttpClient) { }

  randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  randomLetter(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return characters.charAt(this.randomInteger(0, characters.length));
  }

  getRandomCar(): Observable<any> {
    return this.http.get(this.randomCarUrl + `?query=${this.randomLetter()}`, { headers: this.httpCarHeaders });
  }

  getRandomVehicle(): Observable<Vehicle> {
    return this.getRandomCar().pipe(
      switchMap((data: any) => from(data.suggestions).pipe(
        elementAt(this.randomInteger(0, data.suggestions.length - 1)),
        map((car: any) => {return {
          id: this.randomInteger(1, 100),
          name: car.value,
          coordinates: {
            xCoord: this.randomInteger(1, 100),
            yCoord: this.randomInteger(1, 100)
          },
          creationDate: new Date().toISOString(),
          enginePower: this.randomInteger(1, 200),
          numberOfWheels: 4,
          vehicleType: <VehicleType><unknown>VehicleType[this.randomInteger(0, 5)],
          fuelType: <FuelType><unknown>FuelType[this.randomInteger(0, 6)],
        }})
      ))
    );
  }

  getVehicleInfo(vehicleName: string): Observable<any> {
    return this.http.get(this.wikiApiUrl + vehicleName).pipe(
      map((data: any) => data.query.pages[Object.keys(data.query.pages)[0]].extract)
    );
  };

  getVehicleImage(vehicleName: string): Observable<any> {
    return this.http.get(this.imagesUrl + `?q=${escape(vehicleName)}`, { responseType: 'text' }).pipe(
      map((data: string) => data.replace('<result>', '').replace('</result>', ''))
    );
  }

}
