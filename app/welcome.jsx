import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import theme from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'


const welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <StatusBar style='dark' />
      <View style={styles.container}>
        {/* Image */}
        
        {/* title */}
        <View style={{gap: 20}}>
            <Text style={styles.title}>Social App</Text>
            <Text style={styles.subTitle}>
                Reimagine the new world with Social App.
            </Text>
        </View>

        {/* button */}
      <View style={styles.button}>
        <Button
            title= "Get Started!"
            buttonStyle={{marginHorisontal: wp(3)}}
            onPress={()=> router.push('signup')}
        />
        <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>
                Already Have an Account?
            </Text>
            <Pressable onPress={()=> router.push('login')}>
                <Text style={[styles.loginText, {color:theme.colors.success}]}>Login</Text>
            </Pressable>
        </View>
      </View>

      </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.dark,
        paddingHorizontal: wp(4),
    },

    title: {
        color: theme.colors.light,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fontWeights.medium,
        font: theme.fonts.primary
    },

    Image: {
        height: hp(30),
        width: wp(100),
        alignSelf: "center"
    },

    subTitle: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.9),
        color: theme.colors.secondary,
    },

    button: {
        gap:30,
        width: '100%'
    },

    bottomTextContainer:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 5,
    },

    loginText:{
        textAlign: 'center',
        color: theme.colors.secondary,
        fontSize: hp(1.8)
    }

})