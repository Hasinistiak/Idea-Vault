import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Icon from '../assets/icons/index'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import theme from '../constants/theme'

import Button from '../components/Button'
import { supabase } from '../lib/supabase'
import Input from '../components/input'

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async()=>{
        if(!emailRef.current || !passwordRef.current){
            Alert.alert("Login", "Please fill all the fields!");
            return;
        }

        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);
        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false)

        //console.log('error: ', error );
        if(error){
            Alert.alert('Login', error.message);
        }

    }

  return (
    <ScreenWrapper bg={theme.colors.darker}>
        <StatusBar style='dark'/>
        <View style={styles.container}>
            <BackButton router={router}/>

            {/*Title*/}
            <View>
                <Text style={styles.titleText}>Hey</Text>
                <Text style={styles.titleText}>Welcome Back!</Text>
            </View>

            {/*form*/}

            <View style={styles.form}>
                <Text style={{fontSize: 17, color: theme.colors.light}}>
                    Please Login to Continue.
                </Text>
                <Input
                    icon={<Icon name="mail" color={theme.colors.light} size={26} strokeWidth={1.6}/>}
                    placeholder= "Enter Your Email"
                    onChangeText={value => emailRef.current = value}
                />
                <Input
                    icon={<Icon name="lock" color={theme.colors.light} size={26} strokeWidth={1.6}/>}
                    placeholder= "Enter Your Password"
                    secureTextEntry
                    onChangeText={value => passwordRef.current = value}
                />
                <Text style={styles.forgotPassword}>
                    Forgot Password?
                </Text>

                {/* Button */}

                <Button title={'Login'} loading={loading} onPress={onSubmit} />
            
                {/*signup*/}
                <View style={styles.signup}>
                    <Text style={styles.signupText}>
                        Don't Have an Account?
                    </Text>
                    <Pressable onPress={()=> router.push('signup')}>
                        <Text style={[styles.signupText, {color: theme.colors.Button2, fontWeight: theme.fontWeights.bold}]}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
        paddingVertical: hp(7)
    },

    titleText: {
        fontSize: 30,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.lightText,
    },

    form:{
        gap:25
    },

    forgotPassword: {
        textAlign: "right",
        fontWeight: theme.fontWeights.bolder,
        color: theme.colors.lightText,
    },
    signup:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },

    signupText: {
        textAlign: 'center',
        color: theme.colors.lightText,
        fontSize: 18
    }
})