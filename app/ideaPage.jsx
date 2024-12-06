import React, { useState } from 'react';
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
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import theme from '../constants/theme';
import Header from '../components/Header';
import { hp, wp } from '../helpers/common';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../contexts/AuthContext';
import { RemoveIdea, UpdateIdea } from '../services/ideaService';

const IdeaPage = () => {
  const { ideaId, ideaTitle, ideaDescription, ideaRanked, ideaState, ideaScore } = useLocalSearchParams();
  const { user } = useAuth();
  const [title, setTitle] = useState(ideaTitle);
  const [description, setDescription] = useState(ideaDescription);
  const [isTitleModalVisible, setTitleModalVisible] = useState(false);
  const [isDescriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false)
  const router = useRouter()
  const ranked = ideaRanked == 'true'
  const state = ideaState == 'idea'



  const closeModals = () => {
    setTitleModalVisible(false);
    setDescriptionModalVisible(false);
    setConfirmModalVisible(false)
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
    }
  };

  const handleIdeaRemove = async () => {
    const res = await RemoveIdea(user?.id, ideaId)
    if (res.success) {
      closeModals()
      router.back()
    }

  }

  const handleIdeaStateChange = async (newState) => {

    const updatedFields = { state: newState };
    const res = await UpdateIdea(user.id, updatedFields, ideaId);

    if (res.success) {
      router.back()
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };


  return (
    <ScreenWrapper bg={theme.colors.darker}>
      <Header ml={wp(4)} mr={wp(4)} showDeleteIcon={true} onDeletePress={() => setConfirmModalVisible(true)} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

          {ranked && (
            <TouchableOpacity
              style={styles.scoreCard}
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
              <Text style={styles.scoreText}>Score : {ideaScore}</Text>

            </TouchableOpacity>
          )}


          {/* Title Card */}
          <Text style={styles.label}>Title</Text>
          <Pressable style={styles.titleCard} onPress={() => setTitleModalVisible(true)}>
            <ScrollView>
              <Text style={styles.cardContent}>{title || 'No Title Provided'}</Text>
            </ScrollView>
          </Pressable>

          {/* Description Card */}
          <Text style={styles.label}>Description</Text>
          <Pressable style={styles.descriptionCard} onPress={() => setDescriptionModalVisible(true)}>
            <ScrollView>
              <Text style={styles.cardContent}>{description || ''}</Text>
            </ScrollView>
          </Pressable>

          {
            !ranked && (
              <TouchableOpacity
                style={styles.rankButton}
                onPress={() => router.push({
                  pathname: 'rankingPage',
                  params: {
                    ideaId: ideaId,
                    ideaTitle: ideaTitle,
                    ideaDescription: ideaDescription,
                    ideaRanked: ideaRanked
                  }
                })}
              >
                <Text style={styles.rankButtonText}>Rank Your Idea?</Text>
              </TouchableOpacity>
            )
          }
          {ranked && state && (
            <>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.PushButton} onPress={() => handleIdeaStateChange('onHold')}>
                  <Text style={styles.buttonText}>Push To On Hold</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.PushButtonExecution} onPress={() => handleIdeaStateChange('execution')}>
                  <Text style={styles.buttonText}>Push To Execution</Text>
                </TouchableOpacity>
              </View>
            </>
          )
          }

          {/* Title Edit Modal */}
          <Modal
            transparent={true}
            visible={isTitleModalVisible}
            animationType="slide"
            onRequestClose={closeModals}
          >
            <TouchableWithoutFeedback onPress={closeModals}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Title</Text>
                    <TextInput
                      style={styles.input}
                      value={title}
                      onChangeText={setTitle}
                      placeholder="Enter new title"
                      placeholderTextColor={theme.colors.light}
                    />
                    <TouchableOpacity style={styles.saveButtonRight} onPress={handleIdeaUpdate}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Description Edit Modal */}
          <Modal
            transparent={true}
            visible={isDescriptionModalVisible}
            animationType="slide"
            onRequestClose={closeModals}
          >
            <TouchableWithoutFeedback onPress={closeModals}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Description</Text>
                    <TextInput
                      style={[styles.input, styles.descriptionInput]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Enter new description"
                      placeholderTextColor={theme.colors.light}
                      multiline
                    />
                    <TouchableOpacity style={styles.saveButtonRight} onPress={handleIdeaUpdate}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Remove Idea Modal*/}
          <Modal
            transparent={true}
            visible={isConfirmModalVisible}
            animationType="slide"
            onRequestClose={closeModals}
          >
            <TouchableWithoutFeedback onPress={closeModals}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Are you sure you want to remove this idea?</Text>
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
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default IdeaPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  titleCard: {
    backgroundColor: theme.colors.dark,
    padding: 20,
    borderRadius: 12,
    marginBottom: hp(3),
  },
  descriptionCard: {
    backgroundColor: theme.colors.dark,
    padding: 20,
    height: hp(30),
    borderRadius: 12,
    marginBottom: hp(3),
  },
  label: {
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.light,
    marginBottom: hp(1),
  },
  cardContent: {
    fontSize: 18,
    color: theme.colors.secondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.dark,
    padding: wp(4),
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: 'white',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#131212',
    padding: wp(3),
    borderRadius: 8,
    color: theme.colors.light,
    marginBottom: hp(2),
  },
  descriptionInput: {
    height: hp(20),
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: wp(2),
    width: wp(20),
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: theme.colors.light,
    fontWeight: theme.fontWeights.bold,
    fontSize: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(3),
    marginHorizontal: wp(1)
  },
  removeButton: {
    backgroundColor: 'rgba(255, 99, 71,0.2)',
    padding: wp(2),
    width: wp(20),
    alignItems: 'center',
    borderRadius: 8,
  },
  removeButtonText: {
    color: 'red',
    fontWeight: theme.fontWeights.bold,
    fontSize: 16,
  },
  rankButton: {
    backgroundColor: theme.colors.Button2,
    padding: wp(4),
    alignItems: 'center',
    borderRadius: 12,
  },
  rankButtonText: {
    color: theme.colors.black,
    fontWeight: theme.fontWeights.bold,
    fontSize: 17,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(4),
    marginTop: hp(2),
  },
  PushButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: wp(3),
    paddingVertical: hp(2),
    alignItems: 'center',
    borderRadius: 12,
    width: wp(43),
  },

  PushButtonExecution: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: wp(3),
    paddingVertical: hp(2),
    alignItems: 'center',
    borderRadius: 12,
    width: wp(43),
  },
  scoreCard: {
    backgroundColor: theme.colors.dark,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: hp(3),
  },
  scoreText: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.light,
  },
  saveButtonRight: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: wp(2),
    width: wp(20),
    alignItems: 'center',
    borderRadius: 8,
  },
  
});
