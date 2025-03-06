import { Injectable, PLATFORM_ID, signal, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ILocalStorageService } from './local-storage.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements ILocalStorageService {
  private isBrowser = signal<boolean>(false);
  private platformId: Object = inject(PLATFORM_ID);

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  setItem<T>(key: string, value: T): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem<T>(key: string): T | null {
    if (this.isBrowser()) {
      const item = localStorage.getItem(key);
      try {
        return item ? (JSON.parse(item) as T) : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }
}
