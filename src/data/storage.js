import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const WORKOUTS_KEY = "@workout_tracker:workouts";
const EXERCISES_KEY = "@workout_tracker:exercises";
const HISTORY_KEY = "@workout_tracker:history";
const TEMPLATES_KEY = "@workout_tracker:templates";
const BODY_METRICS_KEY = "@workout_tracker:body_metrics";
const EXERCISE_STATS_KEY = "@workout_tracker:exercise_stats";
const RECOVERY_LOG_KEY = "@workout_tracker:recovery_log";
const EXERCISE_LIBRARY_KEY = "@workout_tracker:exercise_library";

// Sample data for initial setup
const initialWorkouts = [
  {
    id: "1",
    name: "Upper Body",
    type: "Push Day",
    exercises: ["1", "3", "4"],
    duration: 45,
    color: "#4A90E2",
    notes: "Focus on chest and shoulders",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isTemplate: false,
  },
  {
    id: "2",
    name: "Lower Body",
    type: "Leg Day",
    exercises: ["5", "6", "7", "8"],
    duration: 50,
    color: "#FF6B6B",
    notes: "Heavy squats and deadlifts",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isTemplate: false,
  },
  {
    id: "3",
    name: "Core Strength",
    type: "Core Day",
    exercises: ["9", "10", "11"],
    duration: 30,
    color: "#50E3C2",
    notes: "Focus on stability and control",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isTemplate: false,
  },
  {
    id: "4",
    name: "Full Body",
    type: "Full Body",
    exercises: ["1", "5", "9", "12"],
    duration: 60,
    color: "#9013FE",
    notes: "High intensity, minimal rest",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isTemplate: false,
  },
];

const initialExercises = [
  {
    id: "1",
    name: "Push-ups",
    category: "Upper Body",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    isBodyweight: true,
    isFavorite: false,
    notes: "Keep core tight, elbows at 45 degrees",
  },
  {
    id: "2",
    name: "Pull-ups",
    category: "Upper Body",
    muscleGroups: ["Back", "Biceps"],
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90,
    isBodyweight: true,
    isFavorite: false,
    notes: "Full range of motion, engage lats",
  },
  {
    id: "3",
    name: "Bench Press",
    category: "Upper Body",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    defaultSets: 4,
    defaultReps: 10,
    defaultRest: 120,
    isBodyweight: false,
    isFavorite: true,
    notes: "Keep shoulders retracted, feet planted",
  },
  {
    id: "4",
    name: "Shoulder Press",
    category: "Upper Body",
    muscleGroups: ["Shoulders", "Triceps"],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60,
    isBodyweight: false,
    isFavorite: false,
    notes: "Avoid arching lower back",
  },
  {
    id: "5",
    name: "Squats",
    category: "Lower Body",
    muscleGroups: ["Quads", "Glutes", "Hamstrings"],
    defaultSets: 4,
    defaultReps: 15,
    defaultRest: 90,
    isBodyweight: false,
    isFavorite: true,
    notes: "Knees in line with toes, chest up",
  },
  {
    id: "6",
    name: "Lunges",
    category: "Lower Body",
    muscleGroups: ["Quads", "Glutes", "Hamstrings"],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    isBodyweight: true,
    isFavorite: false,
    notes: "Step far enough to create 90° angles",
  },
  {
    id: "7",
    name: "Deadlifts",
    category: "Lower Body",
    muscleGroups: ["Hamstrings", "Glutes", "Lower Back"],
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 120,
    isBodyweight: false,
    isFavorite: true,
    notes: "Hinge at hips, maintain neutral spine",
  },
  {
    id: "8",
    name: "Leg Press",
    category: "Lower Body",
    muscleGroups: ["Quads", "Glutes", "Hamstrings"],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 90,
    isBodyweight: false,
    isFavorite: false,
    notes: "Don't lock knees at top of movement",
  },
  {
    id: "9",
    name: "Plank",
    category: "Core",
    muscleGroups: ["Abs", "Lower Back"],
    defaultSets: 3,
    defaultReps: 1,
    defaultRest: 60,
    defaultDuration: 60,
    isBodyweight: true,
    isFavorite: false,
    notes: "Keep body in straight line, engage core",
  },
  {
    id: "10",
    name: "Crunches",
    category: "Core",
    muscleGroups: ["Abs"],
    defaultSets: 3,
    defaultReps: 20,
    defaultRest: 45,
    isBodyweight: true,
    isFavorite: false,
    notes: "Focus on contraction, avoid neck strain",
  },
  {
    id: "11",
    name: "Russian Twists",
    category: "Core",
    muscleGroups: ["Abs", "Obliques"],
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45,
    isBodyweight: true,
    isFavorite: false,
    notes: "Rotate from core, keep chest up",
  },
  {
    id: "12",
    name: "Burpees",
    category: "Full Body",
    muscleGroups: ["Full Body", "Cardio"],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60,
    isBodyweight: true,
    isFavorite: false,
    notes: "Focus on form over speed",
  },
];

