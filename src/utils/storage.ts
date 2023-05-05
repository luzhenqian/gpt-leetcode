/**
 * Retrieves the value from the Chrome storage for the specified key.
 *
 * @template T The type of the value to be retrieved.
 * @param {string} key The key of the value to be retrieved from storage.
 * @returns {Promise<T>} A Promise that resolves with the retrieved value.
 */
export async function getStorage<T = any>(key: string): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
}
