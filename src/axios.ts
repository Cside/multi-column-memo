import Axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

const axios = Axios.create({ timeout: 1000 * 10 });

axiosRetry(axios, {
  retries: 3,
  retryDelay: () => 5000,
  retryCondition: () => true,
});

export default async (url: string) => {
  return axios.get(url).catch((error) => {
    // catch 内では res が取れない、、
    const message =
      error instanceof AxiosError ? `${error.code}: ${error.message}` : error;

    console.log(message);
    alert(message);
    throw message;
  });
};
