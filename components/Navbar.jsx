import { TouchableOpacity, StyleSheet, View, TouchableWithoutFeedback, Keyboard, Text, TextInput, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import { hp, wp } from '../helpers/common';
import theme from '../constants/theme';
import Icon from '../assets/icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { CreateIdea } from '../services/ideaService';


const Navbar = ({ fetchIdeas }) => {
    const { user } = useAuth(); // Get logged-in user
    const router = useRouter();
    const pathname = usePathname();
    const { theme: apptheme } = useTheme();
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [idea, setIdea] = useState('');

    const handleCreateIdea = async () => {
        if (!idea.trim()) {
            Alert.alert('Naming Issue', 'Idea Must Have a Name');
            return;
        }

        const newIdea = {
            title: idea.trim(),
            userId: user?.id,
            description: description.trim(),
            state: 'idea',
            ranked: false,
        };

        const res = await CreateIdea(newIdea);
        if (res.success) {
            setIdea('');
            setDescription('');
            setModalVisible(false);
            fetchIdeas(); // Call fetchIdeas after creating the new idea
        }
    };

    // Check if the current path is active
    const isActive = (path) => {
        const cleanPath = pathname.split('?')[0]; // Strip query parameters
        return cleanPath === `/${path}` || cleanPath.startsWith(`/${path}`);
    };

    // Render a single navbar item
    const renderNavItem = (path, iconName) => (
        <TouchableOpacity
            style={styles.navItem}
            onPress={() => !isActive(path) && router.push(path)}
            disabled={isActive(path)} // Disable button if active
        >
            <View style={[styles.iconContainer, { backgroundColor: isActive(path) ? apptheme === 'light' ? 'rgba(167, 173, 199, 0.5)' : 'rgba(103, 116, 149, 0.5)' : 'transparent' }]}>
                <Icon
                    name={iconName}
                    size={30}
                    strokeWidth={3}
                    color={theme.colors.text}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={[styles.navbar, { backgroundColor: theme.colors.Button2 }]}>
                {renderNavItem('onHold', 'pause')}
                {renderNavItem('home', 'idea')}
                {renderNavItem('executions', 'rocket')}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.addButton, {backgroundColor: apptheme ===  'light' ? '#A7ADC7' : theme.colors.Button}]}>
                <Icon name="add" size={35} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Modal for adding idea */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[styles.modalContent, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.dark }]}>
                                <Text style={[styles.modalTitle, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.dark }]}>Add New Idea</Text>

                                <TextInput
                                    style={[styles.input, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.darker, color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}
                                    placeholder="Title (required)"
                                    placeholderTextColor={apptheme === 'dark' ? theme.colors.light : theme.colors.dark}
                                    value={idea}
                                    onChangeText={setIdea}
                                    multiline
                                />

                                <TextInput
                                    style={[styles.input, styles.descriptionInput, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.darker, color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}
                                    placeholder="Description (optional)"
                                    placeholderTextColor={apptheme === 'dark' ? theme.colors.light : theme.colors.dark}
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                />

                                <View style={styles.modalActions}>
                                    <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </Pressable>

                                    <Pressable style={styles.Createbutton} onPress={handleCreateIdea}>
                                        <Text style={styles.buttonText}>Create</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};


export default Navbar;

const styles = StyleSheet.create({
    navbar: {
        position: 'absolute',
        bottom: 15,
        right: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: hp(1),
        borderRadius: 50,
        marginHorizontal: 70,
    },
    navItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: hp(8),
        height: hp(8),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addButton: {
        position: 'absolute',
        
        justifyContent: 'center',
        alignItems: 'center',
        width: hp(8),
        height: hp(8),
        borderRadius: '50%',
        bottom: hp(10),
        right: wp(5),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: hp(2),
        fontFamily: 'Satoshi-Bold',
    },
    input: {
        padding: 10,
        borderRadius: 8,
        marginBottom: hp(3),
        fontFamily: 'Satoshi-Regular',
    },
    descriptionInput: {
        height: hp(20),
        marginBottom: hp(3),
        textAlignVertical: 'top',
        fontFamily: 'Satoshi-Regular',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalContent: {
        width: '90%',
        backgroundColor: theme.colors.dark,
        padding: wp(4),
        borderRadius: 12,
    },
    button: {
        backgroundColor: 'silver',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: hp(1),
    },
    Createbutton: {
        backgroundColor: theme.colors.Button2,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: hp(1),
    },
    buttonText: {
        fontFamily: 'Satoshi-Regular',
    }
});
