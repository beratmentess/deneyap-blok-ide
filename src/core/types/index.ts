export interface BoardInfo {
  id: string;
  name: string;
  fqbn: string;
  chip: string;
  vid?: string;
  pid?: string;
  digitalPins: string[];
  analogPins: string[];
  pwmPins: string[];
  i2cPins: { sda: string; scl: string };
  spiPins: { sck: string; mosi: string; miso: string; ss: string };
  defaultUploadBaud: number;
  hasRgb: boolean;
  hasBluetooth: boolean;
  hasWifi: boolean;
  hasImu: boolean;
  description: string;
}

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  vendorId?: string;
  productId?: string;
  serialNumber?: string;
  friendlyName?: string;
}

export interface CompileOptions {
  boardId: string;
  code: string;
  buildPath?: string;
}

export interface CompileResult {
  success: boolean;
  output: string;
  error?: string;
  binaryPath?: string;
  buildPath?: string;
  programSize?: number;
  programMaxSize?: number;
  dataSize?: number;
  dataMaxSize?: number;
}

export interface UploadOptions {
  boardId: string;
  port: string;
  code?: string;
  buildPath?: string;
}

export interface UploadResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface ProjectData {
  version: string;
  name: string;
  boardId: string;
  workspaceState: any; // Blockly JSON serialization
  cppCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolchainStatus {
  isReady: boolean;
  cliVersion?: string;
  deneyapCoreVersion?: string;
  missingComponents: string[];
  toolchainPath: string;
}
