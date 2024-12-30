import { Animated, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { fetchTaggedIdeas, RemoveTag, UpdateTag } from '../services/tagService';
import Loading from '../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { TouchableWithoutFeedback } from 'react-native';

const TagPage = () => {
    const { tagId, tagName, userId } = useLocalSearchParams();
    const [ideas, setIdeas] = useState([]);
    const [selectedSection, setSelectedSection] = useState('idea'); // 'idea', 'doLater', 'execution'
    const { theme: apptheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const scrollY = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [tagname, setTagName] = useState(tagName);
    const [selectedColor, setSelectedColor] = useState('default');
    const [modalVisible, setModalVisible] = useState(false)

    const fetchIdeas = async () => {
        try {
            const result = await fetchTaggedIdeas(tagId);
            if (result.success) {
                setIdeas(result.data);
            } else {
                console.error('Failed to fetch ideas');
            }
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 700);
            return () => clearTimeout(timeout);
        }
    };

    useEffect(() => {
        setIdeas([]);
        setLoading(true);
        fetchIdeas();
    }, [tagId, tagName]);

    const handleTagRemove = async () => {
        const res = await RemoveTag(userId, tagId);
        if (res.success) {
            closeModals();
            router.back();
        }
    };

    const closeModals = () => {
        setConfirmModalVisible(false);
    };

    const handleTagChange = async () => {
        const updatedFields = { color: selectedColor, name: tagname };
        const res = await UpdateTag(userId, updatedFields, tagId);

        if (res.success) {

        } else {
            alert('Failed to update tag color.');
        }
    };

    const filteredIdeas = ideas.filter((idea) => idea.ideas.state === selectedSection);

    return (
        <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
            <View style={styles.container}>
                <Animated.View
                    style={styles.header}
                >
                    <Header
                        title={tagName}
                        showBackButton={true}
                        showProfileIcon={false}
                        mr={wp(4)}
                        showDeleteIcon={true}
                        onDeletePress={() => setConfirmModalVisible(true)}
                        onTitlePress={()=> setModalVisible(true)}
                    />
                </Animated.View>

                {loading ? (
                    <View style={styles.centeredContainer}>
                        <Loading />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                    >
                        {filteredIdeas.map((idea) => (
                            <TouchableOpacity key={idea.id}
                                onPress={() =>
                                    router.push({
                                        pathname: 'ideaPage',
                                        params: {
                                            ideaId: idea.ideas.id,
                                            ideaTitle: idea.ideas.title,
                                            ideaDescription: idea.ideas.description,
                                            ideaState: idea.ideas.state,
                                        },
                                    })
                                }>
                                <View style={[styles.card, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>
                                    <Text style={[styles.cardTitle, { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText }]}>
                                        {idea.ideas.title}
                                    </Text>
                                    <Text
                                        style={[styles.cardDescription, { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText }]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {idea.ideas.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        {filteredIdeas.length === 0 && (
                            <View style={styles.centeredContainer}>
                                <Text style={styles.emptyText}>No ideas found in this section</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
                <View style={styles.sectionSwitcher}>
                    <TouchableOpacity onPress={() => setSelectedSection('doLater')}>
                        <Text style={[selectedSection === 'doLater' ? [styles.selected, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.Button2 }] : [styles.unselected, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.dark }]]}>Do Later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedSection('idea')}>
                        <Text style={[selectedSection === 'idea' ? [styles.selected, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.Button2 }] : [styles.unselected, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.dark }]]}>Idea</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedSection('execution')}>
                        <Text style={[selectedSection === 'execution' ? [styles.selected, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.Button2 }] : [styles.unselected, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.dark }]]}>Execution</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)}>
                    <View
                        style={[
                            styles.tagModalContent,
                            { backgroundColor: apptheme === 'light' ? theme.colors.card : theme.colors.dark },
                        ]}
                    >
                        <Text
                            style={{
                                ...styles.modalTitle,
                                color: apptheme === 'light' ? theme.colors.darker : theme.colors.light,
                            }}
                        >
                            Edit Tag
                        </Text>
                        <TextInput
                            style={[
                                styles.textArea,
                                {
                                    backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.darker,
                                   color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker
                                },
                            ]}
                            placeholder="Change tag name..."
                            value={tagname}
                            onChangeText={setTagName}
                            placeholderTextColor={apptheme === 'dark' ? theme.colors.light : theme.colors.darker}
                        />
                        <View style={styles.colorPickerContainer}>
                            {[
                                { name: 'red', color: theme.colors.red },
                                { name: 'blue', color: theme.colors.blue },
                                { name: 'green', color: theme.colors.green },
                                { name: 'yellow', color: theme.colors.yellow },
                                { name: 'default', color: apptheme === 'light' ? theme.colors.light : theme.colors.card },
                            ].map(({ name, color }) => (
                                <TouchableOpacity
                                    key={name}
                                    style={[
                                        styles.colorCircle,
                                        {
                                            backgroundColor: color,
                                            borderWidth: selectedColor === name ? 3 : 0,
                                            borderColor: 'black',
                                            shadowColor: selectedColor === name ? 'black' : 'transparent',
                                            shadowRadius: selectedColor === name ? 5 : 0,
                                        },
                                    ]}
                                    onPress={() => setSelectedColor(name)}
                                />
                            ))}
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                {
                                    backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.darker,
                                },
                            ]}
                            onPress={() => {
                                handleTagChange();
                                setModalVisible(false);
                            }}
                        >
                            <Text
                                style={{
                                    color: apptheme === 'light' ? theme.colors.darker : theme.colors.light,
                                }}
                            >
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal for Deleting Tag */}
            <Modal
                visible={isConfirmModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModals}
            >
                <TouchableWithoutFeedback onPress={closeModals}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.modalContent, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.darker }]}>
                                <Text style={[styles.modalTitle, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}>Are you sure you want to delete this tag?</Text>
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity onPress={handleTagRemove} style={[styles.button, styles.removeButton]}>
                                        <Text style={styles.removeButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={closeModals} style={[styles.button, styles.Button]}>
                                        <Text style={[styles.ButtonText, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScreenWrapper>
    );
};

export default TagPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollContainer: {
        padding: 16,
        paddingTop: hp(12),
        marginTop: hp(2)
    },
    card: {
        padding: wp(4),
        borderRadius: 15,
        marginBottom: hp(2),
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Satoshi-Medium'
    },
    cardDescription: {
        fontSize: 16,
        paddingTop: 5,
        fontFamily: 'Satoshi-Regular'
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(30)
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
        fontFamily: 'Satoshi-Bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    modalContent: {
        width: wp(90),
        backgroundColor: theme.colors.light,
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'Satoshi-Bold',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    removeButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 99, 71,0.2)',
    },
    removeButtonText: {
        color: 'rgba(255, 0, 0,0.7)',
        fontFamily: 'Satoshi-Medium',
    },
    sectionSwitcher: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
        position: 'absolute',
        bottom: 15,
        gap: 10,
        right: 0,
        left: 0,
    },
    selected: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 15
    },
    unselected: {
        fontSize: 18,
        color: 'gray',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 15,
        backgroundColor: 'green'
    },
    overlay: {
        position: 'absolute', // Change from 'fixed' to 'absolute'
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },    
    tagModalContent: {
        padding: 20,
        borderRadius: 12,
        // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Remove this line
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        elevation: 5, // Android shadow equivalent
        shadowColor: '#000', // iOS shadow equivalent
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '90%'
    },    
      textArea: {
        width: '100%',
        height: 50,
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 8,
        border: 'none',
        resize: 'none',
        outline: 'none'
      },
      colorPickerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 10,
      },
      colorCircle: {
        width: 35,
        height: 35,
        borderRadius: 50,
    },
    
      saveButton: {
        backgroundColor: '#007bff',
        padding: 10,
        fontSize: 18,
        border: 'none',
        borderRadius: 8,
      }
});
