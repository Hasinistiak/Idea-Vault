import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import theme from '../../constants/theme';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import { fetchUserExecutions, fetchUserExecuted, UpdateIdea } from '../../services/ideaService';
import { useFocusEffect, useRouter } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import { useAuth } from '../../contexts/AuthContext';
import Checkbox from 'expo-checkbox'; // Add checkbox import

const Executions = () => {
  const [ideas, setIdeas] = useState([]);
  const [executedIdeas, setExecutedIdeas] = useState([]);
  const [showMoreExecuted, setShowMoreExecuted] = useState(2);
  const { user } = useAuth();
  const router = useRouter();

  const fetchExecutions = async () => {
    const userId = user?.id;
    const result = await fetchUserExecutions(userId);
    if (result.success) {
      setIdeas(result.data);
    } else {
      Alert.alert('Error', 'Failed to fetch ideas.');
    }
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

  return (
    <ScreenWrapper bg={theme.colors.darker}>
      <View style={styles.container}>
        <Header title={'Executions'} showBackButton={false} showProfileIcon={true} mr={wp(4)} showSearchIcon={true} />

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
            >
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>{idea.title}</Text>
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

          {
            executedIdeas.length > 0 &&(
              <Text style={styles.sectionTitle}>Executed</Text>
            )
          }

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
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.executedCardTitle}>{idea.title}</Text>
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
        </ScrollView>
      </View>
      <Navbar />
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
    height: hp(30)
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
    color: theme.colors.light,
    width: '90%'
  },
  executedCardTitle: {
    fontSize: 14,
    fontWeight: theme.fontWeights.medium,
    color: 'gray',
    width: '90%'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.light,
    marginVertical: hp(2),
    marginTop: hp
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
    alignItems: 'center'
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
});
