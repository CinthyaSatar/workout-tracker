import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WorkoutCard({ workout, onPress }) {
  const { name, exercises, duration } = workout || { name: 'Upper Body', exercises: 4, duration: 45 };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.workoutName}>{name}</Text>
        <Text style={styles.workoutDetails}>{exercises} exercises • {duration} min</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
