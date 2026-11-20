import { cppGenerator } from './cppGenerator';

export function registerDeneyapGenerators() {
  // 1. Buton
  (cppGenerator as any).forBlock['deneyap_button_read'] = function () {
    cppGenerator.addSetup('pinMode_GPKEY', 'pinMode(GPKEY, INPUT_PULLUP);');
    // Button is pulled up, pressing it connects to GND (LOW)
    const code = '(!digitalRead(GPKEY))';
    return [code, cppGenerator.ORDER_LOGICAL_AND];
  };

  // 2. Zaman
  (cppGenerator as any).forBlock['deneyap_delay'] = function (block: any) {
    const delayMs = cppGenerator.valueToCode(block, 'DELAY_MS', cppGenerator.ORDER_NONE) || '1000';
    return `delay(${delayMs});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_millis'] = function () {
    return ['millis()', cppGenerator.ORDER_ATOMIC];
  };

  // 3. Giriş / Çıkış (GPIO)
  (cppGenerator as any).forBlock['deneyap_digital_write'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `digitalWrite(${pin}, ${state});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_digital_read'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT);`);
    const code = `digitalRead(${pin})`;
    return [code, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_analog_read'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const code = `analogRead(${pin})`;
    return [code, cppGenerator.ORDER_ATOMIC];
  };

  (cppGenerator as any).forBlock['deneyap_pwm_write'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const val = cppGenerator.valueToCode(block, 'VALUE', cppGenerator.ORDER_NONE) || '128';
    cppGenerator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `analogWrite(${pin}, ${val});\n`;
  };

  // 4. Dahili RGB LED
  (cppGenerator as any).forBlock['deneyap_rgb_builtin_set'] = function (block: any) {
    const r = cppGenerator.valueToCode(block, 'RED', cppGenerator.ORDER_NONE) || '0';
    const g = cppGenerator.valueToCode(block, 'GREEN', cppGenerator.ORDER_NONE) || '0';
    const b = cppGenerator.valueToCode(block, 'BLUE', cppGenerator.ORDER_NONE) || '0';

    cppGenerator.addSetup('rgb_init', 'pinMode(LEDR, OUTPUT);\n  pinMode(LEDG, OUTPUT);\n  pinMode(LEDB, OUTPUT);');

    // On standard Deneyap Kart, RGB LEDs are Active Low (PWM 255 - val)
    return `analogWrite(LEDR, 255 - (${r}));\nanalogWrite(LEDG, 255 - (${g}));\nanalogWrite(LEDB, 255 - (${b}));\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rgb_builtin_color'] = function (block: any) {
    const color = block.getFieldValue('COLOR');
    cppGenerator.addSetup('rgb_init', 'pinMode(LEDR, OUTPUT);\n  pinMode(LEDG, OUTPUT);\n  pinMode(LEDB, OUTPUT);');

    // Values for Active LOW (0 = full on, 255 = off)
    let r = 255;
    let g = 255;
    let b = 255;

    switch (color) {
      case 'RED':
        r = 0; g = 255; b = 255;
        break;
      case 'GREEN':
        r = 255; g = 0; b = 255;
        break;
      case 'BLUE':
        r = 255; g = 255; b = 0;
        break;
      case 'YELLOW':
        r = 0; g = 0; b = 255;
        break;
      case 'CYAN':
        r = 255; g = 0; b = 0;
        break;
      case 'MAGENTA':
        r = 0; g = 255; b = 0;
        break;
      case 'WHITE':
        r = 0; g = 0; b = 0;
        break;
      case 'OFF':
      default:
        r = 255; g = 255; b = 255;
        break;
    }

    return `analogWrite(LEDR, ${r});\nanalogWrite(LEDG, ${g});\nanalogWrite(LEDB, ${b});\n`;
  };

  // 5. Servo Motor
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

  // 6. Ses (Buzzer)
  (cppGenerator as any).forBlock['deneyap_buzzer_tone'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    const freq = cppGenerator.valueToCode(block, 'FREQ', cppGenerator.ORDER_NONE) || '1000';
    const duration = cppGenerator.valueToCode(block, 'DURATION', cppGenerator.ORDER_NONE) || '500';
    cppGenerator.addSetup(`buzzer_pin_${pin}`, `pinMode(${pin}, OUTPUT);`);
    return `tone(${pin}, ${freq}, ${duration});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_buzzer_notone'] = function (block: any) {
    const pin = block.getFieldValue('PIN');
    return `noTone(${pin});\n`;
  };

  // 7. Seri İletişim
  (cppGenerator as any).forBlock['deneyap_serial_begin'] = function (block: any) {
    const baud = block.getFieldValue('BAUD');
    cppGenerator.addSetup('serial_begin', `Serial.begin(${baud});`);
    return `// Seri port başlatıldı (${baud})\n`;
  };

  (cppGenerator as any).forBlock['deneyap_serial_print'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    return `Serial.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_serial_println'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    return `Serial.println(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_serial_available'] = function () {
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    return ['(Serial.available() > 0)', cppGenerator.ORDER_RELATIONAL];
  };

  (cppGenerator as any).forBlock['deneyap_serial_read'] = function () {
    cppGenerator.addSetup('serial_begin', 'Serial.begin(115200);');
    return ['Serial.readString()', cppGenerator.ORDER_ATOMIC];
  };

  // 8. Bluetooth (Classic)
  (cppGenerator as any).forBlock['deneyap_bluetooth_begin'] = function (block: any) {
    const name = block.getFieldValue('NAME') || 'Deneyap_BT';
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    cppGenerator.addSetup('bt_begin', `SerialBT.begin("${name}");`);
    return `// Bluetooth başlatıldı: "${name}"\n`;
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_println'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    return `SerialBT.println(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_available'] = function () {
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    return ['(SerialBT.available() > 0)', cppGenerator.ORDER_RELATIONAL];
  };

  (cppGenerator as any).forBlock['deneyap_bluetooth_read'] = function () {
    cppGenerator.addInclude('bluetooth_serial', '#include "BluetoothSerial.h"');
    cppGenerator.addDeclaration('bt_serial_obj', 'BluetoothSerial SerialBT;');
    return ['SerialBT.readString()', cppGenerator.ORDER_ATOMIC];
  };

  // 9. LCD I2C
  (cppGenerator as any).forBlock['deneyap_lcd_init'] = function (block: any) {
    const addr = block.getFieldValue('ADDR');
    const size = block.getFieldValue('SIZE');
    cppGenerator.addInclude('wire_h', '#include <Wire.h>');
    cppGenerator.addInclude('lcd_i2c_h', '#include <LiquidCrystal_I2C.h>');
    cppGenerator.addDeclaration('lcd_obj', `LiquidCrystal_I2C lcd(${addr}, ${size});`);
    cppGenerator.addSetup('wire_begin', 'Wire.begin();');
    cppGenerator.addSetup('lcd_init', 'lcd.init();\n  lcd.backlight();');
    return `// LCD I2C başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_print'] = function (block: any) {
    const text = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) || '""';
    const col = cppGenerator.valueToCode(block, 'COL', cppGenerator.ORDER_NONE) || '0';
    const row = cppGenerator.valueToCode(block, 'ROW', cppGenerator.ORDER_NONE) || '0';
    return `lcd.setCursor(${col}, ${row});\nlcd.print(${text});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_lcd_clear'] = function () {
    return `lcd.clear();\n`;
  };

  // 10. Step Motor
  (cppGenerator as any).forBlock['deneyap_stepper_init'] = function () {
    cppGenerator.addInclude('stepper_h', '#include <Stepper.h>');
    cppGenerator.addDeclaration('stepper_obj', 'Stepper myStepper(2048, D0, D2, D1, D3);');
    cppGenerator.addSetup('stepper_speed', 'myStepper.setSpeed(10);');
    return `// Step Motor başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_stepper_speed'] = function (block: any) {
    const speed = cppGenerator.valueToCode(block, 'SPEED', cppGenerator.ORDER_NONE) || '10';
    cppGenerator.addInclude('stepper_h', '#include <Stepper.h>');
    cppGenerator.addDeclaration('stepper_obj', 'Stepper myStepper(2048, D0, D2, D1, D3);');
    return `myStepper.setSpeed(${speed});\n`;
  };

  (cppGenerator as any).forBlock['deneyap_stepper_step'] = function (block: any) {
    const steps = cppGenerator.valueToCode(block, 'STEPS', cppGenerator.ORDER_NONE) || '2048';
    cppGenerator.addInclude('stepper_h', '#include <Stepper.h>');
    cppGenerator.addDeclaration('stepper_obj', 'Stepper myStepper(2048, D0, D2, D1, D3);');
    return `myStepper.step(${steps});\n`;
  };

  // 11. RFID (MFRC522)
  (cppGenerator as any).forBlock['deneyap_rfid_init'] = function () {
    cppGenerator.addInclude('spi_h', '#include <SPI.h>');
    cppGenerator.addInclude('mfrc522_h', '#include <MFRC522.h>');
    cppGenerator.addDeclaration('rfid_obj', 'MFRC522 rfid(D10, D9);');
    cppGenerator.addSetup('spi_begin', 'SPI.begin();');
    cppGenerator.addSetup('rfid_init', 'rfid.PCD_Init();');
    return `// RFID Okuyucu başlatıldı\n`;
  };

  (cppGenerator as any).forBlock['deneyap_rfid_card_present'] = function () {
    cppGenerator.addInclude('spi_h', '#include <SPI.h>');
    cppGenerator.addInclude('mfrc522_h', '#include <MFRC522.h>');
    cppGenerator.addDeclaration('rfid_obj', 'MFRC522 rfid(D10, D9);');
    const code = '(rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial())';
    return [code, cppGenerator.ORDER_LOGICAL_AND];
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

  // 12. Ultrasonik Mesafe
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
    const code = `readDistanceCM(${trig}, ${echo})`;
    return [code, cppGenerator.ORDER_ATOMIC];
  };
}
