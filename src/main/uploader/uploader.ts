import { spawn } from 'child_process';
import { ToolchainManager } from '../compiler/toolchainManager';
import { getBoardById } from '../../core/boards/boardDefinitions';
import { UploadOptions, UploadResult } from '../../core/types';
import { ArduinoCompiler } from '../compiler/arduinoCli';

export class ArduinoUploader {
  private toolchainManager: ToolchainManager;
  private compiler: ArduinoCompiler;

  constructor() {
    this.toolchainManager = ToolchainManager.getInstance();
    this.compiler = new ArduinoCompiler();
  }

  public async upload(
    options: UploadOptions,
    onProgress?: (data: string) => void
  ): Promise<UploadResult> {
    const status = await this.toolchainManager.getStatus();
    if (!status.isReady) {
      const errorMsg = `Bu bileşen offline kurulumda bulunamadı: \n${status.missingComponents.join('\n')}`;
      if (onProgress) onProgress(`[HATA] ${errorMsg}\n`);
      return { success: false, output: errorMsg, error: errorMsg };
    }

    if (!options.port) {
      const errorMsg = 'Lütfen yükleme yapmak için bir COM portu seçin!';
      if (onProgress) onProgress(`[HATA] ${errorMsg}\n`);
      return { success: false, output: errorMsg, error: errorMsg };
    }

    const board = getBoardById(options.boardId);
    const cliPath = this.toolchainManager.getCliPath();
    const configPath = this.toolchainManager.getConfigPath();

    if (onProgress) {
      onProgress(`\n--- YÜKLEME BAŞLADI ---\n`);
      onProgress(`[BİLGİ] Hedef Kart: ${board.name}\n`);
      onProgress(`[BİLGİ] Port: ${options.port}\n`);
    }

    // If source code is provided and no buildPath, compile first!
    let buildPath = options.buildPath;
    let sketchDir: string | undefined;

    if (options.code) {
      if (onProgress) onProgress(`[ADIM 1/2] Kod derleniyor...\n`);
      const compResult = await this.compiler.compile(
        { boardId: options.boardId, code: options.code },
        onProgress
      );
      if (!compResult.success) {
        return {
          success: false,
          output: compResult.output,
          error: 'Derleme başarısız olduğu için yükleme iptal edildi.'
        };
      }
      // Use the build output directory from compilation
      if (compResult.buildPath) {
        buildPath = compResult.buildPath;
      }
      if (onProgress) onProgress(`\n[ADIM 2/2] Karta aktarılıyor...\n`);
    }

    const args = [
      'upload',
      '-p',
      options.port,
      '--fqbn',
      board.fqbn,
      '--config-file',
      configPath
    ];

    if (buildPath) {
      args.push('--build-path', buildPath);
    }

    return new Promise((resolve) => {
      let fullOutput = '';
      const proc = spawn(cliPath, args, {
        cwd: this.toolchainManager.getToolchainDir(),
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
        if (success) {
          if (onProgress) onProgress(`\n[✓ BAŞARILI] Firmware Deneyap Kart'a başarıyla yüklendi!\n`);
        } else {
          if (onProgress) onProgress(`\n[✕ HATA] Yükleme başarısız oldu (Hata Kodu: ${code}).\nLütfen kartın USB bağlantısını ve doğru portu kontrol edin.\n`);
        }

        resolve({
          success,
          output: fullOutput,
          error: success ? undefined : fullOutput
        });
      });

      proc.on('error', (err) => {
        const errMsg = `Yükleyici başlatılamadı: ${err.message}`;
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
