// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as ImageManipulator from "expo-image-manipulator";
// import TextRecognition from "@react-native-ml-kit/text-recognition";

// export default function Home() {
//   const [image, setImage] = useState(null);
//   const [reading, setReading] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });

//   const cameraRef = useRef(null);
//   const screenWidth = Dimensions.get("window").width;

//   const openCamera = () => setShowCamera(true);

//   const capturePhoto = async () => {
//     if (!cameraRef.current) return;

//     try {
//       const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

//       const RECT_WIDTH_PERCENT = 0.8;
//       const RECT_HEIGHT = 200;
//       const rectWidth = previewLayout.width * RECT_WIDTH_PERCENT;
//       const rectX = (previewLayout.width - rectWidth) / 2;
//       const rectY = (previewLayout.height - RECT_HEIGHT) / 2;

//       const scaleX = photo.width / previewLayout.width;
//       const scaleY = photo.height / previewLayout.height;

//       const manipulatedImage = await ImageManipulator.manipulateAsync(
//         photo.uri,
//         [
//           {
//             crop: {
//               originX: rectX * scaleX,
//               originY: rectY * scaleY,
//               width: rectWidth * scaleX,
//               height: RECT_HEIGHT * scaleY,
//             },
//           },
//         ],
//         { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
//       );

//       setImage(manipulatedImage.uri);
//       extractTextFromImage(manipulatedImage.uri);
//       setShowCamera(false);
//     } catch (error) {
//       console.error("Capture error:", error);
//       alert("Failed to capture photo");
//     }
//   };

//   const extractTextFromImage = async (imageUri) => {
//     try {
//       setLoading(true);
//       const result = await TextRecognition.recognize(imageUri);

//       // FIXED: Handle result object properly
//       const fullText = result.text || "";
//       const numbers = fullText.match(/\d+(\.\d+)?/g); // Include decimal numbers
//       const onlyNumbers = numbers ? numbers.join(" ") : "No numbers found";

//       setReading(onlyNumbers);
//     } catch (error) {
//       console.error("OCR Error:", error);
//       alert("Failed to read text from image.");
//       setReading("Error reading text");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetApp = () => {
//     setImage(null);
//     setReading("");
//   };

//   if (!permission) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//       </View>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <View style={[styles.container, styles.permissionContainer]}>
//         <Text style={styles.permissionText}>
//           Camera permission is required to use this feature
//         </Text>
//         <TouchableOpacity
//           style={styles.permissionButton}
//           onPress={requestPermission}
//         >
//           <Text style={styles.buttonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Meter Reading Scanner</Text>

//       <View style={styles.readingContainer}>
//         <TextInput
//           style={styles.input}
//           value={reading}
//           placeholder="Meter reading will appear here"
//           placeholderTextColor="#9CA3AF"
//           editable={false}
//         />
//         {reading && (
//           <TouchableOpacity onPress={resetApp} style={styles.resetButton}>
//             <Text style={styles.resetText}>✕</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
//         <Text style={styles.buttonText}>Capture Meter</Text>
//       </TouchableOpacity>

//       {image && (
//         <Image
//           source={{ uri: image }}
//           style={styles.image}
//           resizeMode="contain"
//         />
//       )}
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#3B82F6" />
//           <Text style={styles.loadingText}>Processing image...</Text>
//         </View>
//       )}

