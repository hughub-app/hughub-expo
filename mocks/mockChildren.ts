import { Child } from "@/lib/api/endpoints/children";

export const mockChildren: Child[] = [
  {
    child_id: 1,
    name: "Alice Johnson",
    date_of_birth: "2018-04-15",
    gender: "F",
    age_range_id: 2,
    height_cm: 120,
    weight_kg: 23,
    notes: "Loves drawing and reading.",
    createdAt: "2025-08-20T10:00:00Z",
    updatedAt: "2025-08-25T14:30:00Z"
  },
  {
    child_id: 2,
    name: "Benjamin Lee",
    date_of_birth: "2016-09-02",
    gender: "M",
    age_range_id: 3,
    height_cm: 135,
    weight_kg: 30,
    notes: "Has a peanut allergy.",
    createdAt: "2025-08-19T11:20:00Z",
    updatedAt: "2025-08-26T09:45:00Z"
  },
  {
    child_id: 3,
    name: "Clara Martinez",
    date_of_birth: "2020-01-22",
    gender: "F",
    age_range_id: 1,
    height_cm: 95,
    weight_kg: 15,
    notes: null,
    createdAt: "2025-08-21T08:10:00Z",
    updatedAt: "2025-08-24T16:00:00Z"
  },
  {
    child_id: 4,
    name: "David Brown",
    date_of_birth: "2019-07-10",
    gender: "M",
    age_range_id: 2,
    height_cm: 110,
    weight_kg: 20,
    notes: "Enjoys soccer practice twice a week.",
    createdAt: "2025-08-22T12:00:00Z",
    updatedAt: "2025-08-27T07:30:00Z"
  },
  {
    child_id: 5,
    name: "Ella Chen",
    date_of_birth: "2017-03-05",
    gender: "F",
    age_range_id: 3,
    height_cm: 128,
    weight_kg: 27,
    notes: "Vegetarian diet.",
    createdAt: "2025-08-18T09:00:00Z",
    updatedAt: "2025-08-26T13:15:00Z"
  }
];