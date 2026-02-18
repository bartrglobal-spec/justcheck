/**
 * public_web_titles
 * -----------------
 * Signals the existence of public web references based on recorded page titles.
 */

export default {
  id: "public_web_titles",
  order: 6,

  run(brain) {
    const titles = brain.publicSignals?.web_titles;

    if (!Array.isArray(titles) || titles.length === 0) {
      return null;
    }

    return {
      level: "green",
      code: "PUBLIC_WEB_REFERENCES",
      message: "This identifier appears in publicly accessible web content."
    };
  }
};
