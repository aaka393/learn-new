import { app, BrowserWindow } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { setupAutoUpdater } from './updater';
import os from 'os'


const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

function getLocalExternalIP(): string {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

const VITE_DEV_SERVER_URL = `http://${getLocalExternalIP()}:5173/`
process.env.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;


// 🚧 Use ['ENV_NAME'] to avoid vite:define plugin - Vite@2.x
const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

// Allow external access on the local network
const SERVER_HOST = '0.0.0.0'; // Make Electron accessible to all local devices
const SERVER_PORT = 3000; // You can choose any port you prefer

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      webSecurity: false,          // 🚨 Disable CORS
      contextIsolation: false,     // 🚨 Allow direct access to Node
      nodeIntegration: true,       // 🚨 Enable Node.js in renderer
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Ensure the app is running and accessible on the network
app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
});

export {
  MAIN_DIST,
  VITE_DEV_SERVER_URL,
  RENDERER_DIST,
};
