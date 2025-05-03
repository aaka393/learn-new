import { autoUpdater, dialog, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "os";
const version = "1.0.0";
const server = "https://your-update-server.com";
const feed = `${server}/update/${process.platform}/${version}`;
function setupAutoUpdater() {
  autoUpdater.setFeedURL({ url: feed });
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 3e5);
  autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message: process.platform === "darwin" ? releaseNotes : `A new version ${releaseName} has been downloaded. Restart the application to apply the updates.`,
      detail: `New version: ${releaseName}

${releaseNotes || ""}`
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });
  autoUpdater.on("error", (message) => {
    console.error("There was a problem updating the application");
    console.error(message);
  });
}
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
function getLocalExternalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
const VITE_DEV_SERVER_URL = `http://${getLocalExternalIP()}:5173/`;
process.env.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win = null;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      webSecurity: false,
      // 🚨 Disable CORS
      contextIsolation: false,
      // 🚨 Allow direct access to Node
      nodeIntegration: true
      // 🚨 Enable Node.js in renderer
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
