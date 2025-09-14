import { Injectable } from '@angular/core';

interface CachePage<T> {
  items: T[];
  total: number;
}

interface CacheData<T> {
  pages: Record<number, T[]>;
  total: number;
  scrollY?: number;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheData<any>>();

  getListCache<T>(key: string): CacheData<T> | null {
    return this.cache.get(key) || null;
  }

  savePage<T>(key: string, page: number, items: T[], total: number) {
    let cacheData = this.cache.get(key);
    if (!cacheData) {
      cacheData = { pages: {}, total };
      this.cache.set(key, cacheData);
    }
    cacheData.pages[page] = items;
    cacheData.total = total;
  }

  saveScroll(key: string, scrollY: number) {
    const cacheData = this.cache.get(key);
    if (cacheData) {
      cacheData.scrollY = scrollY;
    }
  }

  clearCache(key: string) {
    this.cache.delete(key);
  }
}
