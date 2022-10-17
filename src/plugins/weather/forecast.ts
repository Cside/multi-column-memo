import axios from 'axios';

const URL = 'https://weather.yahoo.co.jp/weather/jp/13/4410.html';

type Data = {
  icons: string;
  high: string;
  low: string;
};

export default class Forecast implements Fetcher {
  today: Data = {
    icons: '',
    high: '',
    low: '',
  };
  tomorrow: Data = {
    icons: '',
    high: '',
    low: '',
  };
  async fetch({ fake }: { fake: boolean } = { fake: false }) {
    let html: string;
    if (fake) {
      html = fakeHTML();
    } else {
      const res = await axios.get(URL);
      if (res.status !== 200) {
        throw new Error(`error: ${res.statusText}, url: ${URL}`);
      }
      html = res.data;
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const elems = doc.querySelectorAll(
      '.forecastCity > table > tbody > tr > td',
    );
    if (elems.length !== 2) {
      throw new Error(
        "$('.forecastCity > table > tbody > tr > td').lentgh !== 2",
      );
    }
    for (const [i, td] of [...elems].entries()) {
      const propName = i === 0 ? 'today' : 'tomorrow';

      this[propName].high =
        td.querySelector<HTMLElement>('.temp .high')?.innerText ?? '';
      this[propName].low =
        td.querySelector<HTMLElement>('.temp .low')?.innerText ?? '';
      this[propName].icons = (() => {
        const weather = (
          td.querySelector<HTMLElement>('.pict')?.innerText ?? ''
        ).trim();
        return weatherToIcons(weather);
      })();
    }
  }

  getMessagesForTab(): string[] {
    const format = (str: string) => str.replace(/℃\[.+\]/, '');
    return [this.today, this.tomorrow].map(
      (data) => `${data.icons}${format(data.high)}/${format(data.low)}`,
    );
  }

  getMessagesForConsole(): string[][] {
    return (
      [
        ['Today', this.today],
        ['Tomorrow', this.tomorrow],
      ] as [string, Data][]
    ).map((pair) => {
      const [name, data] = pair;
      return [
        name,
        data.icons,
        [data.high, data.low].map((str) => str.replace('℃', '')).join(' '),
      ];
    });
  }
}

export function weatherToIcons(weather: string) {
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
}

function fakeHTML() {
  return `
      <!DOCTYPE html>
      <html>
        <body>
        <div class="forecastCity">
          <table>
            <tbody>
              <tr>
                <td>
                  <ul class="temp">
                    <li class="high">20℃[-10]</li>
                    <li class="low">10℃[-1]</li>
                  </ul>
                  <p class="pict">
                    曇のち晴
                  </div>
                </td>
                <td>
                  <ul class="temp">
                    <li class="high">12℃[-10]</li>
                    <li class="low">10℃[-1]</li>
                  </ul>
                  <p class="pict">
                    雨のち雪
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </body>
      </html>`;
}
