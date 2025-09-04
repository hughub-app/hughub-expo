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
import HHSpinner from "./HHSpinner";

type SuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  onConfirm?: () => void;
  loading?: boolean;
  loadingText?: string;
};

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onOpenChange,
  title = "Success!",
  description = "Your action was completed successfully.",
  buttonText = "OK",
  onConfirm,
  loading = false,
  loadingText = "Processing...",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <View className="items-center mb-4">
            {
              loading ? (
                <HHSpinner size={48} />
              ) : (
                <CheckCircle2 size={48} className="text-green-400" />
              )
            }
          </View>
          {
            loading ? (
              <Text className="text-center text-xl mb-4">{loadingText}</Text>
            ) : (
              <>
                <DialogTitle className="text-center">{title}</DialogTitle>
                <DialogDescription className="text-center">
                  {description}
                </DialogDescription>
              </>
            )
          }
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
