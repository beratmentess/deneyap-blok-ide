import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Send, Trash2, ArrowDown } from 'lucide-react';
import { SerialPortInfo } from '../../core/types';

interface SerialMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ports: SerialPortInfo[];
  selectedPort: string;
  onSelectPort: (port: string) => void;
}

export const SerialMonitorModal: React.FC<SerialMonitorModalProps> = ({
  isOpen,
  onClose,
  ports,
  selectedPort,
  onSelectPort
}) => {
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dataLogs, setDataLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for incoming serial data from main process
    const cleanup = (window as any).electronAPI?.onSerialData((chunk: string) => {
      setDataLogs((prev) => [...prev, chunk]);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dataLogs, autoScroll]);

  if (!isOpen) return null;

  const handleToggleConnect = async () => {
    if (isConnected) {
      await (window as any).electronAPI?.closeSerialMonitor();
      setIsConnected(false);
      setDataLogs((prev) => [...prev, '\n[BİLGİ] Seri port bağlantısı kesildi.\n']);
    } else {
      if (!selectedPort) {
        alert('Lütfen önce bir COM portu seçin!');
        return;
      }
      setDataLogs((prev) => [...prev, `\n[BİLGİ] ${selectedPort} (${baudRate} baud) bağlanıyor...\n`]);
      const ok = await (window as any).electronAPI?.openSerialMonitor(selectedPort, baudRate);
      if (ok) {
        setIsConnected(true);
        setDataLogs((prev) => [...prev, `[✓ BİLGİ] Bağlantı başarılı!\n`]);
      } else {
        setIsConnected(false);
        setDataLogs((prev) => [...prev, `[✕ HATA] Porta bağlanılamadı. Port başka bir uygulama tarafından kullanılıyor olabilir.\n`]);
      }
    }
  };

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    if (!isConnected) {
      alert('Lütfen önce porta bağlanın!');
      return;
    }

    const toSend = inputVal + '\n';
    await (window as any).electronAPI?.sendSerialData(toSend);
    setDataLogs((prev) => [...prev, `> ${inputVal}\n`]);
    setInputVal('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          width: '780px',
          height: '520px',
          backgroundColor: '#1b1b28',
          border: '1px solid #3d3d5c',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            height: '46px',
            backgroundColor: '#13131d',
            borderBottom: '1px solid #2d2d42',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10ac84' : '#ee5253'
              }}
            />
            <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff' }}>
              Dahili Seri Monitör (Serial Monitor)
            </span>
          </div>

          <button
            onClick={() => {
              if (isConnected) {
                (window as any).electronAPI?.closeSerialMonitor();
                setIsConnected(false);
              }
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#8e8ea0',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Port & Baud & Connect */}
        <div
          style={{
            height: '48px',
            backgroundColor: '#1e1e2f',
            borderBottom: '1px solid #2d2d42',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Port Select */}
            <select
              value={selectedPort}
              onChange={(e) => onSelectPort(e.target.value)}
              disabled={isConnected}
              style={selectStyle}
            >
              <option value="">Port Seçin...</option>
              {ports.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.friendlyName || p.path}
                </option>
              ))}
            </select>

            {/* Baud rate */}
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={isConnected}
              style={selectStyle}
            >
              <option value={9600}>9600 baud</option>
              <option value={19200}>19200 baud</option>
              <option value={38400}>38400 baud</option>
              <option value={57600}>57600 baud</option>
              <option value={115200}>115200 baud</option>
              <option value={921600}>921600 baud</option>
            </select>

            {/* Connect / Disconnect Button */}
            <button
              onClick={handleToggleConnect}
              style={{
                ...btnActionStyle,
                backgroundColor: isConnected ? '#ee5253' : '#10ac84'
              }}
            >
              {isConnected ? <Square size={14} /> : <Play size={14} />}
              {isConnected ? 'Bağlantıyı Kes' : 'Bağlan'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              style={{
                ...btnSecStyle,
                color: autoScroll ? '#1dd1a1' : '#8e8ea0'
              }}
              title="Otomatik Kaydır"
            >
              <ArrowDown size={13} />
              Oto Kaydır
            </button>

            <button
              onClick={() => setDataLogs([])}
              style={btnSecStyle}
              title="Çıktıyı Temizle"
            >
              <Trash2 size={13} />
              Temizle
            </button>
          </div>
        </div>

        {/* Output Screen */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#0c0c12',
            padding: '12px',
            overflowY: 'auto',
            fontFamily: "'Fira Code', Consolas, Monaco, monospace",
            fontSize: '12px',
            lineHeight: '18px',
            color: '#1dd1a1'
          }}
        >
          {dataLogs.length === 0 ? (
            <div style={{ color: '#576574', fontStyle: 'italic' }}>
              Seri monitör hazır. Karta bağlanmak için "Bağlan" butonuna tıklayın.
            </div>
          ) : (
            dataLogs.map((log, idx) => (
              <span key={idx} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {log}
              </span>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            height: '48px',
            backgroundColor: '#181824',
            borderTop: '1px solid #2d2d42',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '8px'
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={isConnected ? 'Karta gönderilecek mesajı yazın...' : 'Mesaj göndermek için porta bağlanın'}
            disabled={!isConnected}
            style={{
              flex: 1,
              backgroundColor: '#252538',
              border: '1px solid #3d3d5c',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!isConnected}
            style={{
              ...btnActionStyle,
              backgroundColor: isConnected ? '#2e86de' : '#576574',
              cursor: isConnected ? 'pointer' : 'not-allowed'
            }}
          >
            <Send size={14} />
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  backgroundColor: '#252538',
  border: '1px solid #3d3d5c',
  borderRadius: '6px',
  color: '#fff',
  padding: '6px 10px',
  fontSize: '12px',
  outline: 'none',
  cursor: 'pointer'
};

const btnActionStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '6px',
  color: '#ffffff',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const btnSecStyle: React.CSSProperties = {
  backgroundColor: '#252538',
  border: '1px solid #3d3d5c',
  borderRadius: '6px',
  color: '#a4b0be',
  padding: '5px 8px',
  fontSize: '11px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};
