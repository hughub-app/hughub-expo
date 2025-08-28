import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { View } from "react-native";
import AddIngredientForm from "./AddIngredientForm";
import { Ingredient } from "@/types";
import { Plus } from "lucide-react-native";

type AddIngredientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddIngredients: (ingredients: Ingredient[]) => void;
  addedIngredientIds?: string[];
};

export const AddIngredientDialog: React.FC<AddIngredientDialogProps> = ({
  open,
  onOpenChange,
  onAddIngredients: onAddIngredient,
  addedIngredientIds = [],
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onPress={() => onOpenChange(true)}>
          <Plus/>
          <Text>Add Ingredient</Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ingredient</DialogTitle>
          <DialogDescription>
            Enter the name of the ingredient you want to add.
          </DialogDescription>
        </DialogHeader>
        <AddIngredientForm
          onAddIngredients={(ingredients) => {
            onAddIngredient(ingredients);
          }}
          addedIngredientIds={addedIngredientIds}
        />
      </DialogContent>
    </Dialog>
  );
};
