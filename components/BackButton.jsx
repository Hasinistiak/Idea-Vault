import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import theme from '../constants/theme'
import Icon from '../assets/icons'

const BackButton = ({ size = 26, router }) => {
    return (
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Icon name="arrowLeft" color={theme.colors.light} strokeWidth={2.5} size={size} />
      </TouchableOpacity>
    );
  };
  

export default BackButton

const styles = StyleSheet.create({
    button:{
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
})