//       <Modal
//         visible={showCamera}
//         animationType="slide"
//         statusBarTranslucent={true}
//       >
//         <View style={styles.cameraContainer}>
//           <CameraView
//             ref={cameraRef}
//             style={styles.camera}
//             onLayout={(event) => {
//               const { width, height } = event.nativeEvent.layout;
//               setPreviewLayout({ width, height });
//             }}
//           >
//             <View style={styles.overlay}>
//               <Text style={styles.instructionText}>
//                 Align meter reading inside the frame
//               </Text>
//               <View style={styles.barcodeArea} />
//               <TouchableOpacity
//                 style={styles.captureButtonInner}
//                 onPress={capturePhoto}
//               >
//                 <View style={styles.captureCircle} />
//               </TouchableOpacity>
//             </View>
//           </CameraView>

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setShowCamera(false)}
//           >
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: "#F9FAFB",
//     justifyContent: "flex-start",
//   },
//   permissionContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 30,
//   },
//   permissionText: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#374151",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginVertical: 24,
//     textAlign: "center",
//     color: "#1F2937",
//   },
//   readingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   input: {
//     flex: 1,
//     borderColor: "#D1D5DB",
//     borderWidth: 1,
//     padding: 16,
//     borderRadius: 12,
//     fontSize: 18,
//     backgroundColor: "white",
//     color: "#1F2937",
//     elevation: 1,
//   },
//   resetButton: {
//     position: "absolute",
//     right: 15,
//     padding: 10,
//   },
//   resetText: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   captureButton: {
//     backgroundColor: "#3B82F6",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     elevation: 2,
//   },
//   permissionButton: {
//     backgroundColor: "#3B82F6",
//     padding: 16,
//     borderRadius: 12,
//     width: "80%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   image: {
//     width: "100%",
//     height: 250,
//     marginTop: 20,
//     borderRadius: 12,
//     backgroundColor: "#E5E7EB",
//   },
//   loadingContainer: {
//     marginTop: 30,
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: "#4B5563",
//   },
//   cameraContainer: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   instructionText: {
//     color: "white",
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     padding: 8,
//     borderRadius: 8,
//   },
//   barcodeArea: {
//     width: "80%",
//     height: 200,
//     borderWidth: 3,
//     borderColor: "rgba(59, 130, 246, 0.8)",
//     backgroundColor: "transparent",
//     borderRadius: 12,
//   },
//   captureButtonInner: {
//     position: "absolute",
//     bottom: 50,
//     alignSelf: "center",
//   },
//   captureCircle: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "white",
//     borderWidth: 4,
//     borderColor: "#E5E7EB",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 60,
//     right: 25,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
// });






// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   ActivityIndicator,
//   Dimensions,
//   Alert,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as ImageManipulator from "expo-image-manipulator";
// import TextRecognition from "@react-native-ml-kit/text-recognition";

// export default function Home() {
//   const [image, setImage] = useState(null);
//   const [reading, setReading] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });

//   const cameraRef = useRef(null);
//   const screenWidth = Dimensions.get("window").width;

//   const openCamera = () => setShowCamera(true);

//   const capturePhoto = async () => {
//     if (!cameraRef.current) return;

//     try {
//       const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

//       const RECT_WIDTH_PERCENT = 0.8;
//       const RECT_HEIGHT = 200;
//       const rectWidth = previewLayout.width * RECT_WIDTH_PERCENT;
//       const rectX = (previewLayout.width - rectWidth) / 2;
//       const rectY = (previewLayout.height - RECT_HEIGHT) / 2;

//       const scaleX = photo.width / previewLayout.width;
//       const scaleY = photo.height / previewLayout.height;

//       const manipulatedImage = await ImageManipulator.manipulateAsync(
//         photo.uri,
//         [
//           {
//             crop: {
//               originX: rectX * scaleX,
//               originY: rectY * scaleY,
//               width: rectWidth * scaleX,
//               height: RECT_HEIGHT * scaleY,
//             },
//           },
//         ],
//         { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
//       );

//       setImage(manipulatedImage.uri);
//       extractTextFromImage(manipulatedImage.uri);
//       setShowCamera(false);
//     } catch (error) {
//       console.error("Capture error:", error);
//       alert("Failed to capture photo");
//     }
//   };

//   const extractTextFromImage = async (imageUri) => {
//     try {
//       setLoading(true);
//       const result = await TextRecognition.recognize(imageUri);
//       const fullText = result.text || "";

//       // NEW: Specialized extraction for meter readings
//       let extractedReading = "";

//       // Strategy 1: Look for digit sequences with consistent spacing/formatting
//       const digitBlocks = fullText.match(/([\d\s]{5,})/g) || [];

//       // Strategy 2: Look for digit sequences that might be meter readings
//       for (const block of digitBlocks) {
//         // Remove spaces and check if it's a valid number sequence
//         const cleanDigits = block.replace(/\s/g, '');
//         if (cleanDigits.length >= 5 && /^\d+$/.test(cleanDigits)) {
//           extractedReading = cleanDigits;
//           break;
//         }
//       }

