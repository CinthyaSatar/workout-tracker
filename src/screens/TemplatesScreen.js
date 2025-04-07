import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getTemplates, createWorkoutFromTemplate, deleteTemplate } from '../data/storage';

export default function TemplatesScreen({ navigation }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await getTemplates();
    setTemplates(data);
  };

  const handleUseTemplate = async (template) => {
    try {
      const success = await createWorkoutFromTemplate(template.id);
      
      if (success) {
        Alert.alert(
          'Success',
          'Workout created from template',
          [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create workout from template');
      }
    } catch (error) {
      console.error('Error creating workout from template:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleDeleteTemplate = (template) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteTemplate(template.id);
              
              if (success) {
                loadTemplates();
              } else {
                Alert.alert('Error', 'Failed to delete template');
              }
            } catch (error) {
              console.error('Error deleting template:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          }
        }
      ]
    );
  };

  const renderTemplateItem = ({ item }) => (
    <View style={[styles.templateCard, { backgroundColor: item.color + '15' }]}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateName}>{item.name}</Text>
        <View style={[styles.templateType, { backgroundColor: item.color }]}>
          <Text style={styles.templateTypeText}>{item.type}</Text>
        </View>
      </View>
      
      <Text style={styles.templateExerciseCount}>
        {item.exercises.length} exercises
      </Text>
      
      {item.notes && (
        <Text style={styles.templateNotes}>{item.notes}</Text>
      )}
      
      <View style={styles.templateActions}>
        <TouchableOpacity 
          style={[styles.templateButton, { backgroundColor: item.color }]}
          onPress={() => handleUseTemplate(item)}
        >
          <Text style={styles.templateButtonText}>Use Template</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteTemplate(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.title}>Workout Templates</Text>
        <View style={styles.placeholder} />
      </View>

      {templates.length > 0 ? (
        <FlatList
          data={templates}
          keyExtractor={item => item.id}
          renderItem={renderTemplateItem}
          contentContainerStyle={styles.templatesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No templates available</Text>
          <Text style={styles.emptyStateSubtext}>
            Create a workout and save it as a template to get started
          </Text>
        </View>
      )}
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
  templatesList: {
    padding: 15,
  },
  templateCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  templateType: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  templateTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  templateExerciseCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  templateNotes: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 15,
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  templateButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  templateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#F44336',
  },
  emptyState: {
    flex: 1,
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
