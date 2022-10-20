import asTable from 'as-table';
import { setIntervalOverSleep } from '../utils';
import Current from './weather/current';
import Forecast from './weather/forecast';

const FAKE = true;

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
