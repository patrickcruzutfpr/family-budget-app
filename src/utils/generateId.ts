/**
 * Generate a unique ID for database records
 * Uses timestamp + random string for uniqueness
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
};

/**
 * Generate a shorter ID for simpler use cases
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

/**
 * Validate if a string is a valid generated ID
 */
export const isValidId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  
  // Check if it matches our ID pattern (timestamp-random)
  const parts = id.split('-');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
};
