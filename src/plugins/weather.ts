import asTable from 'as-table';
import Current from './weather/current';
import Forecast from './weather/forecast';

// setInterval(() => {
//   updateCurrentTemp();
// }, 1_000 * 60 * 20); // Quta: 41 calls per hoour
// updateCurrentTemp();

(async () => {
  const current = new Current();
  const forecast = new Forecast();
  await Promise.all([
    current.fetch({ fake: true }),
    forecast.fetch({ fake: true }),
  ]);

  document.title = [
    ...current.getMessagesForTab(),
    ...forecast.getMessagesForTab(),
  ].join('　');

  console.clear();
  // 絵文字だとちょっと崩れる問題。
  // 環境によって文字の幅は異なるため、直すのは困難と思われる...
  // https://github.com/xpl/as-table/issues/12
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
})();
