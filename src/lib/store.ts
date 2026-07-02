// Simple in-memory + localStorage store using zustand-like subscribe.
import { useSyncExternalStore } from "react";

export type Category = "food" | "transport" | "shopping" | "bills" | "entertainment" | "subscriptions" | "groceries" | "other";

export interface Transaction {
  id: string;
  merchant: string;
  category: Category;
  amount: number; // negative = spend, positive = income
  date: string; // ISO
  note?: string;
  icon?: string;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  monthly: number;
  color: string;
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "danger";
  time: string;
}

export type AssistantPermKey =
  | "viewGoals"
  | "addSaving"
  | "editSavingPlan"
  | "createGoal"
  | "viewReports"
  | "receiveAlerts"
  | "editBudget";

export type AssistantPerms = Record<AssistantPermKey, boolean>;

export interface TrustedAssistant {
  name: string;
  phone: string;
  permissions: AssistantPerms;
  status: "connected" | "pending";
}

export interface IncomingInvite {
  fromName: string;
  fromPhone: string;
  permissions: AssistantPerms;
}

export interface AppState {
  onboarded: boolean;
  authed: boolean;
  bankConnected: boolean;
  recoveryMode: boolean;
  darkMode: boolean;
  fontScale: number;
  highContrast: boolean;
  user: { name: string; phone: string; avatar?: string };
  salary: number;
  fixed: number;
  loans: number;
  savingsGoal: number;
  savedThisMonth: number;
  daysUntilPayday: number;
  burnoutScore: number;
  todaySpend: number;
  budgets: Record<Category, { spent: number; limit: number }>;
  transactions: Transaction[];
  goals: Goal[];
  alerts: Alert[];
  achievements: { id: string; title: string; earned: boolean; emoji: string }[];
  trustedAssistant: TrustedAssistant | null;
  incomingInvite: IncomingInvite | null;
}

export const DEFAULT_ASSISTANT_PERMS: AssistantPerms = {
  viewGoals: true,
  addSaving: true,
  editSavingPlan: false,
  createGoal: false,
  viewReports: true,
  receiveAlerts: true,
  editBudget: false,
};

export const ASSISTANT_PERM_LABELS: Record<AssistantPermKey, string> = {
  viewGoals: "عرض أهداف التوفير",
  addSaving: "إضافة مبلغ للتوفير",
  editSavingPlan: "تعديل خطة التوفير",
  createGoal: "إنشاء هدف جديد",
  viewReports: "عرض التقارير",
  receiveAlerts: "استقبال التنبيهات",
  editBudget: "تعديل الميزانية",
};

export const RESTRICTED_ASSISTANT_ACTIONS: string[] = [
  "تغيير كلمة المرور",
  "تغيير رقم الجوال",
  "حذف الحساب",
  "ربط أو حذف الحساب البنكي",
];


const CAT_LABELS: Record<Category, string> = {
  food: "مطاعم",
  transport: "مواصلات",
  shopping: "تسوّق",
  bills: "فواتير",
  entertainment: "ترفيه",
  subscriptions: "اشتراكات",
  groceries: "بقالة",
  other: "أخرى",
};
export const categoryLabel = (c: Category) => CAT_LABELS[c];

const CAT_ICONS: Record<Category, string> = {
  food: "🍔", transport: "⛽", shopping: "🛍️", bills: "🧾",
  entertainment: "🎬", subscriptions: "🎧", groceries: "🛒", other: "•",
};
export const categoryIcon = (c: Category) => CAT_ICONS[c];


