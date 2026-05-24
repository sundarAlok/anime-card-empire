export default function Setup() {
  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial" }}>
      <h1>Setup Page</h1>
      <p>Run the setup script to create Firestore tables (development only):</p>
      <pre style={{ background: "#f0f0f0", padding: "12px", borderRadius: "6px" }}>
        npm run setup:firestore
      </pre>
      <p style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
        This page is informational — run the script from your terminal.
      </p>
    </div>
  );
}
