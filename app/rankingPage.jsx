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
import { useTheme } from '../contexts/ThemeContext';

const RankingPage = () => {
  const { user } = useAuth()
  const [feasibility, setFeasibility] = useState(1);
  const [impact, setImpact] = useState(1);
  const [excitement, setExcitement] = useState(1);
  const [scalability, setScalability] = useState(1);
  const [loading, setLoading] = useState(false);
  const { theme: apptheme } = useTheme();
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
      const res = await UpdateIdea(user?.id, updatedIdea, ideaId);

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
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
      <Header ml={wp(3)} />
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: apptheme === 'dark' ? theme.colors.darker : theme.colors.white }]}>

        <View style={[styles.card, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>
          {/* Average Score */}
          <View style={styles.averageContainer}>
            <Text style={[styles.averageLabel, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Score:</Text>
            <Text style={[styles.averageValue, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>{formatValue(average)}</Text>
          </View>

        </View>


        <View style={[styles.labelCard, { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark }]}>

          {/* Feasibility Selector */}
          <View style={styles.selectorContainer}>
            <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Feasibility</Text>
            <View style={styles.selector}>
              <TouchableOpacity onPress={() => updateValue(feasibility, setFeasibility, -1)}>
                <Ionicons name="chevron-back" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light} />
              </TouchableOpacity>
              <Text style={[styles.value, {color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker}]}>{formatValue(feasibility)}</Text>
              <TouchableOpacity onPress={() => updateValue(feasibility, setFeasibility, 1)}>
                <Ionicons name="chevron-forward" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Impact Selector */}
          <View style={styles.selectorContainer}>
            <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Impact</Text>
            <View style={styles.selector}>
              <TouchableOpacity onPress={() => updateValue(impact, setImpact, -1)}>
                <Ionicons name="chevron-back" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light} />
              </TouchableOpacity>
              <Text style={[styles.value, {color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker}]}>{formatValue(impact)}</Text>
              <TouchableOpacity onPress={() => updateValue(impact, setImpact, 1)}>
                <Ionicons name="chevron-forward" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scalability Selector */}
          <View style={styles.selectorContainer}>
            <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Scalability</Text>
            <View style={styles.selector}>
              <TouchableOpacity onPress={() => updateValue(scalability, setScalability, -1)}>
                <Ionicons name="chevron-back" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light}/>
              </TouchableOpacity>
              <Text style={[styles.value, {color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker}]}>{formatValue(scalability)}</Text>
              <TouchableOpacity onPress={() => updateValue(scalability, setScalability, 1)}>
                <Ionicons name="chevron-forward" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light}/>
              </TouchableOpacity>
            </View>
          </View>

          {/* Excitement Selector */}
          <View style={styles.selectorContainer}>
            <Text style={[styles.label, { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light }]}>Excitement</Text>
            <View style={styles.selector}>
              <TouchableOpacity onPress={() => updateValue(excitement, setExcitement, -1)}>
                <Ionicons name="chevron-back" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light} />
              </TouchableOpacity>
              <Text style={[styles.value, {color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker}]}>{formatValue(excitement)}</Text>
              <TouchableOpacity onPress={() => updateValue(excitement, setExcitement, 1)}>
                <Ionicons name="chevron-forward" size={32} color= { apptheme === 'light' ? theme.colors.darker : theme.colors.light}/>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: wp(5),
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold'
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 30,
    marginHorizontal: wp(2),
    fontFamily: 'Satoshi-Bold'
  },
  averageContainer: {
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 22,
    fontFamily: 'Satoshi-Bold'

  },
  averageValue: {
    fontSize: 35,
    fontFamily: 'Satoshi-Bold'
  },
  rankButton: {
    backgroundColor: theme.colors.Button2,
    padding: wp(4),
    alignItems: 'center',
    borderRadius: 12,

    marginBottom: hp(10),
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 17,
  },
  card: {
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(4),
    marginTop: hp(3)
  },

  labelCard: {
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(4),
  }
});

export default RankingPage;
