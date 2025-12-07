import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useExercises } from '@/context/ExerciseContext';
import quotesData from '@/data/quotes.json';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Quote {
  text: string;
  author: string;
}

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, toggleExerciseComplete, deleteExercise } = useExercises();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const exercise = exercises.find((ex) => ex.id === id);

  const getRandomQuote = (): Quote => {
    const quotes = quotesData as Quote[];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Exercise not found
        </Text>
      </View>
    );
  }

  const handleToggleComplete = () => {
    const wasCompleted = exercise.completed;
    toggleExerciseComplete(exercise.id);
    
    // Show quote only when marking as complete (not when unmarking)
    if (!wasCompleted) {
      const quote = getRandomQuote();
      setCurrentQuote(quote);
      setShowQuote(true);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      const ok = window.confirm("Are you sure you want to delete this exercise?");
      if (ok) {
        deleteExercise(exercise.id);
        router.back();
      }
    } else {
      Alert.alert(
        "Delete Exercise",
        "Are you sure you want to delete this exercise?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteExercise(exercise.id);
              router.back();
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Image
        source={{ uri: exercise.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {exercise.name}
          </Text>
          {exercise.completed && (
            <View style={styles.completedBadge}>
              <FontAwesome name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>

        {exercise.category && (
          <View style={[styles.categoryBadge, { backgroundColor: colors.tint + '20' }]}>
            <Text style={[styles.categoryText, { color: colors.tint }]}>
              {exercise.category}
            </Text>
          </View>
        )}

        <Text style={[styles.description, { color: colors.text }]}>
          {exercise.description}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              exercise.completed
                ? { backgroundColor: colors.tabIconDefault }
                : { backgroundColor: '#4CAF50' },
            ]}
            onPress={handleToggleComplete}
          >
            <FontAwesome
              name={exercise.completed ? 'undo' : 'check'}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {exercise.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Motivational Quote Modal */}
      <Modal
        visible={showQuote}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuote(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.quoteModal, { backgroundColor: colors.background }]}>
            <FontAwesome name="quote-left" size={32} color={colors.tint} style={styles.quoteIcon} />
            {currentQuote && (
              <>
                <Text style={[styles.quoteText, { color: colors.text }]}>
                  "{currentQuote.text}"
                </Text>
                <Text style={[styles.quoteAuthor, { color: colors.tint }]}>
                  — {currentQuote.author}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowQuote(false)}
            >
              <Text style={styles.closeButtonText}>Awesome! 💪</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 300,
  },
  details: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  header: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
    backgroundColor: 'transparent',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quoteModal: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  quoteIcon: {
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  quoteAuthor: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    width: '100%',
    marginBottom: 24,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

