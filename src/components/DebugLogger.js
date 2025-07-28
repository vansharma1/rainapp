const DebugLogger = {
  log: (fn, msg, meta = {}) => {
    console.log(`[${new Date().toLocaleString()}] [${fn}] ${msg}`, meta);
  },
  error: (fn, msg, err) => {
    console.error(`[${new Date().toLocaleString()}] [${fn}] ERROR: ${msg}`, err);
  },
  Render: () => null // Placeholder for future UI log view
};

export default DebugLogger;
