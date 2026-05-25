import { configService } from "./ConfigService";

class StorageService {
  constructor() {
    this.memoryStorage = {};
    this.prefix = configService.get("storagePrefix");
  }

  createKey(key) {
    return `${this.prefix}_${key}`;
  }

  isLocalStorageAvailable() {
    try {
      return typeof window !== "undefined" && window.localStorage;
    } catch {
      return false;
    }
  }

  set(key, value) {
    const finalKey = this.createKey(key);
    const jsonValue = JSON.stringify(value);

    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(finalKey, jsonValue);
    } else {
      this.memoryStorage[finalKey] = jsonValue;
    }
  }

  get(key, defaultValue = null) {
    const finalKey = this.createKey(key);
    let jsonValue = null;

    if (this.isLocalStorageAvailable()) {
      jsonValue = localStorage.getItem(finalKey);
    } else {
      jsonValue = this.memoryStorage[finalKey];
    }

    if (!jsonValue) {
      return defaultValue;
    }

    try {
      return JSON.parse(jsonValue);
    } catch {
      return defaultValue;
    }
  }

  remove(key) {
    const finalKey = this.createKey(key);

    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(finalKey);
    } else {
      delete this.memoryStorage[finalKey];
    }
  }

  clearAppStorage() {
    if (!this.isLocalStorageAvailable()) {
      this.memoryStorage = {};
      return;
    }

    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const storageService = new StorageService();
export default StorageService;
