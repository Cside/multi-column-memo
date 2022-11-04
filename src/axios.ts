import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { sprintf } from './utils';

const axios = Axios.create({ timeout: 1000 * 10 });

axiosRetry(axios, {
  retries: 3,
  retryDelay: () => 10 * 1000,
  retryCondition: () => true,
  onRetry: (cnt: number, error: Error, config: AxiosRequestConfig) => {
    console.log(
      sprintf(
        'Retry count: %s, url: %s, error: %s',
        String(cnt),
        config.url || '',
        error.toString(),
      ),
    );
  },
});

export default async (url: string) => {
  return axios.get(url).catch((error) => {
    // catch 内では res が取れない、、
    const message =
      error instanceof AxiosError ? `${error.code}: ${error.message}` : error;

    console.trace(message);
    alert(message);
    throw message;
  });
};
