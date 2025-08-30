import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from "lucide-react-native";
import { Button } from '@/components/ui/button';
import React from 'react';
import { goBack, RoutePath } from '@/lib/utils';
import { Text } from './ui/text';

// Add prop types for BackButton
interface BackButtonProps {
fallbackUrl: RoutePath;
}

const BackButton: React.FC<BackButtonProps> = ({ fallbackUrl }) => {
  return (
    <Button
      variant='ghost'
      onPress={() => goBack(fallbackUrl)}
      className='w-fit mb-4'
    >
      <Icon as={ChevronLeft} />
      <Text>
        Go Back
      </Text>
    </Button>
  );
};

export default BackButton;