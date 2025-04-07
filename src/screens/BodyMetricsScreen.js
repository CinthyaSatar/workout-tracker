import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getBodyMetrics,
  saveBodyMetric,
  deleteBodyMetric,
} from "../data/storage";
import { formatDate } from "../utils/dateUtils";
import { LineChart } from "react-native-chart-kit";
import { colors, spacing, fontSizes, fontWeights } from "../utils/theme";

const screenWidth = Dimensions.get("window").width;

export default function BodyMetricsScreen({ navigation }) {
  const [metrics, setMetrics] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMetric, setCurrentMetric] = useState({
    weight: "",
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      biceps: "",
      thighs: "",
    },
    notes: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState("weight");

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data = await getBodyMetrics();
    // Sort by date, newest first
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setMetrics(sortedData);
  };

  const handleSaveMetric = async () => {
    try {
      // Validate inputs
      if (!currentMetric.weight || isNaN(parseFloat(currentMetric.weight))) {
        Alert.alert("Error", "Please enter a valid weight");
        return;
      }

      // Convert string values to numbers
      const metricToSave = {
        ...currentMetric,
        weight: parseFloat(currentMetric.weight),
        measurements: {
          chest: currentMetric.measurements.chest
            ? parseFloat(currentMetric.measurements.chest)
            : 0,
          waist: currentMetric.measurements.waist
            ? parseFloat(currentMetric.measurements.waist)
            : 0,
          hips: currentMetric.measurements.hips
            ? parseFloat(currentMetric.measurements.hips)
            : 0,
          biceps: currentMetric.measurements.biceps
            ? parseFloat(currentMetric.measurements.biceps)
            : 0,
          thighs: currentMetric.measurements.thighs
            ? parseFloat(currentMetric.measurements.thighs)
            : 0,
        },
        date: new Date().toISOString(),
      };

      const success = await saveBodyMetric(metricToSave);

      if (success) {
        setModalVisible(false);
        loadMetrics();
        setCurrentMetric({
          weight: "",
          measurements: {
            chest: "",
            waist: "",
            hips: "",
            biceps: "",
            thighs: "",
          },
          notes: "",
        });
        setEditMode(false);
      } else {
        Alert.alert("Error", "Failed to save body metrics");
      }
    } catch (error) {
      console.error("Error saving body metrics:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const handleEditMetric = (metric) => {
    setCurrentMetric({
      ...metric,
      weight: metric.weight.toString(),
      measurements: {
        chest: metric.measurements.chest
          ? metric.measurements.chest.toString()
          : "",
        waist: metric.measurements.waist
          ? metric.measurements.waist.toString()
          : "",
        hips: metric.measurements.hips
          ? metric.measurements.hips.toString()
          : "",
        biceps: metric.measurements.biceps
          ? metric.measurements.biceps.toString()
          : "",
        thighs: metric.measurements.thighs
          ? metric.measurements.thighs.toString()
          : "",
      },
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDeleteMetric = async (id) => {
    Alert.alert(
      "Delete Measurement",
      "Are you sure you want to delete this measurement?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteBodyMetric(id);
            if (success) {
              loadMetrics();
            } else {
              Alert.alert("Error", "Failed to delete measurement");
            }
          },
        },
      ]
    );
  };

  const renderChartData = () => {
    if (metrics.length === 0) return null;

    // Sort by date, oldest first for charts
    const sortedMetrics = [...metrics].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let data = {
      labels: sortedMetrics
        .slice(-7)
        .map((m) => formatDate(m.date).slice(0, 5)),
      datasets: [
        {
          data: [],
        },
      ],
    };

    if (selectedMetricType === "weight") {
      data.datasets[0].data = sortedMetrics.slice(-7).map((m) => m.weight);
    } else {
      data.datasets[0].data = sortedMetrics
        .slice(-7)
        .map((m) => m.measurements[selectedMetricType] || 0);
    }

    return data;
  };

  const chartData = renderChartData();

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
        <Text style={styles.title}>Body Metrics</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentMetric({
              weight: "",
              measurements: {
                chest: "",
                waist: "",
                hips: "",
                biceps: "",
                thighs: "",
              },
              notes: "",
            });
            setEditMode(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {metrics.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Progress Chart</Text>

              <View style={styles.metricTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.metricTypeButton,
                    selectedMetricType === "weight" &&
                      styles.metricTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedMetricType("weight")}
                >
                  <Text
                    style={[
                      styles.metricTypeButtonText,
                      selectedMetricType === "weight" &&
                        styles.metricTypeButtonTextSelected,
                    ]}
                  >
                    Weight
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.metricTypeButton,
                    selectedMetricType === "chest" &&
                      styles.metricTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedMetricType("chest")}
                >
                  <Text
                    style={[
                      styles.metricTypeButtonText,
                      selectedMetricType === "chest" &&
                        styles.metricTypeButtonTextSelected,
                    ]}
                  >
                    Chest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.metricTypeButton,
                    selectedMetricType === "waist" &&
                      styles.metricTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedMetricType("waist")}
                >
                  <Text
                    style={[
                      styles.metricTypeButtonText,
                      selectedMetricType === "waist" &&
                        styles.metricTypeButtonTextSelected,
                    ]}
                  >
                    Waist
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.metricTypeButton,
                    selectedMetricType === "biceps" &&
                      styles.metricTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedMetricType("biceps")}
                >
                  <Text
                    style={[
                      styles.metricTypeButtonText,
                      selectedMetricType === "biceps" &&
                        styles.metricTypeButtonTextSelected,
                    ]}
                  >
                    Arms
                  </Text>
                </TouchableOpacity>
              </View>

              {chartData && (
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: colors.card,
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    decimalPlaces: 1,
                    color: (opacity = 1) => colors.primary,
                    labelColor: (opacity = 1) => colors.textSecondary,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: colors.primary,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              )}
            </View>

            <Text style={styles.sectionTitle}>History</Text>
            {metrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricDate}>
                    {formatDate(metric.date)}
                  </Text>
                  <View style={styles.metricActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditMetric(metric)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMetric(metric.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Weight:</Text>
                  <Text style={styles.metricValue}>{metric.weight} lbs</Text>
                </View>

                <View style={styles.measurementsContainer}>
                  <Text style={styles.measurementsTitle}>
                    Measurements (inches):
                  </Text>
                  <View style={styles.measurementsGrid}>
                    {metric.measurements.chest && (
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Chest:</Text>
                        <Text style={styles.measurementValue}>
                          {metric.measurements.chest}
                        </Text>
                      </View>
                    )}
                    {metric.measurements.waist && (
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Waist:</Text>
                        <Text style={styles.measurementValue}>
                          {metric.measurements.waist}
                        </Text>
                      </View>
                    )}
                    {metric.measurements.hips && (
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Hips:</Text>
                        <Text style={styles.measurementValue}>
                          {metric.measurements.hips}
                        </Text>
                      </View>
                    )}
                    {metric.measurements.biceps && (
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Biceps:</Text>
                        <Text style={styles.measurementValue}>
                          {metric.measurements.biceps}
                        </Text>
                      </View>
                    )}
                    {metric.measurements.thighs && (
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Thighs:</Text>
                        <Text style={styles.measurementValue}>
                          {metric.measurements.thighs}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {metric.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{metric.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No body metrics recorded yet.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add your first measurement.
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
              {editMode ? "Edit Measurement" : "New Measurement"}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={currentMetric.weight}
                onChangeText={(text) =>
                  setCurrentMetric({ ...currentMetric, weight: text })
                }
                keyboardType="numeric"
                placeholder="Enter weight"
              />
            </View>

            <Text style={styles.inputSectionTitle}>Measurements (inches)</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Chest</Text>
                <TextInput
                  style={styles.input}
                  value={currentMetric.measurements.chest}
                  onChangeText={(text) =>
                    setCurrentMetric({
                      ...currentMetric,
                      measurements: {
                        ...currentMetric.measurements,
                        chest: text,
                      },
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Chest"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Waist</Text>
                <TextInput
                  style={styles.input}
                  value={currentMetric.measurements.waist}
                  onChangeText={(text) =>
                    setCurrentMetric({
                      ...currentMetric,
                      measurements: {
                        ...currentMetric.measurements,
                        waist: text,
                      },
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Waist"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hips</Text>
                <TextInput
                  style={styles.input}
                  value={currentMetric.measurements.hips}
                  onChangeText={(text) =>
                    setCurrentMetric({
                      ...currentMetric,
                      measurements: {
                        ...currentMetric.measurements,
                        hips: text,
                      },
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Hips"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Biceps</Text>
                <TextInput
                  style={styles.input}
                  value={currentMetric.measurements.biceps}
                  onChangeText={(text) =>
                    setCurrentMetric({
                      ...currentMetric,
                      measurements: {
                        ...currentMetric.measurements,
                        biceps: text,
                      },
                    })
                  }
                  keyboardType="numeric"
                  placeholder="Biceps"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Thighs</Text>
              <TextInput
                style={styles.input}
                value={currentMetric.measurements.thighs}
                onChangeText={(text) =>
                  setCurrentMetric({
                    ...currentMetric,
                    measurements: {
                      ...currentMetric.measurements,
                      thighs: text,
                    },
                  })
                }
                keyboardType="numeric"
                placeholder="Thighs"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentMetric.notes}
                onChangeText={(text) =>
                  setCurrentMetric({ ...currentMetric, notes: text })
                }
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
                onPress={handleSaveMetric}
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
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: fontSizes.lg,
    color: colors.card,
    fontWeight: fontWeights.bold,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  chart: {
    marginVertical: spacing.md,
    borderRadius: 16,
  },
  metricTypeSelector: {
    flexDirection: "row",
    marginVertical: spacing.sm,
  },
  metricTypeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  metricTypeButtonSelected: {
    backgroundColor: colors.primary,
  },
  metricTypeButtonText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  metricTypeButtonTextSelected: {
    color: colors.card,
    fontWeight: fontWeights.medium,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  metricDate: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  metricActions: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: spacing.sm,
  },
  editButtonText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
  },
  deleteButton: {},
  deleteButtonText: {
    fontSize: fontSizes.sm,
    color: colors.error,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  metricLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    width: 80,
  },
  metricValue: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  measurementsContainer: {
    marginVertical: spacing.sm,
  },
  measurementsTitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  measurementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  measurementItem: {
    flexDirection: "row",
    width: "50%",
    marginBottom: spacing.xs,
  },
  measurementLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    width: 60,
  },
  measurementValue: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  notesContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputSectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  cancelButton: {
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    width: "48%",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  saveButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
    width: "48%",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: fontSizes.md,
    color: colors.card,
    fontWeight: fontWeights.medium,
  },
});
