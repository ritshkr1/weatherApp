import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgStyle } from '@angular/common';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../services/weather-service.service';

@Component({
    selector: 'app-weather-card',
    imports: [FormsModule,NgIf,DatePipe,NgStyle,NgFor],
    templateUrl: './weather-card.component.html',
    styleUrl: './weather-card.component.css',
})
export class WeatherCardComponent implements OnInit {
    city: string = '';
    allCitiesRes : any = []
    selectedCountry:string = 'India';
    countries: string[] = ['India'];
    allCities :string[] = [];
  suggestions: string[] = [];
  weatherData: any = null;
  error: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
      this.getAllCities();
  }

  getAllCities(){
    this.weatherService.getSearchCity().subscribe(
        (response) => {
          this.allCitiesRes = response
          this.countries = this.weatherService.getAllCountryNames(this.allCitiesRes)
          this.allCities = this.weatherService.filterCitiesOfIndia(this.allCitiesRes,'India');
        },
        (error) => {
          this.error = 'Error fetching city suggestions.';
          this.allCities = [];
        }
      );
  }

  onCountryChange(){
    this.city = ''
    this.allCities = this.weatherService.filterCitiesOfIndia(this.allCitiesRes, this.selectedCountry);

  }

  // Get gradient background based on temperature
  getWeatherBackground() {
    if (this.weatherData) {
      const temp = this.weatherData.current.temp_c;
      // Gradient colors based on temperature range
      if (temp <= 15) {
        return { 'background': 'linear-gradient(45deg, #00aaff, #4e8dff)' }; // Cold temperatures
      } else if (temp <= 25) {
        return { 'background': 'linear-gradient(45deg, #ff9f00, #ff5f00)' }; // Moderate temperatures
      } else {
        return { 'background': 'linear-gradient(45deg, #ff7e5f, #ff3232)' }; // Hot temperatures
      }
    }
    return {};
  }

  // Fetch city suggestions as user types
  onCityInput(event: Event) {
    this.error = ''
    const query = (event.target as HTMLInputElement).value.toLowerCase();  // Convert input to lowercase for case-insensitive matching
    if (query.length > 0) { 
      this.suggestions = this.allCities.filter((city: string) => city.toLowerCase().startsWith(query));
    } else {
      this.suggestions = [];
    }
  }

  // Select a city from the suggestions
  selectCity(city: string) {
    this.city = city;
    this.suggestions = []; // Clear suggestions after selection
    this.getWeather()
  }

  getWeather() {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name.';
      return;
    }

    this.weatherService.getWeatherByCity(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.error = '';
      },
      error: () => {
        this.weatherData = null;
        this.error = 'City not found or API error.';
      },
    });
  }

}


