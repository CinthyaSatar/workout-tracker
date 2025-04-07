/**
 * App theme and styling constants
 */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const colors = {
  // Main brand colors inspired by the Mantra theme
  primary: "#7E57C2", // Purple - main brand color
  primaryDark: "#5E35B1", // Darker purple for gradients
  primaryLight: "#D1C4E9", // Light purple for backgrounds
  secondary: "#FF9A8B", // Soft coral/peach for accents

  // UI colors
  background: "#F8F5FF", // Very light purple tint for background
  card: "#ffffff", // White for cards
  text: "#3A3A3A", // Dark gray for main text
  textSecondary: "#6D6D6D", // Medium gray for secondary text
  textLight: "#9E9E9E", // Light gray for tertiary text
  border: "#E8E2F4", // Light purple-gray for borders

  // Functional colors
  success: "#66BB6A", // Green with slight desaturation
  error: "#EF5350", // Softer red
  warning: "#FFCA28", // Soft amber
  info: "#42A5F5", // Soft blue

  // Additional colors
  accent1: "#81D4FA", // Light blue
  accent2: "#A5D6A7", // Light green
  accent3: "#FFE082", // Light amber
  dark: "#212121", // Almost black
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
