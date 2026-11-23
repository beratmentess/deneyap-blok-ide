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

  (cppGenerator as any).forBlock['logic_null'] = function () {
    return ['NULL', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['controls_flow_statements'] = function (block: any) {
    const flow = block.getFieldValue('FLOW');
    return flow === 'BREAK' ? 'break;\n' : 'continue;\n';
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

  (cppGenerator as any).forBlock['math_single'] = function (block: any) {
    const op = block.getFieldValue('OP');
    const arg = cppGenerator.valueToCode(block, 'NUM', cppGenerator.ORDER_NONE) || '0';
    switch (op) {
      case 'ROOT': return [`sqrt(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'ABS': return [`abs(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'NEG': return [`(-(${arg}))`, cppGenerator.ORDER_UNARY_PREFIX];
      case 'LN': return [`log(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'LOG10': return [`log10(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'EXP': return [`exp(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'POW10': return [`pow(10, ${arg})`, cppGenerator.ORDER_ATOMIC];
      default: return [`(${arg})`, cppGenerator.ORDER_ATOMIC];
    }
  };

  (cppGenerator as any).forBlock['math_round'] = function (block: any) {
    const op = block.getFieldValue('OP');
    const arg = cppGenerator.valueToCode(block, 'NUM', cppGenerator.ORDER_NONE) || '0';
    switch (op) {
      case 'ROUND': return [`round(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'ROUNDUP': return [`ceil(${arg})`, cppGenerator.ORDER_ATOMIC];
      case 'ROUNDDOWN': return [`floor(${arg})`, cppGenerator.ORDER_ATOMIC];
      default: return [`round(${arg})`, cppGenerator.ORDER_ATOMIC];
    }
  };

  (cppGenerator as any).forBlock['math_trig'] = function (block: any) {
    const op = block.getFieldValue('OP');
    const arg = cppGenerator.valueToCode(block, 'NUM', cppGenerator.ORDER_NONE) || '0';
    switch (op) {
      case 'SIN': return [`sin(${arg} * PI / 180.0)`, cppGenerator.ORDER_ATOMIC];
      case 'COS': return [`cos(${arg} * PI / 180.0)`, cppGenerator.ORDER_ATOMIC];
      case 'TAN': return [`tan(${arg} * PI / 180.0)`, cppGenerator.ORDER_ATOMIC];
      case 'ASIN': return [`(asin(${arg}) * 180.0 / PI)`, cppGenerator.ORDER_ATOMIC];
      case 'ACOS': return [`(acos(${arg}) * 180.0 / PI)`, cppGenerator.ORDER_ATOMIC];
      case 'ATAN': return [`(atan(${arg}) * 180.0 / PI)`, cppGenerator.ORDER_ATOMIC];
      default: return [`sin(${arg})`, cppGenerator.ORDER_ATOMIC];
    }
  };

  (cppGenerator as any).forBlock['math_constant'] = function (block: any) {
    const c = block.getFieldValue('CONSTANT');
    switch (c) {
      case 'PI': return ['PI', cppGenerator.ORDER_ATOMIC];
      case 'E': return ['2.718281828459', cppGenerator.ORDER_ATOMIC];
      case 'GOLDEN_RATIO': return ['1.61803398875', cppGenerator.ORDER_ATOMIC];
      case 'SQRT2': return ['1.41421356237', cppGenerator.ORDER_ATOMIC];
      case 'SQRT1_2': return ['0.70710678118', cppGenerator.ORDER_ATOMIC];
      case 'INFINITY': return ['INFINITY', cppGenerator.ORDER_ATOMIC];
      default: return ['0', cppGenerator.ORDER_ATOMIC];
    }
  };

  (cppGenerator as any).forBlock['math_number_property'] = function (block: any) {
    const num = cppGenerator.valueToCode(block, 'NUMBER_TO_CHECK', cppGenerator.ORDER_NONE) || '0';
    const prop = block.getFieldValue('PROPERTY');
    switch (prop) {
      case 'EVEN': return [`(${num} % 2 == 0)`, cppGenerator.ORDER_EQUALITY];
      case 'ODD': return [`(${num} % 2 != 0)`, cppGenerator.ORDER_EQUALITY];
      case 'POSITIVE': return [`(${num} > 0)`, cppGenerator.ORDER_RELATIONAL];
      case 'NEGATIVE': return [`(${num} < 0)`, cppGenerator.ORDER_RELATIONAL];
      case 'WHOLE': return [`(floor(${num}) == ${num})`, cppGenerator.ORDER_EQUALITY];
      case 'DIVISIBLE_BY':
        const div = cppGenerator.valueToCode(block, 'DIVISOR', cppGenerator.ORDER_NONE) || '1';
        return [`(${num} % ${div} == 0)`, cppGenerator.ORDER_EQUALITY];
      default: return ['true', cppGenerator.ORDER_ATOMIC];
    }
  };

  (cppGenerator as any).forBlock['math_modulo'] = function (block: any) {
    const a = cppGenerator.valueToCode(block, 'DIVIDEND', cppGenerator.ORDER_NONE) || '0';
    const b = cppGenerator.valueToCode(block, 'DIVISOR', cppGenerator.ORDER_NONE) || '1';
    return [`(${a} % ${b})`, cppGenerator.ORDER_MULTIPLICATIVE];
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

  (cppGenerator as any).forBlock['text_length'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_NONE) || '""';
    return [`String(${text}).length()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['text_isEmpty'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_NONE) || '""';
    return [`(String(${text}).length() == 0)`, cppGenerator.ORDER_EQUALITY];
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

  (cppGenerator as any).forBlock['procedures_ifreturn'] = function (block: any) {
    const condition = cppGenerator.valueToCode(block, 'CONDITION', cppGenerator.ORDER_NONE) || 'false';
    let code = `if (${condition}) {\n`;
    if (block.hasReturnValue_) {
      const value = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_NONE) || '0';
      code += `  return ${value};\n`;
    } else {
      code += '  return;\n';
    }
    code += '}\n';
    return code;
  };
}
