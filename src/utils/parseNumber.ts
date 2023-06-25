/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 * @param value number
 * @param options Intl options
 * @returns number
 */
export const parseNumber = (value: number, options?: any) => new Intl.NumberFormat(document.documentElement.lang || 'en', options).format(value);
