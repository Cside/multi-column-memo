import axios from 'axios';
import { OPEN_WEATHER_URL } from './secrets';

// https://openweathermap.org/current
type OpenWeatherMapRes = {
  weather: { icon: string }[];
  main: {
    temp: number;
    feel_like: number;
    humidity: number;
  };
  // あと、風速なども気になる。一応。
};

const iconToEmoji = (icon: string) => {
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
};

const updateCurrentTemp = async () => {
  // TODO: Retry
  const res = await axios.get(OPEN_WEATHER_URL);
  if (res.status !== 200) {
    throw new Error(`error. ${res.statusText}`);
  }
  const data = res.data as OpenWeatherMapRes;
  // TODO: コンソールには体感、湿度も
  const str = `${iconToEmoji(data.weather[0].icon)}${Math.round(
    data.main.temp,
  )}`;
  document.title = str;
  console.log(str);
};
setInterval(() => {
  updateCurrentTemp();
}, 1_000 * 60 * 20); // Quta: 41 calls per hoour
updateCurrentTemp();
