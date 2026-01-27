// Utils/api.helper.ts
import { API_CONFIG } from '../Config/api.config';

/**
 * API base URL'i döndürür (API path olmadan)
 * Örnek: http://localhost:3005 veya http://49.13.94.27:3005
 */
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL_NO_API;
};

/**
 * API URL'i döndürür (API path ile)
 * Örnek: http://localhost:3005/api veya http://49.13.94.27:3005/api
 */
export const getApiUrl = (): string => {
  return API_CONFIG.BASE_URL;
};

/**
 * Tam endpoint URL'i oluşturur
 * @param endpoint - Endpoint path (örn: '/tours', '/users')
 * @param useApiPrefix - API prefix kullanılsın mı? (default: false)
 */
export const buildApiUrl = (endpoint: string, useApiPrefix: boolean = false): string => {
  const baseUrl = useApiPrefix ? getApiUrl() : getApiBaseUrl();
  // endpoint zaten / ile başlıyorsa, baseUrl'den sonra direkt ekle
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};



