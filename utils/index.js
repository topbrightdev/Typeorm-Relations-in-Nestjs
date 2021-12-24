// if string is a percentage value with two decimals, for example 23.99
export const isPercentage = (number) =>
  /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/.test(number);

export function calculateGasMargin(value) {
  return value.mul(120).div(100);
}

export const fetcher = (url) => fetch(url).then((res) => res.json());
