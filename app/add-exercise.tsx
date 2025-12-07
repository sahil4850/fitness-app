import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useExercises } from '@/context/ExerciseContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const CATEGORIES = ['Strength', 'Cardio', 'Core', 'Flexibility', 'Other'];

export default function AddExerciseScreen() {
  const router = useRouter();
  const { addExercise } = useExercises();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!imageUrl.trim()) {
      Alert.alert('Error', 'Please enter an image URL');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate image URL by trying to load it
      await new Promise((resolve, reject) => {
        Image.prefetch(imageUrl)
          .then(() => resolve(true))
          .catch(() => reject(new Error('Invalid image URL')));
      });

      addExercise({
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        category: category || undefined,
      });

      if (Platform.OS === "web") {
        window.alert("Exercise added successfully!");
        router.back();
      } else {
        Alert.alert("Success", "Exercise added successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
      setName('');
      setDescription('');
      setImageUrl('');
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'Please enter a valid image URL');
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Exercise Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.tabIconDefault,
                color: colors.text,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Push-ups"
            placeholderTextColor={colors.tabIconDefault}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Description *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.background,
                borderColor: colors.tabIconDefault,
                color: colors.text,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe how to perform this exercise..."
            placeholderTextColor={colors.tabIconDefault}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Image URL *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.tabIconDefault,
                color: colors.text,
              },
            ]}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={colors.tabIconDefault}
            autoCapitalize="none"
            keyboardType="url"
          />
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat
                    ? { backgroundColor: colors.tint }
                    : {
                        backgroundColor: colors.background,
                        borderColor: colors.tabIconDefault,
                      },
                ]}
                onPress={() => setCategory(category === cat ? '' : cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat
                      ? { color: '#fff' }
                      : { color: colors.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.tint },
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name="check" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Add Exercise</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  form: {
    backgroundColor: 'transparent',
  },
  inputGroup: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

