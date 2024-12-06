import React from 'react';
import { Stack, usePathname } from 'expo-router'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router'; 

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainLayout />
    </GestureHandlerRootView>
  );
};

const MainLayout = () => {
  const pathname = usePathname(); // Get the current route path

  const getTabAnimation = () => {
    return 'slide_from_right'; // Apply fade_from_bottom for all tab screens
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: getTabAnimation(), // Apply fade_from_bottom for tab screens
        gestureDirection: 'horizontal',
      }}
    >
      {/* Ensure each route is wrapped in a Screen component */}
    </Stack>
  );
};

export default _layout;
