import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Sample data - will be replaced with AsyncStorage later
const SAMPLE_EXERCISES = [
  { id: "1", name: "Push-ups", sets: 3, reps: 12, rest: 60 },
  { id: "2", name: "Pull-ups", sets: 3, reps: 8, rest: 90 },
  { id: "3", name: "Bench Press", sets: 4, reps: 10, rest: 120 },
  { id: "4", name: "Shoulder Press", sets: 3, reps: 12, rest: 60 },
];

const SAMPLE_WORKOUTS = [
  { id: "1", name: "Upper Body", exercises: 4, duration: 45 },
  { id: "2", name: "Lower Body", exercises: 5, duration: 50 },
  { id: "3", name: "Core Strength", exercises: 6, duration: 30 },
  { id: "4", name: "Full Body", exercises: 8, duration: 60 },
];

export default function WorkoutDetailScreen({ route, navigation }) {
  // Get the workout ID from route.params
  const { workoutId } = route?.params || { workoutId: "1" }; // Default to '1' for testing

  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // In a real app, we'd fetch this from AsyncStorage
    const selectedWorkout = SAMPLE_WORKOUTS.find((w) => w.id === workoutId);
    setWorkout(selectedWorkout);
    setExercises(SAMPLE_EXERCISES);
  }, [workoutId]);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{workout.exercises}</Text>
          <Text style={styles.infoLabel}>Exercises</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{workout.duration}</Text>
          <Text style={styles.infoLabel}>Minutes</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Exercises</Text>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseDetails}>
              {item.sets} sets • {item.reps} reps • {item.rest}s rest
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.startButton}
        onPress={() =>
          navigation?.navigate("WorkoutSession", { workoutId: workout.id })
        }
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#4A90E2",
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A90E2",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  sectionHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  startButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
