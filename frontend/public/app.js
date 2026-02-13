// ===============================
// JustCheck Frontend Logic
// Screens 1 → 5
// ===============================

async function runCheck() {
  const identifier = document.getElementById("identifier").value;
  const identifier_type = document.getElementById("identifier_type").value;

  const output = document.getElementById("output");
  output.innerHTML = "Checking...";

  try {
    const res = await fetch("/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, identifier_type })
    });

    const data = await res.json();

    if (!data || !data.report) {
      throw new Error("Invalid check response");
    }

    renderReport(data.report, { paid: false });

  } catch (err) {
    console.error(err);
    output.innerHTML = "Failed to run check.";
  }
}

/* ===============================
   PAID FLOW — STEP 1
   Init payment (MOCK)
   =============================== */
async function startPayment() {
  const identifier = document.getElementById("identifier").value;
  const identifier_type = document.getElementById("identifier_type").value;

  const output = document.getElementById("output");
  output.innerHTML = "Starting payment...";

  try {
    const res = await fetch("/pay/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, identifier_type })
    });

    const data = await res.json();

    if (!data || !data.payment || !data.payment.ref) {
      throw new Error("Missing payment reference");
    }

    console.log("MOCK PAYMENT REF:", data.payment.ref);

    // MOCK FLOW: immediately confirm payment
    await confirmPayment(
      data.payment.ref,
      identifier,
      identifier_type
    );

  } catch (err) {
    console.error(err);
    output.innerHTML = "Payment initiation failed.";
  }
}

/* ===============================
   PAID FLOW — STEP 2
   Confirm payment → Screen 5
   =============================== */
async function confirmPayment(ref, identifier, identifier_type) {
  const output = document.getElementById("output");
  output.innerHTML = "Generating full report...";

  try {
    const res = await fetch(
      `/pay/confirm?ref=${encodeURIComponent(ref)}&identifier=${encodeURIComponent(identifier)}&identifier_type=${encodeURIComponent(identifier_type)}`
    );

    const data = await res.json();

    if (!data || !data.report) {
      throw new Error("Paid report missing");
    }

    renderReport(data.report, { paid: true });

  } catch (err) {
    console.error(err);
    output.innerHTML = "Failed to generate paid report.";
  }
}

/* ===============================
   REPORT RENDERING
   =============================== */
function renderReport(report, options = {}) {
  const { paid = false } = options;
  const output = document.getElementById("output");

  const indicatorsHtml =
    (report.indicators || []).length > 0
      ? report.indicators
          .map(i => `<li>${i.description || i.code || i}</li>`)
          .join("")
      : "<li>No indicators detected</li>";

  const systemNotesHtml =
    (report.system_notes || []).length > 0
      ? `<ul>${report.system_notes.map(n => `<li>${n}</li>`).join("")}</ul>`
      : "<p>No additional system notes.</p>";

  output.innerHTML = `
    <div class="report ${report.risk_color}">
      <h2>${report.headline}</h2>

      <p><strong>Identifier:</strong> ${report.identifier || ""}</p>
      <p><strong>Confidence:</strong> ${report.confidence}</p>

      <h3>Indicators</h3>
      <ul>${indicatorsHtml}</ul>

      ${
        paid
          ? `
            <h3>System Notes</h3>
            ${systemNotesHtml}
          `
          : `
            <button onclick="startPayment()">
              Unlock full report
            </button>
          `
      }

      <small>
        Generated at: ${report.meta?.generated_at || ""}
      </small>
    </div>
  `;
}
