// Hooks/useTour.ts

import { useState, useEffect, useCallback } from "react";
import { tourService } from "../services/tourService";
import { Tour, TourFilters, TourSort } from "../Types/Tour.types";

interface UseTourReturn {
  tours: Tour[];
  tour: Tour | null;
  categories: string[];
  locations: string[];
  loading: boolean;
  error: string | null;
  getTours: (filters?: TourFilters, sort?: TourSort) => Promise<void>;
  getTourById: (id: number) => Promise<void>;
  getCategories: () => Promise<void>;
  getLocations: () => Promise<void>;
  searchTours: (query: string) => Promise<void>;
  getSpecialOffers: () => Promise<void>;
  getTopRatedTours: (limit?: number) => Promise<void>;
}

export function useTour(): UseTourReturn {
  const [tours, setTours] = useState<Tour[]>([]);
  const [tour, setTour] = useState<Tour | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any) => {
    const message =
      err.response?.data?.message || err.message || "Bir hata oluştu";
    setError(message);
  }, []);

  const getTours = useCallback(
    async (filters?: TourFilters, sort?: TourSort) => {
      setLoading(true);
      setError(null);

      try {
        const data = await tourService.getAllTours(filters, sort);
        setTours(data);
      } catch (err: any) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getTourById = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const data = await tourService.getTourById(id);
        setTour(data);
      } catch (err: any) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await tourService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await tourService.getAllLocations();
      setLocations(data);
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const searchTours = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await tourService.searchTours(query);
        setTours(data);
      } catch (err: any) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getSpecialOffers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await tourService.getSpecialOffers();
      setTours(data);
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getTopRatedTours = useCallback(
    async (limit: number = 5) => {
      setLoading(true);
      setError(null);

      try {
        const data = await tourService.getTopRatedTours(limit);
        setTours(data);
      } catch (err: any) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  return {
    tours,
    tour,
    categories,
    locations,
    loading,
    error,
    getTours,
    getTourById,
    getCategories,
    getLocations,
    searchTours,
    getSpecialOffers,
    getTopRatedTours,
  };
}
