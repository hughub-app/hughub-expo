import { ActivityIndicator, View, } from 'react-native'
import React from 'react'

export default function HHSpinner() {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size="large" color="#d97706" />
    </View>
  )
}