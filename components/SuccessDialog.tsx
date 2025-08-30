import React from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  onConfirm?: () => void;
};

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onOpenChange,
  title = "Success!",
  description = "Your action was completed successfully.",
  buttonText = "OK",
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <View className="items-center mb-4">
            <CheckCircle2 size={48} className="text-green-400" />
          </View>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Button
          className="mt-6"
          onPress={() => {
            onOpenChange(false);
            onConfirm?.();
          }}
        >
          <Text>{buttonText}</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
