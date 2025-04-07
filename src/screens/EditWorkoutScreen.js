import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getWorkoutById,
  saveWorkout,
  getExercises,
  getExercisesForWorkout,
} from "../data/storage";

export default function EditWorkoutScreen({ route, navigation }) {
  // Get the workout ID from route.params if editing
  const { workoutId } = route?.params || {}; // If undefined, we're creating a new workout

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all exercises
        const exercises = await getExercises();
        setAvailableExercises(exercises);

        // If editing an existing workout, load its data
        if (workoutId) {
          const workout = await getWorkoutById(workoutId);
          if (workout) {
            setName(workout.name);
            setDuration(workout.duration.toString());

            // Get the full exercise objects for the selected IDs
            const workoutExercises = await getExercisesForWorkout(workoutId);
            setSelectedExercises(workoutExercises);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load workout data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [workoutId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a workout name");
      return;
    }

    if (!duration || isNaN(parseInt(duration))) {
      Alert.alert("Error", "Please enter a valid duration in minutes");
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert("Error", "Please select at least one exercise");
      return;
    }

    try {
      const workoutData = {
        id: workoutId || undefined, // If undefined, a new ID will be generated
        name: name.trim(),
        duration: parseInt(duration),
        exercises: selectedExercises.map((ex) => ex.id),
      };

      const success = await saveWorkout(workoutData);

      if (success) {
        navigation?.goBack();
      } else {
        Alert.alert("Error", "Failed to save workout");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", "Failed to save workout");
    }
  };

  const toggleExercise = (exercise) => {
    const isSelected = selectedExercises.some((ex) => ex.id === exercise.id);

    if (isSelected) {
      setSelectedExercises(
        selectedExercises.filter((ex) => ex.id !== exercise.id)
      );
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {workoutId ? "Edit Workout" : "New Workout"}
          </Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter workout name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration in minutes"
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Exercises</Text>
          <Text style={styles.helperText}>
            Selected: {selectedExercises.length} exercises
          </Text>

          <FlatList
            data={availableExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedExercises.some(
                (ex) => ex.id === item.id
              );
              return (
                <TouchableOpacity
                  style={[
                    styles.exerciseItem,
                    isSelected && styles.exerciseItemSelected,
                  ]}
                  onPress={() => toggleExercise(item)}
                >
                  <Text
                    style={[
                      styles.exerciseName,
                      isSelected && styles.exerciseNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {item.sets} sets • {item.reps} reps
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            style={styles.exerciseList}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#666",
  },
  saveButton: {
    paddingHorizontal: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  helperText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  exerciseList: {
    marginBottom: 20,
  },
  exerciseItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseItemSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "#F0F8FF",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
  },
  exerciseNameSelected: {
    color: "#4A90E2",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
