import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, RotateCcw, Sparkles, Download, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeEditorViewProps {
  code: string;
  onChange: (code: string) => void;
  onSyncFromBlocks: () => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  code,
  onChange,
  onSyncFromBlocks
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // default light like official Deneyap web

  const lines = code.split('\n');

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor position (Line & Column)
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = code.substring(0, pos);
    const lineIndex = textBefore.split('\n').length;
    const lastLine = textBefore.split('\n').pop() || '';
    setCursorPos({ line: lineIndex, col: lastLine.length + 1 });
  };

  // Keyboard shortcut handlers for enhanced code editing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Tab key -> Insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateCursorPosition();
      }, 0);
      return;
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const textBefore = code.substring(0, start);
      const currentLine = textBefore.split('\n').pop() || '';
      const match = currentLine.match(/^(\s*)/);
      const indent = match ? match[1] : '';

      // If current line ends with '{', add extra 2 spaces indent
      const extraIndent = currentLine.trim().endsWith('{') ? '  ' : '';
      const totalIndent = indent + extraIndent;

      if (totalIndent.length > 0) {
        e.preventDefault();
        const end = textarea.selectionEnd;
        const insertText = '\n' + totalIndent;
        const newCode = code.substring(0, start) + insertText + code.substring(end);
        onChange(newCode);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
          updateCursorPosition();
        }, 0);
        return;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertStarterTemplate = () => {
    if (confirm('Mevcut kod standart setup() / loop() şablonu ile değiştirilecek. Onaylıyor musunuz?')) {
      const template = `// Deneyap Kart C++ / Arduino Kodu
void setup() {
  // Kurulum kodları burada tek sefer çalışır
}

void loop() {
  // Ana döngü kodları burada sürekli çalışır
}
`;
      onChange(template);
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: isLight ? '#ffffff' : '#14141e',
        color: isLight ? '#0f172a' : '#f8fafc',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* Top Editor Control Toolbar */}
      <div
        style={{
          height: '42px',
          backgroundColor: isLight ? '#f8fafc' : '#1c1c2b',
          borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid #2d2d42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          gap: '12px'
        }}
      >
        {/* Left: Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)',
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '12px',
              border: '1px solid #fca5a5'
            }}
          >
            <FileCode size={15} />
            C++ / Arduino Metin Kod Editörü
          </div>
          <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#94a3b8' }}>
            (Blok yerine doğrudan C++ kodu yazabilir, düzenleyebilir ve karta yükleyebilirsiniz)
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Sync from Blocks */}
          <button
            onClick={() => {
              if (confirm('Mevcut bloklardaki C++ kodu editöre aktarılacak. Onaylıyor musunuz?')) {
                onSyncFromBlocks();
              }
            }}
            title="Bloklardaki güncel C++ kodunu editöre aktar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: isLight ? '#1e293b' : '#e2e8f0',
              backgroundColor: isLight ? '#e2e8f0' : '#2d2d42',
              border: isLight ? '1px solid #cbd5e1' : '1px solid #3d3d5c',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            Bloklardan Kodu Al
          </button>

          {/* Starter Template */}
          <button
            onClick={handleInsertStarterTemplate}
            title="Temel setup() ve loop() şablonu yerleştir"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: isLight ? '#1e293b' : '#e2e8f0',
              backgroundColor: isLight ? '#e2e8f0' : '#2d2d42',
              border: isLight ? '1px solid #cbd5e1' : '1px solid #3d3d5c',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} />
            Şablon Yükle
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Tüm Kodu Kopyala"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: copied ? '#16a34a' : isLight ? '#1e293b' : '#e2e8f0',
              backgroundColor: copied ? '#dcfce7' : isLight ? '#e2e8f0' : '#2d2d42',
              border: isLight ? '1px solid #cbd5e1' : '1px solid #3d3d5c',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            title="Açık / Karanlık Tema Değiştir"
            style={{
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: isLight ? '#0284c7' : '#38bdf8',
              backgroundColor: isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.1)',
              border: isLight ? '1px solid #bae6fd' : '1px solid #0284c7',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {isLight ? '🌙 Karanlık Mod' : '☀️ Açık Mod'}
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Textarea */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: isLight ? '#ffffff' : '#14141e'
        }}
      >
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          style={{
            width: '56px',
            backgroundColor: isLight ? '#f8fafc' : '#181824',
            borderRight: isLight ? '1px solid #e2e8f0' : '1px solid #28283c',
            color: isLight ? '#94a3b8' : '#575778',
            fontFamily: "Consolas, 'Courier New', 'Fira Code', monospace",
            fontSize: '14px',
            lineHeight: '22px',
            paddingTop: '12px',
            paddingBottom: '12px',
            textAlign: 'right',
            paddingRight: '12px',
            userSelect: 'none',
            overflow: 'hidden'
          }}
        >
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isCurrent = lineNum === cursorPos.line;
            return (
              <div
                key={i}
                style={{
                  height: '22px',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  color: isCurrent ? (isLight ? '#0f172a' : '#38bdf8') : undefined
                }}
              >
                {lineNum}-
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => {
            onChange(e.target.value);
            updateCursorPosition();
          }}
          onScroll={handleScroll}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: '12px 16px',
            fontFamily: "Consolas, 'Courier New', 'Fira Code', monospace",
            fontSize: '14px',
            lineHeight: '22px',
            color: isLight ? '#0f172a' : '#f8fafc',
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'auto',
            overflowY: 'auto',
            tabSize: 2
          }}
        />
      </div>

      {/* Bottom Status Bar for Code Editor */}
      <div
        style={{
          height: '26px',
          backgroundColor: isLight ? '#f1f5f9' : '#181824',
          borderTop: isLight ? '1px solid #e2e8f0' : '1px solid #28283c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontSize: '11px',
          color: isLight ? '#64748b' : '#94a3b8'
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Satır: <strong>{cursorPos.line}</strong>, Sütun: <strong>{cursorPos.col}</strong></span>
          <span>Toplam: <strong>{lines.length}</strong> satır</span>
          <span>Karakter: <strong>{code.length}</strong></span>
        </div>
        <div>
          <span>C++ / Arduino IDE Uyumlu • UTF-8</span>
        </div>
      </div>
    </div>
  );
};
