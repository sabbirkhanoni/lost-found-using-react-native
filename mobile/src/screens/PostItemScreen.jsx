import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { createItemApi } from '../api/item.api';
import OSMMapView from '../components/OSMMapView';
import { uploadImageApi } from '../api/upload.api';

const PostItemScreen = ({ route, navigation }) => {
  const { type } = route.params; // "lost" | "found"
  const isFound = type === 'found';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (asset) setImageUri(asset.uri);
    });
  };

  const handleUseCurrentLocation = () => {
    setLocating(true);
    Geolocation.getCurrentPosition(
      position => {
        setCoords({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
        setLocating(false);
        Alert.alert(
          'Location captured',
          'Your current location has been pinned.',
        );
      },
      error => {
        setLocating(false);
        Alert.alert('Error', error.message || 'Failed to get location');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleMapPick = ({ latitude, longitude }) => {
    setCoords({ latitude, longitude });
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Title and description are required');
      return;
    }
    if (!coords) {
      Alert.alert('Error', 'Please capture the location first');
      return;
    }

    try {
      setSubmitting(true);

      let imageUrls = [];
      if (imageUri) {
        const uploadResponse = await uploadImageApi(imageUri);
        imageUrls = [uploadResponse.data.url];
      }

      const response = await createItemApi({
        type,
        title,
        description,
        images: imageUrls,
        longitude: coords.longitude,
        latitude: coords.latitude,
        address,
      });

      Alert.alert('Success', response.data.message);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to post item',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isFound ? '✅ Found Something?' : '😟 Lost Something?'}
        </Text>
      </View>

      {/* Image picker */}
      <TouchableOpacity
        onPress={handlePickImage}
        style={[
          styles.imagePicker,
          isFound ? styles.imagePickerFound : styles.imagePickerLost,
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 96, height: 96, borderRadius: 12 }}
          />
        ) : (
          <Text
            style={
              isFound ? styles.imagePickerTextFound : styles.imagePickerTextLost
            }
          >
            📷 Add a photo {isFound ? '' : '(if available)'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>
        {isFound ? 'What did you find?' : 'What did you lose?'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Brown leather wallet"
        placeholderTextColor="#C2BFDA"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description / Hint</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        placeholder="Color, brand, what's inside, etc."
        placeholderTextColor="#C2BFDA"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>
        {isFound ? 'Where did you find it?' : 'Where did you lose it?'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Address / area name (e.g. Dhanmondi 27)"
        placeholderTextColor="#C2BFDA"
        value={address}
        onChangeText={setAddress}
      />

      <View style={styles.mapPickWrapper}>
        <OSMMapView
          key={coords ? `${coords.latitude}-${coords.longitude}` : 'default'}
          latitude={coords?.latitude || 23.7808}
          longitude={coords?.longitude || 90.2792}
          zoom={coords ? 16 : 12}
          markers={
            coords
              ? [
                  {
                    id: 'picked',
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    color: isFound ? '#17B890' : '#FF6B5B',
                  },
                ]
              : []
          }
          pickable
          onMapPress={handleMapPick}
        />
      </View>

      <TouchableOpacity
        onPress={handleUseCurrentLocation}
        style={styles.locationBtn}
      >
        {locating ? (
          <ActivityIndicator color="#6C5CE7" />
        ) : (
          <Text style={styles.locationBtnText}>
            📍 {coords ? 'Location Captured ✓' : 'Use Current Location'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={[
          styles.submitBtn,
          { backgroundColor: isFound ? '#17B890' : '#FF6B5B' },
        ]}
      >
        <Text style={styles.submitBtnText}>
          {submitting
            ? 'Posting...'
            : isFound
            ? 'Post — Notify Everyone'
            : 'Report — AI Will Search'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  mapPickWrapper: {
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E7E4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1B1B3A' },
  imagePicker: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerFound: { borderColor: '#17B890', backgroundColor: '#E3FBF3' },
  imagePickerLost: { borderColor: '#FF6B5B', backgroundColor: '#FFEDEB' },
  imagePickerTextFound: { color: '#0F9B78', fontWeight: '700', fontSize: 12 },
  imagePickerTextLost: { color: '#E4503F', fontWeight: '700', fontSize: 12 },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#68678A',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E4F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#1B1B3A',
  },
  locationBtn: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationBtnText: { color: '#6C5CE7', fontWeight: '700', fontSize: 13 },
  submitBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default PostItemScreen;
