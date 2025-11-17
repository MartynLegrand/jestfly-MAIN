
// Utility functions for the booking page

// Get the background gradient CSS classes based on booking type
export const getBackgroundGradientClassForBookingType = (bookingType: 'dj' | 'studio' | 'consultation') => {
  switch(bookingType) {
    case 'dj':
      return 'from-purple-600/20 to-blue-600/20';
    case 'studio':
      return 'from-cyan-600/20 to-blue-600/20';
    case 'consultation':
      return 'from-pink-600/20 to-purple-600/20';
  }
};

// Get button gradient CSS classes with hover states based on booking type
export const getButtonGradientClassForBookingType = (bookingType: 'dj' | 'studio' | 'consultation') => {
  switch(bookingType) {
    case 'dj':
      return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700';
    case 'studio':
      return 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700';
    case 'consultation':
      return 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700';
  }
};
