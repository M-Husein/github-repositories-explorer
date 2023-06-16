/**
 * @param url : string
 * @param options : Object
 * @returns : Promise
 * ### Docs:
 * - [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * - [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
 * #
 */
export const fetchApi = (url: string, options: any = {}) => 
  new Promise((resolve, reject) => {
    const { responseType, ...restOptions } = options;

    return fetch(url, restOptions)
      .then((response) => {
        if (!response?.ok) {
          reject('Network response was not OK');
        }
        // @ts-ignore
        return response[responseType || "json"](); // json | text | blob | arraybuffer | formData
      })
      .then(resolve)
      .catch(reject);
  });
