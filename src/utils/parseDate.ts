export function parseDate(date: any, options: any = { dateStyle: 'long' }){
  let res = "";
  if(window.Intl && date){
    res = new Intl.DateTimeFormat(options?.locale || document.documentElement.lang, options).format(typeof date === 'object' ? date : new Date(date));
  }
  return res;
}
