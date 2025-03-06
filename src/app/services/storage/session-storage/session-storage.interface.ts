export interface ISessionStorageService {
  /**
   * Saves data to the local storage.
   * @param key key of item to set
   * @param value The data to store in the local storage
   */
  setItem<T>(key: string, value: T): void;

  /**
   * Get item from local storage.
   * @param key key of item to get
   */
  getItem<T>(key: string): T | null;

  /**
   * Remove item from local storage.
   * @param key key of item to remove
   */
  removeItem(key: string): void;

  /**
   * Clear all stored data in the local storage.
   */
  clear(): void;
}
