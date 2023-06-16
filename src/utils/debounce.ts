/**
 * 
 * @param func Function
 * @param wait wait time for hit function
 * @returns executed function
 */
export const debounce = (func: any, wait: number = 300) => {
  let timeout: any;

  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
