import { View } from 'react-native'
import React from 'react'

export default function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <View className="flex-1 container mx-auto px-4 py-6">
            {children}
        </View>
    )
}