import React, { useState, useEffect } from 'react';
import { Stack, usePathname } from 'expo-router'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainLayout />
    </GestureHandlerRootView>
  );
};

const MainLayout = () => {
  const pathname = usePathname(); 
  const [prevPath, setPrevPath] = useState(pathname);  

  const getTabAnimation = () => {
    const currentTab = pathname.split('/')[1];
    const prevTab = prevPath.split('/')[1];  

   
    if (currentTab > prevTab) {
      return 'slide_from_left';
    }

    if (currentTab < prevTab) {
      return 'slide_from_right';
    }
   
    return 'default';
  };

  useEffect(() => {

    setPrevPath(pathname);
  }, [pathname]);

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
