async function runCheck() {
  const identifier = document.getElementById("identifier").value;
  const identifier_type = document.getElementById("identifier_type").value;

  const output = document.getElementById("output");
  output.innerHTML = "Checking...";

  try {
    const res = await fetch(
      `/check?identifier=${encodeURIComponent(identifier)}&identifier_type=${identifier_type}`
    );

    const data = await res.json();
    renderReport(data);
  } catch (err) {
    output.innerHTML = "Failed to run check.";
  }
}

function renderReport(report) {
  const output = document.getElementById("output");

  const indicators = report.indicators
    .map(i => `<li>${i.code}</li>`)
    .join("");

  const notes = report.system_notes
    .map(n => `<li>${n}</li>`)
    .join("");

  output.innerHTML = `
    <div class="report ${report.risk_color}">
      <h2>${report.headline}</h2>

      <p><strong>Identifier:</strong> ${report.identifier}</p>
      <p><strong>Confidence:</strong> ${report.confidence}</p>

      <h3>Indicators</h3>
      <ul>${indicators || "<li>None</li>"}</ul>

      <h3>System Notes</h3>
      <ul>${notes}</ul>

      <small>Generated at: ${report.meta.generated_at}</small>
    </div>
  `;
}
