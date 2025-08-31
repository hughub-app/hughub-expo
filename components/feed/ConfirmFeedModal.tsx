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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import PageContainer from "../PageContainer";
import { CategoryType, MenuIngredient, Intakes } from "@/types";

interface ConfirmFeedModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  child: Child;
  ingredients: MenuIngredient[];
  childIntake?: Intakes
}

export default function ConfirmFeedModal({
  visible,
  onClose,
  onConfirm,
  child,
  ingredients,
  childIntake,
}: ConfirmFeedModalProps) {
  const intakesPerCategory = Object.values(CategoryType).reduce((acc, category) => {
    acc[category] = childIntake?.[category] ?? 0;
    return acc;
  }, {} as Record<CategoryType, number>);
  const projectionPerCategory = Object.values(CategoryType).reduce((acc, category) => {
    acc[category] =
      (childIntake?.[category] ?? 0) +
      intakesPerCategory[category] +
      ingredients
      .filter((b) => b.category === category)
      .reduce((sum, b) => sum + (b.servingPer100g * (b.amount / 100)), 0);
    return acc;
  }, {} as Record<CategoryType, number>);
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
        <PageContainer>
          <Text className="!text-xl font-bold mb-4">
            {child.name} will have
          </Text>
          <View className="flex-row justify-center gap-8 mb-8">
            <NutritionRings
              values={intakesPerCategory}
              projection={projectionPerCategory}
              target={{
                vegetable: 3,
                protein: 2,
                fruit: 3,
                grain: 1,
                dairy: 2,
              }}
            />
            <NutritionLabels />
          </View>
          {dietSuggestions.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Text className="!text-xl font-bold mb-4">Suggestions</Text>
                </AccordionTrigger>
                <AccordionContent>
                  <View className="gap-2">
                    {dietSuggestions.map((suggestion, index) => (
                      <DietSuggestionCard
                        key={index}
                        dietSuggestion={suggestion}
                      />
                    ))}
                  </View>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          <Button onPress={onConfirm} className="mt-4">
            <Text>Yep! Sounds good!</Text>
          </Button>
        </PageContainer>
      </ScrollView>
    </Modal>
  );
}
