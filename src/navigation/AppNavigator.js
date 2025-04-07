import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen";
import EditWorkoutScreen from "../screens/EditWorkoutScreen";
import WorkoutSessionScreen from "../screens/WorkoutSessionScreen";

// New screens for enhanced features
import BodyMetricsScreen from "../screens/BodyMetricsScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ExerciseLibraryScreen from "../screens/ExerciseLibraryScreen";
import TemplatesScreen from "../screens/TemplatesScreen";
import RecoveryLogScreen from "../screens/RecoveryLogScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f5f5f5" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
        <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} />

        {/* New screens */}
        <Stack.Screen name="BodyMetrics" component={BodyMetricsScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen
          name="ExerciseLibrary"
          component={ExerciseLibraryScreen}
        />
        <Stack.Screen name="Templates" component={TemplatesScreen} />
        <Stack.Screen name="RecoveryLog" component={RecoveryLogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
