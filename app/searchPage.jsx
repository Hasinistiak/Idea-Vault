import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ScreenWrapper from '../components/ScreenWrapper';
import theme from '../constants/theme';
import Header from '../components/Header';
import Icon from '../assets/icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const searchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ideas, setIdeas] = useState([]);
  const router = useRouter();
  const { theme: apptheme } = useTheme();


  // Fetch ideas based on search query
  useEffect(() => {
    const fetchIdeas = async () => {
      if (searchQuery === '') return; // Prevent unnecessary fetch if no query

      try {
        const { data, error } = await supabase
          .from('ideas') // Assuming 'posts' is your table with title & description
          .select('*')
          .ilike('title', `%${searchQuery}%`); // 'ilike' for case-insensitive search

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
  }, [searchQuery]); // Trigger when the search query changes

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: apptheme === 'light' ? theme.colors.lightCard : theme.colors.dark },
      ]}
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
      }
    >
      <Text
        style={[
          styles.cardTitle,
          { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light },
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.cardDescription,
          { color: apptheme === 'light' ? theme.colors.darker : theme.colors.light },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.description}
      </Text>
    </TouchableOpacity>
  );
  

  return (
    <ScreenWrapper bg={apptheme === 'dark' ? theme.colors.darker : theme.colors.white}>
      <View style={styles.headerContainer}>
        <Header />
        <View style={[styles.searchBar, {backgroundColor: apptheme === 'dark'? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',}]}>

          <TextInput
            style={[styles.searchInput, { color: apptheme === 'dark' ? theme.colors.light : theme.colors.darker }]}
            placeholder="Search Your Ideas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={apptheme === 'light' ? theme.colors.darker : theme.colors.light}
          />
          <Icon name={'search'} color={apptheme === 'dark' ? theme.colors.light : theme.colors.darker} size={25} />
        </View>
      </View>

      <View style={[styles.container, { backgroundColor: apptheme === 'dark' ? theme.colors.darker : theme.colors.white }]}>
        <FlatList
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchBar: {
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    marginLeft: 45,
    marginRight: 10,
    marginTop: 15
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
fontFamily: 'Satoshi-Regular'
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.dark,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: theme.colors.light,
    fontFamily: 'Satoshi-Medium'
  },
  cardDescription: {
    paddingTop: 5,
    fontSize: 15,
    color: theme.colors.light,
    fontFamily: 'Satoshi-Regular'
  },
});
