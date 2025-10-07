import { useLanguage } from '@/context/LanguageContext';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ApiErrorHandler {
  static async handleResponse(response: Response): Promise<never> {
    let errorMessage = 'Bilinmeyen hata';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // JSON parse hatası, varsayılan mesajı kullan
    }

    switch (response.status) {
      case 400:
        throw new ApiError('Geçersiz istek: ' + errorMessage, 400);
      case 401:
        throw new ApiError('Yetkisiz erişim', 401);
      case 403:
        throw new ApiError('Erişim reddedildi', 403);
      case 404:
        throw new ApiError('Kaynak bulunamadı', 404);
      case 409:
        throw new ApiError('Çakışma: ' + errorMessage, 409);
      case 422:
        throw new ApiError('Geçersiz veri: ' + errorMessage, 422);
      case 429:
        throw new ApiError('Çok fazla istek, lütfen bekleyin', 429);
      case 500:
        throw new ApiError('Sunucu hatası', 500);
      case 502:
        throw new ApiError('Ağ geçidi hatası', 502);
      case 503:
        throw new ApiError('Servis kullanılamıyor', 503);
      case 504:
        throw new ApiError('Zaman aşımı', 504);
      default:
        throw new ApiError(errorMessage, response.status);
    }
  }

  static async handleFetch(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        await this.handleResponse(response);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network hatası
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.', 0);
      }
      
      throw new ApiError('Beklenmeyen hata: ' + (error as Error).message, 0);
    }
  }
}

export class ApiError extends Error implements ApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function showErrorToast(error: ApiError, lang: any) {
  const message = error.message || lang.networkError || 'Bir hata oluştu';
  
  // Basit toast notification (gerçek projede react-toastify gibi kütüphane kullanılabilir)
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    max-width: 400px;
    font-size: 0.875rem;
    line-height: 1.4;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
