import { useRouter, Slot } from "expo-router";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

const RootNavigation = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = true;

        // Queue navigation in next event loop cycle
        setTimeout(() => {
          if (isValid) {
            router.replace('/(main)');
          } else {
            router.replace('/(auth)');
          }
          setIsLoading(false);
        }, 0);

        
      } catch (error) {
        console.error('Auth check failed:', error);
        setTimeout(() => {
          router.replace('/(auth)');
          setIsLoading(false);
        }, 0);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <StatusBar hidden />
      <Slot />
      
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          zIndex: 999
        }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};

export default RootNavigation;