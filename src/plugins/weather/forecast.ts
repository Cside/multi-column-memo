import { axiosGet } from './utils';

const YAHOO_URL = 'https://weather.yahoo.co.jp/weather/jp/13/4410.html';

export const weatherToIcons = (weather: string) => {
  return weather
    .replace(/時々|ときどき|後|のち|一時|れ|り/g, '')
    .split('')
    .map((str) => {
      switch (str) {
        case '晴':
          return '☀';
        case '曇':
          return '☁';
        case '雨':
          return '☔';
        case '雪':
          return '❄';
        default:
          throw new Error(`unknown weather: ${str}`);
      }
    })
    .join('');
};

(async () => {
  const res = await axiosGet(YAHOO_URL);
  if (res.status !== 200) {
    throw new Error(`error: ${res.statusText}, url: ${YAHOO_URL}`);
  }
  const doc = new DOMParser().parseFromString(res.data, 'text/html');
  for (const td of doc.querySelectorAll(
    '.forecastCity > table > tbody > tr > td',
  )) {
    const high = td.querySelector<HTMLElement>('.temp .high')?.innerText;
    const low = td.querySelector<HTMLElement>('.temp .low')?.innerText;
    const weather = (
      td.querySelector<HTMLElement>('.pict')?.innerText ?? ''
    ).trim();
    console.log(weather);

    console.log(high);
    console.log(low);
    console.log(weatherToIcons(weather));
  }
})();
