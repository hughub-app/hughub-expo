import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from "lucide-react-native";
import { Button } from '@/components/ui/button';
import React from 'react';
import { goBack, RoutePath } from '@/lib/utils';

// Add prop types for BackButton
interface BackButtonProps {
fallbackUrl: RoutePath;
}

const BackButton: React.FC<BackButtonProps> = ({ fallbackUrl }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onPress={() => goBack(fallbackUrl)}
    >
      <Icon as={ChevronLeft} />
    </Button>
  );
};

export default BackButton;