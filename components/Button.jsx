import {StyleSheet, View, Text, Pressable,} from 'react-native'
import React from 'react'
import theme from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from './Loading'

const Button = ({
    buttonStyle,
    textStyle,
    title= "",
    onPress=()=>{},
    loading = false,
    hasShadow = true,
}) => {
    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,

    }

    if(loading){
        return(
            <View style={[styles.button, buttonStyle, {backgroundColor: theme.colors.Button2}]}>
                <Loading color='black'/>
            </View>
        )
    }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({

    button:{
        backgroundColor: theme.colors.Button2,
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 25,
    },
    text:{
        fontSize: hp(2.5),
        color: theme.colors.darker,
        fontFamily: 'Satoshi-Bold'
    }


})