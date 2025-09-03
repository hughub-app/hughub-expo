import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// removed Select dropdown for gender in favor of RadioGroup
import { getAge } from "@/lib/utils";
import { PortalHost } from "@rn-primitives/portal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function HomeScreen() {
  const [children, setChildren] = useState<Child[]>(mockChildren);

  // dialog state
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // accepts YYYY-MM-DD or timestamp
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [nameError, setNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");
  const [genderError, setGenderError] = useState<string>("");

  const resetForm = () => {
    setName("");
    setDob("");
    setGender("");
    setNameError("");
    setDobError("");
    setGenderError("");
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

  const computeAgeRangeId = (birth: string) => {
    const d = new Date(isNaN(Number(birth)) ? birth : Number(birth));
    const age = getAge(d);
    if (age <= 5) return 1;
    if (age <= 8) return 2;
    return 3;
  };

  const handleAddChild = () => {
    // validate all fields
    const nErr = validateName(name);
    const dErr = validateDob(dob);
    const gErr = validateGender(gender);
    setNameError(nErr);
    setDobError(dErr);
    setGenderError(gErr);
    if (nErr || dErr || gErr) return;
    const nextId = (children.reduce((m, c) => Math.max(m, c.child_id), 0) || 0) + 1;
    const isoDob = isNaN(Number(dob)) ? dob : new Date(Number(dob)).toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();
    const newChild: Child = {
      child_id: nextId,
      name,
      date_of_birth: isoDob,
      gender: gender === "male" ? "M" : "F",
      age_range_id: computeAgeRangeId(isoDob),
      height_cm: 0,
      weight_kg: 0,
      notes: null,
      createdAt: nowIso,
      updatedAt: nowIso,
      todayIntakes: { vegetable: 0, protein: 0, fruit: 0, grain: 0, dairy: 0 },
    };
    setChildren((prev) => [...prev, newChild]);
    resetForm();
  };

  return (
    <SafeAreaView className="flex-1">
      <PageHead
        title="Home"
        description="Welcome to HugHub!"
      />
      <ScrollView>
        <PageContainer>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Health Dashboard
          </Text>
          <Text className="text-gray-600 mb-6">
            Track your progress with beautiful charts and insights
          </Text>

          <View className="gap-4">
            {children.map((child, cIdx) => (
              <Link href={`/child/${child.child_id}`} key={cIdx}>
                <ChildCard child={child} />
              </Link>
            ))}
          </View>

          <Dialog>
            <PortalHost name="dialog"/>

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
                  <Text className="mb-1">Name</Text>
                  <Input
                    value={name}
                    onChangeText={(v) => {
                      setName(v);
                      setNameError(validateName(v));
                    }}
                    placeholder="e.g., Maya Chen"
                    className={nameError ? "border-red-500" : undefined}
                  />
                  {nameError ? (
                    <Text className="text-red-500 text-sm mt-1">{nameError}</Text>
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
                    <Text className="text-red-500 text-sm mt-1">{dobError}</Text>
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
                    <Text className="text-red-500 text-sm mt-1">{genderError}</Text>
                  ) : null}
                </View>
              </View>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button
                    onPress={handleAddChild}
                    disabled={!name || !dob || !gender || !!nameError || !!dobError || !!genderError}
                  >
                    <Text>Confirm</Text>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
