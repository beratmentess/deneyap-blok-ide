import { contextBridge, ipcRenderer } from 'electron';
import { CompileOptions, UploadOptions, ProjectData } from '../../core/types';

contextBridge.exposeInMainWorld('electronAPI', {
  listPorts: () => ipcRenderer.invoke('serial:list-ports'),
  compile: (options: CompileOptions) => ipcRenderer.invoke('compiler:compile', options),
  upload: (options: UploadOptions) => ipcRenderer.invoke('uploader:upload', options),
  getToolchainStatus: () => ipcRenderer.invoke('toolchain:get-status'),

  openSerialMonitor: (port: string, baudRate: number) =>
    ipcRenderer.invoke('serial:open', port, baudRate),
  closeSerialMonitor: () => ipcRenderer.invoke('serial:close'),
  sendSerialData: (data: string) => ipcRenderer.invoke('serial:write', data),

  onSerialData: (callback: (data: string) => void) => {
    const subscription = (_event: any, value: string) => callback(value);
    ipcRenderer.on('serial:data', subscription);
    return () => ipcRenderer.removeListener('serial:data', subscription);
  },

  onBuildLog: (callback: (log: string) => void) => {
    const subscription = (_event: any, value: string) => callback(value);
    ipcRenderer.on('build:log', subscription);
    return () => ipcRenderer.removeListener('build:log', subscription);
  },

  saveProject: (project: ProjectData) => ipcRenderer.invoke('project:save', project),
  saveProjectAs: (project: ProjectData) => ipcRenderer.invoke('project:save-as', project),
  loadProject: () => ipcRenderer.invoke('project:load')
});
