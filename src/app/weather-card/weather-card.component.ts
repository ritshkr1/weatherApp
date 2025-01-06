import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../services/weather-service.service';

@Component({
    selector: 'app-weather-card',
    imports: [FormsModule,NgIf,DatePipe,],
    templateUrl: './weather-card.component.html',
    styleUrl: './weather-card.component.css',
})
export class WeatherCardComponent {
    city: string = '';
  suggestions: string[] = [];
  weatherData: any = null;
  error: string = '';

  constructor(private weatherService: WeatherService) {}

  // Fetch city suggestions as user types
  onCityInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query.length > 2) { // Fetch suggestions for 3+ characters
      
        this.weatherService.getSearchCity(query).subscribe(
          (response) => {
            console.log(response)
            // this.suggestions = response.map((city:any) => city.name);
          },
          (error) => {
            this.error = 'Error fetching city suggestions.';
            this.suggestions = [];
          }
        );
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


