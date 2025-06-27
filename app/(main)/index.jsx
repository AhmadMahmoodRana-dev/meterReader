// import React, { useState } from 'react';
// import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import * as ImageManipulator from 'expo-image-manipulator';

// export default function Home() {
//   const [image, setImage] = useState(null);
//   const [reading, setReading] = useState('');
//   const [loading, setLoading] = useState(false);

// const takePhoto = async () => {
//   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
//   if (!permissionResult.granted) {
//     alert("Camera permission is required.");
//     return;
//   }

//   const result = await ImagePicker.launchCameraAsync({
//     quality: 1,
//   });

//   if (!result.canceled) {
//     const originalUri = result.assets[0].uri;

//     // Resize and compress the image
//   const manipulatedImage = await ImageManipulator.manipulateAsync(
//   originalUri,
//   [{ resize: { width: 700 } }],
//   { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: false }
// );

//     setImage(manipulatedImage.uri);
//     extractText(manipulatedImage.uri);
//   }
// };

//   const extractText = async (imageUri) => {
//   try {
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('apikey', 'helloworld');
//     formData.append('OCREngine', '2');
//     formData.append('language', 'eng');
//     formData.append('isOverlayRequired', 'false');
//     formData.append('file', {
//       uri: imageUri,
//       name: 'meter.jpg',
//       type: 'image/jpg',
//     });

//     const response = await axios.post(
//       'https://api.ocr.space/parse/image',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );

//     const parsedText = response.data?.ParsedResults?.[0]?.ParsedText || '';
//     console.log("OCR Text:", parsedText);

//     // ✅ Extract only numbers from the OCR result
//     const numberMatches = parsedText.match(/\d+/g);
//     const onlyNumbers = numberMatches ? numberMatches.join(' ') : 'No numbers found.';

//     setReading(onlyNumbers);
//   } catch (error) {
//     console.log("OCR Error:", error);
//     alert("Failed to extract text.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Meter Reading App</Text>

//       <TextInput
//         style={styles.input}
//         value={reading}
//         placeholder="Meter Reading"
//         editable={false}
//       />

//       <Button title="Capture Meter" onPress={takePhoto} />

//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       {loading && <Text>Processing...</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderColor: '#888',
//     borderWidth: 1,
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 5,
//   },
//   image: {
//     width: '100%',
//     height: 250,
//     marginTop: 20,
//   },
// });

// API KEY = AIzaSyDIOB8G9a1UMJqcWzp6ZdcMwy5Ek__kI1c

import React, { useState, useRef } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

export default function Home() {
  const [image, setImage] = useState(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });

  const cameraRef = useRef(null);

  const openCamera = () => {
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false, // Ensure proper orientation
        });

        // Calculate crop region
        const RECT_WIDTH_PERCENT = 0.8;
        const RECT_HEIGHT = 200;

        const rectWidth = previewLayout.width * RECT_WIDTH_PERCENT;
        const rectX = (previewLayout.width - rectWidth) / 2;
        const rectY = (previewLayout.height - RECT_HEIGHT) / 2;

        // Calculate scale factors
        const scaleX = photo.width / previewLayout.width;
        const scaleY = photo.height / previewLayout.height;

        // Crop operations
        const manipulations = [
          {
            crop: {
              originX: rectX * scaleX,
              originY: rectY * scaleY,
              width: rectWidth * scaleX,
              height: RECT_HEIGHT * scaleY,
            },
          },
        ];

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          manipulations,
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setImage(manipulatedImage.uri);
        extractText(manipulatedImage.uri);
        setShowCamera(false);
      } catch (error) {
        console.log("Capture error:", error);
        alert("Failed to capture photo");
      }
    }
  };

  const extractText = async (imageUri) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("apikey", "helloworld");
      formData.append("OCREngine", "2");
      formData.append("language", "eng");
      formData.append("isOverlayRequired", "false");
      formData.append("file", {
        uri: imageUri,
        name: "meter.jpg",
        type: "image/jpg",
      });

      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const parsedText = response.data?.ParsedResults?.[0]?.ParsedText || "";
      const numberMatches = parsedText.match(/\d+/g);
      const onlyNumbers = numberMatches
        ? numberMatches.join(" ")
        : "No numbers found.";

      setReading(onlyNumbers);
    } catch (error) {
      console.log("OCR Error:", error);
      alert("Failed to extract text.");
    } finally {
      setLoading(false);
    }
  };

  if (!permission)
    return (
      <View>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text>No access to camera. Please allow permissions.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meter Reading App</Text>

      <TextInput
        style={styles.input}
        value={reading}
        placeholder="Meter Reading"
        editable={false}
      />

      <Button title="Capture Meter" onPress={openCamera} />

      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setPreviewLayout({ width, height });
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.barcodeArea} />
              <TouchableOpacity
                style={styles.captureButton}
                onPress={capturePhoto}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          </CameraView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: 250,
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  barcodeArea: {
    width: "80%",
    height: 200,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 0, 0.7)",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  captureButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});


