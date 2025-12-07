import { Exercise, ExerciseContextType } from '@/types/exercise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

const STORAGE_KEY = '@fitness_app_exercises';

// Default sample exercises
const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'A classic upper body exercise that targets the chest, shoulders, and triceps. Start in a plank position and lower your body until your chest nearly touches the floor, then push back up.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1673458333819-f96052f30d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXhlcmNpc2UlMjBwdXNoJTIwdXBzfGVufDB8fDB8fHww',
    category: 'Strength',
    completed: false,
    createdAt: Date.now() - 86400000,
  },
  {
    id: '2',
    name: 'Squats',
    description: 'A fundamental lower body exercise that works your quadriceps, hamstrings, and glutes. Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing.',
    imageUrl: 'https://images.unsplash.com/photo-1714646442127-cac6c14a04c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGV4ZXJjaXNlJTIwc3F1YXRzfGVufDB8fDB8fHww',
    category: 'Strength',
    completed: false,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '3',
    name: 'Running',
    description: 'A great cardiovascular exercise that improves heart health and endurance. Start with a warm-up walk, then gradually increase your pace to a comfortable running speed.',
    imageUrl: 'https://images.unsplash.com/photo-1486739985386-d4fae04ca6f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGV4ZXJjaXNlfGVufDB8fDB8fHww',
    category: 'Cardio',
    completed: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '4',
    name: 'Plank',
    description: 'An isometric core exercise that strengthens your abs, back, and shoulders. Hold your body in a straight line from head to heels, engaging your core muscles.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1666299537659-1a9074ace932?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGV4ZXJjaXNlJTIwcGxhbmt8ZW58MHx8MHx8fDA%3D',
    category: 'Core',
    completed: false,
    createdAt: Date.now() - 86400000 * 4,
  },
];

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load exercises from AsyncStorage on mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Save exercises to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveExercises();
    }
  }, [exercises, isLoaded]);

  const loadExercises = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExercises(JSON.parse(stored));
      } else {
        // First time - use default exercises
        setExercises(DEFAULT_EXERCISES);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading exercises:', error);
      setExercises(DEFAULT_EXERCISES);
      setIsLoaded(true);
    }
  };

  const saveExercises = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  };

  const addExercise = (exerciseData: Omit<Exercise, 'id' | 'createdAt'>) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      completed: false,
    };
    setExercises((prev) => [newExercise, ...prev]);
  };

  const toggleExerciseComplete = (id: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const getCompletedExercises = () => {
    return exercises.filter((exercise) => exercise.completed);
  };

  const value: ExerciseContextType = {
    exercises,
    addExercise,
    toggleExerciseComplete,
    deleteExercise,
    getCompletedExercises,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercises() {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercises must be used within an ExerciseProvider');
  }
  return context;
}

