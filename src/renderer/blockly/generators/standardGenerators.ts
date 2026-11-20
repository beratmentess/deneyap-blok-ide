import { cppGenerator } from './cppGenerator';

export function registerStandardGenerators() {
  // Logic
  (cppGenerator as any).forBlock['controls_if'] = function (block: any) {
    let n = 0;
    let code = '';
    let branchCode = '';
    let conditionCode = '';

    do {
      conditionCode = cppGenerator.valueToCode(block, 'IF' + n, cppGenerator.ORDER_NONE) || 'false';
      branchCode = cppGenerator.statementToCode(block, 'DO' + n);
      code += (n > 0 ? ' else if (' : 'if (') + conditionCode + ') {\n' + branchCode + '}';
      n++;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
      branchCode = cppGenerator.statementToCode(block, 'ELSE');
      code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
  };

  (cppGenerator as any).forBlock['logic_compare'] = function (block: any) {
    const op = block.getFieldValue('OP');
    const order = op === 'EQ' || op === 'NEQ' ? cppGenerator.ORDER_EQUALITY : cppGenerator.ORDER_RELATIONAL;
    const a = cppGenerator.valueToCode(block, 'A', order) || '0';
    const b = cppGenerator.valueToCode(block, 'B', order) || '0';

    let opSymbol = '==';
    if (op === 'NEQ') opSymbol = '!=';
    else if (op === 'LT') opSymbol = '<';
    else if (op === 'LTE') opSymbol = '<=';
    else if (op === 'GT') opSymbol = '>';
    else if (op === 'GTE') opSymbol = '>=';

    return [`${a} ${opSymbol} ${b}`, order];
  };

  (cppGenerator as any).forBlock['logic_operation'] = function (block: any) {
    const op = block.getFieldValue('OP');
    const order = op === 'AND' ? cppGenerator.ORDER_LOGICAL_AND : cppGenerator.ORDER_LOGICAL_OR;
    const a = cppGenerator.valueToCode(block, 'A', order) || 'false';
    const b = cppGenerator.valueToCode(block, 'B', order) || 'false';
    const opSymbol = op === 'AND' ? '&&' : '||';
    return [`${a} ${opSymbol} ${b}`, order];
  };

  (cppGenerator as any).forBlock['logic_negate'] = function (block: any) {
    const a = cppGenerator.valueToCode(block, 'BOOL', cppGenerator.ORDER_UNARY_PREFIX) || 'true';
    return [`!${a}`, cppGenerator.ORDER_UNARY_PREFIX];
  };

  (cppGenerator as any).forBlock['logic_boolean'] = function (block: any) {
    const val = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [val, cppGenerator.ORDER_ATOMIC];
  };

  // Loops
  (cppGenerator as any).forBlock['controls_repeat_ext'] = function (block: any) {
    const repeats = cppGenerator.valueToCode(block, 'TIMES', cppGenerator.ORDER_ASSIGNMENT) || '0';
    const branch = cppGenerator.statementToCode(block, 'DO');
    return `for (int count = 0; count < ${repeats}; count++) {\n${branch}}\n`;
  };

  (cppGenerator as any).forBlock['controls_whileUntil'] = function (block: any) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = cppGenerator.valueToCode(block, 'BOOL', until ? cppGenerator.ORDER_UNARY_PREFIX : cppGenerator.ORDER_NONE) || 'false';
    const branch = cppGenerator.statementToCode(block, 'DO');

    if (until) {
      argument0 = '!' + argument0;
    }
    return `while (${argument0}) {\n${branch}}\n`;
  };

  (cppGenerator as any).forBlock['controls_for'] = function (block: any) {
    const varField = block.getField('VAR');
    const variable = varField ? (varField.getText ? varField.getText() : varField.getValue()) : 'i';
    const safeName = String(variable).replace(/[^a-zA-Z0-9_]/g, '_') || 'i';
    const from = cppGenerator.valueToCode(block, 'FROM', cppGenerator.ORDER_ASSIGNMENT) || '0';
    const to = cppGenerator.valueToCode(block, 'TO', cppGenerator.ORDER_ASSIGNMENT) || '10';
    const by = cppGenerator.valueToCode(block, 'BY', cppGenerator.ORDER_ASSIGNMENT) || '1';
    const branch = cppGenerator.statementToCode(block, 'DO');

    return `for (int ${safeName} = ${from}; ${safeName} <= ${to}; ${safeName} += ${by}) {\n${branch}}\n`;
  };

  // Math
  (cppGenerator as any).forBlock['math_number'] = function (block: any) {
    const num = block.getFieldValue('NUM');
    return [num, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['math_arithmetic'] = function (block: any) {
    const op = block.getFieldValue('OP');
    let order = cppGenerator.ORDER_ADDITIVE;
    let opSymbol = '+';

    switch (op) {
      case 'ADD':
        opSymbol = '+';
        order = cppGenerator.ORDER_ADDITIVE;
        break;
      case 'MINUS':
        opSymbol = '-';
        order = cppGenerator.ORDER_ADDITIVE;
        break;
      case 'MULTIPLY':
        opSymbol = '*';
        order = cppGenerator.ORDER_MULTIPLICATIVE;
        break;
      case 'DIVIDE':
        opSymbol = '/';
        order = cppGenerator.ORDER_MULTIPLICATIVE;
        break;
      case 'POWER':
        const aPow = cppGenerator.valueToCode(block, 'A', cppGenerator.ORDER_NONE) || '0';
        const bPow = cppGenerator.valueToCode(block, 'B', cppGenerator.ORDER_NONE) || '0';
        return [`pow(${aPow}, ${bPow})`, cppGenerator.ORDER_ATOMIC];
    }

    const a = cppGenerator.valueToCode(block, 'A', order) || '0';
    const b = cppGenerator.valueToCode(block, 'B', order) || '0';
    return [`${a} ${opSymbol} ${b}`, order];
  };

  (cppGenerator as any).forBlock['math_random_int'] = function (block: any) {
    const from = cppGenerator.valueToCode(block, 'FROM', cppGenerator.ORDER_NONE) || '1';
    const to = cppGenerator.valueToCode(block, 'TO', cppGenerator.ORDER_NONE) || '100';
    return [`random(${from}, ${to} + 1)`, cppGenerator.ORDER_ATOMIC];
  };

  // Text
  (cppGenerator as any).forBlock['text'] = function (block: any) {
    const text = block.getFieldValue('TEXT') || '';
    return [`"${text}"`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['text_join'] = function (block: any) {
    const count = block.itemCount_;
    if (count === 0) return ['""', cppGenerator.ORDER_ATOMIC];

    const elements: string[] = [];
    for (let i = 0; i < count; i++) {
      const el = cppGenerator.valueToCode(block, 'ADD' + i, cppGenerator.ORDER_NONE) || '""';
      elements.push(`String(${el})`);
    }
    return [elements.join(' + '), cppGenerator.ORDER_ADDITIVE];
  };

  // Variables
  (cppGenerator as any).forBlock['variables_get'] = function (block: any) {
    const variable = block.getField('VAR')?.getText() || 'x';
    // Sanitize: replace spaces / Turkish chars for C++ identifier
    const safeName = variable.replace(/[^a-zA-Z0-9_]/g, '_');
    return [safeName, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['variables_set'] = function (block: any) {
    const variable = block.getField('VAR')?.getText() || 'x';
    const safeName = variable.replace(/[^a-zA-Z0-9_]/g, '_');
    const val = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_ASSIGNMENT) || '0';
    // Use int for global declaration (Arduino compatible)
    cppGenerator.addDeclaration(`var_${safeName}`, `int ${safeName};`);
    return `${safeName} = ${val};\n`;
  };

  // Functions (Procedures)
  (cppGenerator as any).forBlock['procedures_defnoreturn'] = function (block: any) {
    const funcName = block.getFieldValue('NAME');
    const branch = cppGenerator.statementToCode(block, 'STACK');
    const code = `void ${funcName}() {\n${branch}}\n`;
    cppGenerator.addFunction(funcName, code);
    return '';
  };

  (cppGenerator as any).forBlock['procedures_defreturn'] = function (block: any) {
    const funcName = block.getFieldValue('NAME');
    const branch = cppGenerator.statementToCode(block, 'STACK');
    const retVal = cppGenerator.valueToCode(block, 'RETURN', cppGenerator.ORDER_NONE) || '0';
    const code = `int ${funcName}() {\n${branch}  return ${retVal};\n}\n`;
    cppGenerator.addFunction(funcName, code);
    return '';
  };

  (cppGenerator as any).forBlock['procedures_callnoreturn'] = function (block: any) {
    const funcName = block.getFieldValue('NAME');
    return `${funcName}();\n`;
  };

  (cppGenerator as any).forBlock['procedures_callreturn'] = function (block: any) {
    const funcName = block.getFieldValue('NAME');
    return [`${funcName}()`, cppGenerator.ORDER_ATOMIC];
  };
}
