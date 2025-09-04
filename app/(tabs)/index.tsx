import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { RingChart } from "@/components/charts/RingChart";
// import { LineChart } from "@/components/charts/LineChart";
import { mockChildren } from "@/mocks/mockChildren";
import type { Child } from "@/lib/api/endpoints/children";
import ChildCard from "@/components/ChildCard";
import { Link } from "expo-router";
import PageContainer from "@/components/PageContainer";
import { PageHead } from "@/components/PageHead";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// removed Select dropdown for gender in favor of RadioGroup
import { getAge } from "@/lib/utils";
import { createChild, listChildren } from "@/lib/api/endpoints/children";
import { getToken } from "@/lib/token";
import { Toast } from "toastify-react-native";
import { PortalHost } from "@rn-primitives/portal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useRouter } from "expo-router";
import { getChildIds } from "@/lib/storage/childIds";

export default function HomeScreen() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childrenIds, setChildrenIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchChildrenIds = async () => {
      const ids = await getChildIds();
      console.log(ids);
      setChildrenIds(ids);
    };
    fetchChildrenIds();
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      if (childrenIds.length > 0) {
        try {
          console.log("Fetching children with IDs:", childrenIds);
          const items = await listChildren(
            {
              ids: childrenIds.join(","),
            },
            { throwError: false }
          );
          if (Array.isArray(items) && items.length)
            setChildren(items as Child[]);
        } catch {}
      }
    };
    fetchChildren();
  }, [childrenIds]);

  // dialog state
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // accepts YYYY-MM-DD or timestamp
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [mealsPerDay, setMealsPerDay] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");
  const [genderError, setGenderError] = useState<string>("");
  const [mealsError, setMealsError] = useState<string>("");

  const resetForm = () => {
    setName("");
    setDob("");
    setGender("");
    setNameError("");
    setDobError("");
    setGenderError("");
    setMealsPerDay("");
    setMealsError("");
  };

  const validateName = (value: string) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateDob = (value: string) => {
    if (!value.trim()) return "Date of birth is required";
    const isNumeric = /^\d+$/.test(value.trim());
    let d: Date;
    if (isNumeric) {
      const n = Number(value.trim());
      d = new Date(n);
    } else {
      // accept YYYY-MM-DD
      const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
      if (!isoLike) return "Use YYYY-MM-DD or timestamp";
      d = new Date(value.trim());
    }
    if (isNaN(d.getTime())) return "Invalid date";
    const now = new Date();
    if (d > now) return "Date cannot be in the future";
    return "";
  };

  const validateGender = (value: string) => {
    if (!value) return "Gender is required";
    if (value !== "male" && value !== "female") return "Invalid gender";
    return "";
  };

  const validateMeals = (value: string) => {
    if (!value.trim()) return "Meals per day is required";
    const num = Number(value);
    if (!isFinite(num)) return "Must be a number";
    if (num === 0) return "Cannot be zero";
    if (num < 0) return "Must be positive";
    return "";
  };

  const computeAgeRangeId = (birth: string) => {
    const d = new Date(isNaN(Number(birth)) ? birth : Number(birth));
    const age = getAge(d);
    if (age <= 5) return 1;
    if (age <= 8) return 2;
    return 3;
  };

  const handleAddChild = async () => {
    // validate all fields
    const nErr = validateName(name);
    const dErr = validateDob(dob);
    const gErr = validateGender(gender);
    const mErr = validateMeals(mealsPerDay);
    setNameError(nErr);
    setDobError(dErr);
    setGenderError(gErr);
    setMealsError(mErr);
    if (nErr || dErr || gErr || mErr) return;
    // const nextId = (children.reduce((m, c) => Math.max(m, c.child_id), 0) || 0) + 1;
    const isoDob = isNaN(Number(dob))
      ? dob
      : new Date(Number(dob)).toISOString().slice(0, 10);
    // const nowIso = new Date().toISOString();
    const newChild: Child = {
      // child_id: nextId,
      name,
      date_of_birth: isoDob,
      gender: gender === "male" ? "M" : "F",
      meals_per_day: Number(mealsPerDay),
    };
    try {
      setSubmitting(true);
      const token = await getToken();
      const res = await createChild(newChild, {
        throwError: true,
        auth: { token: token || undefined },
      });
      const created = res?.item ?? newChild; // fallback to local when API returns no body
      setChildrenIds((prev) => [...prev, String(created.child_id)]);
      // setChildren((prev) => [...prev, created]);
      Toast.success("Child added successfully");
      resetForm();
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      Toast.error("Failed to add child. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <PageHead title="Home" description="Welcome to HugHub!" />
      <ScrollView>
        <PageContainer>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Health Dashboard
          </Text>
          <Text className="text-gray-600 mb-6">
            Track your progress with beautiful charts and insights
          </Text>

          {children.length === 0 ? (
            <View className="items-center mt-20">
              <Text className="!text-3xl">
                Welcome to <span className="font-bold">HugHub!</span>
              </Text>
              <Text className="text-gray-500 mb-4 mt-2">Let's add your children and see how HugHub can help you raise a healthier future!</Text>
            </View>
          ) : (
            <View className="gap-4">
              {children.map((child) => (
                <Link
                  key={child.child_id}
                  asChild
                  href={{
                    pathname: "/child/[child_id]",
                    params: { child_id: String(child.child_id) },
                  }}
                >
                  <ChildCard child={child} />
                </Link>
              ))}
            </View>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <PortalHost name="dialog" />

            <DialogTrigger asChild>
              <Button className="w-full mt-6">
                <Text>Add Child</Text>
              </Button>
            </DialogTrigger>
            <DialogContent portalHost="dialog">
              <DialogHeader>
                <DialogTitle>Add a new child</DialogTitle>
                <DialogDescription>
                  Enter name, date of birth, and gender.
                </DialogDescription>
              </DialogHeader>
              <View className="gap-3 mt-2">
                <View>
                  <Text className="mb-1">Nick Name</Text>
                  <Input
                    value={name}
                    onChangeText={(v) => {
                      setName(v);
                      setNameError(validateName(v));
                    }}
                    placeholder="e.g., Maya"
                    className={nameError ? "border-red-500" : undefined}
                  />
                    <Text className="text-slate-300 text-sm mt-1">
                      (for privacy, use a nickname or initials)
                    </Text>
                  {nameError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {nameError}
                    </Text>
                  ) : null}
                </View>
                <View>
                  <Text className="mb-1">Date of Birth</Text>
                  <Input
                    value={dob}
                    onChangeText={(v) => {
                      setDob(v);
                      setDobError(validateDob(v));
                    }}
                    placeholder="YYYY-MM-DD or timestamp"
                    keyboardType="default"
                    className={dobError ? "border-red-500" : undefined}
                  />
                  {dobError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {dobError}
                    </Text>
                  ) : null}
                </View>
                <View>
                  <Text className="mb-1">Meals per day</Text>
                  <Input
                    value={mealsPerDay}
                    onChangeText={(v) => {
                      setMealsPerDay(v);
                      setMealsError(validateMeals(v));
                    }}
                    placeholder="e.g., 3"
                    keyboardType="numeric"
                    className={mealsError ? "border-red-500" : undefined}
                  />
                  {mealsError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {mealsError}
                    </Text>
                  ) : null}
                </View>
                <View>
                  <Text className="mb-1">Gender</Text>
                  <RadioGroup
                    value={gender || undefined}
                    onValueChange={(v) => {
                      const val = (v as "male" | "female") ?? "";
                      setGender(val);
                      setGenderError(validateGender(val));
                    }}
                    className="flex-row gap-6"
                  >
                    <View className="flex-row items-center gap-2">
                      <RadioGroupItem value="male" />
                      <Text>Male</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <RadioGroupItem value="female" />
                      <Text>Female</Text>
                    </View>
                  </RadioGroup>
                  {genderError ? (
                    <Text className="text-red-500 text-sm mt-1">
                      {genderError}
                    </Text>
                  ) : null}
                </View>
              </View>
              <DialogFooter className="mt-4">
                <Button
                  onPress={handleAddChild}
                  disabled={
                    submitting ||
                    !name ||
                    !dob ||
                    !gender ||
                    !mealsPerDay ||
                    !!nameError ||
                    !!dobError ||
                    !!genderError ||
                    !!mealsError
                  }
                >
                  <Text>{submitting ? "Adding..." : "Confirm"}</Text>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
