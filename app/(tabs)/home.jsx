import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Modal,
  TextInput,
  Button,
  Alert,
  Keyboard,
  Pressable,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import theme from '../../constants/theme';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import { hp, wp } from '../../helpers/common';
import Icon from '../../assets/icons';
import { useAuth } from '../../contexts/AuthContext';
import { CreateIdea, fetchUserIdeas, UpdateIdea } from '../../services/ideaService';
import { router, useFocusEffect, useRouter } from 'expo-router';

const Home = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const { user } = useAuth();
  const [idea, setIdea] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [longPressModalVisible, setLongPressModalVisible] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const route = useRouter();

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
      setIdeas((prevIdeas) => [res.data, ...prevIdeas]);
      setIdea('');
      setDescription('');
      setModalVisible(false);
    }
  };

  const fetchIdeas = async () => {
    const userId = user?.id;
    const result = await fetchUserIdeas(userId);
    if (result.success) {
      setIdeas(result.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIdeas();
    }, [])
  );


  const handleLongPress = (idea) => {
    setSelectedIdea(idea);
    setLongPressModalVisible(true);
  };

  const handleIdeaStateChange = async (newState) => {
    if (!selectedIdea) return;

    const updatedFields = { state: newState }; // The object with the field to update
    const res = await UpdateIdea(user.id, updatedFields, selectedIdea.id);

    if (res.success) {
      await fetchIdeas();

      setLongPressModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };


  // Separate the ideas into ranked and unranked
  const rankedIdeas = ideas.filter((idea) => idea.ranked);
  const unrankedIdeas = ideas.filter((idea) => !idea.ranked);

  return (
    <ScreenWrapper bg={theme.colors.darker}>
      <View style={styles.container}>
        <Header title={'Idea Board'} showBackButton={false} showProfileIcon={true} mr={wp(4)} showSearchIcon={true}/>

        {/* Ranked Section */}
        {rankedIdeas.length > 0 && (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Ranked Ideas</Text>
            {rankedIdeas
              .sort((a, b) => b.score - a.score)  // Sort the ideas based on the score in descending order
              .map((idea, index) => (
                <TouchableOpacity
                  key={idea.id}
                  onPress={() =>
                    router.push({
                      pathname: 'ideaPage',
                      params: {
                        ideaId: idea.id,
                        ideaTitle: idea.title,
                        ideaDescription: idea.description,
                        ideaRanked: idea.ranked,
                        ideaState: idea.state,
                        ideaScore: idea.score,
                      },
                    })
                  }
                  onLongPress={() => handleLongPress(idea)}
                >
                  <Text style={styles.cardRank}>{index + 1}</Text>
                  <View style={styles.rankedCard}>
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardTitle}>{idea.title}</Text>
                      <Text style={styles.cardScore}>{idea.score}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}

        {/* Unranked Section */}
        {unrankedIdeas.length > 0 && (
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Unranked Ideas</Text>
            {unrankedIdeas.map((idea) => (
              <TouchableOpacity
                key={idea.id}
                onPress={() => router.push({ pathname: 'ideaPage', params: { ideaId: idea.id, ideaTitle: idea.title, ideaDescription: idea.description, ideaRanked: idea.ranked, ideaState: idea.state } })}
              >
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{idea.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {
          unrankedIdeas.length === 0 && rankedIdeas.length === 0 && (
            <View style={styles.centeredContainer}>
              <Text style={styles.emptyText}>Nothing Here</Text>
            </View>
          )

        }


        {/* Add Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Icon name="add" color={theme.colors.darker} />

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
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Idea</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Title (required)"
                    placeholderTextColor={theme.colors.light}
                    value={idea}
                    onChangeText={setIdea}
                  />

                  <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Description (optional)"
                    placeholderTextColor={theme.colors.light}
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

        {/* Modal for Long Press Actions */}
        <Modal
          visible={longPressModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setLongPressModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={()=> setLongPressModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Manage Idea</Text>
              <Pressable style={styles.Holdbutton} onPress={() => handleIdeaStateChange('onHold')}>
                <Text style={styles.longpressButtonText}>Push to On Hold</Text>
              </Pressable>
              <Pressable style={styles.Executionbutton} onPress={() => handleIdeaStateChange('execution')}>
                <Text style={styles.longpressButtonText}>Push to Execution</Text>
              </Pressable>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      <Navbar />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    marginBottom: hp(2),
    color: theme.colors.light,
  },
  card: {
    backgroundColor: theme.colors.dark,
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(2),
  },
  rankedCard: {
    backgroundColor: theme.colors.dark,
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(2),
    marginLeft: wp(8),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.secondary,
  },

  cardScore: {
    fontSize: 15,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.secondary,
  },
  cardRank: {
    fontSize: 20,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.secondary,
    position: 'absolute',
    top: wp(3),
    left: wp(1),
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  addButton: {
    position: 'absolute',
    backgroundColor: theme.colors.Button2,
    padding: hp(1.8),
    borderRadius: 10,
    bottom: hp(2),
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
    fontWeight: theme.fontWeights.bold,
    marginBottom: hp(2),
    color: 'white',
  },
  input: {
    backgroundColor: theme.colors.darker,
    padding: 10,
    borderRadius: 8,
    marginBottom: hp(3),
    color: theme.colors.secondary,
  },
  descriptionInput: {
    height: hp(20),
    marginBottom: hp(3),
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Holdbutton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: hp(2)
  },
  Executionbutton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: hp(2)
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
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
    marginBottom: hp(2),
    color: 'white',
  },
  button: {
    backgroundColor: theme.colors.light,
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
  longpressButtonText: {
    color: theme.colors.light,
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
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
    fontWeight: 'bold',
  },
});
