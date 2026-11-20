import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface ConsoleTerminalProps {
  logs: string[];
  onClear: () => void;
}

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = ({ logs, onClear }) => {
  const [collapsed, setCollapsed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, collapsed]);

  return (
    <div
      style={{
        height: collapsed ? '34px' : '180px',
        backgroundColor: '#13131c',
        borderTop: '1px solid #2d2d42',
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.2s ease',
        overflow: 'hidden'
      }}
    >
      {/* Console Header */}
      <div
        style={{
          height: '34px',
          backgroundColor: '#1b1b28',
          borderBottom: collapsed ? 'none' : '1px solid #2d2d42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} color="#ff9f43" />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e0e0e0' }}>
            Derleme & Yükleme Terminali
          </span>
          {logs.length > 0 && (
            <span
              style={{
                fontSize: '10px',
                backgroundColor: '#2a2a3e',
                padding: '2px 6px',
                borderRadius: '10px',
                color: '#a4b0be'
              }}
            >
              {logs.length} satır
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onClear}
            title="Terminali Temizle"
            style={{
              background: 'none',
              border: 'none',
              color: '#8e8ea0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px'
            }}
          >
            <Trash2 size={13} />
            Temizle
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Terminali Genişlet' : 'Terminali Daralt'}
            style={{
              background: 'none',
              border: 'none',
              color: '#8e8ea0',
              cursor: 'pointer'
            }}
          >
            {collapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Console Output Log */}
      {!collapsed && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 12px',
            fontFamily: "'Fira Code', Consolas, Monaco, monospace",
            fontSize: '11px',
            lineHeight: '16px',
            backgroundColor: '#0c0c12'
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#576574', fontStyle: 'italic', paddingTop: '4px' }}>
              Henüz derleme veya yükleme işlemi başlatılmadı. "Derle" veya "Yükle" butonuna tıklayarak işlemi başlatabilirsiniz.
            </div>
          ) : (
            logs.map((log, index) => {
              let color = '#c8d6e5';
              if (log.includes('[HATA]') || log.includes('error:') || log.includes('✕')) {
                color = '#ff6b6b';
              } else if (log.includes('[BAŞARILI]') || log.includes('✓') || log.includes('success')) {
                color = '#1dd1a1';
              } else if (log.includes('[BİLGİ]') || log.includes('[ADIM')) {
                color = '#54a0ff';
              }
              return (
                <div key={index} style={{ color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {log}
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
