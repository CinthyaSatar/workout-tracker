/**
 * App theme and styling constants
 */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const colors = {
  // Main brand colors - Earth tones
  primary: "#A67C52", // Bronze/copper - main brand color
  primaryDark: "#8B5A2B", // Darker bronze for gradients
  primaryLight: "#D7C0A1", // Light beige for backgrounds
  secondary: "#606C38", // Olive green for accents

  // UI colors
  background: "#F5F1E9", // Warm beige background
  card: "#FFFFFF", // White for cards
  text: "#3A3025", // Dark brown for main text
  textSecondary: "#6B5B4E", // Medium brown for secondary text
  textLight: "#9C8E82", // Light brown for tertiary text
  border: "#E6DFD4", // Light beige for borders

  // Functional colors
  success: "#606C38", // Olive green
  error: "#BC6C25", // Burnt orange
  warning: "#DDA15E", // Light bronze
  info: "#83A598", // Sage green

  // Additional colors
  accent1: "#DDA15E", // Light bronze
  accent2: "#FEFAE0", // Cream
  accent3: "#283618", // Dark olive
  dark: "#22333B", // Dark slate
  light: "#FFFFFF", // White
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  title: 44,
};

export const fontWeights = {
  light: "300", // Light weight for elegant headings
  regular: "400", // Regular text
  medium: "500", // Medium emphasis
  semibold: "600", // Semi-bold for subtitles
  bold: "700", // Bold for important elements
};

// Font families - you would need to install and link these fonts
export const fontFamilies = {
  heading: "System", // Replace with actual font like "Playfair Display"
  body: "System", // Replace with actual font like "Poppins"
  accent: "System", // Replace with actual font like "Montserrat"
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
};

// Helper function to get greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

// Screen dimensions
export const screenWidth = width;
export const screenHeight = height;

// Layout constants
export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
