import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BlocklyComponent, BlocklyComponentHandle } from './blockly/BlocklyComponent';
import { CodePreview } from './components/CodePreview';
import { CodeEditorView } from './components/CodeEditorView';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { SerialMonitorModal } from './components/SerialMonitorModal';
import { SerialPortInfo, ProjectData, ToolchainStatus } from '../core/types';
import { getBoardById } from '../core/boards/boardDefinitions';

export const App: React.FC = () => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('deneyapkart');
  const [ports, setPorts] = useState<SerialPortInfo[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>('');
  const [cppCode, setCppCode] = useState<string>('');
  const [viewMode, setViewMode] = useState<'blocks' | 'code'>('blocks');
  const [manualCode, setManualCode] = useState<string>(
    `// ==================================================\n// Deneyap Kart C++ / Arduino Kodu\n// ==================================================\n\nvoid setup() {\n  // Kurulum kodları burada tek sefer çalışır\n}\n\nvoid loop() {\n  // Ana döngü kodları burada sürekli çalışır\n}\n`
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Hazır');
  const [statusType, setStatusType] = useState<'idle' | 'working' | 'success' | 'error'>('idle');
  const [serialMonitorOpen, setSerialMonitorOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('DeneyapProjem');

  const blocklyRef = useRef<BlocklyComponentHandle>(null);

  // Active code is manualCode when in 'code' view, or cppCode when in 'blocks' view
  const activeCode = viewMode === 'code' ? manualCode : cppCode;

  // Load available serial ports
  const refreshPorts = async () => {
    try {
      const portList = await (window as any).electronAPI?.listPorts();
      if (Array.isArray(portList)) {
        setPorts(portList);
        // Auto select first port or preferred Deneyap port if not already selected
        if (!selectedPort && portList.length > 0) {
          const deneyapPort = portList.find((p: any) => p.friendlyName?.includes('Deneyap'));
          setSelectedPort(deneyapPort ? deneyapPort.path : portList[0].path);
        }
      }
    } catch (err) {
      console.error('Portlar alınamadı:', err);
    }
  };

  useEffect(() => {
    refreshPorts();
    const interval = setInterval(refreshPorts, 3000);

    // Check toolchain status on launch
    (window as any).electronAPI?.getToolchainStatus().then((status: ToolchainStatus) => {
      if (!status?.isReady) {
        addLog(`[UYARI] Lokal derleyici eksik bileşenler:\n${status?.missingComponents?.join('\n')}\n`);
      } else {
        addLog(`[BİLGİ] Offline Toolchain hazır (${status.deneyapCoreVersion})\n`);
      }
    });

    // Listen for build logs from main process
    const cleanupLog = (window as any).electronAPI?.onBuildLog((log: string) => {
      addLog(log);
    });

    return () => {
      clearInterval(interval);
      if (cleanupLog) cleanupLog();
    };
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const handleToggleViewMode = () => {
    if (viewMode === 'blocks') {
      if (cppCode.trim().length > 0) {
        setManualCode(cppCode);
      }
      setViewMode('code');
      addLog('[BİLGİ] C++ Metin Kod Yazma Moduna geçildi. Kodunuzu doğrudan yazabilir ve karta yükleyebilirsiniz.\n');
    } else {
      setViewMode('blocks');
      addLog('[BİLGİ] Blok Tabanlı Editör Moduna geçildi.\n');
    }
  };

  const handleCompile = async () => {
    if (isCompiling || isUploading) return;
    setIsCompiling(true);
    setStatusText('Derleniyor...');
    setStatusType('working');
    addLog(`\n================== DERLEME BAŞLADI ==================\n`);
    addLog(`[BİLGİ] Mod: ${viewMode === 'code' ? 'Metin C++ Editörü' : 'Blok Editörü'}\n`);

    try {
      const result = await (window as any).electronAPI?.compile({
        boardId: selectedBoardId,
        code: activeCode
      });

      if (result?.success) {
        setStatusText('Derleme Başarılı');
        setStatusType('success');
      } else {
        setStatusText('Derleme Hatası');
        setStatusType('error');
      }
    } catch (err: any) {
      addLog(`[KRİTİK HATA] ${err.message}\n`);
      setStatusText('Hata Oluştu');
      setStatusType('error');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleUpload = async () => {
    if (isCompiling || isUploading) return;
    if (!selectedPort) {
      alert('Lütfen karta yükleme yapabilmek için üst bardan bir COM Portu seçin!');
      return;
    }

    setIsUploading(true);
    setStatusText('Yükleniyor...');
    setStatusType('working');
    addLog(`\n================== YÜKLEME BAŞLADI ==================\n`);
    addLog(`[BİLGİ] Mod: ${viewMode === 'code' ? 'Metin C++ Editörü' : 'Blok Editörü'}\n`);

    try {
      const result = await (window as any).electronAPI?.upload({
        boardId: selectedBoardId,
        port: selectedPort,
        code: activeCode
      });

      if (result?.success) {
        setStatusText('Yükleme Başarılı');
        setStatusType('success');
      } else {
        setStatusText('Yükleme Hatası');
        setStatusType('error');
      }
    } catch (err: any) {
      addLog(`[KRİTİK HATA] ${err.message}\n`);
      setStatusText('Hata Oluştu');
      setStatusType('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewProject = () => {
    if (confirm('Mevcut proje temizlenecek. Devam etmek istiyor musunuz?')) {
      blocklyRef.current?.clearWorkspace();
      setManualCode(`// Deneyap Kart C++ / Arduino Kodu\nvoid setup() {\n  // Kurulum kodları\n}\n\nvoid loop() {\n  // Ana döngü kodları\n}\n`);
      setProjectName('YeniProje');
      setLogs([]);
      setStatusText('Hazır');
      setStatusType('idle');
    }
  };

  const getProjectData = (): ProjectData => {
    const state = blocklyRef.current?.getWorkspaceJson();
    return {
      version: '1.0.0',
      name: projectName,
      boardId: selectedBoardId,
      workspaceState: state,
      cppCode: activeCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSaveProject = async () => {
    const projectData = getProjectData();
    const res = await (window as any).electronAPI?.saveProject(projectData);
    if (res?.success) {
      addLog(`[BİLGİ] Proje başarıyla kaydedildi: ${res.filePath}\n`);
    }
  };

  const handleSaveProjectAs = async () => {
    const projectData = getProjectData();
    const res = await (window as any).electronAPI?.saveProjectAs(projectData);
    if (res?.success) {
      addLog(`[BİLGİ] Proje farklı kaydedildi: ${res.filePath}\n`);
    }
  };

  const handleOpenProject = async () => {
    const res = await (window as any).electronAPI?.loadProject();
    if (res?.success && res.data) {
      const data: ProjectData = res.data;
      if (data.name) setProjectName(data.name);
      if (data.boardId) setSelectedBoardId(data.boardId);
      if (data.workspaceState) {
        blocklyRef.current?.loadWorkspaceJson(data.workspaceState);
      }
      if (data.cppCode) {
        setManualCode(data.cppCode);
      }
      addLog(`[BİLGİ] "${data.name}" projesi başarıyla açıldı.\n`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        overflow: 'hidden'
      }}
    >
      {/* Top Header */}
      <Header
        selectedBoardId={selectedBoardId}
        onSelectBoard={(id) => {
          setSelectedBoardId(id);
          const board = getBoardById(id);
          addLog(`[BİLGİ] Kart değiştirildi: ${board.name} (${board.chip})\n`);
        }}
        ports={ports}
        selectedPort={selectedPort}
        onSelectPort={setSelectedPort}
        onRefreshPorts={refreshPorts}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onSaveProjectAs={handleSaveProjectAs}
        onCompile={handleCompile}
        onUpload={handleUpload}
        onToggleSerialMonitor={() => setSerialMonitorOpen(!serialMonitorOpen)}
        isCompiling={isCompiling}
        isUploading={isUploading}
        statusText={statusText}
        statusType={statusType}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />

      {/* Main Center Area: Blok Editörü VEYA Tam Metin Kod Editörü */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {viewMode === 'blocks' ? (
          <>
            <div style={{ flex: 1, height: '100%', position: 'relative' }}>
              <BlocklyComponent
                ref={blocklyRef}
                onCodeChange={(code) => setCppCode(code)}
              />
            </div>
            <CodePreview code={cppCode} />
          </>
        ) : (
          <div style={{ flex: 1, height: '100%', position: 'relative' }}>
            <CodeEditorView
              code={manualCode}
              onChange={(newCode) => setManualCode(newCode)}
              onSyncFromBlocks={() => {
                if (cppCode.trim().length > 0) {
                  setManualCode(cppCode);
                  addLog('[BİLGİ] Bloklardaki C++ kodu metin editörüne aktarıldı.\n');
                } else {
                  alert('Henüz bloklardan üretilmiş C++ kodu bulunmuyor.');
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Console Terminal */}
      <ConsoleTerminal
        logs={logs}
        onClear={() => setLogs([])}
      />

      {/* Serial Monitor Modal */}
      <SerialMonitorModal
        isOpen={serialMonitorOpen}
        onClose={() => setSerialMonitorOpen(false)}
        ports={ports}
        selectedPort={selectedPort}
        onSelectPort={setSelectedPort}
      />
    </div>
  );
};
