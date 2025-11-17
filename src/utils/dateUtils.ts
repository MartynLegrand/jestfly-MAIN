/**
 * Date utility functions
 */

import { formatDistanceToNow as dateFnsFormatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a date string to relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @param locale - Optional locale (defaults to English, can use ptBR for Portuguese)
 * @returns Formatted relative time string
 */
export const formatDate = (dateString: string, locale?: 'en' | 'pt-BR'): string => {
  try {
    return dateFnsFormatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: locale === 'pt-BR' ? ptBR : undefined
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return locale === 'pt-BR' ? 'data desconhecida' : 'Unknown date';
  }
};

/**
 * Formats a date to relative time without try-catch (throws on error)
 * @param dateString - ISO date string
 * @param options - Optional formatting options
 * @returns Formatted relative time string
 */
export const formatDistanceToNow = (
  dateString: string,
  options?: { locale?: 'en' | 'pt-BR'; addSuffix?: boolean }
): string => {
  return dateFnsFormatDistanceToNow(new Date(dateString), {
    addSuffix: options?.addSuffix ?? true,
    locale: options?.locale === 'pt-BR' ? ptBR : undefined
  });
};
