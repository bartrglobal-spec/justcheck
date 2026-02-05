import { useState } from "react";

function App() {
  const [identifier, setIdentifier] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "https://justcheck-2-euii.onrender.com/checks?identifier=" +
          encodeURIComponent(identifier) +
          "&identifier_type=phone"
      );

      if (!response.ok) {
        throw new Error("Backend returned an error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>JustCheck</h1>
      <p>Check an identifier before you send money.</p>

      <input
        type="text"
        placeholder="0647470911"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={handleCheck}
        disabled={loading || !identifier}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Checking..." : "Check"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>
          Error: {error}
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
          }}
        >
          <p>
            <strong>Identifier:</strong> {result.identifier}
          </p>
          <p>
            <strong>Type:</strong> {result.identifier_type}
          </p>
          <p>
            <strong>Total Checks:</strong> {result.total_checks}
          </p>
          <p>
            <strong>First Seen:</strong> {result.first_seen}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            <span
              style={{
                color:
                  result.confidence === "green"
                    ? "green"
                    : result.confidence === "amber"
                    ? "orange"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {result.confidence.toUpperCase()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