// Sample data for body metrics
const initialBodyMetrics = [
  {
    id: "1",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    weight: 165,
    measurements: {
      chest: 40,
      waist: 32,
      hips: 38,
      biceps: 14,
      thighs: 22,
    },
    notes: "Starting measurements",
  },
  {
    id: "2",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    weight: 163,
    measurements: {
      chest: 40.5,
      waist: 31.5,
      hips: 38,
      biceps: 14.2,
      thighs: 22.5,
    },
    notes: "Seeing progress in arms and waist",
  },
  {
    id: "3",
    date: new Date().toISOString(),
    weight: 162,
    measurements: {
      chest: 41,
      waist: 31,
      hips: 38,
      biceps: 14.5,
      thighs: 23,
    },
    notes: "Continuing to make progress",
  },
];

// Sample data for exercise stats (PRs and progress)
const initialExerciseStats = [
  {
    exerciseId: "3", // Bench Press
    personalRecords: [
      {
        type: "1RM",
        value: 185,
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "1RM",
        value: 195,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "1RM",
        value: 205,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "5RM",
        value: 165,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "10RM",
        value: 135,
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    progressHistory: [
      {
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 135,
        sets: 3,
        reps: 10,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 145,
        sets: 3,
        reps: 8,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 155,
        sets: 3,
        reps: 8,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 165,
        sets: 3,
        reps: 6,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 175,
        sets: 3,
        reps: 5,
        rpe: 9,
      },
      {
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 185,
        sets: 3,
        reps: 3,
        rpe: 9,
      },
      {
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 165,
        sets: 3,
        reps: 8,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 175,
        sets: 3,
        reps: 6,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 185,
        sets: 3,
        reps: 5,
        rpe: 8,
      },
    ],
  },
  {
    exerciseId: "5", // Squats
    personalRecords: [
      {
        type: "1RM",
        value: 225,
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "1RM",
        value: 245,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "5RM",
        value: 205,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "10RM",
        value: 185,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    progressHistory: [
      {
        date: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 185,
        sets: 3,
        reps: 8,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 195,
        sets: 3,
        reps: 8,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 205,
        sets: 3,
        reps: 6,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 215,
        sets: 3,
        reps: 5,
        rpe: 9,
      },
      {
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 225,
        sets: 3,
        reps: 3,
        rpe: 9,
      },
      {
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 205,
        sets: 3,
        reps: 8,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 215,
        sets: 3,
        reps: 6,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 225,
        sets: 3,
        reps: 5,
        rpe: 8,
      },
    ],
  },
  {
    exerciseId: "7", // Deadlifts
    personalRecords: [
      {
        type: "1RM",
        value: 275,
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "1RM",
        value: 295,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "5RM",
        value: 245,
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        type: "10RM",
        value: 225,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    progressHistory: [
      {
        date: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 225,
        sets: 3,
        reps: 8,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 235,
        sets: 3,
        reps: 8,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 245,
        sets: 3,
        reps: 6,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 255,
        sets: 3,
        reps: 5,
        rpe: 9,
      },
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 265,
        sets: 3,
        reps: 3,
        rpe: 9,
      },
      {
        date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 245,
        sets: 3,
        reps: 8,
        rpe: 7,
      },
      {
        date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 255,
        sets: 3,
        reps: 6,
        rpe: 8,
      },
      {
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        weight: 265,
        sets: 3,
        reps: 5,
        rpe: 8,
      },
    ],
  },
];

// Sample data for recovery logs
const initialRecoveryLogs = [
  {
    id: "1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sleepHours: 7.5,
    sleepQuality: 4, // 1-5 scale
    stressLevel: 3, // 1-5 scale
    muscleSoreness: {
      upper: 2, // 1-5 scale
      lower: 4,
      core: 1,
    },
    notes: "Legs still sore from Monday's workout",
  },
  {
    id: "2",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sleepHours: 8,
    sleepQuality: 5,
    stressLevel: 2,
    muscleSoreness: {
      upper: 3,
      lower: 3,
      core: 1,
    },
    notes: "Feeling well-rested today",
  },
  {
    id: "3",
    date: new Date().toISOString(),
    sleepHours: 6.5,
    sleepQuality: 3,
    stressLevel: 4,
    muscleSoreness: {
      upper: 4,
      lower: 2,
      core: 3,
    },
    notes: "Arms very sore from yesterday's workout",
  },
];

// Sample workout templates
const initialTemplates = [
  {
    id: "template1",
    name: "Push Day Template",
    type: "Push",
    exercises: [
      {
        exerciseId: "3", // Bench Press
        sets: 4,
        reps: 8,
        restSeconds: 90,
      },
      {
        exerciseId: "4", // Shoulder Press
        sets: 3,
        reps: 10,
        restSeconds: 60,
      },
      {
        exerciseId: "1", // Push-ups
        sets: 3,
        reps: 12,
        restSeconds: 60,
      },
    ],
    color: "#4A90E2",
    notes: "Focus on chest and shoulders",
  },
  {
    id: "template2",
    name: "Pull Day Template",
    type: "Pull",
    exercises: [
      {
        exerciseId: "2", // Pull-ups
        sets: 4,
        reps: 8,
        restSeconds: 90,
      },
      {
        exerciseId: "7", // Deadlifts
        sets: 3,
        reps: 8,
        restSeconds: 120,
      },
    ],
    color: "#FF6B6B",
    notes: "Focus on back and biceps",
  },
  {
    id: "template3",
    name: "Leg Day Template",
    type: "Legs",
    exercises: [
      {
        exerciseId: "5", // Squats
        sets: 4,
        reps: 10,
        restSeconds: 90,
      },
      {
        exerciseId: "6", // Lunges
        sets: 3,
        reps: 12,
        restSeconds: 60,
      },
      {
        exerciseId: "8", // Leg Press
        sets: 3,
        reps: 12,
        restSeconds: 60,
      },
    ],
    color: "#50E3C2",
    notes: "Focus on quads, hamstrings, and glutes",
  },
];

// Initialize the app with sample data if none exists
export const initializeStorage = async () => {
  try {
    const workouts = await AsyncStorage.getItem(WORKOUTS_KEY);
    const exercises = await AsyncStorage.getItem(EXERCISES_KEY);
    const bodyMetrics = await AsyncStorage.getItem(BODY_METRICS_KEY);
    const exerciseStats = await AsyncStorage.getItem(EXERCISE_STATS_KEY);
    const recoveryLogs = await AsyncStorage.getItem(RECOVERY_LOG_KEY);
    const templates = await AsyncStorage.getItem(TEMPLATES_KEY);

    if (!workouts) {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(initialWorkouts));
    }

    if (!exercises) {
      await AsyncStorage.setItem(
        EXERCISES_KEY,
        JSON.stringify(initialExercises)
      );
    }

    if (!bodyMetrics) {
      await AsyncStorage.setItem(
        BODY_METRICS_KEY,
        JSON.stringify(initialBodyMetrics)
      );
    }

    if (!exerciseStats) {
      await AsyncStorage.setItem(
        EXERCISE_STATS_KEY,
        JSON.stringify(initialExerciseStats)
      );
    }

    if (!recoveryLogs) {
      await AsyncStorage.setItem(
        RECOVERY_LOG_KEY,
        JSON.stringify(initialRecoveryLogs)
      );
    }

    if (!templates) {
      await AsyncStorage.setItem(
        TEMPLATES_KEY,
        JSON.stringify(initialTemplates)
      );
    }

    return true;
  } catch (error) {
    console.error("Error initializing storage:", error);
    return false;
  }
};

// Workouts CRUD operations
export const getWorkouts = async () => {
  try {
    const workouts = await AsyncStorage.getItem(WORKOUTS_KEY);
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error("Error getting workouts:", error);
    return [];
  }
};

export const getWorkoutById = async (id) => {
  try {
    const workouts = await getWorkouts();
    return workouts.find((workout) => workout.id === id) || null;
  } catch (error) {
    console.error("Error getting workout by id:", error);
    return null;
  }
};

export const saveWorkout = async (workout) => {
  try {
    const workouts = await getWorkouts();
    const existingIndex = workouts.findIndex((w) => w.id === workout.id);

    if (existingIndex >= 0) {
      // Update existing workout
      workouts[existingIndex] = workout;
    } else {
      // Add new workout with a unique ID
      const newWorkout = {
        ...workout,
        id: Date.now().toString(),
      };
      workouts.push(newWorkout);
    }

    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    return true;
  } catch (error) {
    console.error("Error saving workout:", error);
    return false;
  }
};

export const deleteWorkout = async (id) => {
  try {
    const workouts = await getWorkouts();
    const filteredWorkouts = workouts.filter((workout) => workout.id !== id);
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
    return true;
  } catch (error) {
    console.error("Error deleting workout:", error);
    return false;
  }
};

// Exercises CRUD operations
export const getExercises = async () => {
  try {
    const exercises = await AsyncStorage.getItem(EXERCISES_KEY);
    return exercises ? JSON.parse(exercises) : [];
  } catch (error) {
    console.error("Error getting exercises:", error);
    return [];
  }
};

export const getExerciseById = async (id) => {
  try {
    const exercises = await getExercises();
    return exercises.find((exercise) => exercise.id === id) || null;
  } catch (error) {
    console.error("Error getting exercise by id:", error);
    return null;
  }
};

export const getExercisesForWorkout = async (workoutId) => {
  try {
    const workout = await getWorkoutById(workoutId);
    if (!workout) return [];

    const allExercises = await getExercises();
    return allExercises.filter((exercise) =>
      workout.exercises.includes(exercise.id)
    );
  } catch (error) {
    console.error("Error getting exercises for workout:", error);
    return [];
  }
};

export const saveExercise = async (exercise) => {
  try {
    const exercises = await getExercises();
    const existingIndex = exercises.findIndex((e) => e.id === exercise.id);

    if (existingIndex >= 0) {
      // Update existing exercise
      exercises[existingIndex] = exercise;
    } else {
      // Add new exercise with a unique ID
      const newExercise = {
        ...exercise,
        id: Date.now().toString(),
      };
      exercises.push(newExercise);
    }

    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
    return true;
  } catch (error) {
    console.error("Error saving exercise:", error);
    return false;
  }
};

export const deleteExercise = async (id) => {
  try {
    const exercises = await getExercises();
    const filteredExercises = exercises.filter(
      (exercise) => exercise.id !== id
    );
    await AsyncStorage.setItem(
      EXERCISES_KEY,
      JSON.stringify(filteredExercises)
    );

    // Also remove this exercise from any workouts that include it
    const workouts = await getWorkouts();
    const updatedWorkouts = workouts.map((workout) => ({
      ...workout,
      exercises: workout.exercises.filter((exerciseId) => exerciseId !== id),
    }));

    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    return true;
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return false;
  }
};

// Workout history tracking
export const saveWorkoutHistory = async (workoutSession) => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    const workoutHistory = history ? JSON.parse(history) : [];

    const newSession = {
      ...workoutSession,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    workoutHistory.push(newSession);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(workoutHistory));
    return true;
  } catch (error) {
    console.error("Error saving workout history:", error);
    return false;
  }
};

export const getWorkoutHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting workout history:", error);
    return [];
  }
};

