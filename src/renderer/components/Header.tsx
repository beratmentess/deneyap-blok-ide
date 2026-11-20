import React, { useState } from 'react';
import {
  FilePlus,
  FolderOpen,
  Save,
  SaveAll,
  Cpu,
  Usb,
  Play,
  Upload,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { SUPPORTED_BOARDS } from '../../core/boards/boardDefinitions';
import { SerialPortInfo } from '../../core/types';
import deneyapLogo from '../assets/deneyap-logo.png';

interface HeaderProps {
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
  ports: SerialPortInfo[];
  selectedPort: string;
  onSelectPort: (port: string) => void;
  onRefreshPorts: () => void;
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveProjectAs: () => void;
  onCompile: () => void;
  onUpload: () => void;
  onToggleSerialMonitor: () => void;
  isCompiling: boolean;
  isUploading: boolean;
  statusText: string;
  statusType: 'idle' | 'working' | 'success' | 'error';
  projectName: string;
  onProjectNameChange: (name: string) => void;
}

const HoverButton: React.FC<{
  onClick: () => void;
  title: string;
  style: React.CSSProperties;
  hoverBg?: string;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, style, hoverBg, disabled, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        ...(hovered && !disabled ? {
          backgroundColor: hoverBg || '#353550',
          transform: 'translateY(-1px)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
        } : {}),
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {})
      }}
    >
      {children}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({
  selectedBoardId,
  onSelectBoard,
  ports,
  selectedPort,
  onSelectPort,
  onRefreshPorts,
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveProjectAs,
  onCompile,
  onUpload,
  onToggleSerialMonitor,
  isCompiling,
  isUploading,
  statusText,
  statusType,
  projectName,
  onProjectNameChange
}) => {
  return (
    <header
      style={{
        height: '58px',
        background: 'linear-gradient(180deg, #1e1e32 0%, #181828 100%)',
        borderBottom: '1px solid #2d2d42',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        gap: '12px'
      }}
    >
      {/* Brand & Project Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={deneyapLogo}
            alt="Deneyap Kart"
            style={{
              width: '36px',
              height: '36px',
              objectFit: 'contain',
              borderRadius: '6px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <div>
            <div style={{
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#fff',
              letterSpacing: '0.5px',
              background: 'linear-gradient(90deg, #e74c3c, #f39c12, #3498db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Deneyap Blok IDE
            </div>
            <div style={{ fontSize: '10px', color: '#6c6c8a' }}>Tamamen Çevrimdışı</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '30px', backgroundColor: '#2d2d42' }} />

        {/* Project name input */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Proje Adı"
          style={{
            backgroundColor: '#232336',
            border: '1px solid #3d3d5c',
            borderRadius: '6px',
            padding: '5px 10px',
            color: '#fff',
            fontSize: '12px',
            outline: 'none',
            width: '130px',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#5b6abf'}
          onBlur={(e) => e.target.style.borderColor = '#3d3d5c'}
        />

        {/* File Actions */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <HoverButton onClick={onNewProject} title="Yeni Proje" style={btnStyle}>
            <FilePlus size={15} />
            Yeni
          </HoverButton>
          <HoverButton onClick={onOpenProject} title="Proje Aç (.dblock)" style={btnStyle}>
            <FolderOpen size={15} />
            Aç
          </HoverButton>
          <HoverButton onClick={onSaveProject} title="Projeyi Kaydet" style={btnStyle}>
            <Save size={15} />
            Kaydet
          </HoverButton>
          <HoverButton onClick={onSaveProjectAs} title="Farklı Kaydet" style={btnStyle}>
            <SaveAll size={15} />
            Farklı Kaydet
          </HoverButton>
        </div>
      </div>

      {/* Board & Port Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Board Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={16} color="#00d2d3" />
          <select
            value={selectedBoardId}
            onChange={(e) => onSelectBoard(e.target.value)}
            style={selectStyle}
          >
            {SUPPORTED_BOARDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Port Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Usb size={16} color="#54a0ff" />
          <select
            value={selectedPort}
            onChange={(e) => onSelectPort(e.target.value)}
            style={{ ...selectStyle, maxWidth: '160px' }}
          >
            <option value="">Port Seçilmedi</option>
            {ports.map((p) => (
              <option key={p.path} value={p.path}>
                {p.friendlyName || p.path}
              </option>
            ))}
          </select>
          <HoverButton
            onClick={onRefreshPorts}
            title="Portları Yenile"
            style={{ ...btnStyle, padding: '6px' }}
          >
            <RefreshCw size={13} />
          </HoverButton>
        </div>
      </div>

      {/* Compile, Upload, Monitor & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <HoverButton
          onClick={onCompile}
          disabled={isCompiling || isUploading}
          title="Kodu Derle"
          style={{
            ...actionBtnStyle,
            backgroundColor: isCompiling ? '#576574' : '#10ac84'
          }}
          hoverBg="#0d9270"
        >
          {isCompiling ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
          Derle
        </HoverButton>

        <HoverButton
          onClick={onUpload}
          disabled={isCompiling || isUploading}
          title="Karta Yükle"
          style={{
            ...actionBtnStyle,
            backgroundColor: isUploading ? '#576574' : '#ee5253'
          }}
          hoverBg="#d44040"
        >
          {isUploading ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
          Yükle
        </HoverButton>

        <HoverButton
          onClick={onToggleSerialMonitor}
          title="Seri Monitör"
          style={{
            ...actionBtnStyle,
            backgroundColor: '#2e86de'
          }}
          hoverBg="#2470c0"
        >
          <Terminal size={16} />
          Seri Monitör
        </HoverButton>

        {/* Status Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor:
              statusType === 'error'
                ? 'rgba(238, 82, 83, 0.15)'
                : statusType === 'success'
                ? 'rgba(16, 172, 132, 0.15)'
                : statusType === 'working'
                ? 'rgba(255, 159, 67, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${
              statusType === 'error'
                ? '#ee5253'
                : statusType === 'success'
                ? '#10ac84'
                : statusType === 'working'
                ? '#ff9f43'
                : '#3d3d5c'
            }`,
            fontSize: '11px',
            fontWeight: 500,
            color:
              statusType === 'error'
                ? '#ff6b6b'
                : statusType === 'success'
                ? '#1dd1a1'
                : statusType === 'working'
                ? '#feca57'
                : '#8e8ea0',
            transition: 'all 0.3s ease'
          }}
        >
          {statusType === 'working' && <Loader2 size={13} className="spin" />}
          {statusType === 'success' && <CheckCircle2 size={13} />}
          {statusType === 'error' && <AlertCircle size={13} />}
          {statusType === 'idle' && (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10ac84' }} />
          )}
          <span>{statusText}</span>
        </div>
      </div>
    </header>
  );
};

const btnStyle: React.CSSProperties = {
  backgroundColor: '#252538',
  border: '1px solid #3d3d5c',
  borderRadius: '6px',
  color: '#c8d6e5',
  padding: '6px 10px',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  transition: 'all 0.2s ease'
};

const actionBtnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '8px',
  color: '#ffffff',
  padding: '8px 16px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  transition: 'all 0.2s ease'
};

const selectStyle: React.CSSProperties = {
  backgroundColor: '#252538',
  border: '1px solid #3d3d5c',
  borderRadius: '6px',
  color: '#fff',
  padding: '6px 8px',
  fontSize: '12px',
  outline: 'none',
  cursor: 'pointer'
};
