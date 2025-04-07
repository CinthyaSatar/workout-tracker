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
  fontFamilies,
  spacing,
  shadows,
  getGreeting,
  borderRadius,
} from "../utils/theme";

// Temporary username - will be replaced with authentication later
const USERNAME = "Cinthya";

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
  const [greeting, setGreeting] = useState(getGreeting());
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Update greeting if time of day changes
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const navigateToFeature = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <AppLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with greeting */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerBackground}>
            <LinearGradient
              colors={["rgba(126, 87, 194, 0.8)", "rgba(94, 53, 177, 0.9)"]}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.username}>{USERNAME}</Text>
                <Text style={styles.tagline}>
                  Find balance in body and mind
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Quick start button */}
        <TouchableOpacity
          style={styles.quickStartButton}
          onPress={() => navigation.navigate("EditWorkout")}
        >
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.quickStartGradient}
          >
            <Text style={styles.quickStartText}>Begin Your Practice</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Features section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Explore Your Journey</Text>
          <Text style={styles.sectionSubtitle}>
            Discover all the tools to enhance your wellness
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => navigateToFeature(feature.screen)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: feature.color + "15" },
                ]}
              >
                <Image source={feature.icon} style={styles.featureIcon} />
              </View>
              <Text style={styles.featureName}>{feature.name}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    height: 240,
  },
  headerBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    margin: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    padding: 0,
  },
  headerContent: {
    padding: spacing.xl,
    alignItems: "center",
  },
  greeting: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.light,
    color: colors.light,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  username: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.light,
    marginBottom: spacing.md,
    textAlign: "center",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.light,
    color: colors.light,
    opacity: 0.9,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  quickStartButton: {
    margin: spacing.md,
    borderRadius: 30,
    overflow: "hidden",
    ...shadows.medium,
  },
  quickStartGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStartText: {
    color: colors.light,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
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
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  },
  featureCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 35,
    height: 35,
    tintColor: colors.primary,
  },
  featureName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
