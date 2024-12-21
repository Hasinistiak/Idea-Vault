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

const IdeaPage = () => {
  const { ideaId, ideaTitle, ideaDescription, ideaRanked, ideaState, ideaScore } = useLocalSearchParams();
  const { user } = useAuth();
  const [title, setTitle] = useState(ideaTitle);
  const [description, setDescription] = useState(ideaDescription);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const ranked = ideaRanked === 'true';
  const state = ideaState === 'idea';
  const { theme: apptheme } = useTheme();
  const [titleHeight, setTitleHeight] = useState(40);
  const [descriptionHeight, setDescriptionHeight] = useState(40);
  const [showPushButtons, setShowPushButtons] = useState(false);


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

  return (
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
      <Header ml={wp(4)} mr={wp(4)} position={'absolute'} zIndex={100000} showDeleteIcon={true}onDeletePress={() => setConfirmModalVisible(true)} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {ranked && (
          <TouchableOpacity
            style={[styles.scoreCard, { backgroundColor: apptheme === 'light' ? 'rgba(125, 139, 174, 0.5)' : theme.colors.Button2 }]}
            onPress={() =>
              router.push({
                pathname: 'rankingPage',
                params: {
                  ideaId: ideaId,
                  ideaTitle: ideaTitle,
                  ideaDescription: ideaDescription,
                  ideaRanked: ideaRanked,
                },
              })
            }
          >
            <Text style={[styles.scoreText, { color: theme.colors.darker }]}>Score : {ideaScore}</Text>
          </TouchableOpacity>
        )}


        {/* Title Card */}
        <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light, marginTop: ranked ? 'none' : hp(10) }]}>Title</Text>
        <Pressable
          style={[styles.titleCard, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}
        >
          <TextInput
            style={[styles.cardContent, { height: titleHeight }, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter new title"
            placeholderTextColor={theme.colors.light}
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
            placeholderTextColor={theme.colors.light}
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

        {!ranked && (
          <TouchableOpacity
            style={styles.rankButton}
            onPress={() =>
              router.push({
                pathname: 'rankingPage',
                params: {
                  ideaId: ideaId,
                  ideaTitle: ideaTitle,
                  ideaDescription: ideaDescription,
                  ideaRanked: ideaRanked,
                },
              })
            }
          >
            <Text style={[styles.rankButtonText, { color: theme.colors.darker }]}>Rank Your Idea?</Text>
          </TouchableOpacity>
        )}

        {ranked && state && (<>
          <View style={styles.arrowAndButtonsContainer}>
            <TouchableOpacity
              style={[styles.arrowleft, { backgroundColor: apptheme === 'light' ? 'rgba(125, 139, 174, 0.5)' : theme.colors.Button2 }]}
              onPress={() => setShowPushButtons((prev) => !prev)} // Toggle visibility
            >
              <Icon name={showPushButtons ? 'arrowRight' : 'arrowLeft'} size={35} />

            </TouchableOpacity>

            {showPushButtons && ranked && state && (
              <>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.PushButton,
                      { backgroundColor: apptheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' },
                    ]}
                    onPress={() => handleIdeaStateChange('onHold')}
                  >
                    <Text style={[styles.buttonText, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}>
                      Push To On Hold
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.PushButtonExecution, { backgroundColor: apptheme === 'light' ? 'rgba(125, 139, 174, 0.5)' : theme.colors.Button2 }]}
                    onPress={() => handleIdeaStateChange('execution')}
                  >
                    <Text style={[styles.buttonText, { color: theme.colors.darker }]}>Push To Execution</Text>
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
                      <Text style={styles.buttonText}>Cancel</Text>
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
  rankButton: {
    backgroundColor: theme.colors.Button2,
    padding: wp(4),
    alignItems: 'center',
    borderRadius: 12,
  },
  rankButtonText: {
    fontSize: 17,
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
  scoreCard: {
    marginHorizontal: wp(30),
    padding: wp(2),
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: hp(5),
  },
  scoreText: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
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
    width: '100%',
  },
  button: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: 8,
    backgroundColor: 'silver',
  },
  removeButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
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
});
