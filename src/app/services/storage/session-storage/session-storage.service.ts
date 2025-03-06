import { Injectable, PLATFORM_ID, signal, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ISessionStorageService } from './session-storage.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService implements ISessionStorageService {
  private isBrowser = signal<boolean>(false);
  private platformId: Object = inject(PLATFORM_ID);

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  setItem<T>(key: string, value: T): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem<T>(key: string): T | null {
    if (this.isBrowser()) {
      const item = sessionStorage.getItem(key);
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
      sessionStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isBrowser()) {
      sessionStorage.clear();
    }
  }
}
