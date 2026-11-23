import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import * as Tr from 'blockly/msg/tr';
import 'blockly/blocks'; // Standard blocks
import { DENEYAP_TOOLBOX } from './toolbox/toolboxDefinition';
import { registerDeneyapBlocks } from './blocks/deneyapBlocks';
import { registerDeneyapGenerators } from './generators/deneyapGenerators';
import { registerStandardGenerators } from './generators/standardGenerators';
import { cppGenerator } from './generators/cppGenerator';

// Set language to Turkish
Blockly.setLocale(Tr as any);

// Register blocks & generators once
registerDeneyapBlocks();
registerDeneyapGenerators();
registerStandardGenerators();

interface BlocklyComponentProps {
  onCodeChange: (code: string) => void;
  onWorkspaceChange?: (jsonState: any) => void;
  initialState?: any;
}

export interface BlocklyComponentHandle {
  getWorkspaceJson: () => any;
  loadWorkspaceJson: (state: any) => void;
  clearWorkspace: () => void;
}

export const BlocklyComponent = React.forwardRef<BlocklyComponentHandle, BlocklyComponentProps>(
  ({ onCodeChange, onWorkspaceChange, initialState }, ref) => {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    React.useImperativeHandle(ref, () => ({
      getWorkspaceJson: () => {
        if (!workspaceRef.current) return null;
        return Blockly.serialization.workspaces.save(workspaceRef.current);
      },
      loadWorkspaceJson: (state: any) => {
        if (!workspaceRef.current || !state) return;
        Blockly.serialization.workspaces.load(state, workspaceRef.current);
      },
      clearWorkspace: () => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
        }
      }
    }));

    useEffect(() => {
      if (!blocklyDiv.current) return;

      // Inject Blockly
      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox: DENEYAP_TOOLBOX,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#cbd5e1',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        }
      });

      workspaceRef.current = workspace;

      // Load initial state if provided
      if (initialState) {
        try {
          Blockly.serialization.workspaces.load(initialState, workspace);
        } catch (e) {
          console.warn('Initial state could not be loaded:', e);
        }
      } else {
        // Create initial default starter blocks: Deneyap Kurulum & Döngü with blink LED
        try {
          const starterJson = {
            blocks: {
              languageVersion: 0,
              blocks: [
                {
                  type: 'deneyap_kurulum_dongu',
                  x: 60,
                  y: 50,
                  inputs: {
                    LOOP: {
                      block: {
                        type: 'deneyap_digital_write',
                        fields: {
                          PIN: 'D10',
                          STATE: 'HIGH'
                        },
                        next: {
                          block: {
                            type: 'deneyap_delay',
                            inputs: {
                              DELAY_MS: {
                                shadow: {
                                  type: 'math_number',
                                  fields: { NUM: 1000 }
                                }
                              }
                            },
                            next: {
                              block: {
                                type: 'deneyap_digital_write',
                                fields: {
                                  PIN: 'D10',
                                  STATE: 'LOW'
                                },
                                next: {
                                  block: {
                                    type: 'deneyap_delay',
                                    inputs: {
                                      DELAY_MS: {
                                        shadow: {
                                          type: 'math_number',
                                          fields: { NUM: 1000 }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              ]
            }
          };
          Blockly.serialization.workspaces.load(starterJson, workspace);
        } catch (e) {
          console.error('Default blocks error:', e);
        }
      }

      // Initial code generation
      const initialCode = cppGenerator.workspaceToCode(workspace);
      onCodeChange(initialCode);

      // Listen for workspace changes
      const changeListener = () => {
        const code = cppGenerator.workspaceToCode(workspace);
        onCodeChange(code);

        if (onWorkspaceChange) {
          const jsonState = Blockly.serialization.workspaces.save(workspace);
          onWorkspaceChange(jsonState);
        }
      };

      workspace.addChangeListener(changeListener);

      const handleResize = () => {
        Blockly.svgResize(workspace);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        workspace.dispose();
      };
    }, []);

    return (
      <div
        ref={blocklyDiv}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    );
  }
);
