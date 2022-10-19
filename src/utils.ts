export const sprintf = (fmt: string, ...args: (string | number)[]) => {
  return fmt.replace(/%[sdf]/g, () => String(args.shift() ?? ''));
};

const CHECK_INTERVAL = 1_000 * 60;
export const setIntervalOverSleep = (fn: () => void, interval: number) => {
  let lastExecutedAt = Date.now();
  setInterval(() => {
    const now = Date.now();
    if (now - lastExecutedAt >= interval) {
      lastExecutedAt = now;
      fn();
    }
  }, CHECK_INTERVAL);
};
