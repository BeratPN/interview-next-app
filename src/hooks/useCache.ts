import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UseCacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleTime?: number; // Stale time in milliseconds
}

const cache = new Map<string, CacheItem<unknown>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 dakika
const DEFAULT_STALE_TIME = 1 * 60 * 1000; // 1 dakika

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions = {}
) {
  const { ttl = DEFAULT_TTL, staleTime = DEFAULT_STALE_TIME } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isStale = useCallback((item: CacheItem<T>) => {
    return Date.now() - item.timestamp > staleTime;
  }, [staleTime]);

  const isExpired = useCallback((item: CacheItem<T>) => {
    return Date.now() > item.expiresAt;
  }, []);

  const fetchData = useCallback(async (force = false) => {
    const cached = cache.get(key) as CacheItem<T> | undefined;
    
    // Cache'de var ve expire olmamışsa
    if (cached && !isExpired(cached) && !force) {
      setData(cached.data as T);
      
      // Stale ise background'da yenile
      if (isStale(cached)) {
        try {
          const freshData = await fetcher();
          const newItem: CacheItem<T> = {
            data: freshData,
            timestamp: Date.now(),
            expiresAt: Date.now() + ttl
          };
          cache.set(key, newItem);
          setData(freshData);
        } catch (err) {
          console.warn('Background refresh failed:', err);
        }
      }
      return;
    }

    // Cache'de yok veya expire olmuş, yeni data fetch et
    setLoading(true);
    setError(null);

    try {
      const freshData = await fetcher();
      const newItem: CacheItem<T> = {
        data: freshData,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };
      cache.set(key, newItem);
      setData(freshData);
    } catch (err) {
      setError(err as Error);
      // Hata durumunda stale data varsa onu kullan
      if (cached && !isExpired(cached)) {
        setData(cached.data as T);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, staleTime, isExpired, isStale]);

  const invalidate = useCallback(() => {
    cache.delete(key);
  }, [key]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate
  };
}

// Cache utility functions
export const cacheUtils = {
  clear: () => cache.clear(),
  delete: (key: string) => cache.delete(key),
  has: (key: string) => cache.has(key),
  size: () => cache.size
};
