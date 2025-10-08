// Uygulama sabitleri
export const APP_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 dakika
    DEFAULT_STALE_TIME: 1 * 60 * 1000, // 1 dakika
  },
  VALIDATION: {
    MAX_STOCK: 999999,
    MIN_STOCK: 1,
    MAX_PRICE: 9999999,
    MIN_PRICE: 0.01,
  },
  IMAGES: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    PLACEHOLDER_SIZE: 60,
    PREVIEW_SIZE: 200,
  },
} as const;

export const PRODUCT_CATEGORIES = [
  'Mobilya',
  'Dekorasyon', 
  'Aydınlatma',
  'Giyim',
  'Elektronik',
  'Ev & Yaşam',
  'Spor & Outdoor',
  'Kitap & Hobi',
  'Otomotiv',
  'Bahçe & Tarım'
] as const;

export const SORT_OPTIONS = [
  { value: 'name', label: 'sortByName' },
  { value: 'price', label: 'sortByPrice' },
  { value: 'category', label: 'sortByCategory' },
  { value: 'order', label: 'sortByOrder' },
] as const;

export const SORT_ORDERS = [
  { value: 'asc', label: 'ascending' },
  { value: 'desc', label: 'descending' },
] as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  UPLOAD: '/api/upload',
} as const;

export const ROUTES = {
  HOME: '/',
  ADD_PRODUCT: '/add-product',
  EDIT_PRODUCT: '/edit',
} as const;

export const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

