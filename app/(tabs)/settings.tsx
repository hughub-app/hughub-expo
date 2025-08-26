import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Bell, Shield, Smartphone, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const settingsOptions = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your account settings',
      action: () => console.log('Profile pressed')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure your notification preferences',
      action: () => console.log('Notifications pressed')
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Control your data and privacy settings',
      action: () => console.log('Privacy pressed')
    },
    {
      icon: Smartphone,
      title: 'Connected Devices',
      description: 'Manage connected fitness devices',
      action: () => console.log('Devices pressed')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => console.log('Help pressed')
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        <View className="pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Settings
          </Text>
          <Text className="text-gray-600 mb-6">
            Customize your app experience
          </Text>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <View className="flex-row items-center">
                <View className="bg-blue-100 rounded-full p-4 mr-4">
                  <User size={32} color="#007AFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-semibold text-gray-800">
                    John Doe
                  </Text>
                  <Text className="text-gray-600">john.doe@example.com</Text>
                  <Text className="text-sm text-blue-600 mt-1">
                    Premium Member
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Settings Options */}
          <View className="space-y-3">
            {settingsOptions.map((option, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full p-4 justify-start"
                    onPress={option.action}
                  >
                    <View className="flex-row items-center w-full">
                      <View className="bg-gray-100 rounded-full p-2 mr-3">
                        <option.icon size={20} color="#666" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-gray-800">
                          {option.title}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {option.description}
                        </Text>
                      </View>
                    </View>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Logout */}
          <View className="mt-8">
            <Button
              variant="destructive"
              className="w-full"
              onPress={() => console.log('Logout pressed')}
            >
              <View className="flex-row items-center">
                <LogOut size={18} color="white" className="mr-2" />
                <Text className="text-white font-medium">Sign Out</Text>
              </View>
            </Button>
          </View>

          {/* App Version */}
          <View className="mt-6 items-center">
            <Text className="text-sm text-gray-500">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}