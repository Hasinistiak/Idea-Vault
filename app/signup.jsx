import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from '../assets/icons/index';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import Input from '../components/input';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

const SignUp = () => {
    const router = useRouter();
    const emailRef = useRef("");

    const nameRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Sign Up", "Please fill all the fields!");
            return;
        }

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();


        setLoading(true);

        // Sign up the user with Supabase Auth
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            }
        });
        setLoading(false);

        if (error) {
            Alert.alert("Sign Up", error.message);
            return;
        }


        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: user.id,
                    name: name,
                    email: email
                }
            ]);

        if (insertError) {
            Alert.alert("Database Error", insertError.message);
        }
    };

    return (
        <ScreenWrapper bg={theme.colors.darker}>
            <StatusBar style='dark' />
            <ScrollView>
                <View style={styles.container}>
                    <BackButton router={router} />

                    {/*Title*/}
                    <View>
                        <Text style={styles.titleText}>Let's</Text>
                        <Text style={styles.titleText}>Get Started!</Text>
                    </View>

                    {/*form*/}

                    <View style={styles.form}>
                        <Text style={{ fontSize: 17, color: theme.colors.lightText }}>
                            Please Enter Details to Create a new Account.
                        </Text>
                        <Input
                            icon={<Icon name="user" color={theme.colors.light} size={26} strokeWidth={1.6} />}
                            placeholder="Enter Your Name"
                            onChangeText={value => nameRef.current = value}
                        />
                        <Input
                            icon={<Icon name="mail" color={theme.colors.light} size={26} strokeWidth={1.6} />}
                            placeholder="Enter Your Email"
                            onChangeText={value => emailRef.current = value}
                        />
                        <Input
                            icon={<Icon name="lock" color={theme.colors.light} size={26} strokeWidth={1.6} />}
                            placeholder="Enter Your Password"
                            secureTextEntry
                            onChangeText={value => passwordRef.current = value}
                        />

                        {/* Button */}

                        <Button title={'Sign Up'} loading={loading} onPress={onSubmit} />

                        {/*signup*/}
                        <View style={styles.login}>
                            <Text style={styles.loginText}>
                                Already Have an Account?
                            </Text>
                            <Pressable onPress={() => router.push('login')}>
                                <Text style={[styles.loginText, { color: theme.colors.Button2, fontWeight: theme.fontWeights.bold }]}>
                                    Login
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
        paddingVertical: hp(7)
    },

    titleText: {
        fontSize: 30,
        fontWeight: theme.fontWeights.bold,
    color: theme.colors.light,
    },    

    form: {
        gap: 18
    },
    login: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },

    loginText: {
        textAlign: 'center',
        color: theme.colors.lightText,
        fontSize: 18,
        marginBottom: hp(5)
    }
});
