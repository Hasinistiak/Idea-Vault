import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import theme from '../constants/theme';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp } from '../helpers/common';

const Settings = () => {
    const { user, logout } = useAuth();
    const { theme: apptheme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out', 'Error Signing Out');
        }
    };

    const enableTheme = () => {
        toggleTheme(apptheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.light}>
        <Header title={'Settings'}/>
        <View style={[styles.container, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.darker }]}>
            
            
            {/* User Details Card */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.cardTitle,
                        { color: apptheme === 'dark' ? theme.colors.lightText : theme.colors.text },
                    ]}
                >
                    User Details
                </Text>

                <View style={styles.cardContent}>
                    <Text
                        style={[
                            styles.cardText,
                            { color: apptheme === 'dark' ? theme.colors.lightText : theme.colors.text },
                        ]}
                    >
                        {user?.name || 'N/A'}
                    </Text>
                    <Text
                        style={[
                            styles.cardText,
                            { color: apptheme === 'dark' ? theme.colors.lightText : theme.colors.text },
                        ]}
                    >
                        {user?.email || 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Theme Toggle Card */}
            <View
                style={[
                    styles.toggleCard,
                    {
                        backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.cardTitle,
                        { color: apptheme === 'dark' ? theme.colors.lightText : theme.colors.text },
                    ]}
                >
                    Theme Settings
                </Text>

                <View style={styles.cardContent}>
                    <Text
                        style={[
                            styles.cardText,
                            { color: apptheme === 'dark' ? theme.colors.lightText : theme.colors.text },
                        ]}
                    >
                        Switch To {apptheme === 'light' ? 'Dark' : 'Light'} Theme
                    </Text>


                    <Switch
                        value={apptheme === 'dark'}
                        onValueChange={enableTheme}
                        trackColor={{ false: theme.colors.lightText, true: theme.colors.text }}
                        thumbColor={theme.colors.Button2}
                    />
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                    handleLogout();
                }}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
        </ScreenWrapper>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: hp(10)
    },
    card: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 10,

    },
    toggleCard: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardContent: {
        paddingVertical: 10,
    },
    cardText: {
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 99, 71,0.2)',

        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    logoutText: {
        color: 'rgba(255, 0, 0,0.7)',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
