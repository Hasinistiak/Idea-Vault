import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import theme from '../constants/theme';
import { hp } from '../helpers/common';
import BackButton from './BackButton';
import Icon from '../assets/icons';

const Header = ({title, showBackButton = true, mb=10, ml=0, showDeleteIcon= false, onDeletePress}) => {
    const router = useRouter();
  return (
    <View style={[styles.container, {marginBottom: mb}, {marginLeft: ml}]}>
      {
        showBackButton && (
            <View style={styles.backButton}>
                <BackButton router={router} />
            </View>
        )
      }

      
      <Text style={styles.title}>{title || ""}</Text>

      {
        showDeleteIcon && (
          <TouchableOpacity style={styles.deleteIcon} onPress={onDeletePress}>
            <Icon name={'delete'} color={'red'} size={28}/>
          </TouchableOpacity>
          
        )
      }
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap:10,
    },

    title: {
        fontSize: hp(2.7),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.light,
    },

    backButton:{
        position: 'absolute',
        left: 0
    },

    deleteIcon:{
      position: 'absolute',
      right: 0
  }
})