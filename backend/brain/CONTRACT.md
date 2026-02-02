# JustCheck Brain Contract — v1 (LOCKED)

This document defines the IMMUTABLE interface rules for the JustCheck Brain.
Any violation MUST fail safe.

--------------------------------------------------
INDICATOR CONTRACT (NON-NEGOTIABLE)
--------------------------------------------------

Every indicator MUST be an object with:

- key: string
- weight: number (integer, >= 0)
- run: function(input) => boolean

Example:
{
  key: "short_identifier",
  weight: 1,
  run: (input) => boolean
}

--------------------------------------------------
BRAIN RULES
--------------------------------------------------

1. Brain MUST NEVER throw or crash
2. Brain MUST return a valid response even if indicators fail
3. Brain MUST NOT make judgments or claims
4. Brain MUST only output confidence signals

--------------------------------------------------
SIGNAL OUTPUT (LOCKED WORDING)
--------------------------------------------------

GREEN:
- level: "green"
- summary: "Low Risk Indicators"

AMBER:
- level: "amber"
- summary: "Some Risk Indicators"

RED:
- level: "red"
- summary: "Elevated Risk Indicators"

--------------------------------------------------
FAIL-SAFE BEHAVIOR
--------------------------------------------------

If:
- Indicator contract is broken
- Indicator execution throws
- Brain integrity is compromised

Then:
- Return GREEN
- Include meta.note explaining fail-safe

--------------------------------------------------
VERSIONING
--------------------------------------------------

- v1 = current production brain
- New indicators MAY be added
- Existing indicator keys MUST NEVER change
- Weights MAY change
- Output wording MUST NEVER change

--------------------------------------------------
THIS FILE IS LAW.
DO NOT OPTIMIZE.
DO NOT IMPROVE.
DO NOT INTERPRET.
--------------------------------------------------
