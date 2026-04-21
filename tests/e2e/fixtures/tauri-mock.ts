export const TAURI_MOCK_SCRIPT = `
  const tauriStore = {};

  window.__TAURI_INTERNALS__ = {
    invoke: async function(cmd, args) {
      if (cmd === 'plugin:store|load') return null;
      if (cmd === 'plugin:store|get') return tauriStore[args?.key] ?? null;
      if (cmd === 'plugin:store|set') { tauriStore[args?.key] = args?.value; return null; }
      if (cmd === 'plugin:store|save') return null;
      if (cmd === 'plugin:store|entries') return Object.entries(tauriStore);
      if (cmd === 'plugin:shell|open') return null;
      return null;
    },
    transformCallback: function(_callback, _once) {
      return Math.floor(Math.random() * 2147483647);
    },
    metadata: {
      currentWindow: { label: 'main' },
      windows: [{ label: 'main' }],
    },
  };
`
