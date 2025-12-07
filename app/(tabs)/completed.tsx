import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useExercises } from '@/context/ExerciseContext';
import { Exercise } from '@/types/exercise';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

function CompletedExerciseCard({ exercise }: { exercise: Exercise }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: '#4CAF50' }]}
      onPress={() => router.push(`/exercise/${exercise.id}` as any)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: exercise.imageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {exercise.name}
          </Text>
          <FontAwesome name="check-circle" size={24} color="#4CAF50" />
        </View>
        {exercise.category && (
          <Text style={[styles.cardCategory, { color: colors.tint }]}>
            {exercise.category}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function CompletedExercisesScreen() {
  const { getCompletedExercises } = useExercises();
  const completedExercises = getCompletedExercises();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (completedExercises.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <FontAwesome name="trophy" size={64} color={colors.tabIconDefault} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Completed Exercises Yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
            Complete some exercises to see them here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Completed Exercises
        </Text>
        <View style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.badgeText}>{completedExercises.length}</Text>
        </View>
      </View>

      <FlatList
        data={completedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CompletedExerciseCard exercise={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  cardCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'transparent',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

