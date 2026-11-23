import { cppGenerator } from './cppGenerator';

export function registerDeneyapGenerators() {
  // ==========================================
  // 1. ☪ Deneyap
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_include'] = function () {
    cppGenerator.addInclude('deneyap_core', '#include <deneyap.h>');
    return '';
  };

  (cppGenerator as any).forBlock['deneyap_pin_array'] = function (block: any) {
    const pins = block.getFieldValue('PINS') || 'D0, D1, D4, D5';
    cppGenerator.addDeclaration('pin_array', `const int deneyap_pins[] = { ${pins} };`);
    return '';
  };

  (cppGenerator as any).forBlock['deneyap_tanimlama'] = function (block: any) {
    const code = cppGenerator.statementToCode(block, 'DECL');
    cppGenerator.addDeclaration('tanimlama_block', code);
    return '';
  };

  (cppGenerator as any).forBlock['deneyap_kurulum_dongu'] = function () {
    // Processed directly in cppGenerator.workspaceToCode
    return '';
  };

  (cppGenerator as any).forBlock['deneyap_raw_code_stmt'] = function (block: any) {
    const code = block.getFieldValue('CODE') || '';
    return `${code}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_raw_code_expr'] = function (block: any) {
    const code = block.getFieldValue('CODE') || '0';
    return [code, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_to_hex'] = function (block: any) {
    const val = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_NONE) || '0';
    return [`String(${val}, HEX)`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_button_read'] = function () {
    cppGenerator.addSetup('pinMode_GPKEY', 'pinMode(GPKEY, INPUT_PULLUP);');
    return ['(!digitalRead(GPKEY))', cppGenerator.ORDER_LOGICAL_AND];
  };

  // ==========================================
  // 2. ⇆ Mantık
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_logic_constant'] = function (block: any) {
    const val = block.getFieldValue('VAL');
    return [val, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_switch_case'] = function (block: any) {
    const expr = cppGenerator.valueToCode(block, 'EXPR', cppGenerator.ORDER_NONE) || '0';
    const c1Val = cppGenerator.valueToCode(block, 'CASE1_VAL', cppGenerator.ORDER_NONE) || '1';
    const c1Do = cppGenerator.statementToCode(block, 'CASE1_DO');
    const c2Val = cppGenerator.valueToCode(block, 'CASE2_VAL', cppGenerator.ORDER_NONE) || '2';
    const c2Do = cppGenerator.statementToCode(block, 'CASE2_DO');
    const defDo = cppGenerator.statementToCode(block, 'DEFAULT_DO');

    return `switch (${expr}) {\n  case ${c1Val}:\n${c1Do}    break;\n  case ${c2Val}:\n${c2Do}    break;\n  default:\n${defDo}    break;\n}\n`;
  };

  // ==========================================
  // 3. ⏱ Zaman
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_delay_unit'] = function (block: any) {
    const time = cppGenerator.valueToCode(block, 'TIME', cppGenerator.ORDER_NONE) || '1000';
    const unit = block.getFieldValue('UNIT');
    if (unit === 'MICROS') {
      return `delayMicroseconds(${time});\n`;
    }
    return `delay(${time});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_delay'] = function (block: any) {
    const delayMs = cppGenerator.valueToCode(block, 'DELAY_MS', cppGenerator.ORDER_NONE) || '1000';
    return `delay(${delayMs});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_interval'] = function (block: any) {
    const interval = block.getFieldValue('INTERVAL') || 1000;
    const unit = block.getFieldValue('UNIT');
    const branch = cppGenerator.statementToCode(block, 'DO');
    const timeFunc = unit === 'MICROS' ? 'micros()' : 'millis()';
    const varName = `prev_time_${Math.floor(Math.random() * 100000)}`;

    cppGenerator.addDeclaration(varName, `unsigned long ${varName} = 0;`);
    return `if (${timeFunc} - ${varName} >= ${interval}) {\n  ${varName} = ${timeFunc};\n${branch}}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_time_read'] = function (block: any) {
    const unit = block.getFieldValue('UNIT');
    return [unit === 'MICROS' ? 'micros()' : 'millis()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_millis'] = function () {
    return ['millis()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_pulse_in'] = function (block: any) {
    const val = block.getFieldValue('VAL');
    const pin = block.getFieldValue('PIN');
    const timeout = block.getFieldValue('TIMEOUT') || 1000000;
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT);`);
    return [`pulseIn(${pin}, ${val}, ${timeout})`, cppGenerator.ORDER_ATOMIC];
  };

  // ==========================================
  // 4. ∑ Matematik
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_math_map'] = function (block: any) {
    const val = cppGenerator.valueToCode(block, 'VAL', cppGenerator.ORDER_NONE) || '0';
    const fLow = cppGenerator.valueToCode(block, 'F_LOW', cppGenerator.ORDER_NONE) || '0';
    const fHigh = cppGenerator.valueToCode(block, 'F_HIGH', cppGenerator.ORDER_NONE) || '1023';
    const tLow = cppGenerator.valueToCode(block, 'T_LOW', cppGenerator.ORDER_NONE) || '0';
    const tHigh = cppGenerator.valueToCode(block, 'T_HIGH', cppGenerator.ORDER_NONE) || '255';
    return [`map(${val}, ${fLow}, ${fHigh}, ${tLow}, ${tHigh})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_math_angle'] = function (block: any) {
    const angle = block.getFieldValue('ANGLE') || '90';
    return [angle, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_math_analog_pin'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return [pin, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_math_chained_compare'] = function (block: any) {
    const low = cppGenerator.valueToCode(block, 'LOW', cppGenerator.ORDER_RELATIONAL) || '0';
    const val = cppGenerator.valueToCode(block, 'VAL', cppGenerator.ORDER_RELATIONAL) || '0';
    const high = cppGenerator.valueToCode(block, 'HIGH', cppGenerator.ORDER_RELATIONAL) || '100';
    return [`(${low} < ${val} && ${val} < ${high})`, cppGenerator.ORDER_LOGICAL_AND];
  };

  // ==========================================
  // 5. “ Metin
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_text_char'] = function (block: any) {
    const ch = block.getFieldValue('CHAR') || ' ';
    const escaped = ch.charAt(0) === "'" ? "\\'" : ch.charAt(0);
    return [`'${escaped}'`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_text_compare'] = function (block: any) {
    const a = cppGenerator.valueToCode(block, 'A', cppGenerator.ORDER_NONE) || '""';
    const op = block.getFieldValue('OP') === 'NEQ' ? '!=' : '==';
    const b = cppGenerator.valueToCode(block, 'B', cppGenerator.ORDER_NONE) || '""';
    return [`(String(${a}) ${op} String(${b}))`, cppGenerator.ORDER_EQUALITY];
  };

  // ==========================================
  // 6. ∿ Değişken
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_variable_address'] = function (block: any) {
    const varField = block.getField('VAR');
    const varName = varField ? (varField.getText ? varField.getText() : varField.getValue()) : 'x';
    const safeName = String(varName).replace(/[^a-zA-Z0-9_]/g, '_');
    return [`(&${safeName})`, cppGenerator.ORDER_UNARY_PREFIX];
  };

  // ==========================================
  // 7. ∫∫ Fonksiyon
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_procedure_defreturn_typed'] = function (block: any) {
    const funcName = block.getFieldValue('NAME') || 'fonksiyonum';
    const type = block.getFieldValue('TYPE') || 'int';
    const branch = cppGenerator.statementToCode(block, 'STACK');
    const retVal = cppGenerator.valueToCode(block, 'RETURN', cppGenerator.ORDER_NONE) || '0';
    const code = `${type} ${funcName}() {\n${branch}  return ${retVal};\n}\n`;
    cppGenerator.addFunction(funcName, code);
    return '';
  };

  // ==========================================
  // 8. ⇅ Giriş/Çıkış
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_digital_read'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT);`);
    return [`digitalRead(${pin})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_digital_write'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `digitalWrite(${pin}, ${state});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_analog_read'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(${pin})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_analog_write'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const val = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_NONE) || '128';
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `analogWrite(${pin}, ${val});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_pwm_write'] = (cppGenerator as any).forBlock['deneyap_analog_write'];

  (cppGenerator as any).forBlock['deneyap_digital_read_pullup'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT_PULLUP);`);
    return [`digitalRead(${pin})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_attach_interrupt'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    const branch = cppGenerator.statementToCode(block, 'DO');
    const isrName = `deneyap_isr_${pin}`;

    cppGenerator.addFunction(isrName, `void IRAM_ATTR ${isrName}() {\n${branch}}\n`);
    cppGenerator.addSetup(`attachInterrupt_${pin}`, `pinMode(${pin}, INPUT_PULLUP);\n  attachInterrupt(digitalPinToInterrupt(${pin}), ${isrName}, ${mode});`);
    return `// Kesme yapılandırıldı: ${pin}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_detach_interrupt'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return `detachInterrupt(digitalPinToInterrupt(${pin}));\n`;
  };

  (cppGenerator as any).forBlock['deneyap_pin_mode'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, ${mode});`);
    return `pinMode(${pin}, ${mode});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_pwm_setup'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const freq = block.getFieldValue('FREQ') || 5000;
    const res = block.getFieldValue('RES') || 8;
    const ch = block.getFieldValue('CHANNEL') || 0;
    cppGenerator.addSetup(`ledc_setup_${ch}`, `ledcSetup(${ch}, ${freq}, ${res});\n  ledcAttachPin(${pin}, ${ch});`);
    return `// PWM ${pin} Kanal ${ch} frekans: ${freq}Hz\n`;
  };

  (cppGenerator as any).forBlock['deneyap_pwm_custom_write'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const freq = block.getFieldValue('FREQ') || 5000;
    const res = block.getFieldValue('RES') || 8;
    const ch = block.getFieldValue('CHANNEL') || 0;
    const val = cppGenerator.valueToCode(block, 'VAL', cppGenerator.ORDER_NONE) || '128';
    cppGenerator.addSetup(`ledc_setup_${ch}`, `ledcSetup(${ch}, ${freq}, ${res});\n  ledcAttachPin(${pin}, ${ch});`);
    return `ledcWrite(${ch}, ${val});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_pin_toggle'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `digitalWrite(${pin}, !digitalRead(${pin}));\n`;
  };

  // ==========================================
  // 9. Saat (RTC)
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_rtc_set_time'] = function (block: any) {
    const y = block.getFieldValue('YEAR');
    const m = block.getFieldValue('MONTH');
    const d = block.getFieldValue('DAY');
    const h = block.getFieldValue('HOUR');
    const min = block.getFieldValue('MINUTE');
    const s = block.getFieldValue('SECOND');
    cppGenerator.addInclude('sys_time_h', '#include <sys/time.h>');
    return `struct tm t = {0}; t.tm_year = ${y} - 1900; t.tm_mon = ${m} - 1; t.tm_mday = ${d}; t.tm_hour = ${h}; t.tm_min = ${min}; t.tm_sec = ${s}; time_t timeSinceEpoch = mktime(&t); struct timeval epoch = {timeSinceEpoch, 0}; settimeofday(&epoch, NULL);\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rtc_refresh'] = function () {
    return `// RTC zamanı okundu\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rtc_get_part'] = function (block: any) {
    const part = block.getFieldValue('PART');
    cppGenerator.addInclude('time_h', '#include <time.h>');
    const func = `int getRtcPart(int partType) {
  time_t now; time(&now); struct tm* timeinfo = localtime(&now);
  if (partType == 0) return timeinfo->tm_year + 1900;
  if (partType == 1) return timeinfo->tm_mon + 1;
  if (partType == 2) return timeinfo->tm_mday;
  if (partType == 3) return timeinfo->tm_hour;
  if (partType == 4) return timeinfo->tm_min;
  if (partType == 5) return timeinfo->tm_sec;
  return timeinfo->tm_wday;
}`;
    cppGenerator.addFunction('getRtcPart', func);
    const map: Record<string, number> = { YEAR: 0, MONTH: 1, DAY: 2, HOUR: 3, MINUTE: 4, SECOND: 5, DOW: 6 };
    return [`getRtcPart(${map[part] ?? 0})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_rtc_get_date'] = function () {
    cppGenerator.addInclude('time_h', '#include <time.h>');
    const func = `String getRtcDateStr() {
  time_t now; time(&now); struct tm* t = localtime(&now);
  char buf[32]; sprintf(buf, "%02d/%02d/%04d", t->tm_mday, t->tm_mon + 1, t->tm_year + 1900);
  return String(buf);
}`;
    cppGenerator.addFunction('getRtcDateStr', func);
    return ['getRtcDateStr()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_rtc_get_time'] = function () {
    cppGenerator.addInclude('time_h', '#include <time.h>');
    const func = `String getRtcTimeStr() {
  time_t now; time(&now); struct tm* t = localtime(&now);
  char buf[32]; sprintf(buf, "%02d:%02d:%02d", t->tm_hour, t->tm_min, t->tm_sec);
  return String(buf);
}`;
    cppGenerator.addFunction('getRtcTimeStr', func);
    return ['getRtcTimeStr()', cppGenerator.ORDER_ATOMIC];
  };

  // ==========================================
  // 10. ▦ Dizi
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_array_define'] = function (block: any) {
    const name = block.getFieldValue('NAME') || 'dizi1';
    const type = block.getFieldValue('TYPE') || 'int';
    const size = block.getFieldValue('SIZE') || 10;
    cppGenerator.addDeclaration(`arr_${name}`, `${type} ${name}[${size}];`);
    return '';
  };

  (cppGenerator as any).forBlock['deneyap_array_set'] = function (block: any) {
    const name = block.getFieldValue('NAME') || 'dizi1';
    const idx = cppGenerator.valueToCode(block, 'INDEX', cppGenerator.ORDER_NONE) || '0';
    const val = cppGenerator.valueToCode(block, 'VAL', cppGenerator.ORDER_ASSIGNMENT) || '0';
    return `${name}[${idx}] = ${val};\n`;
  };

  (cppGenerator as any).forBlock['deneyap_array_get'] = function (block: any) {
    const name = block.getFieldValue('NAME') || 'dizi1';
    const idx = cppGenerator.valueToCode(block, 'INDEX', cppGenerator.ORDER_NONE) || '0';
    return [`${name}[${idx}]`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_array_size'] = function (block: any) {
    const name = block.getFieldValue('NAME') || 'dizi1';
    return [`(sizeof(${name}) / sizeof(${name}[0]))`, cppGenerator.ORDER_MULTIPLICATIVE];
  };

  // ==========================================
  // 11. ↻ Step Motor
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_l298n_init'] = function (block: any) {
    const a1 = block.getFieldValue('INA1');
    const a2 = block.getFieldValue('INA2');
    const b1 = block.getFieldValue('INB1');
    const b2 = block.getFieldValue('INB2');
    cppGenerator.addSetup('l298n_pins', `pinMode(${a1}, OUTPUT);\n  pinMode(${a2}, OUTPUT);\n  pinMode(${b1}, OUTPUT);\n  pinMode(${b2}, OUTPUT);`);
    return `// L298N Sürücü Motor A(${a1},${a2}) Motor B(${b1},${b2})\n`;
  };

  (cppGenerator as any).forBlock['deneyap_l298n_drive'] = function (block: any) {
    const motor = block.getFieldValue('MOTOR');
    const dir = block.getFieldValue('DIR');
    const speed = cppGenerator.valueToCode(block, 'SPEED', cppGenerator.ORDER_NONE) || '255';
    return `// L298N Sür: ${motor} Yön: ${dir} Hız: ${speed}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_stepper_def'] = function (block: any) {
    const id = block.getFieldValue('ID') || 'step1';
    const steps = block.getFieldValue('STEPS') || 2048;
    const in1 = block.getFieldValue('IN1');
    const in2 = block.getFieldValue('IN2');
    const in3 = block.getFieldValue('IN3');
    const in4 = block.getFieldValue('IN4');
    cppGenerator.addInclude('stepper_h', '#include <Stepper.h>');
    cppGenerator.addDeclaration(`stepper_${id}`, `Stepper ${id}(${steps}, ${in1}, ${in3}, ${in2}, ${in4});`);
    return `// Step motor ${id} tanımlandı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_stepper_set_speed'] = function (block: any) {
    const id = block.getFieldValue('ID') || 'step1';
    const speed = cppGenerator.valueToCode(block, 'SPEED', cppGenerator.ORDER_NONE) || '60';
    return `${id}.setSpeed(${speed});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_stepper_step_custom'] = function (block: any) {
    const id = block.getFieldValue('ID') || 'step1';
    const steps = cppGenerator.valueToCode(block, 'STEPS', cppGenerator.ORDER_NONE) || '100';
    return `${id}.step(${steps});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_stepper_init'] = (cppGenerator as any).forBlock['deneyap_stepper_def'];
  (cppGenerator as any).forBlock['deneyap_stepper_speed'] = (cppGenerator as any).forBlock['deneyap_stepper_set_speed'];
  (cppGenerator as any).forBlock['deneyap_stepper_step'] = (cppGenerator as any).forBlock['deneyap_stepper_step_custom'];

  // ==========================================
  // 12. ∿ Servo
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_servo_full'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const angle = block.getFieldValue('ANGLE') || '90';
    const wait = block.getFieldValue('WAIT') || 100;
    cppGenerator.addInclude('deneyap_servo', '#include <ESP32Servo.h>');
    cppGenerator.addDeclaration(`servo_${pin}`, `Servo servo_${pin};`);
    cppGenerator.addSetup(`servo_attach_${pin}`, `servo_${pin}.attach(${pin});`);
    return `servo_${pin}.write(${angle});\ndelay(${wait});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_servo_attach'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addInclude('deneyap_servo', '#include <ESP32Servo.h>');
    cppGenerator.addDeclaration(`servo_${pin}`, `Servo servo_${pin};`);
    cppGenerator.addSetup(`servo_attach_${pin}`, `servo_${pin}.attach(${pin});`);
    return `// Servo ${pin} başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_servo_write'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const angle = cppGenerator.valueToCode(block, 'ANGLE', cppGenerator.ORDER_NONE) || '90';
    cppGenerator.addInclude('deneyap_servo', '#include <ESP32Servo.h>');
    cppGenerator.addDeclaration(`servo_${pin}`, `Servo servo_${pin};`);
    cppGenerator.addSetup(`servo_attach_${pin}`, `servo_${pin}.attach(${pin});`);
    return `servo_${pin}.write(${angle});\n`;
  };

  // ==========================================
  // 13. 🗎 LCD I2C
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_lcd_init'] = function (block: any) {
    const addr = block.getFieldValue('ADDR') || '0x27';
    const cols = block.getFieldValue('COLS') || 16;
    const rows = block.getFieldValue('ROWS') || 2;
    cppGenerator.addInclude('wire_h', '#include <Wire.h>');
    cppGenerator.addInclude('lcd_i2c_h', '#include <LiquidCrystal_I2C.h>');
    cppGenerator.addDeclaration('lcd_obj', `LiquidCrystal_I2C lcd(${addr}, ${cols}, ${rows});`);
    cppGenerator.addSetup('wire_begin', 'Wire.begin();');
    cppGenerator.addSetup('lcd_init', 'lcd.init();\n  lcd.backlight();');
    return `// LCD I2C (${addr}, ${cols}x${rows}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_set_cursor'] = function (block: any) {
    const col = block.getFieldValue('COL') || 0;
    const row = block.getFieldValue('ROW') || 0;
    return `lcd.setCursor(${col}, ${row});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_print_val'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    return `lcd.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_print'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    const col = cppGenerator.valueToCode(block, 'COL', cppGenerator.ORDER_NONE) || '0';
    const row = cppGenerator.valueToCode(block, 'ROW', cppGenerator.ORDER_NONE) || '0';
    return `lcd.setCursor(${col}, ${row});\nlcd.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_write_char'] = function (block: any) {
    const ch = cppGenerator.valueToCode(block, 'CHAR', cppGenerator.ORDER_NONE) || "'A'";
    return `lcd.write(${ch});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_create_char'] = function (block: any) {
    const id = block.getFieldValue('ID') || 0;
    const bytes = block.getFieldValue('BYTES') || '0x00,0x0A,0x1F,0x1F,0x0E,0x04,0x00,0x00';
    cppGenerator.addDeclaration(`custom_char_${id}`, `byte customChar_${id}[8] = { ${bytes} };`);
    cppGenerator.addSetup(`create_char_${id}`, `lcd.createChar(${id}, customChar_${id});`);
    return `// Özel Karakter ${id} tanımlandı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_write_custom_char'] = function (block: any) {
    const id = block.getFieldValue('ID') || 0;
    return `lcd.write((uint8_t)${id});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_clear'] = function () {
    return `lcd.clear();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_home'] = function () {
    return `lcd.home();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_display_power'] = function (block: any) {
    const mode = block.getFieldValue('MODE');
    return `lcd.${mode}();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_scroll'] = function (block: any) {
    const dir = block.getFieldValue('DIR');
    return `lcd.${dir}();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_backlight'] = function (block: any) {
    const mode = block.getFieldValue('MODE');
    return `lcd.${mode}();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_cursor_mode'] = function (block: any) {
    const mode = block.getFieldValue('MODE');
    return `lcd.${mode}();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_blink_mode'] = function (block: any) {
    const mode = block.getFieldValue('MODE');
    return `lcd.${mode}();\n`;
  };

  // ==========================================
  // 14. ♫ Ses
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_buzzer_tone_full'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const freq = block.getFieldValue('FREQ') || 440;
    const dur = block.getFieldValue('DURATION') || 500;
    cppGenerator.addSetup(`buzzer_pin_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `tone(${pin}, ${freq}, ${dur});\ndelay(${dur});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_buzzer_tone'] = (cppGenerator as any).forBlock['deneyap_buzzer_tone_full'];

  (cppGenerator as any).forBlock['deneyap_buzzer_note'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const note = block.getFieldValue('NOTE');
    const beat = block.getFieldValue('BEAT');
    cppGenerator.addSetup(`buzzer_pin_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `tone(${pin}, ${note}, ${beat});\ndelay(${beat});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_buzzer_notone'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return `noTone(${pin});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_music_note_const'] = function (block: any) {
    const note = block.getFieldValue('NOTE');
    return [note, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_speaker_init'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addSetup(`speaker_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `// Hoparlör ${pin} yapılandırıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_play_melody'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const melody = block.getFieldValue('MELODY');
    return `// Melodi Çal: ${melody} Pinde: ${pin}\n`;
  };

  // ==========================================
  // 15. ☎ Seri İletişim
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_serial_begin'] = function (block: any) {
    const baud = block.getFieldValue('BAUD');
    cppGenerator.addSetup('serial_begin', `Serial.begin(${baud});`);
    return `// Seri port başlatıldı (${baud})\n`;
  };

  (cppGenerator as any).forBlock['deneyap_serial_available'] = function () {
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    return ['(Serial.available() > 0)', cppGenerator.ORDER_RELATIONAL];
  };

  (cppGenerator as any).forBlock['deneyap_serial_print_ext'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    const newline = block.getFieldValue('NEWLINE') === 'TRUE';
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    return newline ? `Serial.println(${text});\n` : `Serial.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_serial_print'] = (cppGenerator as any).forBlock['deneyap_serial_print_ext'];
  (cppGenerator as any).forBlock['deneyap_serial_println'] = (cppGenerator as any).forBlock['deneyap_serial_print_ext'];

  (cppGenerator as any).forBlock['deneyap_serial_read_type'] = function (block: any) {
    const type = block.getFieldValue('TYPE');
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    if (type === 'INT') return ['Serial.parseInt()', cppGenerator.ORDER_ATOMIC];
    if (type === 'CHAR') return ['(char)Serial.read()', cppGenerator.ORDER_ATOMIC];
    return ['Serial.readString()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_serial_read'] = (cppGenerator as any).forBlock['deneyap_serial_read_type'];

  (cppGenerator as any).forBlock['deneyap_serial_write_byte'] = function (block: any) {
    const b = cppGenerator.valueToCode(block, 'BYTE', cppGenerator.ORDER_NONE) || '0';
    return `Serial.write(${b});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_init'] = function (block: any) {
    const sda = block.getFieldValue('SDA');
    const scl = block.getFieldValue('SCL');
    cppGenerator.addInclude('wire_h', '#include <Wire.h>');
    cppGenerator.addSetup('wire_begin', `Wire.begin(${sda}, ${scl});`);
    return `// I2C başlatıldı (SDA: ${sda}, SCL: ${scl})\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_begin_transmission'] = function (block: any) {
    const addr = block.getFieldValue('ADDR') || '0x27';
    cppGenerator.addInclude('wire_h', '#include <Wire.h>');
    return `Wire.beginTransmission(${addr});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_end_transmission'] = function () {
    return `Wire.endTransmission();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_read'] = function (block: any) {
    const addr = block.getFieldValue('ADDR') || '0x27';
    const count = block.getFieldValue('COUNT') || 1;
    return [`(Wire.requestFrom(${addr}, ${count}) > 0 ? Wire.read() : 0)`, cppGenerator.ORDER_CONDITIONAL];
  };

  // ==========================================
  // 16. ⇊ Algılayıcılar
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_imu_read'] = function (block: any) {
    const sensor = block.getFieldValue('SENSOR');
    const axis = block.getFieldValue('AXIS');
    cppGenerator.addInclude('deneyap_imu', '#include <deneyap.h>');
    return [`readIMU_${sensor}_${axis}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_ultrasonic_read'] = function (block: any) {
    const trig = block.getFieldValue('TRIG');
    const echo = block.getFieldValue('ECHO');

    const funcCode = `long readDistanceCM(int trigPin, int echoPin) {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return 999;
  return duration * 0.034 / 2;
}`;
    cppGenerator.addFunction('read_distance_cm', funcCode);
    return [`readDistanceCM(${trig}, ${echo})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_dht11_read'] = function (block: any) {
    const type = block.getFieldValue('TYPE');
    const pin = block.getFieldValue('PIN');
    cppGenerator.addInclude('dht_h', '#include <DHT.h>');
    cppGenerator.addDeclaration(`dht_${pin}`, `DHT dht_${pin}(${pin}, DHT11);`);
    cppGenerator.addSetup(`dht_begin_${pin}`, `dht_${pin}.begin();`);
    return [type === 'HUM' ? `dht_${pin}.readHumidity()` : `dht_${pin}.readTemperature()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_mic_read'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(${pin})`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_magnetic_read'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`readMagneticField_${axis}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_tcs34725_init'] = function () {
    cppGenerator.addInclude('wire_h', '#include <Wire.h>');
    return `// TCS34725 Renk Sensörü başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_tcs34725_read'] = function (block: any) {
    const ch = block.getFieldValue('CHANNEL');
    return [`readTCS34725_${ch}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_tcs34725_is_color'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return [`(getTCS34725Color() == "${color}")`, cppGenerator.ORDER_EQUALITY];
  };

  // ==========================================
  // 17. ⚚ RGB Led
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_rgb_builtin_blink'] = function (block: any) {
    const speed = block.getFieldValue('SPEED');
    const ms = speed === 'FAST' ? 200 : 800;
    cppGenerator.addSetup('led_builtin', 'pinMode(LED_BUILTIN, OUTPUT);');
    return `digitalWrite(LED_BUILTIN, HIGH);\ndelay(${ms});\ndigitalWrite(LED_BUILTIN, LOW);\ndelay(${ms});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_led_picker'] = function (block: any) {
    const type = block.getFieldValue('TYPE');
    const rPin = block.getFieldValue('R');
    const gPin = block.getFieldValue('G');
    const bPin = block.getFieldValue('B');
    const hex = block.getFieldValue('COLOR') || '#ff0000';

    const r = parseInt(hex.substring(1, 3), 16) || 0;
    const g = parseInt(hex.substring(3, 5), 16) || 0;
    const b = parseInt(hex.substring(5, 7), 16) || 0;

    const rVal = type === 'ANODE' ? 255 - r : r;
    const gVal = type === 'ANODE' ? 255 - g : g;
    const bVal = type === 'ANODE' ? 255 - b : b;

    cppGenerator.addSetup(`rgb_pins_${rPin}_${gPin}_${bPin}`, `pinMode(${rPin}, OUTPUT);\n  pinMode(${gPin}, OUTPUT);\n  pinMode(${bPin}, OUTPUT);`);
    return `analogWrite(${rPin}, ${rVal});\nanalogWrite(${gPin}, ${gVal});\nanalogWrite(${bPin}, ${bVal});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_builtin_pwm'] = function (block: any) {
    const r = block.getFieldValue('R') || 255;
    const g = block.getFieldValue('G') || 0;
    const b = block.getFieldValue('B') || 0;
    cppGenerator.addSetup('rgb_init', 'pinMode(LEDR, OUTPUT);\n  pinMode(LEDG, OUTPUT);\n  pinMode(LEDB, OUTPUT);');
    return `analogWrite(LEDR, 255 - ${r});\nanalogWrite(LEDG, 255 - ${g});\nanalogWrite(LEDB, 255 - ${b});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_neopixel'] = function (block: any) {
    const count = block.getFieldValue('COUNT') || 1;
    const hex = block.getFieldValue('COLOR') || '#00ff00';
    return `// Adreslenebilir RGB LED: ${count} adet, Renk: ${hex}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_def_id'] = function (block: any) {
    const id = block.getFieldValue('ID') || 'rgb1';
    const r = block.getFieldValue('R');
    const g = block.getFieldValue('G');
    const b = block.getFieldValue('B');
    cppGenerator.addSetup(`rgb_id_${id}`, `pinMode(${r}, OUTPUT);\n  pinMode(${g}, OUTPUT);\n  pinMode(${b}, OUTPUT);`);
    return `// RGB LED ${id} tanımlandı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_set_id'] = function (block: any) {
    const id = block.getFieldValue('ID') || 'rgb1';
    const r = block.getFieldValue('R');
    const g = block.getFieldValue('G');
    const b = block.getFieldValue('B');
    return `// RGB ${id} renk: (${r}, ${g}, ${b})\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_pick_id'] = function (block: any) {
    const id = block.getFieldValue('ID') || 'rgb1';
    const color = block.getFieldValue('COLOR');
    return `// RGB ${id} renk seçimi: ${color}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_simple_def'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const color = block.getFieldValue('COLOR');
    return `// RGB Basit Pin: ${pin} Renk: ${color}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_show_values'] = function (block: any) {
    const r = cppGenerator.valueToCode(block, 'R', cppGenerator.ORDER_NONE) || '0';
    const g = cppGenerator.valueToCode(block, 'G', cppGenerator.ORDER_NONE) || '0';
    const b = cppGenerator.valueToCode(block, 'B', cppGenerator.ORDER_NONE) || '0';
    cppGenerator.addSetup('rgb_init', 'pinMode(LEDR, OUTPUT);\n  pinMode(LEDG, OUTPUT);\n  pinMode(LEDB, OUTPUT);');
    return `analogWrite(LEDR, 255 - (${r}));\nanalogWrite(LEDG, 255 - (${g}));\nanalogWrite(LEDB, 255 - (${b}));\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_color_field'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return [`"${color}"`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_rgb_builtin_set'] = (cppGenerator as any).forBlock['deneyap_rgb_show_values'];
  (cppGenerator as any).forBlock['deneyap_rgb_builtin_color'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    cppGenerator.addSetup('rgb_init', 'pinMode(LEDR, OUTPUT);\n  pinMode(LEDG, OUTPUT);\n  pinMode(LEDB, OUTPUT);');
    let r = 255, g = 255, b = 255;
    if (color === 'RED') { r = 0; g = 255; b = 255; }
    else if (color === 'GREEN') { r = 255; g = 0; b = 255; }
    else if (color === 'BLUE') { r = 255; g = 255; b = 0; }
    else if (color === 'YELLOW') { r = 0; g = 0; b = 255; }
    else if (color === 'CYAN') { r = 255; g = 0; b = 0; }
    else if (color === 'MAGENTA') { r = 0; g = 255; b = 0; }
    else if (color === 'WHITE') { r = 0; g = 0; b = 0; }
    return `analogWrite(LEDR, ${r});\nanalogWrite(LEDG, ${g});\nanalogWrite(LEDB, ${b});\n`;
  };

  // ==========================================
  // 18. Bluetooth
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_bluetooth_begin'] = function (block: any) {
    const name = block.getFieldValue('NAME') || 'Deneyap_BT';
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    cppGenerator.addSetup('bt_begin', `SerialBT.begin("${name}");`);
    return `// Bluetooth başlatıldı: "${name}"\n`;
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_available'] = function () {
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    return ['(SerialBT.available() > 0)', cppGenerator.ORDER_RELATIONAL];
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_print_ext'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    const nl = block.getFieldValue('NEWLINE') === 'TRUE';
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    return nl ? `SerialBT.println(${text});\n` : `SerialBT.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_println'] = (cppGenerator as any).forBlock['deneyap_bluetooth_print_ext'];

  (cppGenerator as any).forBlock['deneyap_bluetooth_read_ext'] = function (block: any) {
    const type = block.getFieldValue('TYPE');
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    return [type === 'BYTE' ? 'SerialBT.read()' : 'SerialBT.readString()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_read'] = (cppGenerator as any).forBlock['deneyap_bluetooth_read_ext'];

  (cppGenerator as any).forBlock['deneyap_bluetooth_write_byte'] = function (block: any) {
    const byteVal = cppGenerator.valueToCode(block, 'BYTE', cppGenerator.ORDER_NONE) || '0';
    return `SerialBT.write(${byteVal});\n`;
  };

  // ==========================================
  // 19. Kızılötesi
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_ir_recv_init'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addInclude('ir_recv_h', '#include <IRrecv.h>');
    cppGenerator.addDeclaration(`irrecv_${pin}`, `IRrecv irrecv_${pin}(${pin});\ndecode_results ir_results_${pin};`);
    cppGenerator.addSetup(`ir_begin_${pin}`, `irrecv_${pin}.enableIRIn();`);
    return `// IR Alıcı ${pin} başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_ir_available'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return [`(irrecv_${pin}.decode(&ir_results_${pin}))`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_ir_read_code'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return [`String(ir_results_${pin}.value, HEX)`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_ir_send'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const proto = block.getFieldValue('PROTO');
    const code = block.getFieldValue('CODE');
    return `// IR Gönder: ${proto} Kod: ${code} Pin: ${pin}\n`;
  };

  // ==========================================
  // 20. RFID
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_rfid_init'] = function (block: any) {
    const sda = block.getFieldValue('SDA');
    const rst = block.getFieldValue('RST');
    cppGenerator.addInclude('spi_h', '#include <SPI.h>');
    cppGenerator.addInclude('mfrc522_h', '#include <MFRC522.h>');
    cppGenerator.addDeclaration('rfid_obj', `MFRC522 rfid(${sda}, ${rst});`);
    cppGenerator.addSetup('spi_begin', 'SPI.begin();');
    cppGenerator.addSetup('rfid_init', 'rfid.PCD_Init();');
    return `// RFID Okuyucu (${sda}, ${rst}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rfid_card_present'] = function () {
    return ['(rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())', cppGenerator.ORDER_LOGICAL_AND];
  };

  (cppGenerator as any).forBlock['deneyap_rfid_read_uid'] = function () {
    const funcCode = `String getRfidUID() {
  String uidStr = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uidStr += "0";
    uidStr += String(rfid.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  return uidStr;
}`;
    cppGenerator.addFunction('rfid_get_uid', funcCode);
    return ['getRfidUID()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_rfid_uid_equals'] = function (block: any) {
    const uid = block.getFieldValue('UID') || '';
    return [`(getRfidUID() == "${uid.replace(/\s+/g, '').toUpperCase()}")`, cppGenerator.ORDER_EQUALITY];
  };

  // ==========================================
  // 21. Tuş Takımı
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_keypad_3x4_init'] = function (block: any) {
    const r1 = block.getFieldValue('R1'), r2 = block.getFieldValue('R2'), r3 = block.getFieldValue('R3'), r4 = block.getFieldValue('R4');
    const c1 = block.getFieldValue('C1'), c2 = block.getFieldValue('C2'), c3 = block.getFieldValue('C3');
    cppGenerator.addInclude('keypad_h', '#include <Keypad.h>');
    cppGenerator.addDeclaration('keypad_3x4', `const byte ROWS_3x4 = 4; const byte COLS_3x4 = 3;
char keys_3x4[ROWS_3x4][COLS_3x4] = { {'1','2','3'}, {'4','5','6'}, {'7','8','9'}, {'*','0','#'} };
byte rowPins_3x4[ROWS_3x4] = {${r1}, ${r2}, ${r3}, ${r4}};
byte colPins_3x4[COLS_3x4] = {${c1}, ${c2}, ${c3}};
Keypad customKeypad = Keypad(makeKeymap(keys_3x4), rowPins_3x4, colPins_3x4, ROWS_3x4, COLS_3x4);`);
    return `// 3x4 Tuş Takımı başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_keypad_4x4_init'] = function (block: any) {
    const r1 = block.getFieldValue('R1'), r2 = block.getFieldValue('R2'), r3 = block.getFieldValue('R3'), r4 = block.getFieldValue('R4');
    const c1 = block.getFieldValue('C1'), c2 = block.getFieldValue('C2'), c3 = block.getFieldValue('C3'), c4 = block.getFieldValue('C4');
    cppGenerator.addInclude('keypad_h', '#include <Keypad.h>');
    cppGenerator.addDeclaration('keypad_4x4', `const byte ROWS_4x4 = 4; const byte COLS_4x4 = 4;
char keys_4x4[ROWS_4x4][COLS_4x4] = { {'1','2','3','A'}, {'4','5','6','B'}, {'7','8','9','C'}, {'*','0','#','D'} };
byte rowPins_4x4[ROWS_4x4] = {${r1}, ${r2}, ${r3}, ${r4}};
byte colPins_4x4[COLS_4x4] = {${c1}, ${c2}, ${c3}, ${c4}};
Keypad customKeypad = Keypad(makeKeymap(keys_4x4), rowPins_4x4, colPins_4x4, ROWS_4x4, COLS_4x4);`);
    return `// 4x4 Tuş Takımı başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_keypad_get_key'] = function () {
    return ['String(customKeypad.getKey())', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_keypad_is_pressed'] = function () {
    return ['(customKeypad.getKey() != NO_KEY)', cppGenerator.ORDER_RELATIONAL];
  };

  // ==========================================
  // 22. SD Kart
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_sd_init'] = function (block: any) {
    const cs = block.getFieldValue('CS');
    cppGenerator.addInclude('sd_h', '#include <SD.h>\n#include <SPI.h>');
    cppGenerator.addSetup('sd_init', `SD.begin(${cs});`);
    return `// SD Kart (${cs}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_sd_write'] = function (block: any) {
    const file = block.getFieldValue('FILE');
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    const nl = block.getFieldValue('NEWLINE') === 'TRUE';
    return `File f = SD.open("${file}", FILE_APPEND); if (f) { f.${nl ? 'println' : 'print'}(${text}); f.close(); }\n`;
  };

  (cppGenerator as any).forBlock['deneyap_sd_read'] = function (block: any) {
    const file = block.getFieldValue('FILE');
    return [`(SD.open("${file}").readString())`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_sd_exists'] = function (block: any) {
    const file = block.getFieldValue('FILE');
    return [`SD.exists("${file}")`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_sd_remove'] = function (block: any) {
    const file = block.getFieldValue('FILE');
    return `SD.remove("${file}");\n`;
  };

  // ==========================================
  // 23. ☁ Nesnelerin İnterneti
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_wifi_connect'] = function (block: any) {
    const ssid = block.getFieldValue('SSID');
    const pass = block.getFieldValue('PASS');
    cppGenerator.addInclude('wifi_h', '#include <WiFi.h>');
    cppGenerator.addSetup('wifi_begin', `WiFi.begin("${ssid}", "${pass}");`);
    return `// WiFi bağlanıyor: "${ssid}"\n`;
  };

  (cppGenerator as any).forBlock['deneyap_wifi_status'] = function () {
    return ['(WiFi.status() == WL_CONNECTED)', cppGenerator.ORDER_EQUALITY];
  };

  (cppGenerator as any).forBlock['deneyap_wifi_ip'] = function () {
    return ['WiFi.localIP().toString()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_mqtt_connect'] = function (block: any) {
    const server = block.getFieldValue('SERVER');
    const port = block.getFieldValue('PORT') || 1883;
    const client = block.getFieldValue('CLIENT_ID') || 'DeneyapClient';
    cppGenerator.addInclude('mqtt_h', '#include <PubSubClient.h>\n#include <WiFiClient.h>');
    cppGenerator.addDeclaration('mqtt_client', `WiFiClient espClient;\nPubSubClient mqttClient(espClient);`);
    cppGenerator.addSetup('mqtt_setup', `mqttClient.setServer("${server}", ${port});\n  mqttClient.connect("${client}");`);
    return `// MQTT Bağlan: ${server}:${port}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_mqtt_subscribe'] = function (block: any) {
    const topic = block.getFieldValue('TOPIC');
    return `mqttClient.subscribe("${topic}");\n`;
  };

  (cppGenerator as any).forBlock['deneyap_mqtt_publish'] = function (block: any) {
    const topic = block.getFieldValue('TOPIC');
    const msg = cppGenerator.valueToCode(block, 'MSG', cppGenerator.ORDER_NONE) || '""';
    return `mqttClient.publish("${topic}", String(${msg}).c_str());\n`;
  };

  (cppGenerator as any).forBlock['deneyap_mqtt_loop'] = function () {
    return `mqttClient.loop();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_mqtt_message'] = function () {
    return ['mqttLastMessage', cppGenerator.ORDER_ATOMIC];
  };

  // ==========================================
  // 24. ☪ Deneyap LED Matris
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_matrix_init'] = function (block: any) {
    const addr = block.getFieldValue('ADDR') || '0x70';
    cppGenerator.addInclude('matrix_h', '#include <Deneyap_LedMatris.h>');
    cppGenerator.addDeclaration('matrix_obj', `LedMatris ledMatris;`);
    cppGenerator.addSetup('matrix_begin', `ledMatris.begin(${addr});`);
    return `// LED Matris (${addr}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_pattern'] = function (block: any) {
    const pattern = block.getFieldValue('PATTERN');
    return `// LED Matris deseni: ${pattern}\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_icon'] = function (block: any) {
    const icon = block.getFieldValue('ICON');
    return `ledMatris.drawIcon("${icon}");\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_pixel'] = function (block: any) {
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    const state = block.getFieldValue('STATE');
    return `ledMatris.setPixel(${x}, ${y}, ${state});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_row'] = function (block: any) {
    const row = block.getFieldValue('ROW');
    const val = block.getFieldValue('VAL');
    return `ledMatris.setRow(${row}, ${val});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_col'] = function (block: any) {
    const col = block.getFieldValue('COL');
    const val = block.getFieldValue('VAL');
    return `ledMatris.setCol(${col}, ${val});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_clear'] = function () {
    return `ledMatris.clear();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_matrix_brightness'] = function (block: any) {
    const bright = block.getFieldValue('BRIGHT');
    return `ledMatris.setBrightness(${bright});\n`;
  };

  // ==========================================
  // 25. ☪ Deneyap OLED Ekran
  // ==========================================

  (cppGenerator as any).forBlock['deneyap_oled_init'] = function (block: any) {
    const addr = block.getFieldValue('ADDR') || '0x3C';
    cppGenerator.addInclude('oled_h', '#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>');
    cppGenerator.addDeclaration('oled_obj', `Adafruit_SSD1306 display(128, 64, &Wire, -1);`);
    cppGenerator.addSetup('oled_begin', `display.begin(SSD1306_SWITCHCAPVCC, ${addr});\n  display.clearDisplay();\n  display.setTextColor(SSD1306_WHITE);`);
    return `// OLED Ekran (${addr}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_print_text'] = function (block: any) {
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    const size = block.getFieldValue('SIZE');
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    return `display.setTextSize(${size});\ndisplay.setCursor(${x}, ${y});\ndisplay.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_print_num'] = function (block: any) {
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    const size = block.getFieldValue('SIZE');
    const val = cppGenerator.valueToCode(block, 'VAL', cppGenerator.ORDER_NONE) || '0';
    return `display.setTextSize(${size});\ndisplay.setCursor(${x}, ${y});\ndisplay.print(${val});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_clear'] = function () {
    return `display.clearDisplay();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_show'] = function () {
    return `display.display();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_draw_line'] = function (block: any) {
    const x1 = block.getFieldValue('X1'), y1 = block.getFieldValue('Y1');
    const x2 = block.getFieldValue('X2'), y2 = block.getFieldValue('Y2');
    return `display.drawLine(${x1}, ${y1}, ${x2}, ${y2}, SSD1306_WHITE);\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_draw_rect'] = function (block: any) {
    const x = block.getFieldValue('X'), y = block.getFieldValue('Y');
    const w = block.getFieldValue('W'), h = block.getFieldValue('H');
    const fill = block.getFieldValue('FILL') === 'FILLED';
    return fill ? `display.fillRect(${x}, ${y}, ${w}, ${h}, SSD1306_WHITE);\n` : `display.drawRect(${x}, ${y}, ${w}, ${h}, SSD1306_WHITE);\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_draw_circle'] = function (block: any) {
    const x = block.getFieldValue('X'), y = block.getFieldValue('Y');
    const r = block.getFieldValue('R');
    const fill = block.getFieldValue('FILL') === 'FILLED';
    return fill ? `display.fillCircle(${x}, ${y}, ${r}, SSD1306_WHITE);\n` : `display.drawCircle(${x}, ${y}, ${r}, SSD1306_WHITE);\n`;
  };

  (cppGenerator as any).forBlock['deneyap_oled_scroll'] = function (block: any) {
    const dir = block.getFieldValue('DIR');
    if (dir === 'RIGHT') return `display.startscrollright(0x00, 0x0F);\n`;
    if (dir === 'LEFT') return `display.startscrollleft(0x00, 0x0F);\n`;
    if (dir === 'DIAG_RIGHT') return `display.startscrolldiagright(0x00, 0x0F);\n`;
    if (dir === 'DIAG_LEFT') return `display.startscrolldiagleft(0x00, 0x0F);\n`;
    return `display.stopscroll();\n`;
  };

  // ==========================================
  // 26 & 27. ☪ Deneyap Algılayıcılar (I2C)
  // ==========================================

  // Barometre
  (cppGenerator as any).forBlock['deneyap_i2c_barometer_init'] = function (block: any) {
    const addr = block.getFieldValue('ADDR');
    cppGenerator.addInclude('deneyap_baro_h', '#include <Deneyap_BasincOlcer.h>');
    cppGenerator.addDeclaration('baro_obj', 'BasincOlcer Barometre;');
    cppGenerator.addSetup('baro_begin', `Barometre.begin(${addr});`);
    return `// Deneyap Barometre (${addr}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_barometer_temp'] = function () {
    return ['Barometre.getTemperature()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_barometer_pressure'] = function () {
    return ['Barometre.getPressure()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_barometer_altitude'] = function () {
    return ['Barometre.getAltitude()', cppGenerator.ORDER_ATOMIC];
  };

  // BME280
  (cppGenerator as any).forBlock['deneyap_i2c_bme280_init'] = function (block: any) {
    const addr = block.getFieldValue('ADDR');
    cppGenerator.addInclude('deneyap_bme_h', '#include <Deneyap_CevreBasinc.h>');
    cppGenerator.addDeclaration('bme_obj', 'CevreBasinc BME280;');
    cppGenerator.addSetup('bme_begin', `BME280.begin(${addr});`);
    return `// Deneyap BME280 (${addr}) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_bme280_temp'] = function () {
    return ['BME280.getTemperature()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_bme280_humidity'] = function () {
    return ['BME280.getHumidity()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_bme280_pressure'] = function () {
    return ['BME280.getPressure()', cppGenerator.ORDER_ATOMIC];
  };

  // Pusula
  (cppGenerator as any).forBlock['deneyap_i2c_compass_init'] = function () {
    cppGenerator.addInclude('deneyap_pusula_h', '#include <Deneyap_Pusula.h>');
    cppGenerator.addDeclaration('pusula_obj', 'Pusula PusulaSens;&');
    cppGenerator.addSetup('pusula_begin', 'PusulaSens.begin();');
    return `// Deneyap Pusula başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_compass_read'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`PusulaSens.get${axis}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_compass_angle'] = function () {
    return ['PusulaSens.getHeading()', cppGenerator.ORDER_ATOMIC];
  };

  // 6 Eksen Ataletsel (IMU)
  (cppGenerator as any).forBlock['deneyap_i2c_imu6_init'] = function () {
    cppGenerator.addInclude('deneyap_imu_h', '#include <Deneyap_6EksenAtaletsel.h>');
    cppGenerator.addDeclaration('imu6_obj', 'LSM6DSM IMU6;');
    cppGenerator.addSetup('imu6_begin', 'IMU6.begin();');
    return `// Deneyap 6-Eksen Ataletsel başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_imu6_accel'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`IMU6.readFloatAccel${axis}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_imu6_gyro'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`IMU6.readFloatGyro${axis}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_imu6_temp'] = function () {
    return ['IMU6.readTempC()', cppGenerator.ORDER_ATOMIC];
  };

  // Jest / Renk (APDS9960)
  (cppGenerator as any).forBlock['deneyap_i2c_apds9960_init'] = function () {
    cppGenerator.addInclude('deneyap_apds_h', '#include <Deneyap_JestAlgilama.h>');
    cppGenerator.addDeclaration('apds_obj', 'Gesture APDS9960;');
    cppGenerator.addSetup('apds_begin', 'APDS9960.begin();');
    return `// Deneyap Jest Algılama başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_apds9960_gesture'] = function () {
    return ['APDS9960.getGestureString()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_apds9960_color'] = function (block: any) {
    const ch = block.getFieldValue('CHANNEL');
    return [`APDS9960.getColor${ch}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_apds9960_proximity'] = function () {
    return ['APDS9960.readProximity()', cppGenerator.ORDER_ATOMIC];
  };

  // Sıcaklık Nem (DHT20 / SHT)
  (cppGenerator as any).forBlock['deneyap_i2c_dht_init'] = function () {
    cppGenerator.addInclude('deneyap_sht_h', '#include <Deneyap_SicaklikNemBasinc.h>');
    cppGenerator.addDeclaration('sht_obj', 'SHT3x SHT;');
    cppGenerator.addSetup('sht_begin', 'SHT.begin();');
    return `// Deneyap Sıcaklık Nem başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_dht_temp'] = function () {
    return ['SHT.getTemperature()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_dht_humidity'] = function () {
    return ['SHT.getHumidity()', cppGenerator.ORDER_ATOMIC];
  };

  // Derinlik
  (cppGenerator as any).forBlock['deneyap_i2c_depth_init'] = function () {
    return `// Deneyap Derinlik başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_depth_read'] = function () {
    return ['readDeneyapDepth()', cppGenerator.ORDER_ATOMIC];
  };

  // Duman / Gaz
  (cppGenerator as any).forBlock['deneyap_i2c_smoke_init'] = function () {
    return `// Deneyap Gaz/Duman Sensörü başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_smoke_val'] = function () {
    return ['readDeneyapSmoke()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_smoke_detected'] = function () {
    return ['(readDeneyapSmoke() > 300)', cppGenerator.ORDER_RELATIONAL];
  };

  // Joystick (I2C)
  (cppGenerator as any).forBlock['deneyap_i2c_joystick_init'] = function () {
    return `// Deneyap I2C Joystick başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_joystick_axis'] = function (block: any) {
    const axis = block.getFieldValue('AXIS');
    return [`readDeneyapJoystick_${axis}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_joystick_button'] = function () {
    return ['readDeneyapJoystick_Button()', cppGenerator.ORDER_ATOMIC];
  };

  // Çift Çizgi İzleyen
  (cppGenerator as any).forBlock['deneyap_i2c_line_init'] = function () {
    return `// Deneyap Çizgi İzleyen başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_line_read'] = function (block: any) {
    const side = block.getFieldValue('SIDE');
    return [`readDeneyapLine_${side}()`, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_line_status'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    return [`isDeneyapLineColor("${color}")`, cppGenerator.ORDER_ATOMIC];
  };

  // Lazer Mesafe (VL53L0X)
  (cppGenerator as any).forBlock['deneyap_i2c_vl53l0x_init'] = function () {
    cppGenerator.addInclude('deneyap_tof_h', '#include <Deneyap_LazerMesafe.h>');
    cppGenerator.addDeclaration('tof_obj', 'VL53L0X LazerMesafe;');
    cppGenerator.addSetup('tof_begin', 'LazerMesafe.begin();');
    return `// Deneyap Lazer Mesafe başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_vl53l0x_dist'] = function () {
    return ['LazerMesafe.readRangeSingleMillimeters()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_vl53l0x_ambient'] = function () {
    return ['LazerMesafe.readAmbientLight()', cppGenerator.ORDER_ATOMIC];
  };

  // Yağmur Sensörü
  (cppGenerator as any).forBlock['deneyap_i2c_rain_init'] = function () {
    return `// Deneyap Yağmur Sensörü başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_rain_val'] = function () {
    return ['readDeneyapRain()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_rain_is_raining'] = function () {
    return ['(readDeneyapRain() > 200)', cppGenerator.ORDER_RELATIONAL];
  };

  // Röle
  (cppGenerator as any).forBlock['deneyap_i2c_relay_init'] = function () {
    return `// Deneyap Röle başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_relay_set'] = function (block: any) {
    const ch = block.getFieldValue('CH');
    const state = block.getFieldValue('STATE');
    return `setDeneyapRelay(${ch}, ${state});\n`;
  };

  // Toprak Nemi
  (cppGenerator as any).forBlock['deneyap_i2c_soil_init'] = function () {
    return `// Deneyap Toprak Nemi başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_soil_read'] = function () {
    return ['readDeneyapSoilMoisture()', cppGenerator.ORDER_ATOMIC];
  };

  // Dokunmatik Tuş Takımı
  (cppGenerator as any).forBlock['deneyap_i2c_touch_init'] = function () {
    return `// Deneyap Dokunmatik başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_touch_read'] = function () {
    return ['readDeneyapTouchKey()', cppGenerator.ORDER_ATOMIC];
  };

  // Kızılötesi Alıcı-Verici
  (cppGenerator as any).forBlock['deneyap_i2c_ir_init'] = function () {
    return `// Deneyap I2C Kızılötesi başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_ir_read'] = function () {
    return ['readDeneyapI2CIR()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_ir_send'] = function (block: any) {
    const code = block.getFieldValue('CODE');
    return `sendDeneyapI2CIR(${code});\n`;
  };

  // PIR Hareket Sensörü
  (cppGenerator as any).forBlock['deneyap_i2c_pir_init'] = function () {
    return `// Deneyap Hareket (PIR) başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_pir_motion'] = function () {
    return ['readDeneyapPIR()', cppGenerator.ORDER_ATOMIC];
  };

  // RTC (I2C)
  (cppGenerator as any).forBlock['deneyap_i2c_rtc_init'] = function () {
    return `// Deneyap I2C RTC başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_rtc_reset'] = function () {
    return `resetDeneyapI2CRTC();\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_rtc_read'] = function (block: any) {
    const type = block.getFieldValue('TYPE');
    return [type === 'TIME' ? 'getDeneyapRTCTime()' : 'getDeneyapRTCDate()', cppGenerator.ORDER_ATOMIC];
  };

  // DC Motor Sürücü
  (cppGenerator as any).forBlock['deneyap_i2c_dcmotor_init'] = function () {
    return `// Deneyap DC Motor Sürücü başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_dcmotor_drive'] = function (block: any) {
    const m = block.getFieldValue('MOTOR');
    const dir = block.getFieldValue('DIR');
    const speed = cppGenerator.valueToCode(block, 'SPEED', cppGenerator.ORDER_NONE) || '255';
    return `driveDeneyapDCMotor("${m}", "${dir}", ${speed});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_dcmotor_stop'] = function (block: any) {
    const m = block.getFieldValue('MOTOR');
    return `stopDeneyapDCMotor("${m}");\n`;
  };

  // Step Motor Sürücü
  (cppGenerator as any).forBlock['deneyap_i2c_stepper_init'] = function () {
    return `// Deneyap Step Motor Sürücü başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_stepper_step'] = function (block: any) {
    const steps = cppGenerator.valueToCode(block, 'STEPS', cppGenerator.ORDER_NONE) || '100';
    const speed = cppGenerator.valueToCode(block, 'SPEED', cppGenerator.ORDER_NONE) || '60';
    return `stepDeneyapStepper(${steps}, ${speed});\n`;
  };

  // UV Sensörü
  (cppGenerator as any).forBlock['deneyap_i2c_uv_init'] = function () {
    return `// Deneyap UV Sensörü başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_uv_read'] = function () {
    return ['readDeneyapUV()', cppGenerator.ORDER_ATOMIC];
  };

  // Mikrofon
  (cppGenerator as any).forBlock['deneyap_i2c_mic_init'] = function () {
    return `// Deneyap I2C Mikrofon başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_mic_read'] = function () {
    return ['readDeneyapI2CMic()', cppGenerator.ORDER_ATOMIC];
  };

  // GPS
  (cppGenerator as any).forBlock['deneyap_i2c_gps_init'] = function () {
    return `// Deneyap GPS başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_i2c_gps_lat'] = function () {
    return ['getDeneyapGPS_Lat()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_gps_lng'] = function () {
    return ['getDeneyapGPS_Lng()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_gps_speed'] = function () {
    return ['getDeneyapGPS_Speed()', cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_i2c_gps_sats'] = function () {
    return ['getDeneyapGPS_Satellites()', cppGenerator.ORDER_ATOMIC];
  };
}
