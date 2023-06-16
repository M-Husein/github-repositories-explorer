/**
 * 
 * @param args 
 * @returns 
 */
export function cx(...args: unknown[]){
  return args
    .flat()
    .filter(Boolean) // s => typeof s === 'string'
    .join(' ')
    .trim()
    ||
    undefined
}
