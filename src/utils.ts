export const sprintf = (fmt: string, ...args: (string | number)[]) => {
  return fmt.replace(/%[sdf]/g, () => String(args.shift() ?? ''));
};