const initial: AppState = {
  onboarded: false,
  authed: false,
  bankConnected: false,
  recoveryMode: false,
  darkMode: false,
  fontScale: 1,
  colorblind: false,
  user: { name: "محمد", phone: "+966 5• ••• ••••" },
  salary: 12000,
  fixed: 4200,
  loans: 800,
  savingsGoal: 3000,
  savedThisMonth: 1200,
  daysUntilPayday: 18,
  burnoutScore: 32,
  todaySpend: 240,
  budgets: {
    food: { spent: 780, limit: 1200 },
    transport: { spent: 320, limit: 600 },
    shopping: { spent: 640, limit: 800 },
    bills: { spent: 420, limit: 500 },
    entertainment: { spent: 520, limit: 600 },
    subscriptions: { spent: 180, limit: 200 },
    groceries: { spent: 890, limit: 1500 },
    other: { spent: 120, limit: 400 },
  },
  transactions: [
    { id: "t1", merchant: "مطعم البيك", category: "food", amount: -45, date: "2026-07-01T14:20:00.000Z", icon: "🍔" },
    { id: "t2", merchant: "محطة بنزين", category: "transport", amount: -80, date: "2026-07-01T11:05:00.000Z", icon: "⛽" },
    { id: "t3", merchant: "سوبر ماركت الدانوب", category: "groceries", amount: -120, date: "2026-07-01T09:12:00.000Z", icon: "🛒" },
    { id: "t4", merchant: "اشتراك Netflix", category: "subscriptions", amount: -55, date: "2026-06-30T22:00:00.000Z", icon: "🎬" },
    { id: "t5", merchant: "أمازون", category: "shopping", amount: -320, date: "2026-06-29T19:45:00.000Z", icon: "🛍️" },
    { id: "t6", merchant: "ستاربكس", category: "food", amount: -28, date: "2026-06-28T08:15:00.000Z", icon: "☕" },
    { id: "t7", merchant: "راتب شهري", category: "other", amount: 12000, date: "2026-06-20T00:00:00.000Z", icon: "💰" },
  ],
  goals: [],
  alerts: [
    { id: "a1", title: "ارتفاع غير معتاد في الإنفاق", body: "لاحظنا زيادة 55% عن معدل هذا الأسبوع.", severity: "warning", time: "قبل 2 ساعة" },
    { id: "a2", title: "ميزانية الترفيه شارفت على الانتهاء", body: "استهلكت 80% من ميزانية الترفيه ومازال أمامك 6 أيام.", severity: "warning", time: "اليوم" },
    { id: "a3", title: "قد يتأخر هدف السيارة", body: "بمعدل الإنفاق الحالي سيتأخر هدفك شهرين إضافيين.", severity: "danger", time: "أمس" },
    { id: "a4", title: "أحسنت! ادّخرت أكثر من المتوقع", body: "وفّرت 420 ريال إضافية هذا الأسبوع.", severity: "info", time: "أمس" },
  ],
  achievements: [
    { id: "ac1", title: "أول أسبوع بدون تجاوز", emoji: "🏅", earned: true },
    { id: "ac2", title: "ادّخرت 1000 ريال", emoji: "💎", earned: true },
    { id: "ac3", title: "شهر كامل ضمن الميزانية", emoji: "🏆", earned: false },
    { id: "ac4", title: "قلّلت المطاعم 20%", emoji: "🥗", earned: false },
  ],
  trustedAssistant: null,
  incomingInvite: {
    fromName: "والدك — عبدالله",
    fromPhone: "+966 5• ••• ••23",
    permissions: {
      viewGoals: true,
      addSaving: true,
      editSavingPlan: false,
      createGoal: false,
      viewReports: true,
      receiveAlerts: true,
      editBudget: false,
    },
  },

};

let state: AppState = load();
const listeners = new Set<() => void>();

function load(): AppState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem("manee_state_v2");
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {}
  return initial;
}
function save() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem("manee_state_v2", JSON.stringify(state)); } catch {}
}

export function getState() { return state; }
export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  save();
  listeners.forEach((l) => l());
}
export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => selector(state),
    () => selector(initial),
  );
}

export function resetAll() {
  localStorage.removeItem("manee_state_v2");
  state = initial;
  listeners.forEach((l) => l());
}

// Simulate a purchase impact
export function simulatePurchase(amount: number) {
  const s = state;
  const remaining = Math.max(0, s.salary - (s.fixed + s.loans) - sumSpend() - amount);
  const burnoutDelta = Math.min(40, Math.round((amount / s.salary) * 100));
  const newBurnout = Math.min(100, s.burnoutScore + burnoutDelta);
  const monthlyGoal = s.goals[0]?.monthly || 500;
  const delayMonths = Math.max(0, Math.round(amount / monthlyGoal));
  return { remaining, newBurnout, delayMonths, burnoutDelta };
}
function sumSpend() {
  return state.transactions.filter((t) => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0);
}
