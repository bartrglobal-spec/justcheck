console.log("🔥🔥🔥 LOADED render.js FROM:", __filename);

module.exports = {
  renderReport: (payload) => {
    return {
      DEBUG_RENDERER: true,
      message: "THIS RESPONSE PROVES WHICH render.js IS EXECUTING",
      payload
    };
  }
};
