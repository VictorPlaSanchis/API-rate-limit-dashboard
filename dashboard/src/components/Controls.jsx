// src/components/Controls.jsx
import { useState } from "react";
import axios from "axios";

export default function Controls({ onFlush }) {
  const [spamCount, setSpamCount] = useState(50);
  const [spamInterval, setSpamInterval] = useState(100); // ms
  const [userId, setUserId] = useState("");
  const [spamming, setSpamming] = useState(false);
  const [progress, setProgress] = useState(0);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
  });

  const handleFlush = async () => {
    await api.post("/admin/flush");
    onFlush();
  };

  const handleSpam = async () => {
    setSpamming(true);
    setProgress(0);

    for (let i = 1; i <= spamCount; i++) {
      try {
        await api.get("/ping", {
          headers: userId ? { "X-User-ID": userId } : {}
        });
      } catch (e) {
        // ignoramos errores de 429 o red
      }
      setProgress(i);
      await new Promise(r => setTimeout(r, spamInterval));
    }

    setSpamming(false);
    alert(`🚀 Spam terminado: ${spamCount} peticiones enviadas`);
  };

  return (
    <div className="controls">
      <button onClick={handleFlush} disabled={spamming}>
        🚮 Flush DB
      </button>

      <div>
        <input
          type="number"
          value={spamCount}
          min={1}
          onChange={e => setSpamCount(Number(e.target.value))}
          disabled={spamming}
          style={{ width: 60 }}
        />
        <span>peticiones</span>
      </div>

      <div>
        <input
          type="number"
          value={spamInterval}
          min={0}
          onChange={e => setSpamInterval(Number(e.target.value))}
          disabled={spamming}
          style={{ width: 60 }}
        />
        <span>ms intervalo</span>
      </div>

      <div>
        <input
          type="text"
          value={userId}
          placeholder="IP o userId (X-User-ID)"
          onChange={e => setUserId(e.target.value)}
          disabled={spamming}
          style={{ width: 150 }}
        />
      </div>

      <button onClick={handleSpam} disabled={spamming}>
        {spamming
          ? `Enviando... (${progress}/${spamCount})`
          : "🚀 Iniciar Spam"}
      </button>
    </div>
  );
}
