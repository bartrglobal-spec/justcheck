/**
 * Confidence Gradient Engine
 *
 * This is a PURE function.
 * - No database access
 * - No side effects
 * - Deterministic output
 *
 * It returns a confidence gradient,
 * not a verdict or accusation.
 */

function deriveConfidence({ count, firstSeen }) {
  let score = 100;

  // More repeated checks reduce confidence
  if (count >= 5) score -= 40;
  else if (count >= 3) score -= 25;
  else if (count >= 2) score -= 10;

  // Older presence increases confidence
  if (firstSeen) {
    const ageDays =
      (Date.now() - new Date(firstSeen).getTime()) /
      (1000 * 60 * 60 * 24);

    if (ageDays > 180) score += 10;
    else if (ageDays < 7) score -= 15;
  }

  // Clamp score
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let band = 'green';
  if (score < 40) band = 'red';
  else if (score < 70) band = 'amber';

  return {
    confidence_score: score,
    confidence_band: band
  };
}

module.exports = {
  deriveConfidence
};
