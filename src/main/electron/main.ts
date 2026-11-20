import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { ArduinoCompiler } from '../compiler/arduinoCli';
import { ArduinoUploader } from '../uploader/uploader';
import { SerialPortManager } from '../serial/serialPortManager';
import { ToolchainManager } from '../compiler/toolchainManager';
import { CompileOptions, UploadOptions, ProjectData } from '../../core/types';

let mainWindow: BrowserWindow | null = null;
const compiler = new ArduinoCompiler();
const uploader = new ArduinoUploader();
const serialManager = SerialPortManager.getInstance();
const toolchainManager = ToolchainManager.getInstance();

function getIconPath(): string | undefined {
  // Try multiple locations for logo
  const candidates = [
    path.join(__dirname, '..', 'dist', 'assets', 'deneyap-logo.png'),
    path.join(__dirname, '..', '..', 'src', 'renderer', 'assets', 'deneyap-logo.png'),
    path.join(process.cwd(), 'src', 'renderer', 'assets', 'deneyap-logo.png'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

function createWindow() {
  const iconPath = getIconPath();

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Deneyap Blok IDE',
    backgroundColor: '#1a1a2e',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false // needed for local preload ipc
    }
  });

  // If in dev mode, load Vite dev server; else load built html
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    serialManager.close();
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  serialManager.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC: Toolchain status
ipcMain.handle('toolchain:get-status', async () => {
  return await toolchainManager.getStatus();
});

// IPC: Compile
ipcMain.handle('compiler:compile', async (_event, options: CompileOptions) => {
  return await compiler.compile(options, (logChunk) => {
    mainWindow?.webContents.send('build:log', logChunk);
  });
});

// IPC: Upload
ipcMain.handle('uploader:upload', async (_event, options: UploadOptions) => {
  // If serial monitor is open on the same port, close it first so upload succeeds!
  serialManager.close();

  return await uploader.upload(options, (logChunk) => {
    mainWindow?.webContents.send('build:log', logChunk);
  });
});

// IPC: Serial Ports
ipcMain.handle('serial:list-ports', async () => {
  return await serialManager.listPorts();
});

ipcMain.handle('serial:open', async (_event, portPath: string, baudRate: number) => {
  return await serialManager.open(portPath, baudRate, (dataChunk) => {
    mainWindow?.webContents.send('serial:data', dataChunk);
  });
});

ipcMain.handle('serial:close', async () => {
  return serialManager.close();
});

ipcMain.handle('serial:write', async (_event, data: string) => {
  return await serialManager.write(data);
});

// IPC: Project Save / Load
let lastSavedPath: string | null = null;

ipcMain.handle('project:save', async (_event, project: ProjectData) => {
  if (!mainWindow) return { success: false };

  // If we already have a saved path, write directly
  if (lastSavedPath) {
    try {
      fs.writeFileSync(lastSavedPath, JSON.stringify(project, null, 2), 'utf-8');
      return { success: true, filePath: lastSavedPath };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Otherwise show save dialog (first time)
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Projeyi Kaydet',
    defaultPath: `${project.name || 'projem'}.dblock`,
    filters: [
      { name: 'Deneyap Blok Projesi (*.dblock)', extensions: ['dblock'] },
      { name: 'JSON Dosyası (*.json)', extensions: ['json'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');
    lastSavedPath = filePath;
    return { success: true, filePath };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('project:save-as', async (_event, project: ProjectData) => {
  if (!mainWindow) return { success: false };

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Farklı Kaydet',
    defaultPath: `${project.name || 'projem'}.dblock`,
    filters: [
      { name: 'Deneyap Blok Projesi (*.dblock)', extensions: ['dblock'] },
      { name: 'JSON Dosyası (*.json)', extensions: ['json'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8');
    lastSavedPath = filePath;
    return { success: true, filePath };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('project:load', async () => {
  if (!mainWindow) return { success: false };

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Proje Aç',
    filters: [
      { name: 'Deneyap Blok Projesi (*.dblock; *.json)', extensions: ['dblock', 'json'] }
    ],
    properties: ['openFile']
  });

  if (canceled || filePaths.length === 0) {
    return { success: false };
  }

  try {
    const raw = fs.readFileSync(filePaths[0], 'utf-8');
    const data = JSON.parse(raw);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});
