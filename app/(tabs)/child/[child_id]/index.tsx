// app/child/[child_id].tsx

import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RingChart } from "@/components/charts/RingChart";
import Emoji, { type EmojiType } from "@/components/emoji";
import { useMoodStore } from "@/hooks/useMoodStore";
import PageContainer from "@/components/PageContainer";
import BackButton from "@/components/BackButton";
import { PageHead } from "@/components/PageHead";
import { usePersistChildId } from "@/lib/hooks/usePersistChildId";
import { useChildById } from "@/lib/hooks/useChildById";
import NutritionRings from "@/components/diets/NutritionRings";
import NutritionLabels from "@/components/diets/NutritionLabels";
import { api } from "@/lib/api/client";
import type { components } from "@/generated/api";
import type { Intakes } from "@/types";

type MoodLog = components['schemas']['MoodLog'];

// Map backend mood string -> score 1-5
function moodToScore(mood?: string): number | null {
  if (!mood) return null;
  const m = String(mood).toLowerCase();
  if (m === 'angry') return 1;
  if (m === 'sad') return 2;
  if (m === 'neutral') return 3;
  if (m === 'happy') return 4;
  if (m === 'excited' || m === 'laugh') return 5; // support both labels
  return null;
}

// Monday 00:00:00.000 of the week containing `d`
function startOfISOWeek(d: Date): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0 (Sun) .. 6 (Sat)
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  date.setDate(date.getDate() + diff);
  return date;
}

