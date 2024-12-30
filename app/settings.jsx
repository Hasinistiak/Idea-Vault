import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert, Modal, TextInput, ScrollView, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import theme from '../constants/theme';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helpers/common';
import { CreateTag, fetchUserTags } from '../services/tagService';
import Plus from '../assets/icons/Plus';
import { Add } from '../assets/icons/Add';
import { useRouter } from 'expo-router';

const Settings = () => {
    const { user, logout } = useAuth();
    const { theme: apptheme, toggleTheme } = useTheme();
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out', 'Error Signing Out');
        }
    };

    const enableTheme = () => {
        toggleTheme(apptheme === 'light' ? 'dark' : 'light');
    };

    const fetchTags = async () => {
        const userId = user?.id;
        const result = await fetchUserTags(userId);
        if (result.success) {
            setTags(result.data);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTags();
            supabase
                .channel('table-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'tags',
                    },
                    (payload) => {
                        fetchTags();
                    }
                )
                .subscribe();
        }
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 700);
        return () => clearTimeout(timeout);
    }, [user]);

    const handleCreateTag = async () => {
        if (!tag.trim()) {
            alert('Tag Must Have a Name');
            return;
        }

        const newTag = {
            name: tag.trim(),
            userId: user?.id,
        };

        const res = await CreateTag(newTag);
        if (res.success) {
            if (setTags) {
                setTags((prevTags) => [res.data, ...prevTags]);
            }
            setTag('');
            setModalVisible(false);
        }
    };

    const handleCancel = () => {
        setTag('');
        setModalVisible(false);
        fetchTags()
    }

    const handleClick = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
            <Animated.View
                style={styles.header}
            >
                <Header title={'Settings'} />
            </Animated.View>
            <ScrollView style={[styles.container, { backgroundColor: apptheme === 'light' ? theme.colors.white : theme.colors.darker }]}>
                <View>

                    {/* User Details Card */}
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark,
                                marginTop: hp(10),
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

                    {/* Tags Card */}
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark,
                            },
                        ]}
                    >
                        <View style={styles.tagsHeader}>
                            <Text
                                style={[
                                    styles.cardTitle,
                                    { color: apptheme === 'dark' ? theme.colors.lightText : theme.colors.text },
                                ]}
                            >
                                Tags
                            </Text>
                            <TouchableOpacity
                                onPress={handleClick}
                                style={[styles.plusButton, { backgroundColor: apptheme === 'light' ? theme.colors.Button2 : theme.colors.Button2 }]}
                                activeOpacity={0.7}
                            >
                                <Add width={18} height={18} color={theme.colors.darker} />
                            </TouchableOpacity>
                        </View>


                        <View style={[styles.tagsWrapper, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>
                            {tags.map((item, index) => (
                                <View key={index} style={{
                                    ...styles.tag,
                                    backgroundColor:
                                      item.color === 'red'
                                        ? theme.colors.red
                                        : item.color === 'blue'
                                          ? theme.colors.blue
                                          : item.color === 'green'
                                            ? theme.colors.green
                                            : item.color === 'yellow'
                                              ? theme.colors.yellow
                                              : apptheme === 'light'
                                                ? theme.colors.light
                                                : theme.colors.card,
                                    color:
                                     apptheme === 'light' ? theme.colors.darker : theme.colors.light
                                  }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: 'tagPage',
                                                params: {
                                                    tagId: item.id,
                                                    tagName: item.name,
                                                    userId: item.userId,
                                                },
                                            })
                                        }
                                    ><Text style={{ color: apptheme === 'light' ? theme.colors.darker : theme.colors.light, }}>{item.name}</Text></TouchableOpacity>
                                    {/* <Cancel onPress={() => onPressCancel(item.tag_id)} /> */}
                                </View>
                            ))}
                        </View>


                        <Modal
                            transparent={true}
                            visible={modalVisible}
                            animationType="fade"
                            onRequestClose={handleCancel}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={[styles.modalContent, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.darker }]}>
                                    <TextInput
                                        value={tag}
                                        onChangeText={setTag}
                                        placeholder="Enter tag name"
                                        placeholderTextColor={apptheme === 'light' ? theme.colors.darker : theme.colors.light}
                                        style={[styles.input, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}
                                    />
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={handleCreateTag}
                                            style={[styles.createButton, { backgroundColor: apptheme === 'light' ? theme.colors.Button2 : theme.colors.Button2 }]}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.buttonText}>Create</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
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
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Settings;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,


    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
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

        marginBottom: 10,
        fontFamily: 'Satoshi-Bold'
    },
    cardContent: {
        paddingVertical: 10,
    },
    cardText: {
        fontSize: 16,
        fontFamily: 'Satoshi-Regular'
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 99, 71,0.2)',

        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 30
    },
    logoutText: {
        color: 'rgba(255, 0, 0,0.7)',
        fontSize: 16,
        fontFamily: 'Satoshi-Bold'
    },
    tagsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tagText: {
        fontWeight: '500',
        fontSize: 16,
    },
    plusButton: {
        padding: 8,
        borderRadius: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        padding: 12,
        marginBottom: 20,
        backgroundColor: theme.colors.dark,
        borderRadius: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    createButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    tagsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
        marginTop: hp(1),
        paddingHorizontal: wp(2),
        paddingVertical: wp(3),
        borderRadius: 12
    },
    tag: {
        paddingHorizontal: wp(2),
        paddingVertical: wp(1),
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
});
