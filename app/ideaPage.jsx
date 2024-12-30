import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import theme from '../constants/theme';
import Header from '../components/Header';
import { hp, wp } from '../helpers/common';
import { useAuth } from '../contexts/AuthContext';
import { RemoveIdea, UpdateIdea } from '../services/ideaService';
import { useTheme } from '../contexts/ThemeContext';
import Icon from '../assets/icons';
import { AddIdeaTag, fetchIdeaTags, fetchUserTags, RemoveIdeaTag } from '../services/tagService';
import { Add } from '../assets/icons/Add';
import Cancel from '../assets/icons/Cancel';
import Loading from '../components/Loading';
import { FlatList } from 'react-native';

const IdeaPage = () => {
  const { ideaId, ideaTitle, ideaDescription, ideaState } = useLocalSearchParams();
  const { user } = useAuth();
  const [title, setTitle] = useState(ideaTitle);
  const [description, setDescription] = useState(ideaDescription);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const { theme: apptheme } = useTheme();
  const [titleHeight, setTitleHeight] = useState(40);
  const [descriptionHeight, setDescriptionHeight] = useState(40);
  const [showPushButtons, setShowPushButtons] = useState(false);
  const [tags, setTags] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [userTags, setUserTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([])
  const [loading, setLoading] = useState(true);


  const fetchTags = async () => {
    const ideaid = ideaId;
    const result = await fetchIdeaTags(ideaid);
    if (result.success) {
      setTags(result.data);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);


  useEffect(() => {
    if (title !== ideaTitle || description !== ideaDescription) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [title, description, ideaTitle, ideaDescription]);

  const closeModals = () => {
    setConfirmModalVisible(false);
  };

  const handleIdeaUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Naming Issue', 'Idea Must Have a Name');
      return;
    }

    const updatedIdea = {
      title: title.trim(),
      userId: user?.id,
      description: description.trim(),
    };

    const res = await UpdateIdea(user?.id, updatedIdea, ideaId);
    if (res.success) {
      closeModals();
      setHasChanges(false); // Hide the save button after saving
    }
  };

  const handleIdeaRemove = async () => {
    const res = await RemoveIdea(user?.id, ideaId);
    if (res.success) {
      closeModals();
      router.back();
    }
  };

  const handleIdeaStateChange = async (newState) => {
    const updatedFields = { state: newState };
    const res = await UpdateIdea(user.id, updatedFields, ideaId);

    if (res.success) {
      router.back();
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };

  const fetchUsersTags = async () => {
    const result = await fetchUserTags(user.id);
    if (result.success) {
      setUserTags(result.data);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchUsersTags();
    }
  }, [user.id]);


  useEffect(() => {
    if (userTags && tags) {
      // Filter out tags that are already in the `tags` array from `userTags`
      const newAvailableTags = userTags.filter(userTag => !tags.some(tag => tag.tag_id === userTag.id));
      setAvailableTags(newAvailableTags); // Update availableTags with the result

    }
  }, [tags, userTags]);



  const handleCancel = () => {
    setModalVisible(false);
  }

  const handleAddTag = async (tagId) => {

    const newTag = {
      tag_id: tagId,
      idea_id: ideaId
    };

    const res = await AddIdeaTag(newTag);
    if (res.success) {
      if (setTags) {
        setTags((prevTags) => [res.data, ...prevTags]);
      }
      setModalVisible(false);

      fetchTags()
    }
  };


  const onPressCancel = async (tagId) => {
    const res = await RemoveIdeaTag(tagId, ideaId);
    if (res.success) {
      fetchTags()
    } else {
      alert('Error: Failed to delete tag.');
    }
  }

  const handleClick = () => {
    setModalVisible(!modalVisible);
  };


  return (
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
      <Header ml={wp(4)} mr={wp(4)} position={'absolute'} zIndex={100000} showDeleteIcon={true} onDeletePress={() => setConfirmModalVisible(true)} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Title Card */}
        <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light, marginTop: hp(10) }]}>Title</Text>
        <Pressable
          style={[styles.titleCard, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}
        >
          <TextInput
            style={[styles.cardContent, { height: titleHeight }, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter new title"
            placeholderTextColor={'gray'}
            multiline
            scrollEnabled={false}
            onContentSizeChange={(event) =>
              setTitleHeight(event.nativeEvent.contentSize.height)
            }
          />
        </Pressable>

        {/* Description Card */}
        <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Description</Text>
        <Pressable
          style={[styles.descriptionCard, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}
        >
          <TextInput
            style={[styles.cardContent, { height: descriptionHeight }, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter new description"
            placeholderTextColor={'gray'}
            multiline
            scrollEnabled={false}
            onContentSizeChange={(event) =>
              setDescriptionHeight(event.nativeEvent.contentSize.height)
            }
          />
        </Pressable>

        {/* Save Button */}
        {hasChanges && (
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.Button2 }]} onPress={handleIdeaUpdate}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}

        <View style={styles.tagContainer}>
          <View style={styles.tagHeader}>
            <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Tags</Text>
            <TouchableOpacity onPress={() => handleClick()} style={styles.addButton}>
              <Add width={25} height={25} />
            </TouchableOpacity>
          </View>
          {tags.length > 0 ? (
            <View style={[styles.tagsWrapper, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>
              {tags.map((item, index) => (
                <View key={index} style={{
                  ...styles.tag,
                  backgroundColor:
                    item.tags.color === 'red'
                      ? theme.colors.red
                      : item.tags.color === 'blue'
                        ? theme.colors.blue
                        : item.tags.color === 'green'
                          ? theme.colors.green
                          : item.tags.color === 'yellow'
                            ? theme.colors.yellow
                            : apptheme === 'light'
                              ? theme.colors.light
                              : theme.colors.card,
                  color:
                    apptheme === 'light' ? theme.colors.darker : theme.colors.light
                }}>
                  <Text style={{ color: apptheme === 'light' ? theme.colors.darker : theme.colors.light, }}>{item.tags?.name}</Text>
                  <Cancel onPress={() => onPressCancel(item.tag_id)} color={apptheme === 'light' ? theme.colors.darker : theme.colors.light} />
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.tagsWrapper, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>
              <Text style={styles.noTags}>No tags Here</Text>
            </View>
          )}
        </View>


        {ideaState && (
          <>
            <View style={styles.arrowAndButtonsContainer}>
              <TouchableOpacity
                style={[styles.arrowleft, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.Button2 }]}
                onPress={() => setShowPushButtons((prev) => !prev)} // Toggle visibility
              >
                <Icon name={showPushButtons ? 'arrowRight' : 'arrowLeft'} size={35} />

              </TouchableOpacity>

              {showPushButtons && ideaState === 'idea' && (
                <>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.PushButton,
                        { backgroundColor: apptheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' },
                      ]}
                      onPress={() => handleIdeaStateChange('doLater')}
                    >
                      <Text style={[styles.buttonText, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}>
                        Push To Do Later
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.PushButtonExecution, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.Button2 }]}
                      onPress={() => handleIdeaStateChange('execution')}
                    >
                      <Text style={[styles.buttonText, { color: theme.colors.darker }]}>Push To Execution</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {showPushButtons && ideaState === 'doLater' && (
                <>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.PushButton,
                        { backgroundColor: apptheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' },
                      ]}
                      onPress={() => handleIdeaStateChange('idea')}
                    >
                      <Text style={[styles.buttonText, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}>
                        Push To Ideas
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.PushButtonExecution, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.Button2 }]}
                      onPress={() => handleIdeaStateChange('execution')}
                    >
                      <Text style={[styles.buttonText, { color: theme.colors.darker }]}>Push To Execution</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {showPushButtons && ideaState === 'execution' && (
                <>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.PushButton,
                        { backgroundColor: apptheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' },
                      ]}
                      onPress={() => handleIdeaStateChange('doLater')}
                    >
                      <Text style={[styles.buttonText, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}>
                        Push To Do Later
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.PushButtonExecution, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.Button2 }]}
                      onPress={() => handleIdeaStateChange('idea')}
                    >
                      <Text style={[styles.buttonText, { color: theme.colors.darker }]}>Push To Ideas</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

            </View>
          </>
        )}

        {/* Remove Idea Modal */}
        <Modal
          transparent={true}
          visible={isConfirmModalVisible}
          animationType="slide"
          onRequestClose={closeModals}
        >
          <TouchableWithoutFeedback onPress={closeModals}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.modalContent, { backgroundColor: apptheme === 'light' ? theme.colors.light : theme.colors.dark }]}>
                  <Text style={[styles.modalTitle, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Are you sure you want to remove this idea?</Text>
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={closeModals}>
                      <Text style={[styles.buttonText, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeButton} onPress={handleIdeaRemove}>
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <TouchableWithoutFeedback onPress={handleCancel}>
            <View style={styles.overlay}>
              <View style={[styles.tagModalContainer, {
                backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark
              }]}>
                <Text style={[styles.headerText, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>
                  Available Tags
                </Text>
                <View style={styles.tagsContainer}>
                  {availableTags.length > 0 ? (
                    availableTags.map((item) => (
                      <TouchableOpacity
                        key={item.id.toString()}
                        style={{
                          ...styles.tagButton,
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
                        }}
                        onPress={() => handleAddTag(item.id)}
                      >
                        <Text style={[styles.tagText, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    loading ? <Loading size="small" color="gray" /> :
                      <Text style={styles.noTagsText}>No tags. Create one</Text>
                  )}
                </View>
                <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </ScrollView>
    </ScreenWrapper>
  );
};

export default IdeaPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(5),
    paddingBottom: hp(150)
  },
  titleCard: {
    borderRadius: 12,
    height: 'auto',
    padding: 20,
    textAlignVertical: 'top',
    marginBottom: 40,
  },
  descriptionCard: {
    padding: 20,
    height: 'auto',
    borderRadius: 12,
    textAlignVertical: 'top',
    marginBottom: 40
  },
  label: {
    fontSize: 20,
    marginBottom: hp(1),
    fontFamily: 'Satoshi-Bold',
  },
  cardContent: {
    fontSize: 18,
    color: theme.colors.secondary,
    height: 'auto',
    fontFamily: 'Satoshi-Regular',
  },
  saveButton: {
    padding: wp(4),
    alignItems: 'center',
    borderRadius: 12,
    marginTop: hp(2),
  },
  buttonText: {
    fontSize: 14,
    color: theme.colors.darker,
    fontFamily: 'Satoshi-Medium',
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: wp(2),
    position: 'absolute',
    left: 0,
    top: 17
  },
  PushButton: {

    paddingVertical: hp(2),
    alignItems: 'center',
    borderRadius: 50,
    width: wp(37),
  },
  PushButtonExecution: {

    paddingVertical: hp(2),
    alignItems: 'center',
    borderRadius: 50,
    width: wp(37),
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

  arrowleft: {
    position: 'absolute',
    right: wp(0),
    top: hp(2),
    padding: wp(2),
    borderRadius: '50%',
  },
  arrowAndButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: wp(4),
    marginTop: hp(2),
  },

  tagContainer: {
    marginTop: 10,
  },


  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: wp(1)
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
  addButton: {
    backgroundColor: theme.colors.Button2,
    padding: 4,
    borderRadius: 20
  },
  noTags: {
    color: 'gray',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  tagModalContainer: {
    width: '80%', // Adjust to your preference
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: 'black', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row', // Arrange the tags horizontally
    flexWrap: 'wrap', // Allow the tags to wrap to the next line if space is insufficient
    justifyContent: 'flex-start', // Align items to the left
    marginBottom: 10,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 25,
    margin: 5, // Added margin for spacing between buttons
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noTagsText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'gray',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.light,
  },
});
