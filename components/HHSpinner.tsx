import { ActivityIndicator, View, } from 'react-native'
import React from 'react'

type HHSpinnerProps = {
  size?: number | 'small' | 'large';
  color?: string;
};


export default function HHSpinner({ size = 'large', color = '#d97706' }: HHSpinnerProps) {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}