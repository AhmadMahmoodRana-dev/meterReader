import { Stack } from "expo-router";

const MainStack = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animationMatchesGesture: true,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default MainStack;
