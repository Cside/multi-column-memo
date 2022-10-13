export const throttleAsync = (fn: (...args: any[]) => void, wait: number) => {
  let timerId: number | null = null;
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  return (...args: any[]) => {
    return new Promise((resolve) => {
      if (timerId !== null) {
        return resolve(null);
      }
      timerId = window.setTimeout(() => {
        timerId = null;
        resolve(fn(...args));
      }, wait);
    });
  };
};
