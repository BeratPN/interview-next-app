// Ortak type tanımları
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  brand: string;
  model: string;
  color: string;
  stock: number;
}

export interface SearchParams {
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface HomeProps {
  searchParams: SearchParams;
}

export interface PaginationData {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export type SortBy = 'name' | 'price' | 'category' | 'order';
export type SortOrder = 'asc' | 'desc';
export type Language = 'tr' | 'en';
export type Theme = 'light' | 'dark';
export type FormMode = 'add' | 'edit';

// Component Props
export interface ProductRowProps {
  id: number;
  image?: string;
  name: string;
  category: string;
  price: number;
  brand?: string;
  model?: string;
  color?: string;
  stock?: number;
  onDelete?: () => void;
}

export interface ProductFormProps {
  mode?: FormMode;
  initialData?: Partial<Product>;
  categories?: string[];
  apiEndpoint?: string;
  onSuccess?: (product?: Product) => void;
  onCancel?: () => void;
}

export interface PageHeaderProps {
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
}

export interface ProductTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Context Types
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  lang: Record<string, string>;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// API Error Types
export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Cache Types
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface UseCacheOptions {
  ttl?: number;
  staleTime?: number;
}

export interface UseCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
}