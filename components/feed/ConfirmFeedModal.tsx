import { Modal, ScrollView, View } from "react-native";
import React from "react";
import { Text } from "../ui/text";
import ModalHeader from "../ui/ModalHeader";
import Rings from "../charts/Rings";
import NutritionRings from "../diets/NutritionRings";
import { Child } from "@/lib/api/endpoints/children";
import NutritionLabels from "../diets/NutritionLabels";
import { mockDietSuggestions } from "@/mocks/mockDietSuggestions";
import DietSuggestionCard from "./DietSuggestionCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface ConfirmFeedModalProps {
  visible: boolean;
  onClose: () => void;
  child: Child
}

export default function ConfirmFeedModal({
  visible,
  onClose,
  child,
}: ConfirmFeedModalProps) {
  const dietSuggestions = React.useMemo(() => {
    const shuffled = [...mockDietSuggestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ModalHeader title="After this meal..." onClose={onClose} />
      <ScrollView>
        <View className="container mx-auto p-4">
          <Text className="!text-xl font-bold mb-4">{child.name} will have</Text>
          <View className="flex-row justify-center gap-8 mb-8">
            <NutritionRings
              values={{
                veggies: 0,
                protein: 0,
                fruits: 0,
                grains: 0,
                dairy: 0,
              }}
              target={{
                veggies: 0,
                protein: 0,
                fruits: 0,
                grains: 0,
                dairy: 0,
              }}
            />
            <NutritionLabels />
          </View>
          {
            dietSuggestions.length > 0 && (
              <Accordion type='single' collapsible>
                <AccordionItem value='item-1'>
                  <AccordionTrigger>
                  <Text className="!text-xl font-bold mb-4">Suggestions</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <View className="gap-2">
                      {dietSuggestions.map((suggestion, index) => (
                        <DietSuggestionCard key={index} dietSuggestion={suggestion} />
                      ))}
                    </View>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          }
        </View>
      </ScrollView>
    </Modal>
  );
}
