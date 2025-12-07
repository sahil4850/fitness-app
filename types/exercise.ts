export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
  completed?: boolean;
  createdAt: number;
}

export type ExerciseContextType = {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => void;
  toggleExerciseComplete: (id: string) => void;
  deleteExercise: (id: string) => void;
  getCompletedExercises: () => Exercise[];
};

