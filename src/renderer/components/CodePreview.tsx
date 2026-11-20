import React, { useState } from 'react';
import { Code, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface CodePreviewProps {
  code: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (collapsed) {
    return (
      <div
        style={{
          width: '36px',
          backgroundColor: '#161622',
          borderLeft: '1px solid #2d2d42',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '12px',
          cursor: 'pointer'
        }}
        onClick={() => setCollapsed(false)}
        title="C++ Kod Önizlemesini Aç"
      >
        <Eye size={18} color="#00d2d3" />
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            marginTop: '16px',
            color: '#8e8ea0',
            fontSize: '11px',
            letterSpacing: '1px'
          }}
        >
          C++ KODU
        </span>
      </div>
    );
  }

  const lines = code.split('\n');

  return (
    <div
      style={{
        width: '380px',
        height: '100%',
        backgroundColor: '#161622',
        borderLeft: '1px solid #2d2d42',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Code Header */}
      <div
        style={{
          height: '38px',
          backgroundColor: '#1e1e2f',
          borderBottom: '1px solid #2d2d42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Code size={15} color="#00d2d3" />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e0e0e0' }}>
            C++ Kodu (Arduino / ESP32)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleCopy}
            title="Kodu Kopyala"
            style={{
              background: 'none',
              border: 'none',
              color: copied ? '#1dd1a1' : '#a4b0be',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              padding: '4px 6px',
              borderRadius: '4px',
              backgroundColor: '#262638'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>

          <button
            onClick={() => setCollapsed(true)}
            title="Kodu Gizle"
            style={{
              background: 'none',
              border: 'none',
              color: '#a4b0be',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <EyeOff size={15} />
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '10px 0',
          fontFamily: "'Fira Code', Consolas, Monaco, 'Courier New', monospace",
          fontSize: '11.5px',
          lineHeight: '18px',
          backgroundColor: '#111119'
        }}
      >
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} style={{ verticalAlign: 'top' }}>
                <td
                  style={{
                    width: '36px',
                    textAlign: 'right',
                    paddingRight: '12px',
                    color: '#576574',
                    userSelect: 'none',
                    fontSize: '10.5px'
                  }}
                >
                  {idx + 1}
                </td>
                <td style={{ color: getSyntaxColor(line), whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingRight: '12px' }}>
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function getSyntaxColor(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith('//')) return '#7f8c8d'; // Comment
  if (trimmed.startsWith('#include') || trimmed.startsWith('#define')) return '#e056fd'; // Preprocessor
  if (trimmed.startsWith('void') || trimmed.startsWith('int') || trimmed.startsWith('long') || trimmed.startsWith('bool') || trimmed.startsWith('float') || trimmed.startsWith('auto') || trimmed.startsWith('String')) return '#54a0ff'; // Types
  if (trimmed.includes('setup()') || trimmed.includes('loop()')) return '#00d2d3'; // Main functions
  if (trimmed.startsWith('for') || trimmed.startsWith('while') || trimmed.startsWith('if') || trimmed.startsWith('else')) return '#ff9f43'; // Control
  if (trimmed.includes('digitalWrite') || trimmed.includes('analogWrite') || trimmed.includes('delay') || trimmed.includes('pinMode')) return '#1dd1a1'; // Arduino functions
  return '#c8d6e5';
}
