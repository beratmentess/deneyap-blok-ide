import * as Blockly from 'blockly/core';

export class CppGenerator extends Blockly.Generator {
  public includes: Set<string> = new Set();
  public declarations: Map<string, string> = new Map();
  public setups: Map<string, string> = new Map();
  public userFunctions: Map<string, string> = new Map();

  constructor() {
    super('CPP');

    // Register operator precedences
    this.ORDER_ATOMIC = 0;
    this.ORDER_UNARY_POSTFIX = 1;
    this.ORDER_UNARY_PREFIX = 2;
    this.ORDER_MULTIPLICATIVE = 3;
    this.ORDER_ADDITIVE = 4;
    this.ORDER_SHIFT = 5;
    this.ORDER_RELATIONAL = 6;
    this.ORDER_EQUALITY = 7;
    this.ORDER_BITWISE_AND = 8;
    this.ORDER_BITWISE_XOR = 9;
    this.ORDER_BITWISE_OR = 10;
    this.ORDER_LOGICAL_AND = 11;
    this.ORDER_LOGICAL_OR = 12;
    this.ORDER_CONDITIONAL = 13;
    this.ORDER_ASSIGNMENT = 14;
    this.ORDER_COMMA = 15;
    this.ORDER_NONE = 99;
  }

  // Precedences
  public ORDER_ATOMIC: number;
  public ORDER_UNARY_POSTFIX: number;
  public ORDER_UNARY_PREFIX: number;
  public ORDER_MULTIPLICATIVE: number;
  public ORDER_ADDITIVE: number;
  public ORDER_SHIFT: number;
  public ORDER_RELATIONAL: number;
  public ORDER_EQUALITY: number;
  public ORDER_BITWISE_AND: number;
  public ORDER_BITWISE_XOR: number;
  public ORDER_BITWISE_OR: number;
  public ORDER_LOGICAL_AND: number;
  public ORDER_LOGICAL_OR: number;
  public ORDER_CONDITIONAL: number;
  public ORDER_ASSIGNMENT: number;
  public ORDER_COMMA: number;
  public ORDER_NONE: number;

  public addInclude(key: string, includeCode: string) {
    this.includes.add(includeCode);
  }

  public addDeclaration(key: string, code: string) {
    this.declarations.set(key, code);
  }

  public addSetup(key: string, code: string) {
    this.setups.set(key, code);
  }

  public addFunction(key: string, code: string) {
    this.userFunctions.set(key, code);
  }

  public resetGenerator() {
    this.includes.clear();
    this.declarations.clear();
    this.setups.clear();
    this.userFunctions.clear();

    // Default include
    this.includes.add('#include <Arduino.h>');
  }

  /**
   * scrub_ is called by Blockly's blockToCode to handle
   * the "next" (bottom) connection of statement blocks.
   * Without this, only the first block in a chain produces code.
   */
  public scrub_(block: Blockly.Block, code: string, _opt_thisOnly?: boolean): string {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !_opt_thisOnly) {
      const nextCode = this.blockToCode(nextBlock);
      if (typeof nextCode === 'string') {
        return code + nextCode;
      } else if (Array.isArray(nextCode)) {
        return code + nextCode[0];
      }
    }
    return code;
  }

  public workspaceToCode(workspace: Blockly.Workspace): string {
    this.resetGenerator();

    if (!workspace) return '';

    const topBlocks = workspace.getTopBlocks(true);
    let loopCode = '';
    let explicitSetupCode = '';

    for (const block of topBlocks) {
      if (!block.isEnabled()) continue;

      // Check if this is the main Deneyap Kurulum/Döngü block
      if (block.type === 'deneyap_kurulum_dongu') {
        const setupStatements = this.statementToCode(block, 'SETUP');
        if (setupStatements.trim().length > 0) {
          explicitSetupCode += setupStatements;
        }
        const loopStatements = this.statementToCode(block, 'LOOP');
        if (loopStatements.trim().length > 0) {
          loopCode += loopStatements;
        }
        continue;
      }

      // Check if this is the Tanımlama (global definitions) block
      if (block.type === 'deneyap_tanimlama') {
        const declStatements = this.statementToCode(block, 'DECL');
        if (declStatements.trim().length > 0) {
          this.addDeclaration('tanimlama_block', declStatements);
        }
        continue;
      }

      // Any other top-level blocks
      const line = this.blockToCode(block);
      if (typeof line === 'string') {
        loopCode += line;
      } else if (Array.isArray(line)) {
        loopCode += line[0];
      }
    }

    // Build the complete C++ sketch
    let fullSketch = '// ==================================================\n';
    fullSketch += '// Deneyap Blok IDE ile Otomatik Oluşturulmuştur\n';
    fullSketch += '// ==================================================\n\n';

    // 1. Includes
    for (const inc of this.includes) {
      fullSketch += `${inc}\n`;
    }
    fullSketch += '\n';

    // 2. Global declarations
    if (this.declarations.size > 0) {
      fullSketch += '// --- Değişkenler ve Modül Tanımları ---\n';
      for (const [, decl] of this.declarations) {
        fullSketch += `${decl}\n`;
      }
      fullSketch += '\n';
    }

    // 3. User functions
    if (this.userFunctions.size > 0) {
      fullSketch += '// --- Kullanıcı Fonksiyonları ---\n';
      for (const [, func] of this.userFunctions) {
        fullSketch += `${func}\n`;
      }
      fullSketch += '\n';
    }

    // 4. Setup function
    fullSketch += 'void setup() {\n';
    if (this.setups.size > 0) {
      for (const [, setupLine] of this.setups) {
        fullSketch += `  ${setupLine}\n`;
      }
    }
    if (explicitSetupCode.trim().length > 0) {
      const indentedSetup = explicitSetupCode
        .split('\n')
        .map((l) => (l.trim().length > 0 ? `  ${l}` : ''))
        .join('\n');
      fullSketch += `${indentedSetup}\n`;
    }
    fullSketch += '}\n\n';

    // 5. Loop function
    fullSketch += 'void loop() {\n';
    if (loopCode.trim().length > 0) {
      const indented = loopCode
        .split('\n')
        .map((l) => (l.trim().length > 0 ? `  ${l}` : ''))
        .join('\n');
      fullSketch += `${indented}\n`;
    }
    fullSketch += '}\n';

    return fullSketch;
  }
}

export const cppGenerator = new CppGenerator();
