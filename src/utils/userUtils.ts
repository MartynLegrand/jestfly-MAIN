/**
 * User utility functions
 */

/**
 * Generates initials from a user's name
 * @param name - The full name of the user
 * @returns Uppercase initials (up to 2 characters)
 * @example
 * getInitials("John Doe") // returns "JD"
 * getInitials("Jane") // returns "JA"
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return 'U';
  }

  return name
    .trim()
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
