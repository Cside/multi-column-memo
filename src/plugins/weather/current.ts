import axios from 'axios';
import { sprintf } from '../../utils';
import { OPEN_WEATHER_URL } from './secrets';

// https://openweathermap.org/current
declare type OpenWeatherMapRes = {
  weather: { icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  // あと、風速なども気になる。一応。
};

export default class Current implements Fetcher {
  icon = '';
  temp = 0;
  feelsLike = 0;
  humidity = 0;

  async fetch({ fake }: { fake: boolean } = { fake: false }) {
    let data: OpenWeatherMapRes;
    if (fake) {
      data = {
        weather: [{ icon: '02d' }],
        main: {
          temp: 19.52,
          feels_like: 20.67,
          humidity: 50,
        },
      };
    } else {
      const res = await axios.get(OPEN_WEATHER_URL);
      if (res.status !== 200) {
        const message = `error: ${res.statusText}, url: ${URL}`;
        alert(message);
        throw new Error(message);
      }
      data = res.data;
    }

    this.icon = iconToEmoji(data.weather[0].icon);
    this.temp = data.main.temp;
    this.feelsLike = data.main.feels_like;
    this.humidity = data.main.humidity;
  }

  getMessagesForTab(): string[] {
    return [
      sprintf('%s%f (%d)', this.icon, Math.round(this.temp), this.humidity),
    ];
  }

  getMessagesForConsole(): string[][] {
    return [
      [
        'Current',
        this.icon,
        sprintf(
          '%f (Humidity: %d, Feels %f)',
          Math.round(this.temp * 10) / 10,
          this.humidity,
          Math.round(this.feelsLike * 10) / 10,
        ),
      ],
    ];
  }
}

export function iconToEmoji(icon: string) {
  icon = icon.slice(0, -1);
  switch (icon) {
    case '01':
      return '☀';
    case '02':
      return '🌤';
    case '03':
      return '⛅';
    case '04':
      return '☁';
    case '09':
    case '10':
      return '☔';
    case '11':
      return '⚡';
    case '13':
      return '❄';
    case '50':
      return '🌫';
    default:
      throw new Error(`unknown icon: ${icon}`);
  }
}