function endOfISOWeek(d: Date): Date {
  const start = startOfISOWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function formatDateTimeLocal(iso: string): string {
  const dt = new Date(iso);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  const hh = String(dt.getHours()).padStart(2, '0');
  const mm = String(dt.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function formatDateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatRelative(fromIso?: string): string {
  if (!fromIso) return '—';
  const from = new Date(fromIso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - from);
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec} seconds ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minutes ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hours ago`;
  const day = Math.floor(hr / 24);
  return `${day} days ago`;
}

export default function ChildScreen() {
  const params = useLocalSearchParams();
  const childIdParam = Array.isArray(params.child_id) ? params.child_id?.[0] : (params.child_id as string | undefined);
  const router = useRouter();

  // Persist provided id for later reuse across pages
  usePersistChildId(typeof childIdParam === 'string' ? childIdParam : undefined);

  const idNum = typeof childIdParam === 'string' ? Number(childIdParam) : NaN;
  const { child, loading, error } = useChildById(Number.isFinite(idNum) ? idNum : null);
  const todayIntakes = child?.todayIntakes;

  // Debug: verify the exact route param received and normalization
  useEffect(() => {
    console.log('Route child_id raw:', params.child_id, 'normalized:', childIdParam, 'numeric:', idNum);
  }, [params.child_id]);


  // Fetched + computed mood insights
  const [chartData, setChartData] = useState<Array<{ x: number; y: number }>>([
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
  ]);
  const [weeklyAverage, setWeeklyAverage] = useState<number>(0);
  const [latestMood, setLatestMood] = useState<MoodLog | null>(null);
  const [weeklyIntakes, setWeeklyIntakes] = useState<Intakes>({
    vegetable: 0,
    protein: 0,
    fruit: 0,
    grain: 0,
    dairy: 0,
  });

  const weeklyEmoji = useMemo<EmojiType>(() => {
    const v = Number.isFinite(weeklyAverage) ? weeklyAverage : 0;
    if (v <= 0) return 'meh';
    const r = Math.min(5, Math.max(1, Math.round(v)));
    switch (r) {
      case 1: return 'angry';
      case 2: return 'frown';
      case 3: return 'meh';
      case 4: return 'smile';
      case 5: return 'laugh';
      default: return 'meh';
    }
  }, [weeklyAverage]);

  // Load weekly mood logs and latest mood
  useEffect(() => {
    const id = Number.isFinite(idNum) ? idNum : null;
    if (!id) return;

    const load = async () => {
      try {
        const now = new Date();
        const start = startOfISOWeek(now);
        const end = endOfISOWeek(now);
        const startDate = formatDateOnly(start);
        const endDate = formatDateOnly(end);

        console.log('[Mood] Loading weekly range (date-only)', {
          child_id: id,
          start: startDate,
          end: endDate,
        });

        // Also fetch a year range to compute latest (fallback for broken latest API)
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);
        const yearStartStr = formatDateOnly(yearStart);
        const nextYearStartStr = formatDateOnly(nextYearStart);

        const [rangeRes, rangeYearRes] = await Promise.all([
          api.GET('/mood_logs/range/{child_id}', {
            params: { path: { child_id: id }, query: { start: startDate, end: endDate } },
          }),
          api.GET('/mood_logs/range/{child_id}', {
            params: { path: { child_id: id }, query: { start: yearStartStr, end: nextYearStartStr } },
          }),
        ]);

        try {
          console.log('[Mood] Range response', {
            ok: rangeRes.response.ok,
            status: rangeRes.response.status,
            url: rangeRes.response.url,
            count: Array.isArray(rangeRes.data) ? rangeRes.data.length : 'n/a',
          });
          console.log('[Mood] Year range response (for latest)', {
            ok: rangeYearRes.response.ok,
            status: rangeYearRes.response.status,
            url: rangeYearRes.response.url,
            count: Array.isArray(rangeYearRes.data) ? rangeYearRes.data.length : 'n/a',
            range: { start: yearStartStr, end: nextYearStartStr },
          });
        } catch {}

        // Compute day averages Mon(1)..Sun(7)
        const sums: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
        const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
        const logs: MoodLog[] = Array.isArray(rangeRes.data) ? (rangeRes.data as MoodLog[]) : [];
        for (const log of logs) {
          const score = moodToScore(log.mood);
          if (score == null) continue;
          const dt = new Date(log.created_at as string);
          const dow = dt.getDay(); // 0..6
          const dayIdx = dow === 0 ? 7 : dow; // Mon=1..Sun=7
          sums[dayIdx] += score;
          counts[dayIdx] += 1;
        }
        const newChart = Array.from({ length: 7 }, (_, i) => {
          const idx = (i + 1) as 1|2|3|4|5|6|7;
          const avg = counts[idx] > 0 ? sums[idx] / counts[idx] : 0;
          return { x: idx, y: Number(avg.toFixed(2)) };
        });
        setChartData(newChart);

        const daysWithData = Object.values(counts).filter((c) => c > 0).length;
        const weekAvg = daysWithData > 0
          ? newChart.reduce((acc, p, i) => acc + (counts[(i+1) as 1|2|3|4|5|6|7] > 0 ? p.y : 0), 0) / daysWithData
          : 0;
        setWeeklyAverage(Number(weekAvg.toFixed(2)));

        try {
          console.log('[Mood] Computed', {
            sums, counts, chart: newChart, weeklyAverage: Number(weekAvg.toFixed(2)),
          });
        } catch {}

        // Determine latest from year range
        const logsYear: MoodLog[] = Array.isArray(rangeYearRes.data) ? (rangeYearRes.data as MoodLog[]) : [];
        const latest = logsYear
          .slice()
          .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())[0];
        setLatestMood(latest ?? null);
      } catch (e) {
        console.warn('[Mood] Failed to load mood logs', e);
        setChartData([
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 6, y: 0 },
          { x: 7, y: 0 },
        ]);
        setWeeklyAverage(0);
        setLatestMood(null);
      }
    };
    load();
  }, [idNum]);

  // Load weekly meals and compute averages for ring chart
  useEffect(() => {
    const id = Number.isFinite(idNum) ? idNum : null;
    if (!id) return;
    const loadMeals = async () => {
      try {
        const now = new Date();
        const start = startOfISOWeek(now);
        const end = endOfISOWeek(now);
        const startDate = formatDateOnly(start);
        const endDate = formatDateOnly(end);

        console.log('[Meals] Loading weekly range (date-only)', { child_id: id, start: startDate, end: endDate });
        const res = await api.GET('/meals/range/{child_id}', {
          params: { path: { child_id: id }, query: { start: startDate, end: endDate } },
        });
        const meals = (Array.isArray(res.data) ? res.data : []) as components['schemas']['Meal'][];
        console.log('[Meals] Range response', { ok: res.response.ok, status: res.response.status, url: res.response.url, count: meals.length });

        if (meals.length === 0) {
          setWeeklyIntakes({ vegetable: 0, protein: 0, fruit: 0, grain: 0, dairy: 0 });
          return;
        }

        let sumVeg = 0, sumProtein = 0, sumFruit = 0, sumGrain = 0, sumDairy = 0;
        for (const m of meals) {
          sumFruit += (m.servings_fruit as number) ?? 0;
          sumGrain += (m.servings_grain as number) ?? 0;
          sumProtein += (m.servings_meat_fish_eggs_nuts_seeds as number) ?? 0;
          sumDairy += (m.servings_milk_yoghurt_cheese as number) ?? 0;
          sumVeg += (m.servings_veg_legumes_beans as number) ?? 0;
        }
        const n = meals.length;
        const avg: Intakes = {
          vegetable: Number((sumVeg / n).toFixed(2)),
          protein: Number((sumProtein / n).toFixed(2)),
          fruit: Number((sumFruit / n).toFixed(2)),
          grain: Number((sumGrain / n).toFixed(2)),
          dairy: Number((sumDairy / n).toFixed(2)),
        };
        console.log('[Meals] Computed weekly averages', avg);
        setWeeklyIntakes(avg);
      } catch (e) {
        console.warn('[Meals] Failed to load meals', e);
        setWeeklyIntakes({ vegetable: 0, protein: 0, fruit: 0, grain: 0, dairy: 0 });
      }
    };
    loadMeals();
  }, [idNum]);

  const currentEmoji = useMoodStore((s) => s.currentEmoji);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && !child) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!child) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Child not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <PageHead title={`${child?.name}`} description={`${child?.name}`} />
      <ScrollView className="flex-1 px-4">
        <PageContainer>
          <BackButton fallbackUrl="/" />

          {/* Emotional Wellbeing Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-5xl">Emotional Wellbeing</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Monthly Mood Overview LineChart*/}
              <View className="">
                <LineChart
                  data={chartData}
                  title="Weekly Mood Overview"
                  color="#00D4AA"
                  height={280}
                />
              </View>

              {/* Mood Static Card */}
              <View className="flex-row space-x-6 top-6">
                {/* Weekly Average Card */}
                <Card className="flex-1 mr-2">
                  <View className="flex-row items-center p-4">
                    <View className="mr-4">
                      <Emoji type={weeklyEmoji} size={40} />
                    </View>
                    <View className="flex-1">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl">
                          Weekly Average
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <Text className="text-lg text-gray-800">
                          Average Mood: {weeklyAverage.toFixed(1)}/5
                        </Text>
                      </CardContent>
                    </View>
                  </View>
                </Card>
                {/* Lastest Mood */}
                <Card className="flex-1 ml-2">
                  <View className="flex-row items-center p-4">
                    <View className="mr-4">
                      <Emoji type={currentEmoji} size={40} />
                    </View>
                    <View className="flex-1">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl">Latest Mood</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <Text className="text-lg text-gray-800">
                          Mood: {(() => {
                            const s = moodToScore(latestMood?.mood);
                            return s ? `${s}/5` : '—';
                          })()}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          Recorded on: {latestMood?.created_at ? formatDateTimeLocal(latestMood.created_at as string) : '—'}
                        </Text>
                      </CardContent>
                    </View>
                  </View>
                </Card>
              </View>

              {/* Maya's Thought Tab*/}
              <Text className="text-2xl font-semibold text-gray-900 mt-8">
                Maya's Thoughts
              </Text>
              <View className="flex-row item items-center">
                <Badge
                  variant="outline"
                  className="mt-4 ml-2 text-2xl font-semibold text-gray-900"
                >
                  Games 🎮
                </Badge>
                <Badge
                  variant="outline"
                  className="mt-4 ml-2 text-2xl font-semibold text-gray-900"
                >
                  Learning 📚
                </Badge>
                <Badge
                  variant="outline"
                  className="mt-4 ml-2 text-2xl font-semibold text-gray-900 outline-border-2"
                >
                  Friends 👫
                </Badge>
              </View>
              <Text className="text-gray-900 mt-4">
                🗓️Last Update {formatRelative(latestMood?.created_at as string)}
              </Text>

              {/* View Details Button */}
              <Button
                className="mt-4"
                onPress={() => {
                  router.push({
                    pathname: "/GetMood/[child_id]",
                    params: { child_id: String(childIdParam) },
                  });
                }}
              >
                <Text>Update Mood</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Diet & Nutrition Section */}
          <Card className="mb-6">
            <CardHeader>
              <Text className="!text-5xl">Diet & Nutrition</Text>
            </CardHeader>
            <CardContent>
              <Text className="mt-4 ml-2 text-xl font-bold text-gray-800 mb-2">
                Today's Intakes
              </Text>
              <View className="mt-20 order-1 md:order-2">
                <View className="flex-row justify-center items-center gap-4 ">
                  {/* {todayIntakes && ( */}
                    <NutritionRings
                      values={weeklyIntakes}
                      target={{
                        dairy: 6,
                        protein: 5,
                        grain: 5,
                        vegetable: 6,
                        fruit: 3,
                      }}
                    />
                  {/* )} */}
                  <NutritionLabels />
                </View>
              </View>

              <Button
                onPress={() => {
                  router.push({
                    pathname: "/diet/[child_id]",
                    params: { child_id: String(childIdParam) },
                  });
                }}
              >
                <Text>View Diet Details</Text>
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
