import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font'; // Import useFonts hook
import Loading from '../components/Loading';
import { useTheme } from '../contexts/ThemeContext';
import theme from '../constants/theme';

const Index = () => {
  const router = useRouter();
  const { theme: apptheme} = useTheme();

  // Load fonts using useFonts hook
  const [fontsLoaded] = useFonts({
    'Satoshi-Regular': require('../assets/fonts/Satoshi/Satoshi-Regular.otf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi/Satoshi-Bold.otf'),
    'Satoshi-Medium': require('../assets/fonts/Satoshi/Satoshi-Medium.otf'),
  });

  if (!fontsLoaded) {
    // Show a loading indicator until fonts are loaded
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }}>
      <Loading />
    </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }}>
      <Loading />
    </View>
  );
};

export default Index;
