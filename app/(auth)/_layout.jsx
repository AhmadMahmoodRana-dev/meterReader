import { Stack } from "expo-router";

const AuthStack = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default AuthStack;
