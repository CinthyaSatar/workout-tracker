import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { getExercises, saveExercise, deleteExercise } from "../data/storage";

export default function ExerciseLibraryScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchQuery, selectedCategory]);

  const loadExercises = async () => {
    const data = await getExercises();
    setExercises(data);
  };

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (exercise) => exercise.category === selectedCategory
      );
    }

    setFilteredExercises(filtered);
  };

  const handleToggleFavorite = async (exercise) => {
    try {
      const updatedExercise = {
        ...exercise,
        isFavorite: !exercise.isFavorite,
      };

      const success = await saveExercise(updatedExercise);

      if (success) {
        loadExercises();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const getCategories = () => {
    const categories = ["All", ...new Set(exercises.map((ex) => ex.category))];
    return categories;
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => handleViewExercise(item)}
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseCategory}>{item.category}</Text>
        <Text style={styles.exerciseMuscles}>
          {item.muscleGroups.join(", ")}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          item.isFavorite && styles.favoriteButtonActive,
        ]}
        onPress={() => handleToggleFavorite(item)}
      >
        <Text
          style={[
            styles.favoriteButtonText,
            item.isFavorite && styles.favoriteButtonTextActive,
          ]}
        >
          ★
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
        <Text style={styles.title}>Exercise Library</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {getCategories().map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category &&
                    styles.categoryButtonTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.exercisesList}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedExercise && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.exerciseDetailRow}>
                <Text style={styles.exerciseDetailLabel}>Category:</Text>
                <Text style={styles.exerciseDetailValue}>
                  {selectedExercise.category}
                </Text>
              </View>

              <View style={styles.exerciseDetailRow}>
                <Text style={styles.exerciseDetailLabel}>Muscle Groups:</Text>
                <Text style={styles.exerciseDetailValue}>
                  {selectedExercise.muscleGroups.join(", ")}
                </Text>
              </View>

              <View style={styles.exerciseDetailRow}>
                <Text style={styles.exerciseDetailLabel}>Type:</Text>
                <Text style={styles.exerciseDetailValue}>
                  {selectedExercise.isBodyweight ? "Bodyweight" : "Weighted"}
                </Text>
              </View>

              <View style={styles.exerciseDetailRow}>
                <Text style={styles.exerciseDetailLabel}>Default Sets:</Text>
                <Text style={styles.exerciseDetailValue}>
                  {selectedExercise.defaultSets}
                </Text>
              </View>

              <View style={styles.exerciseDetailRow}>
                <Text style={styles.exerciseDetailLabel}>Default Reps:</Text>
                <Text style={styles.exerciseDetailValue}>
                  {selectedExercise.defaultReps}
                </Text>
              </View>

              <View style={styles.exerciseDetailRow}>
                <Text style={styles.exerciseDetailLabel}>Default Rest:</Text>
                <Text style={styles.exerciseDetailValue}>
                  {selectedExercise.defaultRest} seconds
                </Text>
              </View>

              {selectedExercise.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Form Notes:</Text>
                  <Text style={styles.notesText}>{selectedExercise.notes}</Text>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.favoriteButtonLarge,
                    selectedExercise.isFavorite &&
                      styles.favoriteButtonLargeActive,
                  ]}
                  onPress={() => {
                    handleToggleFavorite(selectedExercise);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.favoriteButtonLargeText}>
                    {selectedExercise.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonSelected: {
    backgroundColor: "#4A90E2",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  categoryButtonTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  exercisesList: {
    padding: 15,
  },
  exerciseItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  exerciseCategory: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 3,
  },
  exerciseMuscles: {
    fontSize: 12,
    color: "#666",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  favoriteButtonActive: {
    backgroundColor: "#FFD700",
  },
  favoriteButtonText: {
    fontSize: 20,
    color: "#666",
  },
  favoriteButtonTextActive: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
  exerciseDetailRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  exerciseDetailLabel: {
    width: 120,
    fontSize: 16,
    color: "#666",
  },
  exerciseDetailValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  notesContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: "#1a1a1a",
    lineHeight: 20,
  },
  modalButtons: {
    marginTop: 10,
  },
  favoriteButtonLarge: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  favoriteButtonLargeActive: {
    backgroundColor: "#FFD700",
  },
  favoriteButtonLargeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
});
