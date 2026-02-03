import { MEAL_TIMES } from "./constants";

/**
 * Get current meal type based on time
 */
export const getCurrentMealType = () => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  for (const [mealType, times] of Object.entries(MEAL_TIMES)) {
    const start = parseTime(times.start);
    const end = parseTime(times.end);
    if (currentTime >= start && currentTime <= end) {
      return mealType;
    }
  }
  return null;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("en-US", defaultOptions);
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

/**
 * Calculate average rating
 */
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
