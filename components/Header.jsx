import { Pressable, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import theme from '../constants/theme';
import { hp, wp } from '../helpers/common';
import BackButton from './BackButton';
import Icon from '../assets/icons';
import Avatar from './Avatar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Header = ({ title, showBackButton = true, mb = 10, ml = 10, mr = 0, showDeleteIcon = false, onDeletePress, showProfileIcon = false, showSearchIcon=false }) => {
  const router = useRouter();
  const { user, logout } = useAuth(); 
  const [modalVisible, setModalVisible] = useState(false); 

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign Out', 'Error Signing Out');
    }
  };

  return (
    <View style={[styles.container, { marginBottom: mb }, { marginLeft: ml }, { marginRight: mr }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}

      <Text style={styles.title}>{title || ''}</Text>

      {showDeleteIcon && (
        <TouchableOpacity style={styles.deleteIcon} onPress={onDeletePress}>
          <Icon name={'delete'} color={'rgba(255, 0, 0,0.8)'} size={28} />
        </TouchableOpacity>
      )}

      {showProfileIcon && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileIcon}>
            {/*<Avatar uri={user?.image} size={hp(3.8)} />*/}
            <Icon name={'user'} size={28} color={theme.colors.light}/>
          </TouchableOpacity>
      )}

{showSearchIcon && (
          <TouchableOpacity onPress={()=>router.push('searchPage')} style={styles.searchIcon}>
            <Icon name={'search'} size={28} color={theme.colors.light}/>
          </TouchableOpacity>
      )}

      {/* User Profile Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Profile</Text>

                {/*<Avatar uri={user?.image} size={hp(8)} />*/}
                <Icon name={'user'} size={80} color={theme.colors.light}/>

                <Text style={styles.modalText}>{user?.name || 'N/A'}</Text>
                <Text style={styles.modalText}>{user?.email || 'N/A'}</Text>

                {/* Logout Button */}
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    handleLogout(); 
                    setModalVisible(false); 
                  }}
                >
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* Close Modal Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  },
  title: {
    fontSize: 25,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.light,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 99, 71,0.2)',
  },
  profileIcon: {
    position: 'absolute',
    left: 0,
    padding: wp(1.5),
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    padding: wp(1.5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(80),
    backgroundColor: theme.colors.dark,
    borderRadius: 12,
    padding: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.light,
    marginBottom: hp(2),
  },
  modalText: {
    fontSize: hp(2.2),
    color: theme.colors.light,
    marginVertical: hp(0.5),
  },
  logoutButton: {
    backgroundColor: theme.colors.danger,
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: 10,
    marginTop: hp(2),
  },
  logoutText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
  },
  closeButton: {
    marginTop: hp(2),
  },
  closeButtonText: {
    color: 'gray',
    fontSize: hp(2),
  },
});
