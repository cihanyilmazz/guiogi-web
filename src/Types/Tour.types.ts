// Types/Tour.types.ts

export interface Tour {
    id: number;
    title: string;
    description: string;
    coverImage: string;
    location: string;
    duration: string;
    groupSize: string;
    category: string;
    season: string;
    guide: string;
    rating: number;
    reviewCount: number;
    specialOffer: string;
    included: string[];
    highlights: string[];
    price?: number;
    discount?: number;
    startDate?: string;
    endDate?: string;
    maxCapacity?: number;
    currentBookings?: number;
    isActive?: boolean;
  }
  
  export interface TourFilters {
    category?: string;
    location?: string;
    season?: string;
    minRating?: number;
    maxPrice?: number;
    search?: string;
  }
  
  export interface TourSort {
    field: "rating" | "price" | "reviewCount" | "title";
    order: "asc" | "desc";
  }
  
  export interface TourResponse {
    success: boolean;
    data: Tour[] | Tour;
    message?: string;
    total?: number;
  }