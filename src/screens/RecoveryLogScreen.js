import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getRecoveryLogs, saveRecoveryLog, deleteRecoveryLog } from '../data/storage';
import { formatDate } from '../utils/dateUtils';

// Simple rating component
const RatingSelector = ({ value, onChange, max = 5, label }) => {
  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingButtons}>
        {[...Array(max)].map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.ratingButton,
              value >= i + 1 && styles.ratingButtonSelected
            ]}
            onPress={() => onChange(i + 1)}
          >
            <Text style={[
              styles.ratingButtonText,
              value >= i + 1 && styles.ratingButtonTextSelected
            ]}>
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function RecoveryLogScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState({
    sleepHours: '',
    sleepQuality: 3,
    stressLevel: 3,
    muscleSoreness: {
      upper: 1,
      lower: 1,
      core: 1
    },
    notes: ''
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await getRecoveryLogs();
    // Sort by date, newest first
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setLogs(sortedData);
  };

  const handleSaveLog = async () => {
    try {
      // Validate inputs
      if (!currentLog.sleepHours || isNaN(parseFloat(currentLog.sleepHours))) {
        Alert.alert('Error', 'Please enter valid sleep hours');
        return;
      }

      // Convert string values to numbers
      const logToSave = {
        ...currentLog,
        sleepHours: parseFloat(currentLog.sleepHours),
        date: new Date().toISOString()
      };

      const success = await saveRecoveryLog(logToSave);
      
      if (success) {
        setModalVisible(false);
        loadLogs();
        setCurrentLog({
          sleepHours: '',
          sleepQuality: 3,
          stressLevel: 3,
          muscleSoreness: {
            upper: 1,
            lower: 1,
            core: 1
          },
          notes: ''
        });
        setEditMode(false);
      } else {
        Alert.alert('Error', 'Failed to save recovery log');
      }
    } catch (error) {
      console.error('Error saving recovery log:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleEditLog = (log) => {
    setCurrentLog({
      ...log,
      sleepHours: log.sleepHours.toString()
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDeleteLog = async (id) => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this recovery log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteRecoveryLog(id);
            if (success) {
              loadLogs();
            } else {
              Alert.alert('Error', 'Failed to delete log');
            }
          }
        }
      ]
    );
  };

  // Helper function to get color based on rating
  const getRatingColor = (rating, inverse = false) => {
    const colors = inverse 
      ? ['#4CAF50', '#8BC34A', '#FFEB3B', '#FF9800', '#F44336'] 
      : ['#F44336', '#FF9800', '#FFEB3B', '#8BC34A', '#4CAF50'];
    
    return colors[rating - 1] || colors[2];
  };

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
        <Text style={styles.title}>Recovery Log</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setCurrentLog({
              sleepHours: '',
              sleepQuality: 3,
              stressLevel: 3,
              muscleSoreness: {
                upper: 1,
                lower: 1,
                core: 1
              },
              notes: ''
            });
            setEditMode(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {logs.length > 0 ? (
          <>
            {logs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                  <View style={styles.logActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditLog(log)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteLog(log.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.logSection}>
                  <View style={styles.logRow}>
                    <Text style={styles.logLabel}>Sleep:</Text>
                    <Text style={styles.logValue}>{log.sleepHours} hours</Text>
                  </View>
                  <View style={styles.logRow}>
                    <Text style={styles.logLabel}>Sleep Quality:</Text>
                    <View style={styles.ratingDisplay}>
                      {[...Array(5)].map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.ratingDot,
                            i < log.sleepQuality && { 
                              backgroundColor: getRatingColor(log.sleepQuality) 
                            }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.logRow}>
                    <Text style={styles.logLabel}>Stress Level:</Text>
                    <View style={styles.ratingDisplay}>
                      {[...Array(5)].map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.ratingDot,
                            i < log.stressLevel && { 
                              backgroundColor: getRatingColor(log.stressLevel, true) 
                            }
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                
                <View style={styles.sorenessSection}>
                  <Text style={styles.sectionTitle}>Muscle Soreness:</Text>
                  <View style={styles.sorenessGrid}>
                    <View style={styles.sorenessItem}>
                      <Text style={styles.sorenessLabel}>Upper Body:</Text>
                      <View style={styles.ratingDisplay}>
                        {[...Array(5)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.ratingDot,
                              i < log.muscleSoreness.upper && { 
                                backgroundColor: getRatingColor(log.muscleSoreness.upper, true) 
                              }
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                    <View style={styles.sorenessItem}>
                      <Text style={styles.sorenessLabel}>Lower Body:</Text>
                      <View style={styles.ratingDisplay}>
                        {[...Array(5)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.ratingDot,
                              i < log.muscleSoreness.lower && { 
                                backgroundColor: getRatingColor(log.muscleSoreness.lower, true) 
                              }
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                    <View style={styles.sorenessItem}>
                      <Text style={styles.sorenessLabel}>Core:</Text>
                      <View style={styles.ratingDisplay}>
                        {[...Array(5)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.ratingDot,
                              i < log.muscleSoreness.core && { 
                                backgroundColor: getRatingColor(log.muscleSoreness.core, true) 
                              }
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
                
                {log.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{log.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recovery logs yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to log your recovery
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit Recovery Log' : 'New Recovery Log'}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sleep Hours</Text>
              <TextInput
                style={styles.input}
                value={currentLog.sleepHours}
                onChangeText={(text) => setCurrentLog({...currentLog, sleepHours: text})}
                keyboardType="numeric"
                placeholder="Enter sleep hours"
              />
            </View>
            
            <RatingSelector
              label="Sleep Quality"
              value={currentLog.sleepQuality}
              onChange={(value) => setCurrentLog({...currentLog, sleepQuality: value})}
            />
            
            <RatingSelector
              label="Stress Level"
              value={currentLog.stressLevel}
              onChange={(value) => setCurrentLog({...currentLog, stressLevel: value})}
            />
            
            <Text style={styles.inputSectionTitle}>Muscle Soreness</Text>
            
            <RatingSelector
              label="Upper Body"
              value={currentLog.muscleSoreness.upper}
              onChange={(value) => setCurrentLog({
                ...currentLog, 
                muscleSoreness: {...currentLog.muscleSoreness, upper: value}
              })}
            />
            
            <RatingSelector
              label="Lower Body"
              value={currentLog.muscleSoreness.lower}
              onChange={(value) => setCurrentLog({
                ...currentLog, 
                muscleSoreness: {...currentLog.muscleSoreness, lower: value}
              })}
            />
            
            <RatingSelector
              label="Core"
              value={currentLog.muscleSoreness.core}
              onChange={(value) => setCurrentLog({
                ...currentLog, 
                muscleSoreness: {...currentLog.muscleSoreness, core: value}
              })}
            />
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentLog.notes}
                onChangeText={(text) => setCurrentLog({...currentLog, notes: text})}
                placeholder="Add any notes here"
                multiline={true}
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveLog}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  logActions: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  deleteButton: {},
  deleteButtonText: {
    fontSize: 14,
    color: '#F44336',
  },
  logSection: {
    marginBottom: 15,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logLabel: {
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  logValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  ratingDisplay: {
    flexDirection: 'row',
  },
  ratingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  sorenessSection: {
    marginBottom: 15,
  },
  sorenessGrid: {},
  sorenessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sorenessLabel: {
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  notesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  notesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#1a1a1a',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 10,
    marginTop: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingButtons: {
    flexDirection: 'row',
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  ratingButtonText: {
    fontSize: 16,
    color: '#666',
  },
  ratingButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    width: '48%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
