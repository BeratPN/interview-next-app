import { Product, FormErrors } from '@/types';
import { APP_CONFIG, BLUR_DATA_URL } from '@/constants';

// Form validation utilities
export const validateProduct = (product: Partial<Product>, lang: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!product.name?.trim()) {
    errors.name = lang.productNameError;
  }
  
  if (!product.brand?.trim()) {
    errors.brand = lang.brandError;
  }
  
  if (!product.model?.trim()) {
    errors.model = lang.modelError;
  }
  
  if (!product.color?.trim()) {
    errors.color = lang.colorError;
  }
  
  if (!product.category) {
    errors.category = lang.productCategoryError;
  }
  
  if (product.price === undefined || product.price <= 0 || Number.isNaN(product.price)) {
    errors.price = lang.productPriceError;
  } else if (product.price > APP_CONFIG.VALIDATION.MAX_PRICE) {
    errors.price = lang.priceMaxError || 'Fiyat çok yüksek';
  }
  
  if (product.stock === undefined || Number.isNaN(product.stock)) {
    errors.stock = lang.stockError;
  } else if (product.stock < APP_CONFIG.VALIDATION.MIN_STOCK) {
    errors.stock = lang.stockMinError;
  } else if (product.stock > APP_CONFIG.VALIDATION.MAX_STOCK) {
    errors.stock = lang.stockMaxError;
  }
  
  return errors;
};

// Price formatting
export const formatPrice = (price: number, locale: string = 'tr-TR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Number formatting
export const formatNumber = (num: number, locale: string = 'tr-TR'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

// File validation
export const validateFile = (file: File): string | null => {
  if (!APP_CONFIG.IMAGES.ALLOWED_TYPES.includes(file.type as any)) {
    return 'Geçersiz dosya formatı';
  }
  
  if (file.size > APP_CONFIG.IMAGES.MAX_SIZE) {
    return 'Dosya boyutu çok büyük';
  }
  
  return null;
};

// URL parameter helpers
export const buildSearchParams = (params: Record<string, string | number | undefined>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// Error message helpers
export const getErrorMessage = (error: unknown, lang: Record<string, string>): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return lang.errorMessage || 'Bilinmeyen hata';
};

// Category styling helpers
export const getCategoryClass = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Elektronik': 'electronics',
    'Mobilya': 'furniture',
    'Dekorasyon': 'decoration',
    'Aydınlatma': 'lighting',
    'Giyim': 'clothing',
    'Ev & Yaşam': 'home',
    'Spor & Outdoor': 'sports',
    'Kitap & Hobi': 'books',
    'Otomotiv': 'automotive',
    'Bahçe & Tarım': 'garden'
  };
  
  return categoryMap[category] || 'default';
};

// Export BLUR_DATA_URL
export { BLUR_DATA_URL };
