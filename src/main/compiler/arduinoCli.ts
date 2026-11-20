import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { ToolchainManager } from './toolchainManager';
import { getBoardById } from '../../core/boards/boardDefinitions';
import { CompileOptions, CompileResult } from '../../core/types';

export class ArduinoCompiler {
  private toolchainManager: ToolchainManager;

  constructor() {
    this.toolchainManager = ToolchainManager.getInstance();
  }

  public async compile(
    options: CompileOptions,
    onProgress?: (data: string) => void
  ): Promise<CompileResult> {
    const status = await this.toolchainManager.getStatus();
    if (!status.isReady) {
      const errorMsg = `Bu bileşen offline kurulumda bulunamadı: \n${status.missingComponents.join('\n')}`;
      if (onProgress) onProgress(`[HATA] ${errorMsg}\n`);
      return {
        success: false,
        output: errorMsg,
        error: errorMsg
      };
    }

    const board = getBoardById(options.boardId);
    const cliPath = this.toolchainManager.getCliPath();
    const configPath = this.toolchainManager.getConfigPath();
    const toolchainDir = this.toolchainManager.getToolchainDir();

    // Create a local build directory inside toolchain/build
    const baseBuildDir = path.join(toolchainDir, 'build');
    const sketchName = 'sketch_' + Date.now();
    const sketchDir = path.join(baseBuildDir, sketchName);
    const buildDir = options.buildPath || path.join(baseBuildDir, 'output');

    fs.mkdirSync(sketchDir, { recursive: true });
    fs.mkdirSync(buildDir, { recursive: true });

    const inoPath = path.join(sketchDir, `${sketchName}.ino`);
    fs.writeFileSync(inoPath, options.code, 'utf-8');

    if (onProgress) {
      onProgress(`[BİLGİ] Seçilen Kart: ${board.name} (${board.fqbn})\n`);
      onProgress(`[BİLGİ] Geçici proje dosyası oluşturuldu: ${inoPath}\n`);
      onProgress(`[BİLGİ] Lokal C++ derleyicisi çalıştırılıyor...\n`);
    }

    const args = [
      'compile',
      '--fqbn',
      board.fqbn,
      sketchDir,
      '--build-path',
      buildDir,
      '--config-file',
      configPath
    ];

    return new Promise((resolve) => {
      let fullOutput = '';
      const proc = spawn(cliPath, args, {
        cwd: toolchainDir,
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf-8'
        }
      });

      proc.stdout.on('data', (data) => {
        const text = data.toString('utf-8');
        fullOutput += text;
        if (onProgress) onProgress(text);
      });

      proc.stderr.on('data', (data) => {
        const text = data.toString('utf-8');
        fullOutput += text;
        if (onProgress) onProgress(text);
      });

      proc.on('close', (code) => {
        const success = code === 0;

        // Parse program and data sizes if available
        let programSize: number | undefined;
        let programMaxSize: number | undefined;
        let dataSize: number | undefined;
        let dataMaxSize: number | undefined;

        const progMatch = fullOutput.match(/Sketch uses\s+([0-9]+)\s+bytes.*Maximum is\s+([0-9]+)/i);
        if (progMatch) {
          programSize = parseInt(progMatch[1], 10);
          programMaxSize = parseInt(progMatch[2], 10);
        }

        const dataMatch = fullOutput.match(/Global variables use\s+([0-9]+)\s+bytes.*Maximum is\s+([0-9]+)/i);
        if (dataMatch) {
          dataSize = parseInt(dataMatch[1], 10);
          dataMaxSize = parseInt(dataMatch[2], 10);
        }

        // Locate compiled binary
        let binaryPath: string | undefined;
        if (success) {
          const expectedBin = path.join(buildDir, `${sketchName}.ino.bin`);
          if (fs.existsSync(expectedBin)) {
            binaryPath = expectedBin;
          }
        }

        if (success) {
          if (onProgress) onProgress(`\n[✓ BAŞARILI] Derleme başarıyla tamamlandı! Program boyutu: ${programSize || 0} bayt\n`);
        } else {
          if (onProgress) onProgress(`\n[✕ HATA] Derleme başarısız oldu (Hata Kodu: ${code})\n`);
        }

        resolve({
          success,
          output: fullOutput,
          error: success ? undefined : fullOutput,
          binaryPath,
          buildPath: buildDir,
          programSize,
          programMaxSize,
          dataSize,
          dataMaxSize
        });
      });

      proc.on('error', (err) => {
        const errMsg = `Derleyici başlatılamadı: ${err.message}`;
        if (onProgress) onProgress(`\n[KRİTİK HATA] ${errMsg}\n`);
        resolve({
          success: false,
          output: errMsg,
          error: errMsg
        });
      });
    });
  }
}
