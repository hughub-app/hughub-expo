import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from "lucide-react-native";
import { Button } from '@/components/ui/button';
import React from 'react';

// Add prop types for BackButton
interface BackButtonProps {
  onPress?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <Button variant="outline" size="icon" onPress={onPress}>
      <Icon as={ChevronLeft} />
    </Button>
  );
};

export default BackButton;