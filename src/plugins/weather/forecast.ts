import axiosGet from '../../axios';
import { sprintf } from '../../utils';
import { YAHOO_WEATHER_URLS } from './secrets';

export default class Forecast implements Fetcher {
  today = {
    icons: '',
    high: '',
    low: '',
    dawn: [] as number[],
  };
  tomorrow = {
    icons: '',
    high: '',
    low: '',
  };
  async fetch({ fake }: { fake: boolean } = { fake: false }) {
    let Htmls: { data: string }[];
    if (fake) {
      Htmls = fakeHtmls();
    } else {
      Htmls = await Promise.all([
        axiosGet(YAHOO_WEATHER_URLS.WEEKLY),
        axiosGet(YAHOO_WEATHER_URLS.PINPOINT),
      ]);
    }
    {
      const doc = new DOMParser().parseFromString(Htmls[0].data, 'text/html');
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
    {
      const doc = new DOMParser().parseFromString(Htmls[1].data, 'text/html');

      this.today.dawn = [
        ...doc.querySelectorAll<HTMLElement>(
          '#yjw_pinpoint_tomorrow ' +
            'tr:nth-of-type(3) ' +
            'td:nth-of-type(n+2):nth-of-type(-n+4)',
        ),
      ].map((elem) => Number(elem.innerText.trim()));
    }
  }

  getMessagesForTab(): string[] {
    const temp = (str: string) => str.replace(/^([0-9]+).+/, '$1');
    const format = '%s%d/%d';
    return [
      sprintf(
        format,
        this.today.icons,
        temp(this.today.high),
        Math.min(...this.today.dawn),
      ),
      sprintf(
        format,
        this.tomorrow.icons,
        temp(this.tomorrow.high),
        temp(this.tomorrow.low),
      ),
    ];
  }

  getMessagesForConsole(): string[][] {
    return (
      [
        ['Today', this.today],
        ['Tomorrow', this.tomorrow],
      ] as [string, { icons: string; high: string; low: string }][]
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

function fakeHtmls() {
  return [
    {
      data: `
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
        </html>`,
    },
    {
      data: `
        <div id="yjw_pinpoint_tomorrow">
          <table>
            <tbody>
              <tr></tr>
              <tr></tr>
              <tr>
                <td>
                  <small>気温（℃）</small>
                </td>
                <td>
                  <small>18</small>
                </td>
                <td>
                  <small>15</small>
                </td>
                <td>
                  <small>14</small>
                </td>
                <td>
                  <small>18</small>
                </td>
                <td>
                  <small>22</small>
                </td>
                <td>
                  <small>23</small>
                </td>
                <td>
                  <small>20</small>
                </td>
                <td>
                  <small>19</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>`,
    },
  ];
}
