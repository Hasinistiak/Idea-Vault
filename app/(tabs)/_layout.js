import React from 'react';
import { Stack, usePathname } from 'expo-router'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router'; 
import { ThemeProvider } from '../../contexts/ThemeContext';

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainLayout />
    </GestureHandlerRootView>
  );
};

const MainLayout = () => {
  const pathname = usePathname(); 

  const getTabAnimation = () => {
    return 'none'; 
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: getTabAnimation(), 
        gestureDirection: 'horizontal',
      }}
    >
      {/* Ensure each route is wrapped in a Screen component */}
    </Stack>
  );
};

export default _layout;
