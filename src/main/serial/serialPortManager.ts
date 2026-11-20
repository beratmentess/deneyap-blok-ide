import { SerialPort } from 'serialport';
import { SerialPortInfo } from '../../core/types';

export class SerialPortManager {
  private static instance: SerialPortManager;
  private activePort: SerialPort | null = null;
  private onDataCallback: ((data: string) => void) | null = null;

  private constructor() {}

  public static getInstance(): SerialPortManager {
    if (!SerialPortManager.instance) {
      SerialPortManager.instance = new SerialPortManager();
    }
    return SerialPortManager.instance;
  }

  public async listPorts(): Promise<SerialPortInfo[]> {
    try {
      const ports = await SerialPort.list();
      return ports.map((p) => {
        let friendlyName = p.path;
        const manufacturer = p.manufacturer || '';
        const vid = (p.vendorId || '').toLowerCase();
        const pid = (p.productId || '').toLowerCase();

        // Detect if this is Deneyap or ESP32
        const isDeneyap =
          vid === '303a' ||
          manufacturer.toLowerCase().includes('deneyap') ||
          manufacturer.toLowerCase().includes('turkish technology team') ||
          manufacturer.toLowerCase().includes('silicon labs') ||
          manufacturer.toLowerCase().includes('wch') ||
          vid === '10c4' ||
          vid === '1a86';

        if (manufacturer) {
          friendlyName += ` (${manufacturer})`;
        }

        if (isDeneyap) {
          friendlyName += ' [Deneyap / ESP Uyumlu]';
        }

        return {
          path: p.path,
          manufacturer: p.manufacturer,
          vendorId: p.vendorId,
          productId: p.productId,
          serialNumber: p.serialNumber,
          friendlyName
        };
      });
    } catch (err) {
      console.error('Port listeleme hatası:', err);
      return [];
    }
  }

  public open(
    portPath: string,
    baudRate: number = 115200,
    onData: (chunk: string) => void
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.close(); // Close any currently open port

      try {
        this.activePort = new SerialPort({
          path: portPath,
          baudRate: baudRate,
          autoOpen: false
        });

        this.onDataCallback = onData;

        this.activePort.open((err) => {
          if (err) {
            console.error('Port açılamadı:', err.message);
            this.activePort = null;
            resolve(false);
            return;
          }

          this.activePort?.on('data', (data: Buffer) => {
            if (this.onDataCallback) {
              this.onDataCallback(data.toString('utf-8'));
            }
          });

          this.activePort?.on('error', (portErr) => {
            console.error('Seri port hatası:', portErr.message);
          });

          resolve(true);
        });
      } catch (e) {
        console.error('Serial port oluşturma hatası:', e);
        resolve(false);
      }
    });
  }

  public write(data: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.activePort || !this.activePort.isOpen) {
        resolve(false);
        return;
      }

      this.activePort.write(data, (err) => {
        if (err) {
          console.error('Veri gönderme hatası:', err.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public close(): boolean {
    if (this.activePort && this.activePort.isOpen) {
      this.activePort.close();
    }
    this.activePort = null;
    this.onDataCallback = null;
    return true;
  }

  public isOpen(): boolean {
    return !!(this.activePort && this.activePort.isOpen);
  }
}
