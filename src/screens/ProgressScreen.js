import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getExerciseStats, getExercises } from '../data/storage';
import { formatDate } from '../utils/dateUtils';

// We'll use a simple line chart for now
// In a real app, you'd want to use a proper charting library like react-native-chart-kit
const LineChart = ({ data, height, width }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <View style={{ height, width }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
        {data.map((point, index) => {
          const normalizedHeight = ((point.value - minValue) / (range || 1)) * height;
          return (
            <View 
              key={index} 
              style={{
                flex: 1,
                height: normalizedHeight || 1,
                backgroundColor: '#4A90E2',
                margin: 2,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }}
            />
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.chartLabel}>{formatDate(data[0].date)}</Text>
        <Text style={styles.chartLabel}>{formatDate(data[data.length - 1].date)}</Text>
      </View>
    </View>
  );
};

export default function ProgressScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [exerciseStats, setExerciseStats] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [progressHistory, setProgressHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const exercisesData = await getExercises();
      setExercises(exercisesData);
      
      const stats = await getExerciseStats();
      setExerciseStats(stats);
      
      if (stats.length > 0) {
        // Select the first exercise with stats by default
        const firstExerciseWithStats = exercisesData.find(ex => 
          stats.some(stat => stat.exerciseId === ex.id)
        );
        
        if (firstExerciseWithStats) {
          handleSelectExercise(firstExerciseWithStats);
        }
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    
    const stats = exerciseStats.find(stat => stat.exerciseId === exercise.id);
    
    if (stats) {
      // Sort PRs by date (newest first)
      const sortedPRs = [...stats.personalRecords].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPersonalRecords(sortedPRs);
      
      // Sort progress by date (oldest first for charts)
      const sortedProgress = [...stats.progressHistory].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setProgressHistory(sortedProgress);
    } else {
      setPersonalRecords([]);
      setProgressHistory([]);
    }
  };

  const getExercisesWithStats = () => {
    return exercises.filter(exercise => 
      exerciseStats.some(stat => stat.exerciseId === exercise.id)
    );
  };

  const chartData = progressHistory.map(entry => ({
    date: entry.date,
    value: entry.weight
  }));

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
        <Text style={styles.title}>Progress Tracker</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.exerciseSelector}>
        <Text style={styles.selectorLabel}>Select Exercise:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exerciseButtonsContainer}
        >
          {getExercisesWithStats().map(exercise => (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseButton,
                selectedExercise?.id === exercise.id && styles.exerciseButtonSelected
              ]}
              onPress={() => handleSelectExercise(exercise)}
            >
              <Text 
                style={[
                  styles.exerciseButtonText,
                  selectedExercise?.id === exercise.id && styles.exerciseButtonTextSelected
                ]}
              >
                {exercise.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {selectedExercise ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weight Progress</Text>
              {progressHistory.length > 0 ? (
                <View style={styles.chartContainer}>
                  <LineChart 
                    data={chartData} 
                    height={150} 
                    width={Dimensions.get('window').width - 40} 
                  />
                  <View style={styles.chartLegend}>
                    <Text style={styles.chartLegendText}>
                      Range: {Math.min(...progressHistory.map(p => p.weight))} - {Math.max(...progressHistory.map(p => p.weight))} lbs
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>No progress data available</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Records</Text>
              {personalRecords.length > 0 ? (
                <View style={styles.prContainer}>
                  {personalRecords.map((pr, index) => (
                    <View key={index} style={styles.prCard}>
                      <View style={styles.prHeader}>
                        <Text style={styles.prType}>{pr.type}</Text>
                        <Text style={styles.prDate}>{formatDate(pr.date)}</Text>
                      </View>
                      <Text style={styles.prValue}>{pr.value} lbs</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No personal records available</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              {progressHistory.length > 0 ? (
                <FlatList
                  data={[...progressHistory].reverse().slice(0, 5)} // Show most recent 5
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                      <View style={styles.historyItemHeader}>
                        <Text style={styles.historyItemDate}>{formatDate(item.date)}</Text>
                        <Text style={styles.historyItemRpe}>RPE: {item.rpe || 'N/A'}</Text>
                      </View>
                      <Text style={styles.historyItemDetails}>
                        {item.sets} sets × {item.reps} reps @ {item.weight} lbs
                      </Text>
                    </View>
                  )}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.emptyText}>No workout history available</Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No exercise selected</Text>
            <Text style={styles.emptyStateSubtext}>
              Select an exercise to view progress data
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#4A90E2',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 40,
  },
  exerciseSelector: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  exerciseButtonsContainer: {
    paddingRight: 20,
  },
  exerciseButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  exerciseButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  exerciseButtonText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  exerciseButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  chartContainer: {
    marginVertical: 10,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chartLegend: {
    alignItems: 'center',
    marginTop: 10,
  },
  chartLegendText: {
    fontSize: 12,
    color: '#666',
  },
  prContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  prCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  prHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  prType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  prDate: {
    fontSize: 12,
    color: '#666',
  },
  prValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A90E2',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 10,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  historyItemDate: {
    fontSize: 14,
    color: '#666',
  },
  historyItemRpe: {
    fontSize: 14,
    color: '#4A90E2',
  },
  historyItemDetails: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
