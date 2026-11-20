import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { spawn } from 'child_process';
import { ToolchainStatus } from '../../core/types';

export class ToolchainManager {
  private static instance: ToolchainManager;
  private toolchainDir: string;
  private cliBinaryPath: string;
  private configFilePath: string;

  private constructor() {
    const appPath = app.getAppPath();
    const exeDir = path.dirname(app.getPath('exe'));
    const potentialPaths = [
      path.join(process.cwd(), 'toolchain'),
      path.join(appPath, 'toolchain'),
      path.join(process.resourcesPath || '', 'toolchain'),
      path.join(exeDir, 'toolchain'),
      path.join(exeDir, 'resources', 'toolchain')
    ];

    let foundDir = potentialPaths[0];
    for (const p of potentialPaths) {
      if (fs.existsSync(path.join(p, 'bin', 'arduino-cli.exe'))) {
        foundDir = p;
        break;
      }
    }

    this.toolchainDir = path.resolve(foundDir);
    this.cliBinaryPath = path.join(this.toolchainDir, 'bin', 'arduino-cli.exe');
    this.configFilePath = path.join(this.toolchainDir, 'arduino-cli.yaml');

    this.ensureDefaultConfig();
  }

  public static getInstance(): ToolchainManager {
    if (!ToolchainManager.instance) {
      ToolchainManager.instance = new ToolchainManager();
    }
    return ToolchainManager.instance;
  }

  public getCliPath(): string {
    return this.cliBinaryPath;
  }

  public getConfigPath(): string {
    return this.configFilePath;
  }

  public getToolchainDir(): string {
    return this.toolchainDir;
  }

  public async getStatus(): Promise<ToolchainStatus> {
    const missing: string[] = [];
    let isReady = true;

    // 1. Check CLI binary
    if (!fs.existsSync(this.cliBinaryPath)) {
      missing.push('arduino-cli.exe derleyici arayüzü bulunamadı');
      isReady = false;
    }

    // 2. Ensure config
    this.ensureDefaultConfig();

    // 3. Check Deneyap hardware core
    const coreDir = path.join(this.toolchainDir, 'data', 'packages', 'deneyap', 'hardware', 'esp32');
    if (!fs.existsSync(coreDir)) {
      missing.push('Deneyap Arduino Çekirdeği (deneyap:esp32) bulunamadı');
      isReady = false;
    }

    // 4. Check toolchain tools (esp-x32 gcc, esptool)
    const espX32Dir = path.join(this.toolchainDir, 'data', 'packages', 'deneyap', 'tools', 'esp-x32');
    if (!fs.existsSync(espX32Dir)) {
      missing.push('Xtensa ESP32 GCC derleyicisi (esp-x32) bulunamadı');
      isReady = false;
    }

    const esptoolDir = path.join(this.toolchainDir, 'data', 'packages', 'deneyap', 'tools', 'esptool_py');
    if (!fs.existsSync(esptoolDir)) {
      missing.push('esptool yükleyici modülü bulunamadı');
      isReady = false;
    }

    let cliVersion = '1.6.0 (yerel)';
    if (fs.existsSync(this.cliBinaryPath)) {
      try {
        cliVersion = await this.queryCliVersion();
      } catch (err) {
        cliVersion = '1.6.0 (yerel)';
      }
    }

    return {
      isReady,
      cliVersion,
      deneyapCoreVersion: '2.1.1 (yerel)',
      missingComponents: missing,
      toolchainPath: this.toolchainDir
    };
  }

  private queryCliVersion(): Promise<string> {
    return new Promise((resolve) => {
      const proc = spawn(this.cliBinaryPath, ['version', '--config-file', this.configFilePath]);
      let out = '';
      proc.stdout.on('data', (d) => (out += d.toString()));
      proc.on('close', () => {
        const match = out.match(/Version:\s*([^\s]+)/i);
        resolve(match ? match[1] : '1.6.0');
      });
      proc.on('error', () => resolve('1.6.0'));
    });
  }

  private ensureDefaultConfig(): void {
    // Only write config if it doesn't exist or needs updating
    const dataDir = path.join(this.toolchainDir, 'data').replace(/\\/g, '/');
    const downloadsDir = path.join(this.toolchainDir, 'staging').replace(/\\/g, '/');
    const userDir = path.join(this.toolchainDir, 'user').replace(/\\/g, '/');

    const yamlContent = `board_manager:
  additional_urls:
    - https://raw.githubusercontent.com/deneyapkart/deneyapkart-arduino-core/master/package_deneyapkart_index.json
directories:
  data: "${dataDir}"
  downloads: "${downloadsDir}"
  user: "${userDir}"
library:
  enable_unsafe_install: true
`;

    try {
      // Check if existing config has correct paths
      if (fs.existsSync(this.configFilePath)) {
        const existing = fs.readFileSync(this.configFilePath, 'utf-8');
        if (existing.includes(dataDir)) {
          return; // Config is already correct
        }
      }
      fs.writeFileSync(this.configFilePath, yamlContent, 'utf-8');
    } catch (e) {
      console.error('Config dosyası güncellenemedi:', e);
    }
  }
}
