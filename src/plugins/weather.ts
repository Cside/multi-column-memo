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
const CURRENT_WEATHER = 'currentWeather';
const TODAYS_WEATHER = 'TodaysWeather';
const TOMORROWS_WEATHER = 'TomorrowsWeather';

// TODO: モジュール切ったほうが良いんじゃね。Y! と Open Weather で。
const FULL_INFO = {
  [CURRENT_WEATHER]: {
    icon: '',
    temp: 0,
    feelLike: 0,
    humidity: 0,
  },
  [TODAYS_WEATHER]: {
    icons: '',
    highLow: '',
  },
  [TOMORROWS_WEATHER]: {
    icons: '',
    highLow: '',
  },
};
type KEYS_TYPE =
  | typeof CURRENT_WEATHER
  | typeof TODAYS_WEATHER
  | typeof TOMORROWS_WEATHER;
const getInfoForTab = (key: KEYS_TYPE) => {
  switch (key) {
    case CURRENT_WEATHER:
      return;
    case TODAYS_WEATHER:
      return;
    case TOMORROWS_WEATHER:
      return;
  }
};
const getInfoForConsole = (key: KEYS_TYPE) => {
  switch (key) {
    case CURRENT_WEATHER:
      return;
    case TODAYS_WEATHER:
      return;
    case TOMORROWS_WEATHER:
      return;
  }
};

// setInterval(() => {
//   updateCurrentTemp();
// }, 1_000 * 60 * 20); // Quta: 41 calls per hoour
// updateCurrentTemp();
