import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import theme from '../../constants/theme';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import { fetchUserExecutions, fetchUserExecuted, UpdateIdea } from '../../services/ideaService';
import { useFocusEffect, useRouter } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import { useAuth } from '../../contexts/AuthContext';
import Checkbox from 'expo-checkbox'; // Add checkbox import
import Loading from '../../components/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { Animated } from 'react-native';

const Executions = () => {
  const [ideas, setIdeas] = useState([]);
  const [executedIdeas, setExecutedIdeas] = useState([]);
  const [showMoreExecuted, setShowMoreExecuted] = useState(2);
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { theme: apptheme } = useTheme();
  const [longPressModalVisible, setLongPressModalVisible] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchExecutions = async () => {
    setIsLoading(true);
    const userId = user?.id;
    const result = await fetchUserExecutions(userId);
    if (result.success) {
      setIdeas(result.data);
    } else {
      Alert.alert('Error', 'Failed to fetch ideas.');
    }
    setIsLoading(false);
  };

  const fetchExecuted = async () => {
    const userId = user?.id;
    const result = await fetchUserExecuted(userId);
    if (result.success) {
      setExecutedIdeas(result.data);
    } else {
      Alert.alert('Error', 'Failed to fetch executed ideas.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExecutions();
      fetchExecuted();
    }, [])
  );

  const handleCheckboxChange = async (idea, isChecked) => {
    const updatedFields = { state: isChecked ? 'executed' : 'execution' };
    const res = await UpdateIdea(user.id, updatedFields, idea.id);

    if (res.success) {
      await fetchExecutions();
      await fetchExecuted();
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };

  const handleLongPress = (idea) => {
    setSelectedIdea(idea);
    setLongPressModalVisible(true);
  };

  const handleIdeaStateChange = async (newState) => {
    if (!selectedIdea) return;

    const updatedFields = { state: newState };
    const res = await UpdateIdea(user.id, updatedFields, selectedIdea.id);

    if (res.success) {
      await fetchExecutions();
      setLongPressModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };


  return (
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
      <View style={styles.container}>

        <Animated.View
          style={[
            styles.header,
            {
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [0, 150],
                    outputRange: [1, 0.8],
                    extrapolate: 'clamp',
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0.5],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <Header
            title="Executions"
            showBackButton={false}
            showProfileIcon={true}
            mr={wp(4)}
            showSearchIcon={true}
          />
        </Animated.View>

        {isLoading ? (
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
            {/* First Section: Executions */}
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
                <View style={[styles.card, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>
                  <View style={styles.row}>
                    <View style={{width: '90%'}}>
                    <Text style={[styles.cardTitle, { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText }]}>{idea.title}</Text>
                    <Text
                      style={[
                        styles.cardDescription,
                        { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {idea.description}
                    </Text>
                    </View>
                    <Checkbox
                      value={idea.state === 'executed'}
                      onValueChange={(newValue) => handleCheckboxChange(idea, newValue)}
                      color={theme.colors.Button2}
                      style={styles.checkbox}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {ideas.length === 0 && (
              <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>Nothing Here</Text>
              </View>
            )}

            {/* Second Section: Executed */}
            {executedIdeas.length > 0 && (
              <Text style={[styles.sectionTitle, { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText, marginTop: hp(24) }]}>Executed</Text>
            )}

            {executedIdeas.slice(0, showMoreExecuted).map((idea) => (
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
              >
                <View style={[styles.card, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark, }]}>
                  <View style={styles.row}>
                  <View style={{width: '90%'}}>
                    <Text style={[styles.executedCardTitle, { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText }]}>{idea.title}</Text>
                    <Text
                      style={[
                        styles.cardDescription,
                        { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {idea.description}
                    </Text>
                    </View>
                    <Checkbox
                      value={idea.state === 'executed'}
                      onValueChange={(newValue) => handleCheckboxChange(idea, newValue)}
                      color={theme.colors.Button2}
                      style={styles.checkbox}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {executedIdeas.length > showMoreExecuted && (
              <TouchableOpacity onPress={() => setShowMoreExecuted(showMoreExecuted + 2)}>
                <Text style={styles.showMore}>Show More</Text>
              </TouchableOpacity>
            )}

            {/* Add extra padding to the bottom to ensure content isn't hidden behind the navbar */}
            <View style={styles.bottomPadding}></View>
          </ScrollView>
        )}
      </View>
      <Navbar />
      <Modal
        visible={longPressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLongPressModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLongPressModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => { /* Prevent modal from closing when clicking inside */ }}>
              <View style={[styles.modalContent, { backgroundColor: apptheme === 'dark' ? theme.colors.darker : theme.colors.light }]}>
                <Text style={[
                  styles.modalTitle,
                  { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                ]}>Change Idea State</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleIdeaStateChange('idea')}>
                  <Text style={[
                    styles.buttonText,
                    { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                  ]}>Push to Ideas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleIdeaStateChange('onHold')}>
                  <Text style={[
                    styles.buttonText,
                    { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                  ]}>Push to On Hold</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenWrapper>
  );
};

export default Executions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',

  },
  scrollContainer: {
    padding: 16,
    paddingTop: hp(12),
    marginTop: hp(2),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  card: {
    backgroundColor: theme.colors.dark,
    padding: wp(4),
    borderRadius: 15,
    marginBottom: hp(2),
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium'
  },
  executedCardTitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium'
  },
  cardDescription: {
    fontSize: 16,
    paddingTop: 5,
    fontFamily: 'Satoshi-Regular'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: hp(2),
    fontFamily: 'Satoshi-Bold'
  },
  showMore: {
    fontSize: 16,
    color: theme.colors.Button2,
    textAlign: 'center',
    marginVertical: hp(2),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 12,
  },
  bottomPadding: {
    height: hp(15),
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
    marginBottom: hp(2),
    fontFamily: 'Satoshi-Bold'
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
  },
});
