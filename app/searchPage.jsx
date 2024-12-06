import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ScreenWrapper from '../components/ScreenWrapper';
import theme from '../constants/theme';
import Header from '../components/Header';
import Icon from '../assets/icons';
import { useRouter } from 'expo-router';

const searchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ideas, setIdeas] = useState([]);
  const router = useRouter()
  
  // Fetch ideas based on search query
  useEffect(() => {
    const fetchIdeas = async () => {
      if (searchQuery === '') return; // Prevent unnecessary fetch if no query

      try {
        const { data, error } = await supabase
          .from('ideas')  // Assuming 'posts' is your table with title & description
          .select('*')
          .ilike('title', `%${searchQuery}%`);  // 'ilike' for case-insensitive search

        if (error) {
          console.error(error);
        } else {
          setIdeas(data); // Update the state with fetched data
        }
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
  }, [searchQuery]);  // Trigger when the search query changes

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} 
    onPress={() =>
      router.push({
        pathname: 'ideaPage',
        params: {
          ideaId: item.id,
          ideaTitle: item.title,
          ideaDescription: item.description,
          ideaRanked: item.ranked,
          ideaState: item.state,
          ideaScore: item.score,
        },
      })
    }>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper bg={theme.colors.darker}>
      <Header title={'Search'}/>
      
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.searchBar}>
              <Icon name={'search'} color={'white'} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Your Ideas..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={theme.colors.light}
              />
            </View>
          }
          data={ideas}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default searchPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.darker,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.dark,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: theme.colors.light,
    marginLeft: 8,  // Add spacing between icon and input
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.dark,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.light,
  },
});