// Body Metrics CRUD operations
export const getBodyMetrics = async () => {
  try {
    const metrics = await AsyncStorage.getItem(BODY_METRICS_KEY);
    return metrics ? JSON.parse(metrics) : [];
  } catch (error) {
    console.error("Error getting body metrics:", error);
    return [];
  }
};

export const saveBodyMetric = async (metric) => {
  try {
    const metrics = await getBodyMetrics();
    const existingIndex = metrics.findIndex((m) => m.id === metric.id);

    if (existingIndex >= 0) {
      // Update existing metric
      metrics[existingIndex] = metric;
    } else {
      // Add new metric with a unique ID
      const newMetric = {
        ...metric,
        id: Date.now().toString(),
        date: metric.date || new Date().toISOString(),
      };
      metrics.push(newMetric);
    }

    await AsyncStorage.setItem(BODY_METRICS_KEY, JSON.stringify(metrics));
    return true;
  } catch (error) {
    console.error("Error saving body metric:", error);
    return false;
  }
};

export const deleteBodyMetric = async (id) => {
  try {
    const metrics = await getBodyMetrics();
    const filteredMetrics = metrics.filter((metric) => metric.id !== id);
    await AsyncStorage.setItem(
      BODY_METRICS_KEY,
      JSON.stringify(filteredMetrics)
    );
    return true;
  } catch (error) {
    console.error("Error deleting body metric:", error);
    return false;
  }
};

