export default function genericPattern(brain = {}) {
  if (!brain || !brain.identifier || !brain.identifier_type) {
    return null;
  }

  return {
    label: "Public pattern presence",
    description:
      "Some publicly observable patterns are present for this identifier. This is neither a positive nor negative finding on its own."
  };
}
