function deriveSystemNotes(context = {}) {
  const notes = [];

  if (context.limitedSources) {
    notes.push("Some data sources were temporarily unavailable at the time of this check.");
  }

  if (context.conservativeMode) {
    notes.push("This check was completed using conservative system safeguards.");
  }

  if (context.outdatedSignals) {
    notes.push("Some information sources may be outdated or inconsistent.");
  }

  if (notes.length === 0) {
    notes.push("This result is based on limited system processing at the time of the check.");
  }

  return notes;
}

module.exports = { deriveSystemNotes };
