import axios from 'axios';
import { OPEN_WEATHER_URL } from '../secrets';

const USE_FAKE_RES = true;

// https://openweathermap.org/current
type OpenWeatherMapRes = {
  weather: { icon: string }[];
  main: {
    temp: number;
    feel_like?: number;
    humidity?: number;
  };
  // あと、風速なども気になる。一応。
};
/* eslint @typescript-eslint/no-explicit-any: 0 */
const fakeAxiosRes = (data: any) => ({
  status: 200,
  statusText: '',
  data,
});

const axiosGet = (url: string) => {
  if (!USE_FAKE_RES) {
    console.log('use axios');
    return axios.get<OpenWeatherMapRes>(url);
  }
  switch (url) {
    case OPEN_WEATHER_URL: {
      console.log('use cache');
      const res: OpenWeatherMapRes = {
        weather: [{ icon: '02d' }],
        main: {
          temp: 19,
        },
      };
      return Promise.resolve(fakeAxiosRes(res));
    }
    default:
      throw new Error(`USE_FAKE_RES and unknown url: ${url}`);
  }
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
// TODO: TODO: 開発中はレスポンスをキャッシュする機能（開発してるうちに Quota 使い果たすで。。）

const updateCurrentTemp = async () => {
  // TODO: Retry
  const res = await axiosGet(OPEN_WEATHER_URL);
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
