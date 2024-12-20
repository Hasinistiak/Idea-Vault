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
import Loading from '../../components/Loading';
import { useTheme } from '../../contexts/ThemeContext';

const Home = () => {
  const { user } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [longPressModalVisible, setLongPressModalVisible] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const { theme: apptheme } = useTheme();

  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const userId = user?.id;
      const result = await fetchUserIdeas(userId);
      if (result.success) {
        setIdeas(result.data);
      }
    } catch (error) {
      Alert.alert("Error fetching ideas:", error);
    } finally {
      setLoading(false);
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

    const updatedFields = { state: newState };
    const res = await UpdateIdea(user.id, updatedFields, selectedIdea.id);

    if (res.success) {
      await fetchIdeas();
      setLongPressModalVisible(false);
    } else {
      Alert.alert('Error', 'Failed to update idea state.');
    }
  };

  const rankedIdeas = ideas.filter((idea) => idea.ranked);
  const unrankedIdeas = ideas.filter((idea) => !idea.ranked);

  return (
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.light}>
      <View style={styles.container}>
        {/* Header with Scroll Animation */}
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
            title="Idea Board"
            showBackButton={false}
            showProfileIcon={true}
            mr={wp(4)}
            showSearchIcon={true}
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
              { useNativeDriver: false }  // Set to false for debugging
            )}
          >
            {/* Ranked Ideas Section */}
            {rankedIdeas.length > 0 && (
              <View style={{ marginBottom: hp(17), marginTop: hp(2) }}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText,
                      marginTop: hp(10)
                     },
                  ]}
                >
                  Ranked Ideas
                </Text>
                {rankedIdeas
                  .sort((a, b) => b.score - a.score)
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
                      <Text
                        style={[
                          styles.cardRank,
                          { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                        ]}
                      >
                        {index + 1}
                      </Text>
                      <View
                        style={[
                          styles.rankedCard,
                          { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark },
                        ]}
                      >
                        <View style={styles.cardDetails}>
                          <Text
                            style={[
                              styles.cardTitle,
                              { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                            ]}
                          >
                            {idea.title}
                          </Text>
                          <Text
                            style={[
                              styles.cardScore,
                              { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                            ]}
                          >
                            {idea.score}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            )}

            {/* Unranked Ideas Section */}
            {unrankedIdeas.length > 0 && (
              <View style={{ marginBottom: hp(15), marginTop: hp(7) }}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                  ]}
                >
                  Unranked Ideas
                </Text>
                {unrankedIdeas.map((idea) => (
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
                        },
                      })
                    }
                  >
                    <View
                      style={[
                        styles.card,
                        { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cardTitle,
                          { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                        ]}
                      >
                        {idea.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Empty State */}
            {unrankedIdeas.length === 0 && rankedIdeas.length === 0 && (
              <View style={styles.centeredContainer}>
                <Text style={styles.emptyText}>Nothing Here</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Modal for Long Press Actions */}
        <Modal
          visible={longPressModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setLongPressModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setLongPressModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: apptheme === 'dark' ? theme.colors.darker : theme.colors.light },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                  ]}
                >
                  Manage Idea
                </Text>
                <Pressable style={styles.Holdbutton} onPress={() => handleIdeaStateChange('onHold')}>
                  <Text style={styles.longpressButtonText}>Push to On Hold</Text>
                </Pressable>
                <Pressable
                  style={[styles.Executionbutton, { backgroundColor: theme.colors.Button2 }]}
                  onPress={() => handleIdeaStateChange('execution')}
                >
                  <Text style={styles.longpressButtonText}>Push to Execution</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      <Navbar fetchIdeas={fetchIdeas} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
    padding: wp(4),
    borderRadius: 15,
    marginBottom: hp(2),
  },
  rankedCard: {
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(2),
    marginLeft: wp(8),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.secondary,
  },
  cardScore: {
    fontSize: 16,
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
    justifyContent: 'space-between',
  },
  Holdbutton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: hp(2),
  },
  Executionbutton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: hp(2),
  },
  longpressButtonText: {
    color: theme.colors.darker,
    fontSize: 16,
    fontWeight: theme.fontWeights.bold,
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

  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(30),
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
});