//       // Strategy 3: If no match found, use the largest digit sequence
//       if (!extractedReading) {
//         const digitSequences = fullText.match(/\d+/g) || [];
//         if (digitSequences.length > 0) {
//           // Find the longest digit sequence (most likely meter reading)
//           extractedReading = digitSequences.reduce(
//             (longest, current) => current.length > longest.length ? current : longest,
//             ""
//           );
//         }
//       }

//       setReading(extractedReading || "No meter reading found");
//     } catch (error) {
//       console.error("OCR Error:", error);
//       setReading("Error reading meter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetApp = () => {
//     setImage(null);
//     setReading("");
//   };

//   if (!permission) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//       </View>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <View style={[styles.container, styles.permissionContainer]}>
//         <Text style={styles.permissionText}>
//           Camera permission is required to scan meters
//         </Text>
//         <TouchableOpacity
//           style={styles.permissionButton}
//           onPress={requestPermission}
//         >
//           <Text style={styles.buttonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Gas Meter Reader</Text>
//       <Text style={styles.subtitle}>Capture your meter reading</Text>

//       <View style={styles.readingContainer}>
//         <TextInput
//           style={styles.input}
//           value={reading}
//           placeholder="Meter reading will appear here"
//           placeholderTextColor="#9CA3AF"
//           editable={false}
//         />
//         {reading && (
//           <TouchableOpacity onPress={resetApp} style={styles.resetButton}>
//             <Text style={styles.resetText}>✕</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
//         <Text style={styles.buttonText}>Capture Meter</Text>
//       </TouchableOpacity>

//       {image && (
//         <Image
//           source={{ uri: image }}
//           style={styles.image}
//           resizeMode="contain"
//         />
//       )}
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#3B82F6" />
//           <Text style={styles.loadingText}>Reading meter...</Text>
//         </View>
//       )}

//       <Modal
//         visible={showCamera}
//         animationType="slide"
//         statusBarTranslucent={true}
//       >
//         <View style={styles.cameraContainer}>
//           <CameraView
//             ref={cameraRef}
//             style={styles.camera}
//             onLayout={(event) => {
//               const { width, height } = event.nativeEvent.layout;
//               setPreviewLayout({ width, height });
//             }}
//           >
//             <View style={styles.overlay}>
//               <Text style={styles.instructionText}>
//                 Align the meter digits inside the frame
//               </Text>
//               <View style={styles.barcodeArea} />
//               <TouchableOpacity
//                 style={styles.captureButtonInner}
//                 onPress={capturePhoto}
//               >
//                 <View style={styles.captureCircle} />
//               </TouchableOpacity>
//             </View>
//           </CameraView>

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setShowCamera(false)}
//           >
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: "#F9FAFB",
//     justifyContent: "flex-start",
//   },
//   permissionContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 30,
//   },
//   permissionText: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#374151",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     marginTop: 24,
//     marginBottom: 8,
//     textAlign: "center",
//     color: "#1F2937",
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 30,
//     textAlign: "center",
//     color: "#6B7280",
//   },
//   readingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   input: {
//     flex: 1,
//     borderColor: "#D1D5DB",
//     borderWidth: 1,
//     padding: 16,
//     borderRadius: 12,
//     fontSize: 24,
//     fontWeight: "bold",
//     backgroundColor: "white",
//     color: "#1F2937",
//     elevation: 1,
//     textAlign: "center",
//     fontFamily: "monospace",
//   },
//   resetButton: {
//     position: "absolute",
//     right: 15,
//     padding: 10,
//   },
//   resetText: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   captureButton: {
//     backgroundColor: "#3B82F6",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     elevation: 2,
//   },
//   permissionButton: {
//     backgroundColor: "#3B82F6",
//     padding: 16,
//     borderRadius: 12,
//     width: "80%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   image: {
//     width: "100%",
//     height: 250,
//     marginTop: 20,
//     borderRadius: 12,
//     backgroundColor: "#E5E7EB",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//   },
//   loadingContainer: {
//     marginTop: 30,
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: "#4B5563",
//   },
//   cameraContainer: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   instructionText: {
//     color: "white",
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     padding: 8,
//     borderRadius: 8,
//   },
//   barcodeArea: {
//     width: "80%",
//     height: 200,
//     borderWidth: 3,
//     borderColor: "rgba(59, 130, 246, 0.8)",
//     backgroundColor: "transparent",
//     borderRadius: 12,
//   },
//   captureButtonInner: {
//     position: "absolute",
//     bottom: 50,
//     alignSelf: "center",
//   },
//   captureCircle: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "white",
//     borderWidth: 4,
//     borderColor: "#E5E7EB",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 60,
//     right: 25,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
// });








