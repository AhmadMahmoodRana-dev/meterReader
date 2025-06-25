import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';


export default function Home() {
  const [image, setImage] = useState(null);
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);

const takePhoto = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Camera permission is required.");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 1,
  });

  if (!result.canceled) {
    const originalUri = result.assets[0].uri;

    // Resize and compress the image
  const manipulatedImage = await ImageManipulator.manipulateAsync(
  originalUri,
  [{ resize: { width: 700 } }],
  { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: false }
);



    setImage(manipulatedImage.uri);
    extractText(manipulatedImage.uri);
  }
};

  const extractText = async (imageUri) => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('apikey', 'helloworld');
    formData.append('OCREngine', '2');
 // Free demo key
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('file', {
      uri: imageUri,
      name: 'meter.jpg',
      type: 'image/jpg',
    });

    const response = await axios.post(
      'https://api.ocr.space/parse/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const parsedText = response.data?.ParsedResults?.[0]?.ParsedText;
    console.log("Meter Reading:", response.data); // 👈 This logs it
    setReading(parsedText || 'No text found.');
  } catch (error) {
    console.log("OCR Error:", error);
    alert("Failed to extract text.");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meter Reading App</Text>

      <TextInput
        style={styles.input}
        value={reading}
        placeholder="Meter Reading"
        editable={false}
      />

      <Button title="Capture Meter" onPress={takePhoto} />

      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <Text>Processing...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: 20,
  },
});

// API KEY = AIzaSyDIOB8G9a1UMJqcWzp6ZdcMwy5Ek__kI1c