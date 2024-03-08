import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {

  constructor(private http: HttpClient) { }

  getWeatherDataWithCityName(cityName:string){
    this.http.get(environment.weatherBaseUrl, {
      headers: new HttpHeaders().set(environment.XRapidAPIHostHeaderName,environment.XRapidAPIHostHeaderValue).set(environment.XRapidAPIKeyLabel,environment.XRapidAPIKeyValue)
    })
  }
}
