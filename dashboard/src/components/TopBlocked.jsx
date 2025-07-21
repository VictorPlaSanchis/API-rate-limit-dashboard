// src/components/TopBlocked.jsx
export default function TopBlocked({ buckets }) {
  const top5 = Object.entries(buckets)
    .map(([ip, { blocked }]) => ({ ip, blocked }))
    .sort((a, b) => b.blocked - a.blocked)
    .slice(0, 5);

  return (
    <div className="table-card">
      <h2>Top 5 IPs Bloqueadas</h2>
      <table>
        <thead>
          <tr>
            <th>IP / User</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {top5.map(({ ip, blocked }) => (
            <tr key={ip}>
              <td>{ip}</td>
              <td>{blocked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
