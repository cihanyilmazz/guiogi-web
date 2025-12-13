// Utils/http.client.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../Config/api.config';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (error.response) {
      // Sunucu hataları
      console.error('API Hatası:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Network hataları
      console.error('Network Hatası:', error.message);
    } else {
      // Diğer hatalar
      console.error('Hata:', error.message);
    }
  }
}

export const httpClient = new HttpClient();