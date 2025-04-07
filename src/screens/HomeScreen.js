import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppLayout from "../components/AppLayout";
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  shadows,
  getGreeting,
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
  },
  {
    id: "progress",
    name: "Progress",
    icon: require("../../assets/icon.png"),
    screen: "Progress",
    color: colors.success,
  },
  {
    id: "metrics",
    name: "Body Metrics",
    icon: require("../../assets/icon.png"),
    screen: "BodyMetrics",
    color: colors.secondary,
  },
  {
    id: "exercises",
    name: "Exercises",
    icon: require("../../assets/icon.png"),
    screen: "ExerciseLibrary",
    color: colors.warning,
  },
  {
    id: "templates",
    name: "Templates",
    icon: require("../../assets/icon.png"),
    screen: "Templates",
    color: colors.info,
  },
  {
    id: "recovery",
    name: "Recovery",
    icon: require("../../assets/icon.png"),
    screen: "RecoveryLog",
    color: colors.error,
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
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.headerGradient}
          >
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.username}>{USERNAME}</Text>
            <Text style={styles.tagline}>
              Ready to crush your fitness goals?
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Quick start button */}
        <TouchableOpacity
          style={styles.quickStartButton}
          onPress={() => navigation.navigate("EditWorkout")}
        >
          <Text style={styles.quickStartText}>Start New Workout</Text>
        </TouchableOpacity>

        {/* Features grid */}
        <Text style={styles.sectionTitle}>Features</Text>
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
                  { backgroundColor: feature.color + "20" },
                ]}
              >
                <Image source={feature.icon} style={styles.featureIcon} />
              </View>
              <Text style={styles.featureName}>{feature.name}</Text>
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
  },
  headerGradient: {
    padding: spacing.xl,
    borderRadius: 20,
    margin: spacing.md,
    ...shadows.medium,
  },
  greeting: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    color: colors.light,
    marginBottom: spacing.xs,
  },
  username: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.light,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: fontSizes.md,
    color: colors.light,
    opacity: 0.9,
  },
  quickStartButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: spacing.md,
    margin: spacing.md,
    alignItems: "center",
    ...shadows.small,
  },
  quickStartText: {
    color: colors.light,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
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
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: "center",
    ...shadows.small,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  featureIcon: {
    width: 30,
    height: 30,
    tintColor: colors.text,
  },
  featureName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    textAlign: "center",
  },
});
