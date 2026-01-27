// Config/api.config.ts

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3005/api",
    BASE_URL_NO_API: import.meta.env.VITE_API_BASE_URL || "http://localhost:3005",
    ENDPOINTS: {
      TOURS: "/tours",
      TOUR_BY_ID: "/tours/:id",
      TOURS_BY_CATEGORY: "/tours/category/:category",
      TOURS_BY_LOCATION: "/tours/location/:location",
      TOP_RATED: "/tours/top-rated",
      SPECIAL_OFFERS: "/tours/special-offers",
      SEARCH: "/tours/search",
      CATEGORIES: "/tours/categories",
      LOCATIONS: "/tours/locations"
    },
    DEFAULT_HEADERS: {
      "Content-Type": "application/json",
    },
    TIMEOUT: 10000 // 10 saniye
  } as const;