import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import theme from '../constants/theme'
import Icon from '../assets/icons'
import { useTheme } from '../contexts/ThemeContext';
import { wp } from '../helpers/common';


const BackButton = ({ size = 25, router }) => {
    const { theme: apptheme } = useTheme();
  
    return (
      <TouchableOpacity onPress={() => router.back()} style={[styles.button, {backgroundColor: apptheme === 'dark'? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',}]}>
        <Icon name="arrowLeft" color={apptheme === 'light' ? theme.colors.darker : theme.colors.light} strokeWidth={2.5} size={size} />
      </TouchableOpacity>
    );
  };
  

export default BackButton

const styles = StyleSheet.create({
    button:{
        alignSelf: 'flex-start',
        padding: wp(2),
        borderRadius: '50%',
        zIndex: 999
    },
})