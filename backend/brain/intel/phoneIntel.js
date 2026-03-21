/**
 * phoneIntel.js
 * -------------
 * Carrier and structural intelligence for phone numbers.
 * Detects VOIP, virtual carriers, and suspicious number ranges.
 */

console.log("phoneIntel module LOADED");

/* ----------------------------- */
/* KNOWN VOIP / VIRTUAL PROVIDERS */
/* ----------------------------- */

const VOIP_PREFIXES = [

  /* US VOIP-heavy ranges */

  "1201",
  "1210",
  "1212",
  "1213",
  "1214",
  "1215",
  "1216",
  "1217",
  "1218",
  "1219",

  "1305",
  "1310",
  "1312",
  "1315",

  "1407",
  "1415",
  "1424",

  "1505",
  "1510",

  "1602",
  "1617",
  "1626",
  "1646",
  "1650",
  "1661",
  "1678",

  "1702",
  "1713",
  "1720",
  "1732",
  "1747",
  "1754",
  "1760",

  "1800",
  "1833",
  "1844",
  "1855",
  "1866",
  "1877",
  "1888"

];

/* ----------------------------- */
/* TEMP / BURNER NUMBER PATTERNS */
/* ----------------------------- */

const BURNER_PATTERNS = [

  "555",      // classic fake numbers
  "000",
  "999",
  "1234"

];

/* ----------------------------- */
/* NORMALIZE PHONE NUMBER */
/* ----------------------------- */

function normalize(phone) {

  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");

  if (digits.length < 10) return null;

  return digits;

}

/* ----------------------------- */
/* EXTRACT PREFIX */
/* ----------------------------- */

function extractPrefix(phone) {

  const digits = normalize(phone);

  if (!digits) return null;

  return digits.slice(0, 4);

}

/* ----------------------------- */
/* VOIP DETECTION */
/* ----------------------------- */

function detectVOIP(prefix) {

  if (!prefix) return false;

  return VOIP_PREFIXES.includes(prefix);

}

/* ----------------------------- */
/* BURNER PATTERN DETECTION */
/* ----------------------------- */

function detectBurnerPattern(phone) {

  const digits = normalize(phone);

  if (!digits) return false;

  for (const pattern of BURNER_PATTERNS) {

    if (digits.includes(pattern)) {
      return true;
    }

  }

  return false;

}

/* ----------------------------- */
/* MAIN INTELLIGENCE FUNCTION */
/* ----------------------------- */

export default function phoneIntel(phone) {

  const normalized = normalize(phone);

  if (!normalized) {

    return {
      valid: false
    };

  }

  const prefix = extractPrefix(normalized);

  const voip = detectVOIP(prefix);

  const burner = detectBurnerPattern(normalized);

  const signals = [];

  if (voip) {

    signals.push({
      type: "voip_carrier",
      severity: "medium",
      message: "Number range commonly associated with VOIP providers"
    });

  }

  if (burner) {

    signals.push({
      type: "burner_pattern",
      severity: "low",
      message: "Number contains patterns often used in temporary or fake numbers"
    });

  }

  return {

    valid: true,

    normalized,

    prefix,

    voip,

    burner,

    signals

  };

}