import asTable from 'as-table';
import { setIntervalOverSleep, sprintf } from '../utils';
import Current from './weather/current';
import Forecast from './weather/forecast';
import { YAHOO_WEATHER_URLS } from './weather/secrets';

const FAKE = false;

(async () => {
  const current = new Current();
  const forecast = new Forecast();

  const render = () => {
    document.title = [
      ...current.getMessagesForTab(),
      ...forecast.getMessagesForTab(),
    ].join('　');

    // 絵文字だとちょっと崩れる問題。
    // 環境によって文字の幅は異なるため、直すのは困難と思われる...
    // https://github.com/xpl/as-table/issues/12

    // console.clear();
    console.log('refreshed at: ' + getTime());
    console.log(
      '%c' +
        asTable([
          ...current.getMessagesForConsole(),
          ...forecast.getMessagesForConsole(),
        ]),
      `
      font-size: 25px;
      font-family: Monaco, "Apple Color Emoji";
      line-height: 2.0em;
    `,
    );
    console.log(
      sprintf(
        '[0:00] %d℃  [3:00] %d℃  [6:00] %d℃',
        forecast.today.dawn?.[0] || '',
        forecast.today.dawn?.[1] || '',
        forecast.today.dawn?.[2] || '',
      ),
    );
    console.log(
      asTable([
        ['週間予報：', YAHOO_WEATHER_URLS.WEEKLY],
        ['ピンポイント：', YAHOO_WEATHER_URLS.PINPOINT],
      ]),
    );
  };
  await Promise.all([
    current.fetch({ fake: FAKE }),
    forecast.fetch({ fake: FAKE }),
  ]);
  render();

  setIntervalOverSleep(async () => {
    await current.fetch({ fake: FAKE });
    render();
  }, 1_000 * 60 * 20);

  setIntervalOverSleep(async () => {
    await forecast.fetch({ fake: FAKE });
    render();
  }, 1_000 * 60 * 60 * 4);
})();

function getTime() {
  const date = new Date();
  return (
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
    ('0' + date.getSeconds()).slice(-2)
  );
}
