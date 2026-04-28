import { ProgressMetric } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: any) {
  if (Number(value) % 1 !== 0) {
    return parseFloat(Number(value).toFixed(2));
  }
  return value;
}

export function deduplicateByDate(data: ProgressMetric[]): ProgressMetric[] {
  const map = new Map<string, ProgressMetric>();
  for (const item of data) {
    const dateKey = new Date(item.date).toISOString().split("T")[0];
    map.set(dateKey, item);
  }
  return Array.from(map.values());
}

export function getTrendingVsStartOfMonth(data: ProgressMetric[]): number {
  if (data.length === 0) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  const trend = ((last.progress - first.progress) / first.progress) * 100;
  return parseFloat(trend.toFixed(2));
}

export function getTrendingVsPrevious(data: ProgressMetric[]): number {
  if (data.length < 2) return 0;
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const trend = ((last.progress - prev.progress) / prev.progress) * 100;
  return parseFloat(trend.toFixed(2));
}
