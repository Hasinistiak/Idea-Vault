import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userservice'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const _layout = ()=>{
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
    </GestureHandlerRootView>
  )
}

const MainLayout = () => {
  const {setAuth, setUserData} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event, session) => {
      //console.log('session user: ', session?.user?.id);


      if(session){
        setAuth(session?.user)
        updateUserData(session?.user, session?.user?.email);
        router.replace('/home')

      }else{
        setAuth(null)
        router.replace('/welcome')

      }

    })
  }, [])

  const updateUserData = async (user, email)=>{
    let res = await getUserData(user?.id);
    if(res.success) setUserData({...res.data, email});
  } 

  return (
    <Stack
        screenOptions={{
            headerShown:false,
            animation: 'fade_from_bottom',
        }}
    >
    </Stack>
  )
}

export default _layout