import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import theme from '../../constants/theme'
import Navbar from '../../components/Navbar'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { useFocusEffect, useRouter } from 'expo-router'
import { fetchUserOnHolds, UpdateIdea } from '../../services/ideaService'
import { hp, wp } from '../../helpers/common'
import { ScrollView } from 'react-native-gesture-handler'

const onHold = () => {
  const [ideas, setIdeas] = useState([]);
  const { user } = useAuth()
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [longPressModalVisible, setLongPressModalVisible] = useState(false);
  const router = useRouter();

  const fetchOnHolds = async () => {
    const userId = user?.id;
    const result = await fetchUserOnHolds(userId);
    if (result.success) {
      setIdeas(result.data);
    } else {
      Alert.alert('Error', 'Failed to fetch ideas.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOnHolds();
    }, [])
  );

  const handleLongPress = (idea) => {
    setSelectedIdea(idea);
    setLongPressModalVisible(true);
  };

  const handleIdeaStateChange = async (newState) => {
    if (!selectedIdea) return;

    const updatedFields = { state: newState };
    const res = await UpdateIdea(user.id, updatedFields, selectedIdea.id);

    if (res.success) {
      await fetchOnHolds();
      setLongPressModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };
  return (
    <ScreenWrapper bg={theme.colors.darker}>
      <View style={styles.container}>
        <Header title={'on Hold'} showBackButton={false} showProfileIcon={true} mr={wp(4)} showSearchIcon={true}/>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {ideas.map((idea) => (
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
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{idea.title}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {
            ideas.length === 0 && (
              <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>Nothing Here</Text>
              </View>
            )
          }


        </ScrollView>
      </View>
      <Navbar />

      <Modal
        visible={longPressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLongPressModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Idea State</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleIdeaStateChange('idea')}>
              <Text style={styles.buttonText}>Push to Ideas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleIdeaStateChange('execution')}>
              <Text style={styles.buttonText}>Push to Executions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setLongPressModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default onHold;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.dark,
    padding: wp(5),
    borderRadius: 12,
    marginBottom: hp(2),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
    marginBottom: hp(1),
    color: theme.colors.light,
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
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
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
