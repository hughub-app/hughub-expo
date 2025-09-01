import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SwitchIngredientForm from "./SwitchIngredientForm";
import { Ingredient } from "@/lib/api/endpoints/ingredients";

type SwitchIngredientDialogProps = {
  onSelectIngredient?: (ingredientId: number) => void;
  ingredient: Ingredient;
  children: React.ReactNode;
};

export const SwitchIngredientDialog: React.FC<SwitchIngredientDialogProps> = ({
  onSelectIngredient,
  ingredient,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Find Alternative to {ingredient.ingredient_name}
          </DialogTitle>
          <DialogDescription>
            Choose an ingredient to replace {ingredient.ingredient_name}.
          </DialogDescription>
        </DialogHeader>
        <SwitchIngredientForm
          onSelectIngredient={onSelectIngredient}
          ingredientId={ingredient.ingredient_id}
        />
      </DialogContent>
    </Dialog>
  );
};
