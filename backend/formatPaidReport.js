export default function formatPaidReport(brain) {

  const summary = brain.externalSignalSummary || {}
  const confidence = brain.confidence || {}

  const warnings = summary.warning_mentions_count || 0
  const discussions = summary.discussion_mentions_count || 0
  const hasPresence = summary.has_web_presence || false

  const riskLevel = confidence.riskLevel || "amber"
  const riskScore = confidence.riskScore || 0

  // =========================
  // HUMAN NARRATIVE ENGINE
  // =========================

  let what_we_found = ""
  let what_this_means = ""
  let what_to_do = ""

  // ================= GREEN =================
  if (riskLevel === "green") {

    what_we_found =
      "No clear warning signals were found in publicly available data. There are no strong negative discussions or scam-related mentions linked to this identifier."

    what_this_means =
      "This is generally a positive sign. Most scams leave some kind of trail, and none was detected here. However, absence of data does not guarantee safety."

    what_to_do =
      "Still verify who you are dealing with. Confirm details independently and avoid rushing into payment. If anything feels off, pause."

  }

  // ================= AMBER =================
  if (riskLevel === "amber") {

    what_we_found =
      `${warnings > 0 ? warnings + " potential warning signal(s)" : "Some weak or unclear signals"} were detected, along with ${discussions} public discussion reference(s). These signals are not strong enough to confirm risk, but they should not be ignored.`

    what_this_means =
      "This sits in the uncertainty zone. It could be harmless, but this is also how many scams start — with weak or scattered signals that people overlook."

    what_to_do =
      "Do NOT rush this transaction. Ask more questions. Request proof. Reverse image search profile photos. Try to move the conversation to a verifiable platform. If the other party pushes urgency or avoids verification, treat that as a warning sign."

  }

  // ================= RED =================
  if (riskLevel === "red") {

    what_we_found =
      `${warnings} warning-related mention(s) and ${discussions} discussion reference(s) were found. This pattern is commonly associated with reported scams or repeated complaints.`

    what_this_means =
      "There are clear risk signals linked to this identifier. While this is not a verdict, patterns like this are often seen in scam activity or deceptive behavior."

    what_to_do =
      "Do NOT send money. Stop the transaction immediately. Take time to verify everything independently. If you are being pressured to act fast, that is a major red flag. Walk away until you are completely certain."

  }

  // =========================
  // RETURN STRUCTURE
  // =========================

  return {

    confidence: {
      riskLevel,
      riskScore
    },

    narrative: {
      what_we_found,
      what_this_means,
      what_to_do
    }

  }

}