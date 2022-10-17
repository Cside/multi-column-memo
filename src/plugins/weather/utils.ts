import axios from 'axios';
import { OPEN_WEATHER_URL } from './secrets';

/* eslint @typescript-eslint/no-explicit-any: 0 */
const fakeAxiosRes = (data: any) => ({
  status: 200,
  statusText: '',
  data,
});

export const axiosGet = (url: string, { fake = false }: { fake: boolean }) => {
  if (!fake) {
    console.log('use axios');
    return axios.get<OpenWeatherMapRes>(url);
  }
  switch (url) {
    case OPEN_WEATHER_URL: {
      console.log('use cache');
      const res: OpenWeatherMapRes = {
        weather: [{ icon: '02d' }],
        main: {
          temp: 19.5,
          feel_like: 20,
          humidity: 50,
        },
      };
      return Promise.resolve(fakeAxiosRes(res));
    }
    default:
      throw new Error(`USE_FAKE_RES and unknown url: ${url}`);
  }
};
