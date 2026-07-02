// AI backend client for the Financial Burnout model.
// Backend: https://amd-backend-production-5f23.up.railway.app
import { getState, setState } from "./store";

const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AI_API_BASE) ||
  "https://amd-backend-production-5f23.up.railway.app";

export type PredictionLabel = "Healthy" | "At Risk" | "Burnout";

export interface PredictionResponse {
  prediction: PredictionLabel;
  probabilities: Record<PredictionLabel, number>;
}

export interface SamplePayload {
  profile: string;
  prediction: PredictionResponse;
  session: number[][];
}

function pickProfile(): "healthy" | "risk" | "burnout" {
  const s = getState();
  const spent = Object.values(s.budgets).reduce((a, b) => a + b.spent, 0);
  const ratio = spent / Math.max(1, s.salary);
  if (ratio < 0.45) return "healthy";
  if (ratio < 0.75) return "risk";
  return "burnout";
}

export async function fetchSample(profile?: "healthy" | "risk" | "burnout"): Promise<SamplePayload> {
  const p = profile ?? pickProfile();
  const res = await fetch(`${API_BASE}/sample/${p}`, { method: "GET" });
  if (!res.ok) throw new Error(`AI sample failed: ${res.status}`);
  return res.json();
}

export async function predict(session: number[][]): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });
  if (!res.ok) throw new Error(`AI predict failed: ${res.status}`);
  const data = await res.json();
  return data.prediction ?? data;
}

export function scoreFromProbabilities(p: Record<PredictionLabel, number>): number {
  const score =
    (p.Healthy ?? 0) * 15 +
    (p["At Risk"] ?? 0) * 65 +
    (p.Burnout ?? 0) * 95;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export interface BurnoutAssessment {
  score: number;
  label: PredictionLabel;
  probabilities: Record<PredictionLabel, number>;
  profile: string;
}

export async function refreshBurnoutFromBackend(): Promise<BurnoutAssessment> {
  const sample = await fetchSample();
  // Re-run through /predict so we exercise the real model endpoint.
  let prediction: PredictionResponse;
  try {
    prediction = await predict(sample.session);
  } catch {
    prediction = sample.prediction;
  }
  const score = scoreFromProbabilities(prediction.probabilities);
  setState({ burnoutScore: score });
  return {
    score,
    label: prediction.prediction,
    probabilities: prediction.probabilities,
    profile: sample.profile,
  };
}
