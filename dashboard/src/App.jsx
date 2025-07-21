// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { fetchStats } from "./services/api";
import Controls from "./components/Controls";
import StatsCharts from "./components/StatsChart";
import TopBlocked from "./components/TopBlocked";
import "./index.css";

export default function App() {
  const [history, setHistory] = useState([]);
  const [buckets, setBuckets] = useState({});
  const lastTotal = useRef(0);
  const lastBlocked = useRef(0);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const initStats = await fetchStats();
      lastTotal.current = initStats.total_requests;
      lastBlocked.current = initStats.blocked_requests;
      setBuckets(initStats.buckets);
    }
    init();

    async function update() {
      const stats = await fetchStats();
      if (!isMounted) return;

      // actualizar tabla TopBlocked siempre
      setBuckets(stats.buckets);

      // calcular deltas
      const dt = stats.total_requests - lastTotal.current;
      const db = stats.blocked_requests - lastBlocked.current;
      lastTotal.current = stats.total_requests;
      lastBlocked.current = stats.blocked_requests;
      if (dt === 0 && db === 0) return;

      const point = { t: new Date(), allowed: dt, blocked: db };
      setHistory(prev => {
        const next = prev.length >= 60 ? prev.slice(1) : prev;
        return [...next, point];
      });
    }

    const id = setInterval(update, 2000);
    return () => { isMounted = false; clearInterval(id); };
  }, []);

  const handleFlush = () => {
    lastTotal.current = 0;
    lastBlocked.current = 0;
    setHistory([]);
    setBuckets({});
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>API Rate Limiter Dashboard</h1>
      <Controls onFlush={handleFlush} />
      <StatsCharts history={history} />
      <TopBlocked buckets={buckets} />
    </div>
  );
}
