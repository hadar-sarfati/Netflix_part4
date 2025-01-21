const themes = {
  light: {
    'body-background': '#d8d8d8', // Light gray background to reduce excessive brightness
    'main-gradient': 'linear-gradient(to bottom, rgba(219, 218, 218, 0.74), rgba(243, 240, 240, 0.96))', // Light gradient with transparency
    'text-color': '#333333', // Dark gray text for good contrast but not as harsh as black
    'menu-gradient': 'linear-gradient(to bottom, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.32))', // Subtle glassy effect with less white
    'menu-text': '#333333', // Darker text for menus to keep contrast soft but clear
    'menu-shadow': '0 4px 15px rgba(0, 0, 0, 0.6)', // Very soft shadow for depth
    'search-bg': 'rgba(255, 255, 255, 0.3)', // Light transparent background for search bar
    'search-text': '#333333', // Dark gray for search text
    'search-placeholder': 'rgba(0, 0, 0, 0.5)', // Slightly lighter placeholder text
    'button-hover': 'rgba(0, 0, 0, 0.08)', // Soft hover effect on buttons
    'fade-overlay-gradient': 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 95%, rgb(227, 226, 226) 100%)', // Transparent fade with a soft white finish
    'light-fade-overlay-gradient': 'linear-gradient(to bottom, rgba(205, 203, 203, 0.84) 0%, rgba(255, 255, 255, 0.68) 100%)', // Subtle fade effect for overlays
    'moviesbycategories': 'rgba(243, 240, 240, 0.96))', // Light transparent background for category elements
  },
    dark: {
      'body-background': '#000000',
      'main-gradient': 'linear-gradient(to bottom, #1f1f1f63, #00000055, #4140403d)',
      'text-color': '#ffffff',
      'menu-gradient': 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
      'menu-text': '#ffffff',
      'menu-shadow': '0 4px 10px rgba(0, 0, 0, 0.71)',
      'search-bg': 'rgba(255, 255, 255, 0.15)',
      'search-text': '#ffffff',
      'search-placeholder': 'rgba(255, 255, 255, 0.7)',
      'button-hover': 'rgba(255, 255, 255, 0.1)',
      'fade-overlay-gradient': 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)', // Dark fade gradient
      'dark-fade-overlay-gradient': 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)', // Dark mode specific fade gradient
    }
  };
  
  export default themes;
  