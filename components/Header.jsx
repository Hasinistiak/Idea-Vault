import { Pressable, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback, Switch } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import BackButton from './BackButton';
import Icon from '../assets/icons';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ title, showBackButton = true, mb = 10, ml = 10, mr = 0, showDeleteIcon = false, onDeletePress, showProfileIcon = false, showSearchIcon = false, position, zIndex, mt =25, onTitlePress}) => {
  const router = useRouter();

  const { theme: apptheme } = useTheme();

  return (
    <View style={[styles.container, {marginTop: mt} ,{ marginBottom: mb }, { marginLeft: ml }, { marginRight: mr }, {position}, {zIndex}]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}

      <Text style={[styles.title, {color : apptheme === 'light' ? theme.colors.text : theme.colors.lightText}]} onPress={onTitlePress}>{title || ''}</Text>

      {showDeleteIcon && (
        <TouchableOpacity style={styles.deleteIcon} onPress={onDeletePress}>
          <Icon name={'delete'} color={'rgba(255, 0, 0,0.7)'} size={25} />
        </TouchableOpacity>
      )}

      {showProfileIcon && (
        <TouchableOpacity onPress={() => router.push('settings')} style={[styles.profileIcon, {backgroundColor :apptheme === 'light' ? theme.colors.lightCard : theme.colors.Button2}]}>
          {/*<Avatar uri={user?.image} size={hp(3.8)} />*/}
          <Icon name={'user'} size={25} color={theme.colors.dark} />
        </TouchableOpacity>
      )}

      {showSearchIcon && (
        <TouchableOpacity onPress={() => router.push('searchPage')} style={[styles.searchIcon, {backgroundColor :apptheme === 'light' ? theme.colors.lightCard : theme.colors.Button2}]}>
          <Icon name={'search'} size={25} color={theme.colors.dark }  />
        </TouchableOpacity>
      )}

      {/* User Profile Modal */}
      
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,

    right: 0,
    left: 0
  },
  title: {
    fontSize: 25,
    top: 10,
    fontFamily: 'Satoshi-Bold'
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,
    top: 10,
    padding:wp(2),
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 99, 71,0.2)',
  },
  profileIcon: {
    position: 'absolute',
    left: 0,
    top: 10,
    padding: wp(2),
    borderRadius: '50%',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    top: 10,
    padding: wp(2),
    borderRadius: '50%'
  },

});
