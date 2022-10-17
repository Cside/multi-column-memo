import { OPEN_WEATHER_URL } from './secrets';
import { axiosGet } from './utils';

export const iconToEmoji = (icon: string) => {
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
  const res = await axiosGet(OPEN_WEATHER_URL);
  if (res.status !== 200) {
    throw new Error(`error: ${res.statusText}, url: ${OPEN_WEATHER_URL}`);
  }
  const data = res.data as OpenWeatherMapRes;
  const str = `${iconToEmoji(data.weather[0].icon)}${Math.round(
    data.main.temp,
  )}`;
  document.title = str;
  console.log(str);
};
