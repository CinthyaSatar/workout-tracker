import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { initializeStorage } from "./src/data/storage";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize the app data
    const prepare = async () => {
      try {
        await initializeStorage();
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading Workout Tracker...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
