import { weatherToIcons } from './forecast';
for (const spec of [
  { input: '晴れ', expects: '☀' },
  { input: '曇り', expects: '☁' },
  { input: '雨', expects: '☔' },
  { input: '雪', expects: '❄' },
  { input: '晴れ後曇り', expects: '☀☁' },
  { input: '雨のち雪', expects: '☔❄' },
  { input: '雪時々曇り', expects: '❄☁' },
  { input: '曇りときどき雨', expects: '☁☔' },
  { input: '雨一時晴れ', expects: '☔☀' },
]) {
  it(`${spec.input} => ${spec.expects}`, () => {
    expect(weatherToIcons(spec.input)).toBe(spec.expects);
  });
}
