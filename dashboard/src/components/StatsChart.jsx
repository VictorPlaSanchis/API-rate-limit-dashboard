import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Filler,
  CategoryScale,
  Legend
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ChartCard({ title, data, options }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      borderRadius: "var(--card-radius)",
      boxShadow: "var(--card-shadow)",
      padding: 16
    }}>
      <h2 style={{ marginBottom: 12, color: "var(--text)" }}>{title}</h2>
      <div style={{ height: 250 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default function StatsCharts({ history }) {
  // preparar dataset de allowed
  const allowedData = {
    datasets: [{
      label: "Allowed",
      data: history.map(pt => ({ x: pt.t, y: pt.allowed })),
      borderColor: "var(--accent-blue)",
      backgroundColor: "rgba(59,130,246,0.1)",
      pointRadius: 2,
      borderWidth: 2,
      fill: true,
      tension: 0.3
    }]
  };
  // dataset de blocked
  const blockedData = {
    datasets: [{
      label: "Blocked",
      data: history.map(pt => ({ x: pt.t, y: pt.blocked })),
      borderColor: "var(--accent-red)",
      backgroundColor: "rgba(239,68,68,0.1)",
      pointRadius: 2,
      borderWidth: 2,
      fill: true,
      tension: 0.3
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        titleColor: "var(--text)",
        bodyColor: "var(--text)"
      }
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "minute", tooltipFormat: "HH:mm" },
        grid: { color: "#e8e8e8" },
        ticks: { color: "var(--text)" }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e8e8e8" },
        ticks: { color: "var(--text)" }
      }
    }
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 16
    }}>
      <ChartCard title="Allowed Requests" data={allowedData} options={commonOptions} />
      <ChartCard title="Blocked Requests" data={blockedData} options={commonOptions} />
    </div>
  );
}
