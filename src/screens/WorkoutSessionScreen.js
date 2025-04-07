import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getWorkoutById,
  getExercisesForWorkout,
  saveWorkoutHistory,
} from "../data/storage";

export default function WorkoutSessionScreen({ route, navigation }) {
  // Get the workout ID from route.params
  const { workoutId } = route?.params || { workoutId: "1" }; // Default to '1' for testing

  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [exerciseData, setExerciseData] = useState({});
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentRpe, setCurrentRpe] = useState(7);
  const [currentNotes, setCurrentNotes] = useState("");

  const timerRef = useRef(null);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const workoutData = await getWorkoutById(workoutId);
        if (!workoutData) {
          Alert.alert("Error", "Workout not found");
          navigation?.goBack();
          return;
        }

        setWorkout(workoutData);

        const exercisesData = await getExercisesForWorkout(workoutId);
        setExercises(exercisesData);

        // Initialize workout
        setWorkoutStartTime(new Date());
      } catch (error) {
        console.error("Error loading workout:", error);
        Alert.alert("Error", "Failed to load workout");
        navigation?.goBack();
      }
    };

    loadWorkout();

    return () => {
      // Clean up timer when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workoutId]);

  useEffect(() => {
    if (isResting) {
      // Start rest timer
      const currentExercise = exercises[currentExerciseIndex];
      setTimer(currentExercise?.rest || 60);

      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            // Rest period is over
            clearInterval(timerRef.current);
            setIsResting(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isResting, currentExerciseIndex, exercises]);

  const handleCompleteSet = () => {
    const currentExercise = exercises[currentExerciseIndex];

    if (!currentExercise) return;

    // Save the current set data
    const weight = currentWeight || "0";
    const exerciseId = currentExercise.id;

    // Update exercise data with current set info
    const currentExerciseData = exerciseData[exerciseId] || {
      sets: [],
      notes: currentNotes,
      rpe: currentRpe,
    };

    currentExerciseData.sets.push({
      setNumber: currentSet,
      weight: parseFloat(weight),
      reps: currentExercise.defaultReps,
    });

    currentExerciseData.notes = currentNotes;
    currentExerciseData.rpe = currentRpe;

    setExerciseData({
      ...exerciseData,
      [exerciseId]: currentExerciseData,
    });

    if (currentSet < currentExercise.defaultSets) {
      // Move to next set and start rest period
      setCurrentSet(currentSet + 1);
      setIsResting(true);
    } else {
      // Exercise completed, update completed exercises
      setCompletedExercises({
        ...completedExercises,
        [currentExercise.id]: true,
      });

      // Reset for next exercise
      setCurrentWeight("");
      setCurrentRpe(7);
      setCurrentNotes("");

      // Move to next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      } else {
        // Workout completed
        handleCompleteWorkout();
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const endTime = new Date();
      const durationMs = endTime - workoutStartTime;
      const durationMinutes = Math.round(durationMs / (1000 * 60));

      const workoutSession = {
        workoutId,
        startTime: workoutStartTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationMinutes,
        exercises: exercises.map((ex) => {
          const exData = exerciseData[ex.id] || { sets: [], notes: "", rpe: 0 };
          return {
            id: ex.id,
            name: ex.name,
            sets: exData.sets,
            rpe: exData.rpe,
            notes: exData.notes,
            completed: !!completedExercises[ex.id],
          };
        }),
      };

      await saveWorkoutHistory(workoutSession);

      Alert.alert(
        "Workout Completed",
        `Great job! You completed your workout in ${durationMinutes} minutes.`,
        [{ text: "OK", onPress: () => navigation?.navigate("Home") }]
      );
    } catch (error) {
      console.error("Error saving workout history:", error);
      Alert.alert("Error", "Failed to save workout history");
      navigation?.goBack();
    }
  };

  if (!workout || exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading workout...</Text>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            Alert.alert(
              "End Workout",
              "Are you sure you want to end this workout?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "End Workout", onPress: () => navigation?.goBack() },
              ]
            );
          }}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {isResting ? (
        <View style={styles.restContainer}>
          <Text style={styles.restTitle}>Rest Time</Text>
          <Text style={styles.restTimer}>{timer}</Text>
          <Text style={styles.restSubtitle}>seconds</Text>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkipRest}>
            <Text style={styles.skipButtonText}>Skip Rest</Text>
          </TouchableOpacity>

          <Text style={styles.nextUpText}>
            Next: Set {currentSet} of {currentExercise.sets} -{" "}
            {currentExercise.name}
          </Text>
        </View>
      ) : (
        <View style={styles.exerciseContainer}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseProgress}>
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </Text>
          </View>

          <View style={styles.setInfo}>
            <Text style={styles.setTitle}>
              Set {currentSet} of {currentExercise.defaultSets}
            </Text>
            <Text style={styles.repCount}>
              {currentExercise.defaultReps} reps
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Weight:</Text>
              <TextInput
                style={styles.weightInput}
                value={currentWeight}
                onChangeText={setCurrentWeight}
                placeholder="Enter weight"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>RPE:</Text>
              <View style={styles.rpeSelector}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.rpeButton,
                      currentRpe === value && styles.rpeButtonSelected,
                    ]}
                    onPress={() => setCurrentRpe(value)}
                  >
                    <Text
                      style={[
                        styles.rpeButtonText,
                        currentRpe === value && styles.rpeButtonTextSelected,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Notes:</Text>
              <TextInput
                style={styles.notesInput}
                value={currentNotes}
                onChangeText={setCurrentNotes}
                placeholder="Add form notes, etc."
                multiline
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteSet}
          >
            <Text style={styles.completeButtonText}>
              {currentSet < currentExercise.defaultSets
                ? "Complete Set"
                : "Complete Exercise"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Workout Progress</Text>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const isCompleted = completedExercises[item.id];
            const isCurrent = index === currentExerciseIndex;

            return (
              <View
                style={[
                  styles.progressItem,
                  isCompleted && styles.progressItemCompleted,
                  isCurrent && styles.progressItemCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.progressItemText,
                    isCompleted && styles.progressItemTextCompleted,
                    isCurrent && styles.progressItemTextCurrent,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={styles.progressItemSets}>
                  {item.sets} × {item.reps}
                </Text>
                {isCompleted && <Text style={styles.progressItemCheck}>✓</Text>}
              </View>
            );
          }}
          style={styles.progressList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: "100%",
  },
  inputRow: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  weightInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    fontSize: 16,
  },
  notesInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  rpeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rpeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  rpeButtonSelected: {
    backgroundColor: "#4A90E2",
  },
  rpeButtonText: {
    fontSize: 14,
    color: "#666",
  },
  rpeButtonTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
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
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 28,
    color: "#666",
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  restContainer: {
    backgroundColor: "#4A90E2",
    padding: 30,
    alignItems: "center",
  },
  restTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  restTimer: {
    fontSize: 60,
    fontWeight: "700",
    color: "#fff",
  },
  restSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  nextUpText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  exerciseContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  exerciseHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  exerciseProgress: {
    fontSize: 14,
    color: "#666",
  },
  setInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  repCount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#4A90E2",
  },
  completeButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  progressContainer: {
    flex: 1,
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  progressList: {
    flex: 1,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  progressItemCompleted: {
    opacity: 0.6,
  },
  progressItemCurrent: {
    backgroundColor: "#F0F8FF",
  },
  progressItemText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  progressItemTextCompleted: {
    textDecorationLine: "line-through",
  },
  progressItemTextCurrent: {
    fontWeight: "600",
    color: "#4A90E2",
  },
  progressItemSets: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  progressItemCheck: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
  },
});