// Exercise Stats CRUD operations
export const getExerciseStats = async () => {
  try {
    const stats = await AsyncStorage.getItem(EXERCISE_STATS_KEY);
    return stats ? JSON.parse(stats) : [];
  } catch (error) {
    console.error("Error getting exercise stats:", error);
    return [];
  }
};

export const getExerciseStatsById = async (exerciseId) => {
  try {
    const stats = await getExerciseStats();
    return stats.find((stat) => stat.exerciseId === exerciseId) || null;
  } catch (error) {
    console.error("Error getting exercise stats by id:", error);
    return null;
  }
};

export const saveExerciseStat = async (exerciseStat) => {
  try {
    const stats = await getExerciseStats();
    const existingIndex = stats.findIndex(
      (s) => s.exerciseId === exerciseStat.exerciseId
    );

    if (existingIndex >= 0) {
      // Update existing stat
      stats[existingIndex] = exerciseStat;
    } else {
      // Add new stat
      stats.push(exerciseStat);
    }

    await AsyncStorage.setItem(EXERCISE_STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error("Error saving exercise stat:", error);
    return false;
  }
};

export const addPersonalRecord = async (exerciseId, record) => {
  try {
    const stats = await getExerciseStats();
    const existingIndex = stats.findIndex((s) => s.exerciseId === exerciseId);

    if (existingIndex >= 0) {
      // Add PR to existing stats
      const newRecord = {
        ...record,
        date: record.date || new Date().toISOString(),
      };
      stats[existingIndex].personalRecords.push(newRecord);
    } else {
      // Create new stats entry with this PR
      const newRecord = {
        ...record,
        date: record.date || new Date().toISOString(),
      };
      stats.push({
        exerciseId,
        personalRecords: [newRecord],
        progressHistory: [],
      });
    }

    await AsyncStorage.setItem(EXERCISE_STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error("Error adding personal record:", error);
    return false;
  }
};

export const addProgressEntry = async (exerciseId, entry) => {
  try {
    const stats = await getExerciseStats();
    const existingIndex = stats.findIndex((s) => s.exerciseId === exerciseId);

    if (existingIndex >= 0) {
      // Add progress entry to existing stats
      const newEntry = {
        ...entry,
        date: entry.date || new Date().toISOString(),
      };
      stats[existingIndex].progressHistory.push(newEntry);
    } else {
      // Create new stats entry with this progress entry
      const newEntry = {
        ...entry,
        date: entry.date || new Date().toISOString(),
      };
      stats.push({
        exerciseId,
        personalRecords: [],
        progressHistory: [newEntry],
      });
    }

    await AsyncStorage.setItem(EXERCISE_STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error("Error adding progress entry:", error);
    return false;
  }
};

// Recovery Log CRUD operations
export const getRecoveryLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(RECOVERY_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Error getting recovery logs:", error);
    return [];
  }
};

export const saveRecoveryLog = async (log) => {
  try {
    const logs = await getRecoveryLogs();
    const existingIndex = logs.findIndex((l) => l.id === log.id);

    if (existingIndex >= 0) {
      // Update existing log
      logs[existingIndex] = log;
    } else {
      // Add new log with a unique ID
      const newLog = {
        ...log,
        id: Date.now().toString(),
        date: log.date || new Date().toISOString(),
      };
      logs.push(newLog);
    }

    await AsyncStorage.setItem(RECOVERY_LOG_KEY, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error("Error saving recovery log:", error);
    return false;
  }
};

export const deleteRecoveryLog = async (id) => {
  try {
    const logs = await getRecoveryLogs();
    const filteredLogs = logs.filter((log) => log.id !== id);
    await AsyncStorage.setItem(RECOVERY_LOG_KEY, JSON.stringify(filteredLogs));
    return true;
  } catch (error) {
    console.error("Error deleting recovery log:", error);
    return false;
  }
};

// Templates CRUD operations
export const getTemplates = async () => {
  try {
    const templates = await AsyncStorage.getItem(TEMPLATES_KEY);
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error("Error getting templates:", error);
    return [];
  }
};

export const getTemplateById = async (id) => {
  try {
    const templates = await getTemplates();
    return templates.find((template) => template.id === id) || null;
  } catch (error) {
    console.error("Error getting template by id:", error);
    return null;
  }
};

export const saveTemplate = async (template) => {
  try {
    const templates = await getTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    if (existingIndex >= 0) {
      // Update existing template
      templates[existingIndex] = template;
    } else {
      // Add new template with a unique ID
      const newTemplate = {
        ...template,
        id: template.id || `template${Date.now()}`,
      };
      templates.push(newTemplate);
    }

    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error("Error saving template:", error);
    return false;
  }
};

export const deleteTemplate = async (id) => {
  try {
    const templates = await getTemplates();
    const filteredTemplates = templates.filter(
      (template) => template.id !== id
    );
    await AsyncStorage.setItem(
      TEMPLATES_KEY,
      JSON.stringify(filteredTemplates)
    );
    return true;
  } catch (error) {
    console.error("Error deleting template:", error);
    return false;
  }
};

export const createWorkoutFromTemplate = async (templateId) => {
  try {
    const template = await getTemplateById(templateId);
    if (!template) return false;

    const workout = {
      name: template.name.replace("Template", "").trim(),
      type: template.type,
      exercises: template.exercises.map((e) => e.exerciseId),
      duration:
        template.exercises.reduce(
          (total, e) => total + e.sets * e.restSeconds,
          0
        ) / 60,
      color: template.color,
      notes: template.notes,
      createdAt: new Date().toISOString(),
      isTemplate: false,
    };

    return await saveWorkout(workout);
  } catch (error) {
    console.error("Error creating workout from template:", error);
    return false;
  }
};
