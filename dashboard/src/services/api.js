import axios from "axios";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
});

export function fetchStats() {
  return client.get("/stats").then(res => res.data);
}

export function flushDB() {
  return client.post("/admin/flush");
}

export function spamPings(count, intervalMs) {
  return client.post("/admin/spam", { count, intervalMs });
}
