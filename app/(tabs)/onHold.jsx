import { Animated, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import theme from '../../constants/theme'
import Navbar from '../../components/Navbar'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { useFocusEffect, useRouter } from 'expo-router'
import { fetchUserOnHolds, UpdateIdea } from '../../services/ideaService'
import { hp, wp } from '../../helpers/common'
import { ScrollView } from 'react-native-gesture-handler'
import Loading from '../../components/Loading'
import { useTheme } from '../../contexts/ThemeContext'


const onHold = () => {
  const [ideas, setIdeas] = useState([]);
  const { user } = useAuth()
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [longPressModalVisible, setLongPressModalVisible] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { theme: apptheme } = useTheme();

  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchOnHolds = async () => {
    setLoading(true); // Start loading
    try {
      const userId = user?.id;
      const result = await fetchUserOnHolds(userId);
      if (result.success) {
        setIdeas(result.data);
      } else {
        Alert.alert('Error', 'Failed to fetch ideas.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false); // End loading
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
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.light}>
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
            title="On Hold"
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
          <>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }  // Set to false for debugging
              )}
            >
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
                    <Text style={[styles.cardTitle, { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText }]}>{idea.title}</Text>
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
          </>
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
                <TouchableOpacity style={styles.button} onPress={() => handleIdeaStateChange('execution')}>
                  <Text style={[
                    styles.buttonText,
                    { color: apptheme === 'light' ? theme.colors.text : theme.colors.lightText },
                  ]}>Push to Executions</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    paddingTop: hp(12),
    marginTop: hp(2)
  },
  card: {
    padding: wp(5),
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
    fontWeight: theme.fontWeights.medium,
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
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {

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
