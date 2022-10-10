export const throttle = (fn: (...args: any[]) => void, wait: number) => {
  let timerId: number | null = null;
  return (...args: any[]) => {
    if (timerId !== null) {
      return;
    }
    timerId = window.setTimeout(() => {
      fn(...args);
      timerId = null;
    }, wait);
  };
};