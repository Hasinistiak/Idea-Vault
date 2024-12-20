import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({children, bg}) => {


  return (
    <View style={{flex: 1,backgroundColor: bg}}>
        {
            children
        }
    </View>
  )
}

export default ScreenWrapper