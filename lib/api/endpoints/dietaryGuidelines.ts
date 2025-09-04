import { makeReadResource } from "../crud";
import type { paths, components } from "@/generated/api";

export type DietaryGuideline = components["schemas"]["DietaryGuideline"];
export type DietaryGuidelineList = DietaryGuideline[];
export type DietaryGuidelinesQuery =
  paths["/recipes/dietary-guidelines"]["get"]["parameters"]["query"];

const ro = makeReadResource<
  DietaryGuideline,
  DietaryGuidelineList,
  DietaryGuidelinesQuery,
  number
>({
  basePath: "/recipes/dietary-guidelines",
});

export const listDietaryGuidelines = ro.list;