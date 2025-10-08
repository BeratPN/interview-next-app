// API Error class
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
          // Content-Type'ı sadece JSON istekleri için ekle
          ...(options.body && typeof options.body === 'string' && !options.body.includes('FormData') 
            ? { 'Content-Type': 'application/json' } 
            : {}),
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
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Ağ bağlantısı hatası', 0);
      }
      
      throw new ApiError('Beklenmeyen hata: ' + (error as Error).message, 0);
    }
  }
}

export function showErrorToast(error: ApiError, lang: Record<string, string>) {
  const message = error.message || lang.networkError || 'Bir hata oluştu';
  
  // Basit alert fallback (gerçek uygulamada toast library kullanılmalı)
  alert(message);
  
  // Console'a da logla
  console.error('API Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
  });
}