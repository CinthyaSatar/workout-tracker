import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppLayout from "../components/AppLayout";
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  shadows,
  borderRadius,
} from "../utils/theme";

// Navigation categories like Yoga International
const NAV_CATEGORIES = [
  { id: "home", name: "Home" },
  { id: "features", name: "Features" },
  { id: "pricing", name: "Pricing" },
  { id: "about", name: "About" },
  { id: "contact", name: "Contact" },
];

// Marketing sections
const MARKETING_SECTIONS = [
  {
    id: "track",
    title: "Track Your Progress",
    description:
      "Log workouts, monitor gains, and see your improvement over time with detailed analytics.",
    icon: require("../../assets/icon.png"),
  },
  {
    id: "plan",
    title: "Plan Your Workouts",
    description:
      "Create custom workout templates or choose from our library of expert-designed routines.",
    icon: require("../../assets/icon.png"),
  },
  {
    id: "achieve",
    title: "Achieve Your Goals",
    description:
      "Set fitness goals and track your journey with body metrics and progress photos.",
    icon: require("../../assets/icon.png"),
  },
];

// Feature icons
const FEATURES = [
  {
    id: "workouts",
    name: "Workouts",
    icon: require("../../assets/icon.png"),
    screen: "WorkoutDetail",
    color: colors.primary,
    description: "Track your daily workouts",
  },
  {
    id: "progress",
    name: "Progress",
    icon: require("../../assets/icon.png"),
    screen: "Progress",
    color: colors.success,
    description: "Monitor your fitness journey",
  },
  {
    id: "metrics",
    name: "Body Metrics",
    icon: require("../../assets/icon.png"),
    screen: "BodyMetrics",
    color: colors.secondary,
    description: "Track your body measurements",
  },
  {
    id: "exercises",
    name: "Exercises",
    icon: require("../../assets/icon.png"),
    screen: "ExerciseLibrary",
    color: colors.warning,
    description: "Browse exercise library",
  },
  {
    id: "templates",
    name: "Templates",
    icon: require("../../assets/icon.png"),
    screen: "Templates",
    color: colors.info,
    description: "Save your favorite routines",
  },
  {
    id: "recovery",
    name: "Recovery",
    icon: require("../../assets/icon.png"),
    screen: "RecoveryLog",
    color: colors.error,
    description: "Track rest and recovery",
  },
];

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("home");
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    // Will be implemented later
    alert("Login functionality will be implemented in the future");
  };

  const handleSignUp = () => {
    // Will be implemented later
    alert("Sign up functionality will be implemented in the future");
  };

  const navigateToFeature = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <AppLayout>
      {/* Top Navigation Bar - Similar to Yoga International */}
      <View style={styles.topNav}>
        <Text style={styles.logo}>FITTRACK</Text>
        <View style={styles.navButtons}>
          {NAV_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.navButton,
                selectedCategory === category.id && styles.navButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.navButtonText,
                  selectedCategory === category.id &&
                    styles.navButtonTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner - Landing Page Style */}
        <Animated.View style={[styles.heroBanner, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            style={styles.heroBannerGradient}
          >
            <View style={styles.heroBannerContent}>
              <Text style={styles.heroTitle}>Track Your Fitness Journey</Text>
              <Text style={styles.heroSubtitle}>
                The complete workout tracker to help you achieve your fitness
                goals
              </Text>

              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.heroButtonPrimary}
                  onPress={handleSignUp}
                >
                  <Text style={styles.heroButtonPrimaryText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.heroButtonSecondary}
                  onPress={() => navigation.navigate("EditWorkout")}
                >
                  <Text style={styles.heroButtonSecondaryText}>Try Demo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <Text style={styles.sectionSubtitle}>
              Everything you need to track your fitness journey
            </Text>
          </View>

          <View style={styles.marketingGrid}>
            {MARKETING_SECTIONS.map((section) => (
              <View key={section.id} style={styles.marketingCard}>
                <View style={styles.marketingIconContainer}>
                  <Image source={section.icon} style={styles.marketingIcon} />
                </View>
                <Text style={styles.marketingTitle}>{section.title}</Text>
                <Text style={styles.marketingDescription}>
                  {section.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* App Screenshots Section */}
        <View style={styles.screenshotsSection}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Powerful & Easy to Use</Text>
            <Text style={styles.sectionSubtitle}>
              Designed to make tracking your workouts simple and effective
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.screenshotsContainer}
          >
            {FEATURES.slice(0, 3).map((feature) => (
              <View key={feature.id} style={styles.screenshotCard}>
                <View style={styles.screenshotImageContainer}>
                  <Image source={feature.icon} style={styles.screenshotImage} />
                </View>
                <Text style={styles.screenshotCaption}>{feature.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What Our Users Say</Text>
            <Text style={styles.sectionSubtitle}>
              Join thousands of satisfied fitness enthusiasts
            </Text>
          </View>

          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "This app has completely transformed my workout routine. I can easily track my progress and see how far I've come!"
            </Text>
            <Text style={styles.testimonialAuthor}>- Sarah J.</Text>
          </View>

        {/* Call to Action Section */}
        <View style={styles.ctaSection}>
          <View style={styles.sectionContainer}>
            <Text style={styles.ctaTitle}>Ready to Start Your Fitness Journey?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of users who have transformed their fitness with FitTrack
            </Text>
          </View>

          <View style={styles.ctaButtons}>
            <TouchableOpacity
              style={styles.ctaPrimaryButton}
              onPress={handleSignUp}
            >
              <Text style={styles.ctaPrimaryButtonText}>Sign Up Free</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ctaSecondaryButton}
              onPress={() => navigation.navigate("EditWorkout")}
            >
              <Text style={styles.ctaSecondaryButtonText}>Explore Features</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 FitTrack. All rights reserved.</Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  // Top navigation bar
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  navButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
  },
  navButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
  },
  navButtonSelected: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  navButtonText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  navButtonTextSelected: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  loginButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loginButtonText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },

  // Hero banner
  heroBanner: {
    marginBottom: spacing.xl,
    height: 500,
  },
  heroBannerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  heroBannerContent: {
    alignItems: "center",
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    color: colors.light,
    marginBottom: spacing.md,
    textAlign: "center",
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.light,
    color: colors.light,
    opacity: 0.9,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: spacing.xl,
    maxWidth: 500,
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  heroButtonPrimary: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.round,
    marginHorizontal: spacing.sm,
    ...shadows.medium,
  },
  heroButtonPrimaryText: {
    color: colors.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  heroButtonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: colors.light,
    marginHorizontal: spacing.sm,
  },
  heroButtonSecondaryText: {
    color: colors.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
  // Features section
  featuresSection: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  marketingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  marketingCard: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  marketingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  marketingIcon: {
    width: 40,
    height: 40,
    tintColor: colors.primary,
  },
  marketingTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  marketingDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.light,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  // Screenshots section
  screenshotsSection: {
    backgroundColor: colors.card,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  screenshotsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  screenshotCard: {
    width: 280,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginRight: spacing.lg,
    overflow: "hidden",
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  screenshotImageContainer: {
    height: 400,
    width: "100%",
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  screenshotImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  screenshotCaption: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    textAlign: 'center',
  },

  // Testimonials section
  testimonialsSection: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  testimonialCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    margin: spacing.md,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  testimonialText: {
    fontSize: fontSizes.lg,
    fontStyle: 'italic',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  testimonialAuthor: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  // Call to action section
  ctaSection: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xxl,
    marginBottom: 0,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  ctaSubtitle: {
    fontSize: fontSizes.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 600,
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  ctaPrimaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.round,
    marginHorizontal: spacing.sm,
    ...shadows.medium,
  },
  ctaPrimaryButtonText: {
    color: colors.light,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: colors.primary,
    marginHorizontal: spacing.sm,
  },
  ctaSecondaryButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },

  // Footer
  footer: {
    backgroundColor: colors.dark,
    padding: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.light,
    fontSize: fontSizes.sm,
    opacity: 0.8,
  },
});
