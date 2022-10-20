import axios, { AxiosError, AxiosResponse } from 'axios';

// 本来は axios-retry, retry-axios 等のライブラリで retry したいが
// axios の最新バージョンとの食い合わせが悪いのか、エラーが出てしまう
// ( 参照: notion.so/cside/axios-retry-cca4a56dd2714f62a243058efabbb2a8 )
// ゆえに、仕方なく Promise の retry で解決する。
const retryPromise = <T>(
  fn: () => Promise<T>,
  times: number,
  delay: number,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    let error: Error;
    const attempt = () => {
      if (times == 0) {
        reject(error);
      } else {
        fn()
          .then(resolve)
          .catch((e) => {
            times--;
            error = e;
            setTimeout(() => {
              attempt();
            }, delay);
          });
      }
    };
    attempt();
  });
};

export default async (url: string) => {
  return retryPromise<AxiosResponse>(() => axios.get(url), 3, 5000).catch(
    (error) => {
      // catch 内では res が取れない、、
      const message =
        error instanceof AxiosError ? `${error.code}: ${error.message}` : error;

      console.log(message);
      alert(message);
      throw message;
    },
  );
};
