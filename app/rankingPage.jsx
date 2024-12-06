import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Header from '../components/Header';
import { GetIdeaDetails, UpdateIdea } from '../services/ideaService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';

const RankingPage = () => {
  const {user} = useAuth()
  const [feasibility, setFeasibility] = useState(1);
  const [impact, setImpact] = useState(1);
  const [excitement, setExcitement] = useState(1);
  const [scalability, setScalability] = useState(1);
  const [loading, setLoading] = useState(false);

  const { ideaId } = useLocalSearchParams();
  const router = useRouter();

  const average = Math.round((feasibility + impact + excitement + scalability) / 4);

  const updateValue = (value, setValue, increment) => {
    const newValue = value + increment;
    if (newValue >= 1 && newValue <= 10) setValue(newValue);
  };

  const formatValue = (value) => value.toString().padStart(2, '0');


  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        const ideaDetails = await GetIdeaDetails(ideaId); // Fetch current details based on ideaId
        if (ideaDetails) {
          setFeasibility(ideaDetails.feasibility || 1);
          setImpact(ideaDetails.impact || 1);
          setScalability(ideaDetails.scalability || 1);
          setExcitement(ideaDetails.excitement || 1);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch idea details.');
      }
    };
  
    fetchIdeaDetails();
  }, [ideaId]);

  const handleIdeaUpdate = async () => {
    setLoading(true);
    try {
      const updatedIdea = {
        ranked: true,
        score: average,
        excitement: excitement,
        scalability: scalability,
        feasibility: feasibility,
        impact: impact

       };
      const res = await UpdateIdea(user?.id ,updatedIdea, ideaId);

      if (res.success) {
        router.push('home');
      } else {
        Alert.alert('Error', 'Failed to rank the idea. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.darker}>
      <Header ml={wp(3)} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Average Score */}
        <View style={styles.averageContainer}>
          <Text style={styles.averageLabel}>Score:</Text>
          <Text style={styles.averageValue}>{formatValue(average)}</Text>
        </View>

        {/* Feasibility Selector */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Feasibility</Text>
          <View style={styles.selector}>
            <TouchableOpacity onPress={() => updateValue(feasibility, setFeasibility, -1)}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.value}>{formatValue(feasibility)}</Text>
            <TouchableOpacity onPress={() => updateValue(feasibility, setFeasibility, 1)}>
              <Ionicons name="chevron-forward" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Impact Selector */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Impact</Text>
          <View style={styles.selector}>
            <TouchableOpacity onPress={() => updateValue(impact, setImpact, -1)}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.value}>{formatValue(impact)}</Text>
            <TouchableOpacity onPress={() => updateValue(impact, setImpact, 1)}>
              <Ionicons name="chevron-forward" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scalability Selector */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Scalability</Text>
          <View style={styles.selector}>
            <TouchableOpacity onPress={() => updateValue(scalability, setScalability, -1)}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.value}>{formatValue(scalability)}</Text>
            <TouchableOpacity onPress={() => updateValue(scalability, setScalability, 1)}>
              <Ionicons name="chevron-forward" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Excitement Selector */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>Excitement</Text>
          <View style={styles.selector}>
            <TouchableOpacity onPress={() => updateValue(excitement, setExcitement, -1)}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.value}>{formatValue(excitement)}</Text>
            <TouchableOpacity onPress={() => updateValue(excitement, setExcitement, 1)}>
              <Ionicons name="chevron-forward" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Rank Button */}
        <TouchableOpacity
          style={styles.rankButton}
          onPress={handleIdeaUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.buttonText}>Rank Your Idea</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darker,
    paddingHorizontal: wp(5),
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(3),
  },
  label: {
    fontSize: 20,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.secondary,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginHorizontal: wp(2),
  },
  averageContainer: {
    marginTop: hp(0),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 22,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.secondary,
  },
  averageValue: {
    fontSize: 35,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  rankButton: {
    backgroundColor: theme.colors.Button2,
    padding: wp(4),
    alignItems: 'center',
    borderRadius: 12,
    marginTop: hp(10),
    marginBottom: hp(10),
  },
  buttonText: {
    color: 'black',
    fontWeight: theme.fontWeights.bold,
    fontSize: 17,
  },
});

export default RankingPage;
