// Config/api.config.ts

export const API_CONFIG = {
    BASE_URL: "http://localhost:3005/api",
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