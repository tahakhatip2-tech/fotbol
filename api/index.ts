let app: any = null;
let loadError: any = null;

async function loadApp() {
  if (app) return app;
  if (loadError) return null;
  try {
    const mod = await import('../backend/src/app');
    app = mod.default;
    return app;
  } catch (e: any) {
    loadError = e;
    console.error('Failed to load Express app:', e.message, e.stack);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  const expressApp = await loadApp();
  if (!expressApp) {
    return res.status(500).json({
      error: 'Server initialization failed',
      message: loadError?.message || 'Unknown error',
      type: loadError?.constructor?.name
    });
  }
  return expressApp(req, res);
}