import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import TextRecognition from "@react-native-ml-kit/text-recognition";

export default function Home() {
  const [image, setImage] = useState(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [previewLayout, setPreviewLayout] = useState({ width: 0, height: 0 });

  const cameraRef = useRef(null);

  const openCamera = () => setShowCamera(true);

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

      // Capture area dimensions (95% width, 120px height)
      const RECT_WIDTH_PERCENT = 0.95;
      const RECT_HEIGHT = 50;
      const rectWidth = previewLayout.width * RECT_WIDTH_PERCENT;
      const rectX = (previewLayout.width - rectWidth) / 2;
      const rectY = (previewLayout.height - RECT_HEIGHT) / 2;

      // Calculate scaling factors for actual image
      const scaleX = photo.width / previewLayout.width;
      const scaleY = photo.height / previewLayout.height;

      // Crop to the specified rectangle
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: rectX * scaleX,
              originY: rectY * scaleY,
              width: rectWidth * scaleX,
              height: RECT_HEIGHT * scaleY,
            },
          },
        ],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(manipulatedImage.uri);
      extractTextFromImage(manipulatedImage.uri);
      setShowCamera(false);
    } catch (error) {
      console.error("Capture error:", error);
      alert("Failed to capture photo");
    }
  };

  const extractTextFromImage = async (imageUri) => {
    try {
      setLoading(true);
      const result = await TextRecognition.recognize(imageUri);

      // Extract all numbers from recognized text
      const fullText = result.text || "";
      const numbers = fullText.match(/\d+(\.\d+)?/g); // Match integers and decimals
      const onlyNumbers = numbers ? numbers.join(" ") : "No numbers found";

      setReading(onlyNumbers);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to read text from image.");
      setReading("Error reading text");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setImage(null);
    setReading("");
  };

  // Handle camera permissions
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan meter readings
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meter Reading Scanner</Text>

      {/* Reading Display */}
      <View style={styles.readingContainer}>
        <TextInput
          style={styles.input}
          value={reading}
          placeholder="Meter reading will appear here"
          placeholderTextColor="#9CA3AF"
          editable={false}
        />
        {reading && (
          <TouchableOpacity onPress={resetApp} style={styles.resetButton}>
            <Text style={styles.resetText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Capture Button */}
      <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
        <Text style={styles.buttonText}>Capture Meter</Text>
      </TouchableOpacity>

      {/* Preview Image */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        statusBarTranslucent={true}
      >
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

              {/* Wide & Short Capture Area */}
              <View style={styles.barcodeArea} />

              <TouchableOpacity
                style={styles.captureButtonInner}
                onPress={capturePhoto}
              >
                <View style={styles.captureCircle} />
              </TouchableOpacity>
            </View>
          </CameraView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "flex-start",
  },
  permissionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#374151",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 24,
    textAlign: "center",
    color: "#1F2937",
  },
  readingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  input: {
    flex: 1,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    backgroundColor: "white",
    color: "#1F2937",
    elevation: 1,
  },
  resetButton: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
  resetText: {
    fontSize: 18,
    color: "#6B7280",
  },
  captureButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  permissionButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 250,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4B5563",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
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
  instructionText: {
    color: "white",
    fontSize: 18,
    marginBottom: 0,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 8,
  },
  barcodeArea: {
    width: "95%",    // Wide capture area
    height: 50,     // Short height
    borderWidth: 3,
    borderColor: "rgba(59, 130, 246, 0.8)",
    backgroundColor: "transparent",
    borderRadius: 12,
    
  },
  captureButtonInner: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  captureCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#E5E7EB",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 24,
  },
});