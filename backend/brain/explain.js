export default function explain(brain = {}) {
  const level = brain.confidence?.level || "unknown";

  if (level === "low") {
    return (
      "There is a reasonable amount of publicly visible information connected to this identifier. " +
      "Nothing immediately stands out as unusual, but this does not guarantee safety."
    );
  }

  if (level === "medium") {
    return (
      "Some public information is available for this identifier, but there are gaps or inconsistencies. " +
      "People often take a moment to think when information is mixed or incomplete."
    );
  }

  if (level === "high") {
    return (
      "Very little reliable public information could be found for this identifier. " +
      "This does not mean there is a problem, but it does mean uncertainty is higher than usual."
    );
  }

  return (
    "There is not enough information available to clearly describe this identifier."
  );
}
