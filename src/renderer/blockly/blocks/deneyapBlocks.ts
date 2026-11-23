import * as Blockly from 'blockly/core';

// Helper for standard Deneyap pin dropdown
export const DENEYAP_DIGITAL_PINS: [string, string][] = [
  ['D0', 'D0'], ['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'],
  ['D4', 'D4'], ['D5', 'D5'], ['D6', 'D6'], ['D7', 'D7'],
  ['D8', 'D8'], ['D9', 'D9'], ['D10', 'D10'], ['D11', 'D11'],
  ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
];

export const DENEYAP_ANALOG_PINS: [string, string][] = [
  ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'],
  ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5']
];

export const DENEYAP_PWM_PINS: [string, string][] = [
  ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
  ['D6', 'D6'], ['D7', 'D7'], ['D9', 'D9'], ['D10', 'D10'],
  ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
];

export function registerDeneyapBlocks() {
  // ==========================================
  // 1. ☪ Deneyap (Kırmızı / Red)
  // ==========================================

  Blockly.Blocks['deneyap_include'] = {
    init: function () {
      this.appendDummyInput().appendField('#include "deneyap.h"');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d32f2f');
      this.setTooltip('Deneyap kütüphanesini koda dahil eder.');
    }
  };

  Blockly.Blocks['deneyap_pin_array'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Pin dizisini tanımla')
        .appendField(new Blockly.FieldTextInput('D0, D1, D4, D5'), 'PINS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d32f2f');
      this.setTooltip('Belirtilen pinlerden oluşan bir dizi tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_tanimlama'] = {
    init: function () {
      this.appendDummyInput().appendField('Tanımlama');
      this.appendStatementInput('DECL').appendField('yap');
      this.setColour('#d32f2f');
      this.setTooltip('Genel değişkenler ve kurulum öncesi tanımlamalar buraya eklenir.');
    }
  };

  Blockly.Blocks['deneyap_kurulum_dongu'] = {
    init: function () {
      this.appendDummyInput().appendField('Kurulum');
      this.appendStatementInput('SETUP').appendField('yap');
      this.appendDummyInput().appendField('Döngü');
      this.appendStatementInput('LOOP').appendField('yap');
      this.setColour('#d32f2f');
      this.setTooltip('Deneyap Kart ana çalıştırma bloğu: Kurulum tek sefer, Döngü sürekli çalışır.');
    }
  };

  Blockly.Blocks['deneyap_raw_code_stmt'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('kod')
        .appendField(new Blockly.FieldTextInput('Serial.println("Merhaba");'), 'CODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d32f2f');
      this.setTooltip('Doğrudan C++ kod satırı çalıştırır.');
    }
  };

  Blockly.Blocks['deneyap_raw_code_expr'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('kod')
        .appendField(new Blockly.FieldTextInput('millis()'), 'CODE');
      this.setOutput(true, null);
      this.setColour('#d32f2f');
      this.setTooltip('Doğrudan C++ ifadesi (değeri) döndürür.');
    }
  };

  Blockly.Blocks['deneyap_to_hex'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .appendField('HEX koduna dönüştür');
      this.setOutput(true, 'String');
      this.setColour('#d32f2f');
      this.setTooltip('Verilen sayıyı onaltılık (HEX) metin formatına çevirir.');
    }
  };

  Blockly.Blocks['deneyap_button_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Dahili Buton (GPKEY) Basılı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#d32f2f');
      this.setTooltip('Deneyap Kart üzerindeki dahili buton basılı olduğunda Doğru (true) döner.');
    }
  };

  // ==========================================
  // 2. ⇆ Mantık (Turuncu / Gold)
  // ==========================================

  Blockly.Blocks['deneyap_logic_constant'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['1 (YÜKSEK)', '1'],
          ['0 (DÜŞÜK)', '0']
        ]), 'VAL');
      this.setOutput(true, 'Number');
      this.setColour('#f39c12');
      this.setTooltip('1 (HIGH / Lojik 1) veya 0 (LOW / Lojik 0) sabit değeri.');
    }
  };

  Blockly.Blocks['deneyap_switch_case'] = {
    init: function () {
      this.appendValueInput('EXPR')
        .appendField('süre')
        .appendField('dir yap');
      this.appendValueInput('CASE1_VAL').appendField('durum');
      this.appendStatementInput('CASE1_DO').appendField('yap');
      this.appendValueInput('CASE2_VAL').appendField('durum');
      this.appendStatementInput('CASE2_DO').appendField('yap');
      this.appendStatementInput('DEFAULT_DO').appendField('varsayılan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f39c12');
      this.setTooltip('Seçilen değişken değerine göre ilgili durum kodunu çalıştırır.');
    }
  };

  // ==========================================
  // 3. ⏱ Zaman (Camgöbeği / Teal)
  // ==========================================

  Blockly.Blocks['deneyap_delay_unit'] = {
    init: function () {
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('bekle');
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['milisaniye', 'MILLIS'],
          ['mikrosaniye', 'MICROS']
        ]), 'UNIT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00838f');
      this.setTooltip('Belirtilen milisaniye veya mikrosaniye kadar bekler.');
    }
  };

  Blockly.Blocks['deneyap_delay'] = {
    init: function () {
      this.appendValueInput('DELAY_MS')
        .setCheck('Number')
        .appendField('bekle (ms)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00838f');
      this.setTooltip('Belirtilen milisaniye kadar bekler.');
    }
  };

  Blockly.Blocks['deneyap_interval'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Tümü')
        .appendField(new Blockly.FieldNumber(1000, 1), 'INTERVAL')
        .appendField(new Blockly.FieldDropdown([
          ['milisaniye', 'MILLIS'],
          ['mikrosaniye', 'MICROS']
        ]), 'UNIT')
        .appendField('yap');
      this.appendStatementInput('DO');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00838f');
      this.setTooltip('Programı dondurmadan periyodik aralıklarla kod çalıştırır.');
    }
  };

  Blockly.Blocks['deneyap_time_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['milisaniye', 'MILLIS'],
          ['mikrosaniye', 'MICROS']
        ]), 'UNIT');
      this.setOutput(true, 'Number');
      this.setColour('#00838f');
      this.setTooltip('Kart açıldığından beri geçen milisaniye veya mikrosaniye süresi.');
    }
  };

  Blockly.Blocks['deneyap_millis'] = {
    init: function () {
      this.appendDummyInput().appendField('Çalışma Zamanı (milisaniye)');
      this.setOutput(true, 'Number');
      this.setColour('#00838f');
      this.setTooltip('Kartın açılışından itibaren geçen süreyi milisaniye olarak verir.');
    }
  };

  Blockly.Blocks['deneyap_pulse_in'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Durum süresi')
        .appendField(new Blockly.FieldDropdown([
          ['YÜKSEK', 'HIGH'],
          ['DÜŞÜK', 'LOW']
        ]), 'VAL')
        .appendField('Pinde')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN')
        .appendField('Zaman aşımı')
        .appendField(new Blockly.FieldNumber(1000000, 1), 'TIMEOUT')
        .appendField('mikrosaniye');
      this.setOutput(true, 'Number');
      this.setColour('#00838f');
      this.setTooltip('Pindeki darbe süresini mikrosaniye olarak ölçer (pulseIn).');
    }
  };

  // ==========================================
  // 4. ∑ Matematik (Kırmızı / Red)
  // ==========================================

  Blockly.Blocks['deneyap_math_map'] = {
    init: function () {
      this.appendValueInput('VAL')
        .setCheck('Number')
        .appendField('İndeksle Değer');
      this.appendValueInput('F_LOW').setCheck('Number').appendField('dan');
      this.appendValueInput('F_HIGH').setCheck('Number').appendField('e');
      this.appendValueInput('T_LOW').setCheck('Number').appendField('ve');
      this.appendValueInput('T_HIGH').setCheck('Number').appendField('dan e');
      this.setOutput(true, 'Number');
      this.setColour('#d32f2f');
      this.setTooltip('Değeri bir sayı aralığından başka bir sayı aralığına oranlar (map).');
    }
  };

  Blockly.Blocks['deneyap_math_angle'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Açı')
        .appendField(new Blockly.FieldNumber(90, 0, 180), 'ANGLE');
      this.setOutput(true, 'Number');
      this.setColour('#d32f2f');
      this.setTooltip('Derece cinsinden açı değeri.');
    }
  };

  Blockly.Blocks['deneyap_math_analog_pin'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Analog Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_ANALOG_PINS), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#d32f2f');
      this.setTooltip('Seçilen analog pin numarası sabiti.');
    }
  };

  Blockly.Blocks['deneyap_math_chained_compare'] = {
    init: function () {
      this.appendValueInput('LOW').setCheck('Number');
      this.appendDummyInput().appendField('<');
      this.appendValueInput('VAL').setCheck('Number');
      this.appendDummyInput().appendField('<');
      this.appendValueInput('HIGH').setCheck('Number');
      this.setOutput(true, 'Boolean');
      this.setColour('#d32f2f');
      this.setTooltip('Değerin iki sayı arasında olup olmadığını kontrol eder (A < x < B).');
    }
  };

  // ==========================================
  // 5. “ Metin (Amber / Yellow)
  // ==========================================

  Blockly.Blocks['deneyap_text_char'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("'")
        .appendField(new Blockly.FieldTextInput('A'), 'CHAR')
        .appendField("'");
      this.setOutput(true, 'Number');
      this.setColour('#f5a623');
      this.setTooltip('Tek bir karakter (char) sabiti.');
    }
  };

  Blockly.Blocks['deneyap_text_compare'] = {
    init: function () {
      this.appendValueInput('A').setCheck('String').appendField('Metin');
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['=', 'EQ'],
          ['≠', 'NEQ']
        ]), 'OP');
      this.appendValueInput('B').setCheck('String');
      this.setOutput(true, 'Boolean');
      this.setColour('#f5a623');
      this.setTooltip('İki metni karşılaştırır.');
    }
  };

  // ==========================================
  // 6. ∿ Değişken (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_variable_address'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Adresini Al')
        .appendField(new Blockly.FieldVariable('öğe'), 'VAR');
      this.setOutput(true, null);
      this.setColour('#2980b9');
      this.setTooltip('Değişkenin bellek adresini (pointer / &değişken) alır.');
    }
  };

  // ==========================================
  // 7. ∫∫ Fonksiyon (Kırmızı / Red)
  // ==========================================

  Blockly.Blocks['deneyap_procedure_defreturn_typed'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('bir şey yapmak için')
        .appendField(new Blockly.FieldTextInput('fonksiyonum'), 'NAME')
        .appendField('tür:')
        .appendField(new Blockly.FieldDropdown([
          ['tam sayı (int)', 'int'],
          ['ondalıklı (float)', 'float'],
          ['karakter (char)', 'char'],
          ['mantıksal (bool)', 'bool'],
          ['metin (String)', 'String']
        ]), 'TYPE');
      this.appendStatementInput('STACK').appendField('yap');
      this.appendValueInput('RETURN').appendField('dön');
      this.setColour('#d32f2f');
      this.setTooltip('Belirtilen dönüş türünde bir fonksiyon tanımlar.');
    }
  };

  // ==========================================
  // 8. ⇅ Giriş/Çıkış (Koyu Camgöbeği / Teal)
  // ==========================================

  Blockly.Blocks['deneyap_digital_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dijital Oku Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setOutput(true, 'Boolean');
      this.setColour('#008b8b');
      this.setTooltip('Dijital pinin lojik durumunu (1 veya 0) okur.');
    }
  };

  Blockly.Blocks['deneyap_digital_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dijital Yaz Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN')
        .appendField(new Blockly.FieldDropdown([
          ['1 (YÜKSEK)', 'HIGH'],
          ['0 (DÜŞÜK)', 'LOW']
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('Belirtilen dijital pini YÜKSEK veya DÜŞÜK yapar.');
    }
  };

  Blockly.Blocks['deneyap_analog_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Analog Oku Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_ANALOG_PINS), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#008b8b');
      this.setTooltip('Analog pinden değer okur (0 - 4095).');
    }
  };

  Blockly.Blocks['deneyap_analog_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Analog Yaz Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN');
      this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('Değer (0-255)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('Pinden analog / PWM çıkışı üretir (0-255).');
    }
  };

  Blockly.Blocks['deneyap_pwm_write'] = Blockly.Blocks['deneyap_analog_write'];

  Blockly.Blocks['deneyap_digital_read_pullup'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dijital Giriş (Dahili Direnç) Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setOutput(true, 'Boolean');
      this.setColour('#008b8b');
      this.setTooltip('Pini INPUT_PULLUP olarak yapılandırıp lojik seviyesini okur.');
    }
  };

  Blockly.Blocks['deneyap_attach_interrupt'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kesme: bir')
        .appendField(new Blockly.FieldDropdown([
          ['yükselen kenar', 'RISING'],
          ['düşen kenar', 'FALLING'],
          ['durum değişimi', 'CHANGE']
        ]), 'MODE')
        .appendField('Pin üzerinde tespit edildi')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN')
        .appendField('yap');
      this.appendStatementInput('DO');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('Pinde belirtilen kenar değiştiğinde donanımsal kesme (interrupt) çalıştırır.');
    }
  };

  Blockly.Blocks['deneyap_detach_interrupt'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kesmeyi durdur Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('Pindeki donanımsal kesmeyi devre dışı bırakır.');
    }
  };

  Blockly.Blocks['deneyap_pin_mode'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dijital Pini')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN')
        .appendField(new Blockly.FieldDropdown([
          ['ÇIKIŞ', 'OUTPUT'],
          ['GİRİŞ', 'INPUT'],
          ['GİRİŞ (Dahili Direnç)', 'INPUT_PULLUP']
        ]), 'MODE')
        .appendField('olarak kullan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('Pinin çalışma modunu (Giriş/Çıkış) belirler.');
    }
  };

  Blockly.Blocks['deneyap_pwm_setup'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('PWM Pini')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Frekans')
        .appendField(new Blockly.FieldNumber(5000, 1), 'FREQ')
        .appendField('Çözünürlük')
        .appendField(new Blockly.FieldNumber(8, 1, 16), 'RES')
        .appendField('Kanal')
        .appendField(new Blockly.FieldNumber(0, 0, 15), 'CHANNEL')
        .appendField('olarak kullan');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('ESP32 LEDC PWM kanalını ve frekansını yapılandırır.');
    }
  };

  Blockly.Blocks['deneyap_pwm_custom_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('PWM Pini')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Frekans')
        .appendField(new Blockly.FieldNumber(5000, 1), 'FREQ')
        .appendField('Çözünürlük')
        .appendField(new Blockly.FieldNumber(8, 1, 16), 'RES')
        .appendField('Kanal')
        .appendField(new Blockly.FieldNumber(0, 0, 15), 'CHANNEL')
        .appendField('Değer');
      this.appendValueInput('VAL').setCheck('Number');
      this.appendDummyInput().appendField('yap');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('PWM kanalına özel çözünürlükte sinyal gönderir.');
    }
  };

  Blockly.Blocks['deneyap_pin_toggle'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Pinin durumunu değiştir')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#008b8b');
      this.setTooltip('Pinin çıkış lojik durumunu tersine çevirir (1 ise 0, 0 ise 1).');
    }
  };

  // ==========================================
  // 9. Saat (RTC) (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_rtc_set_time'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RTC Tarih ve Saati Ayarla')
        .appendField('Yıl')
        .appendField(new Blockly.FieldNumber(2024, 2000, 2099), 'YEAR')
        .appendField('Ay')
        .appendField(new Blockly.FieldNumber(1, 1, 12), 'MONTH')
        .appendField('Gün')
        .appendField(new Blockly.FieldNumber(1, 1, 31), 'DAY')
        .appendField('Saat')
        .appendField(new Blockly.FieldNumber(12, 0, 23), 'HOUR')
        .appendField('Dakika')
        .appendField(new Blockly.FieldNumber(0, 0, 59), 'MINUTE')
        .appendField('Saniye')
        .appendField(new Blockly.FieldNumber(0, 0, 59), 'SECOND');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1e88e5');
      this.setTooltip('Gerçek Zamanlı Saat (RTC) donanımının tarih ve saatini ayarlar.');
    }
  };

  Blockly.Blocks['deneyap_rtc_refresh'] = {
    init: function () {
      this.appendDummyInput().appendField('RTC Yenile');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1e88e5');
      this.setTooltip('RTC verilerini günceller.');
    }
  };

  Blockly.Blocks['deneyap_rtc_get_part'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RTC Göster')
        .appendField(new Blockly.FieldDropdown([
          ['Yıl', 'YEAR'],
          ['Ay', 'MONTH'],
          ['Gün', 'DAY'],
          ['Saat', 'HOUR'],
          ['Dakika', 'MINUTE'],
          ['Saniye', 'SECOND'],
          ['Haftanın Günü', 'DOW']
        ]), 'PART');
      this.setOutput(true, 'Number');
      this.setColour('#1e88e5');
      this.setTooltip('RTC modülünden belirtilen tarih veya saat bileşenini okur.');
    }
  };

  Blockly.Blocks['deneyap_rtc_get_date'] = {
    init: function () {
      this.appendDummyInput().appendField('RTC Tarihi Göster');
      this.setOutput(true, 'String');
      this.setColour('#1e88e5');
      this.setTooltip('RTC modülünden GG/AA/YYYY formatında tarihi metin olarak verir.');
    }
  };

  Blockly.Blocks['deneyap_rtc_get_time'] = {
    init: function () {
      this.appendDummyInput().appendField('RTC Saati Göster');
      this.setOutput(true, 'String');
      this.setColour('#1e88e5');
      this.setTooltip('RTC modülünden SS:DD:SS formatında saati metin olarak verir.');
    }
  };

  // ==========================================
  // 10. ▦ Dizi (Koyu Turuncu / Dark Orange)
  // ==========================================

  Blockly.Blocks['deneyap_array_define'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('diziyi ayarla')
        .appendField(new Blockly.FieldTextInput('dizi1'), 'NAME')
        .appendField('tip')
        .appendField(new Blockly.FieldDropdown([
          ['tam sayı', 'int'],
          ['ondalıklı', 'float'],
          ['karakter', 'char'],
          ['metin', 'String'],
          ['mantıksal', 'bool']
        ]), 'TYPE')
        .appendField('boyutu')
        .appendField(new Blockly.FieldNumber(10, 1), 'SIZE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e65100');
      this.setTooltip('Belirtilen türde ve boyutta sabit bir dizi oluşturur.');
    }
  };

  Blockly.Blocks['deneyap_array_set'] = {
    init: function () {
      this.appendValueInput('INDEX')
        .setCheck('Number')
        .appendField(new Blockly.FieldTextInput('dizi1'), 'NAME')
        .appendField('nin');
      this.appendValueInput('VAL')
        .appendField('. elemanını');
      this.appendDummyInput().appendField('yap');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e65100');
      this.setTooltip('Dizinin belirtilen indeksindeki elemanı günceller.');
    }
  };

  Blockly.Blocks['deneyap_array_get'] = {
    init: function () {
      this.appendValueInput('INDEX')
        .setCheck('Number')
        .appendField(new Blockly.FieldTextInput('dizi1'), 'NAME')
        .appendField('nin');
      this.appendDummyInput().appendField('. elemanı');
      this.setOutput(true, null);
      this.setColour('#e65100');
      this.setTooltip('Dizinin belirtilen indeksindeki elemanını okur.');
    }
  };

  Blockly.Blocks['deneyap_array_size'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('dizi1'), 'NAME')
        .appendField('nin boyutu');
      this.setOutput(true, 'Number');
      this.setColour('#e65100');
      this.setTooltip('Dizinin eleman sayısını döndürür.');
    }
  };

  // ==========================================
  // 11. ↻ Step Motor (Çivit / Indigo)
  // ==========================================

  Blockly.Blocks['deneyap_l298n_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('L298N Sürücü Tanımla Motor A')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'INA1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'INA2')
        .appendField('Motor B')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'INB1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'INB2');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#303f9f');
      this.setTooltip('L298N DC motor sürücü pinlerini tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_l298n_drive'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('L298N Sür')
        .appendField(new Blockly.FieldDropdown([
          ['Motor A', 'A'],
          ['Motor B', 'B'],
          ['İkisi Birlikte', 'BOTH']
        ]), 'MOTOR')
        .appendField('Yön')
        .appendField(new Blockly.FieldDropdown([
          ['İleri', 'FORWARD'],
          ['Geri', 'BACKWARD'],
          ['Durdur', 'STOP']
        ]), 'DIR');
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Hız (0-255)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#303f9f');
      this.setTooltip('L298N sürücüsü ile DC motorları sürer.');
    }
  };

  Blockly.Blocks['deneyap_stepper_def'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Step Motor Tanımla ID')
        .appendField(new Blockly.FieldTextInput('step1'), 'ID')
        .appendField('Adım')
        .appendField(new Blockly.FieldNumber(2048, 1), 'STEPS')
        .appendField('Pinler')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'IN1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'IN2')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'IN3')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'IN4');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#303f9f');
      this.setTooltip('4 pinli step motor sürücüsünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_stepper_set_speed'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Step Motor')
        .appendField(new Blockly.FieldTextInput('step1'), 'ID')
        .appendField('Hız (RPM)');
      this.appendValueInput('SPEED').setCheck('Number');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#303f9f');
      this.setTooltip('Step motor dönüş hızını ayarlar.');
    }
  };

  Blockly.Blocks['deneyap_stepper_step_custom'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Step Motor')
        .appendField(new Blockly.FieldTextInput('step1'), 'ID')
        .appendField('Adım');
      this.appendValueInput('STEPS').setCheck('Number');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#303f9f');
      this.setTooltip('Step motoru belirtilen adım kadar döndürür.');
    }
  };

  Blockly.Blocks['deneyap_stepper_init'] = Blockly.Blocks['deneyap_stepper_def'];
  Blockly.Blocks['deneyap_stepper_speed'] = Blockly.Blocks['deneyap_stepper_set_speed'];
  Blockly.Blocks['deneyap_stepper_step'] = Blockly.Blocks['deneyap_stepper_step_custom'];

  // ==========================================
  // 12. ∿ Servo (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_servo_full'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Döndür Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Kanal')
        .appendField(new Blockly.FieldNumber(0, 0, 15), 'CHANNEL')
        .appendField('Açı (0°-180°)')
        .appendField(new Blockly.FieldNumber(90, 0, 180), 'ANGLE')
        .appendField('Bekle (ms)')
        .appendField(new Blockly.FieldNumber(100, 0), 'WAIT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1565c0');
      this.setTooltip('Servo motoru belirtilen açıya getirir ve bekler.');
    }
  };

  Blockly.Blocks['deneyap_servo_attach'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Servo Başlat Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1565c0');
      this.setTooltip('Servo motoru başlatır.');
    }
  };

  Blockly.Blocks['deneyap_servo_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Servo Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN');
      this.appendValueInput('ANGLE')
        .setCheck('Number')
        .appendField('Açısını (0-180°) yap');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1565c0');
      this.setTooltip('Servo motor açısını ayarlar.');
    }
  };

  // ==========================================
  // 13. 🗎 LCD I2C (Derin Mor / Deep Purple)
  // ==========================================

  Blockly.Blocks['deneyap_lcd_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD Başlat Adres')
        .appendField(new Blockly.FieldDropdown([
          ['0x27', '0x27'],
          ['0x3F', '0x3F']
        ]), 'ADDR')
        .appendField('Sütun')
        .appendField(new Blockly.FieldNumber(16, 1), 'COLS')
        .appendField('Satır')
        .appendField(new Blockly.FieldNumber(2, 1), 'ROWS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('I2C LCD ekranı başlatır ve arka ışığını açar.');
    }
  };

  Blockly.Blocks['deneyap_lcd_set_cursor'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD İmleci Ayarla Sütun')
        .appendField(new Blockly.FieldNumber(0, 0), 'COL')
        .appendField('Satır')
        .appendField(new Blockly.FieldNumber(0, 0), 'ROW');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD imlecini belirtilen sütun ve satıra taşır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_print_val'] = {
    init: function () {
      this.appendValueInput('TEXT').appendField('LCD Yazdır');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekrana metin veya sayı yazdırır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_print'] = {
    init: function () {
      this.appendValueInput('TEXT').appendField('LCD Yaz');
      this.appendValueInput('COL').setCheck('Number').appendField('Sütun');
      this.appendValueInput('ROW').setCheck('Number').appendField('Satır');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekranın belirtilen konumuna metin yazdırır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_write_char'] = {
    init: function () {
      this.appendValueInput('CHAR').appendField('LCD Karakter Yazdır');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekrana tek bir karakter yazdırır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_create_char'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Özel Karakter Oluştur ID')
        .appendField(new Blockly.FieldNumber(0, 0, 7), 'ID')
        .appendField('Baytlar')
        .appendField(new Blockly.FieldTextInput('0x00,0x0A,0x1F,0x1F,0x0E,0x04,0x00,0x00'), 'BYTES');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekranda özel bir 5x8 piksel karakteri tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_lcd_write_custom_char'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Özel Karakter Yazdır ID')
        .appendField(new Blockly.FieldNumber(0, 0, 7), 'ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Önceden tanımlanmış özel karakteri ekrana basar.');
    }
  };

  Blockly.Blocks['deneyap_lcd_clear'] = {
    init: function () {
      this.appendDummyInput().appendField('LCD Ekranı Temizle');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekranı siler ve imleci başa alır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_home'] = {
    init: function () {
      this.appendDummyInput().appendField('LCD Ekranı Başa Al (Ev)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('İmleci (0, 0) konumuna getirir.');
    }
  };

  Blockly.Blocks['deneyap_lcd_display_power'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD Ekranı')
        .appendField(new Blockly.FieldDropdown([
          ['Aç', 'display'],
          ['Kapat', 'noDisplay']
        ]), 'MODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekran görüntüsünü açar veya kapatır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_scroll'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD Ekranı')
        .appendField(new Blockly.FieldDropdown([
          ['Sola Kaydır', 'scrollDisplayLeft'],
          ['Sağa Kaydır', 'scrollDisplayRight']
        ]), 'DIR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD ekrandaki metni sağa ya da sola kaydırır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_backlight'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD Arka Işığı')
        .appendField(new Blockly.FieldDropdown([
          ['Aç', 'backlight'],
          ['Kapat', 'noBacklight']
        ]), 'MODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('LCD arka aydınlatmasını açar veya kapatır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_cursor_mode'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD İmleci')
        .appendField(new Blockly.FieldDropdown([
          ['Aç', 'cursor'],
          ['Kapat', 'noCursor']
        ]), 'MODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('İmleç çizgisini gösterir veya gizler.');
    }
  };

  Blockly.Blocks['deneyap_lcd_blink_mode'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD İmleç Yanıp Sönmeyi')
        .appendField(new Blockly.FieldDropdown([
          ['Aç', 'blink'],
          ['Kapat', 'noBlink']
        ]), 'MODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('İmlecin yanıp sönmesini açar veya kapatır.');
    }
  };

  // ==========================================
  // 14. ♫ Ses (Koyu Kırmızı / Crimson Red)
  // ==========================================

  Blockly.Blocks['deneyap_buzzer_tone_full'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Ses Çal Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Frekans (Hz)')
        .appendField(new Blockly.FieldNumber(440, 20, 20000), 'FREQ')
        .appendField('Süre (ms)')
        .appendField(new Blockly.FieldNumber(500, 1), 'DURATION');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Buzzer veya hoparlör ile belirtilen frekansta ses çalar.');
    }
  };

  Blockly.Blocks['deneyap_buzzer_tone'] = Blockly.Blocks['deneyap_buzzer_tone_full'];

  Blockly.Blocks['deneyap_buzzer_note'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Nota Çal Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Nota')
        .appendField(new Blockly.FieldDropdown([
          ['DO (C4)', '262'],
          ['RE (D4)', '294'],
          ['Mİ (E4)', '330'],
          ['FA (F4)', '349'],
          ['SOL (G4)', '392'],
          ['LA (A4)', '440'],
          ['Sİ (B4)', '494'],
          ['İnce DO (C5)', '523']
        ]), 'NOTE')
        .appendField('Vuruş')
        .appendField(new Blockly.FieldDropdown([
          ['Tam (1)', '1000'],
          ['Yarım (1/2)', '500'],
          ['Çeyrek (1/4)', '250'],
          ['Sekizlik (1/8)', '125']
        ]), 'BEAT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Müzik notası çalar.');
    }
  };

  Blockly.Blocks['deneyap_buzzer_notone'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Sesi Durdur Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Buzzer sesini susturur.');
    }
  };

  Blockly.Blocks['deneyap_music_note_const'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Nota')
        .appendField(new Blockly.FieldDropdown([
          ['DO4', '262'], ['RE4', '294'], ['MI4', '330'], ['FA4', '349'],
          ['SOL4', '392'], ['LA4', '440'], ['SI4', '494'], ['DO5', '523']
        ]), 'NOTE');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Seçilen notanın frekans değerini (Hz) döndürür.');
    }
  };

  Blockly.Blocks['deneyap_speaker_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Hoparlör Tanımla Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Kanal')
        .appendField(new Blockly.FieldNumber(0, 0, 15), 'CHANNEL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Hoparlör için PWM ses kanalını tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_play_melody'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Müzik Çal Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Melodi')
        .appendField(new Blockly.FieldDropdown([
          ['İstiklal Marşı', 'ISTIKLAL'],
          ['Neşeye Övgü (Beethoven)', 'ODE_TO_JOY'],
          ['Yıldız Savaşları (Star Wars)', 'STAR_WARS']
        ]), 'MELODY');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Hazır melodilerden birini çalar.');
    }
  };

  // ==========================================
  // 15. ☎ Seri İletişim (Amber & Mor)
  // ==========================================

  Blockly.Blocks['deneyap_serial_begin'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Seri Haberleşmeyi Başlat Baud')
        .appendField(new Blockly.FieldDropdown([
          ['115200', '115200'],
          ['9600', '9600'],
          ['57600', '57600'],
          ['38400', '38400']
        ]), 'BAUD');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f5a623');
      this.setTooltip('Seri haberleşmeyi başlatır.');
    }
  };

  Blockly.Blocks['deneyap_serial_available'] = {
    init: function () {
      this.appendDummyInput().appendField('Seri Veri Geldi mi?');
      this.setOutput(true, 'Boolean');
      this.setColour('#f5a623');
      this.setTooltip('Seri porttan yeni veri gelip gelmediğini kontrol eder.');
    }
  };

  Blockly.Blocks['deneyap_serial_print_ext'] = {
    init: function () {
      this.appendValueInput('TEXT').appendField('Seri Yaz');
      this.appendDummyInput()
        .appendField('Alt Satıra Geç')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'NEWLINE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f5a623');
      this.setTooltip('Seri porta veri yazdırır.');
    }
  };

  Blockly.Blocks['deneyap_serial_print'] = Blockly.Blocks['deneyap_serial_print_ext'];
  Blockly.Blocks['deneyap_serial_println'] = Blockly.Blocks['deneyap_serial_print_ext'];

  Blockly.Blocks['deneyap_serial_read_type'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Seri Oku')
        .appendField(new Blockly.FieldDropdown([
          ['Metin', 'STRING'],
          ['Sayı', 'INT'],
          ['Karakter', 'CHAR']
        ]), 'TYPE');
      this.setOutput(true, null);
      this.setColour('#f5a623');
      this.setTooltip('Seri porttan gelen veriyi okur.');
    }
  };

  Blockly.Blocks['deneyap_serial_read'] = Blockly.Blocks['deneyap_serial_read_type'];

  Blockly.Blocks['deneyap_serial_write_byte'] = {
    init: function () {
      this.appendValueInput('BYTE').appendField('Seri Bayt Yaz');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f5a623');
      this.setTooltip('Seri porta ham bayt gönderir (Serial.write).');
    }
  };

  Blockly.Blocks['deneyap_i2c_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('I2C Tanımla SDA')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'SDA')
        .appendField('SCL')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'SCL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('I2C haberleşme pinlerini yapılandırır (Wire.begin(SDA, SCL)).');
    }
  };

  Blockly.Blocks['deneyap_i2c_begin_transmission'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('I2C Başlat Adres')
        .appendField(new Blockly.FieldTextInput('0x27'), 'ADDR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('I2C cihazına veri iletimi başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_end_transmission'] = {
    init: function () {
      this.appendDummyInput().appendField('I2C İletimi Bitir');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('I2C veri aktarımını sonlandırır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('I2C Veri Oku Adres')
        .appendField(new Blockly.FieldTextInput('0x27'), 'ADDR')
        .appendField('Bayt Sayısı')
        .appendField(new Blockly.FieldNumber(1, 1), 'COUNT');
      this.setOutput(true, 'Number');
      this.setColour('#5e35b1');
      this.setTooltip('I2C cihazından bayt okur.');
    }
  };

  // ==========================================
  // 16. ⇊ Algılayıcılar (Koyu Kırmızı / Red)
  // ==========================================

  Blockly.Blocks['deneyap_imu_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili IMU')
        .appendField(new Blockly.FieldDropdown([
          ['İvmeölçer', 'ACCEL'],
          ['Jiroskop', 'GYRO']
        ]), 'SENSOR')
        .appendField(new Blockly.FieldDropdown([
          ['X Ekseni', 'X'],
          ['Y Ekseni', 'Y'],
          ['Z Ekseni', 'Z']
        ]), 'AXIS')
        .appendField('Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Kartın üzerindeki dahili 6 eksenli hareket sensörünü okur.');
    }
  };

  Blockly.Blocks['deneyap_ultrasonic_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('HC-SR04 Mesafe Oku Trig')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'TRIG')
        .appendField('Echo')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'ECHO');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Ultrasonik sensörden santimetre cinsinden mesafe okur.');
    }
  };

  Blockly.Blocks['deneyap_dht11_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('DHT11')
        .appendField(new Blockly.FieldDropdown([
          ['Sıcaklık (°C)', 'TEMP'],
          ['Nem (%)', 'HUM']
        ]), 'TYPE')
        .appendField('Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('DHT11 sensöründen sıcaklık veya nem okur.');
    }
  };

  Blockly.Blocks['deneyap_mic_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Mikrofon Ses Seviyesi Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_ANALOG_PINS), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Analog mikrofon pininden ortam ses seviyesini okur.');
    }
  };

  Blockly.Blocks['deneyap_magnetic_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Manyetik Alan (Pusula) Oku')
        .appendField(new Blockly.FieldDropdown([
          ['X Ekseni', 'X'],
          ['Y Ekseni', 'Y'],
          ['Z Ekseni', 'Z'],
          ['Açı (°)', 'ANGLE']
        ]), 'AXIS');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Dahili / harici manyetometre verisi okur.');
    }
  };

  Blockly.Blocks['deneyap_tcs34725_init'] = {
    init: function () {
      this.appendDummyInput().appendField('TCS34725 Renk Sensörü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('I2C TCS34725 renk algılayıcı modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_tcs34725_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('TCS34725 Renk Oku')
        .appendField(new Blockly.FieldDropdown([
          ['Kırmızı (R)', 'R'],
          ['Yeşil (G)', 'G'],
          ['Mavi (B)', 'B'],
          ['Netlik (C)', 'C']
        ]), 'CHANNEL');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Renk sensörünün kanal değerini okur.');
    }
  };

  Blockly.Blocks['deneyap_tcs34725_is_color'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('TCS34725 Renk')
        .appendField(new Blockly.FieldDropdown([
          ['Kırmızı', 'RED'],
          ['Yeşil', 'GREEN'],
          ['Mavi', 'BLUE'],
          ['Sarı', 'YELLOW'],
          ['Beyaz', 'WHITE'],
          ['Siyah', 'BLACK']
        ]), 'COLOR')
        .appendField('mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#c62828');
      this.setTooltip('Algılanan rengin belirtilen renk olup olmadığını kontrol eder.');
    }
  };

  // ==========================================
  // 17. ⚚ RGB Led (Mor / Purple)
  // ==========================================

  Blockly.Blocks['deneyap_rgb_builtin_blink'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili LED')
        .appendField(new Blockly.FieldDropdown([
          ['Yavaş', 'SLOW'],
          ['Hızlı', 'FAST']
        ]), 'SPEED')
        .appendField('Yanıp Sön');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Dahili LED lambayı belirtilen hızda yakıp söndürür.');
    }
  };

  Blockly.Blocks['deneyap_rgb_led_picker'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RGB LED')
        .appendField(new Blockly.FieldDropdown([
          ['Ortak Katot', 'CATHODE'],
          ['Ortak Anot', 'ANODE']
        ]), 'TYPE')
        .appendField('R')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'R')
        .appendField('G')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'G')
        .appendField('B')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'B')
        .appendField('Renk')
        .appendField(new Blockly.FieldTextInput(), 'COLOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('RGB LED için renk paletinden seçilen rengi yakar.');
    }
  };

  Blockly.Blocks['deneyap_rgb_builtin_pwm'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili RGB PWM')
        .appendField('K')
        .appendField(new Blockly.FieldNumber(255, 0, 255), 'R')
        .appendField('Y')
        .appendField(new Blockly.FieldNumber(0, 0, 255), 'G')
        .appendField('M')
        .appendField(new Blockly.FieldNumber(0, 0, 255), 'B');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Dahili RGB LED için 0-255 arası parlaklık değerlerini ayarlar.');
    }
  };

  Blockly.Blocks['deneyap_rgb_neopixel'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili Adreslenebilir RGB LED Led Sayısı')
        .appendField(new Blockly.FieldNumber(1, 1), 'COUNT')
        .appendField('Renk')
        .appendField(new Blockly.FieldTextInput(), 'COLOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Deneyap Kart 1A vb. üzerindeki WS2812 Adreslenebilir Neopixel LED rengini ayarlar.');
    }
  };

  Blockly.Blocks['deneyap_rgb_def_id'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RGB LED Tanımla ID')
        .appendField(new Blockly.FieldTextInput('rgb1'), 'ID')
        .appendField('Pinler R')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'R')
        .appendField('G')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'G')
        .appendField('B')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'B')
        .appendField('Tip')
        .appendField(new Blockly.FieldDropdown([
          ['Ortak Katot', 'CATHODE'],
          ['Ortak Anot', 'ANODE']
        ]), 'TYPE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Özel bir RGB LED nesnesi tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_rgb_set_id'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RGB LED')
        .appendField(new Blockly.FieldTextInput('rgb1'), 'ID')
        .appendField('Renk Yap')
        .appendField('K')
        .appendField(new Blockly.FieldNumber(255, 0, 255), 'R')
        .appendField('Y')
        .appendField(new Blockly.FieldNumber(0, 0, 255), 'G')
        .appendField('M')
        .appendField(new Blockly.FieldNumber(0, 0, 255), 'B');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Tanımlı RGB LED rengini sayısal değerlerle ayarlar.');
    }
  };

  Blockly.Blocks['deneyap_rgb_pick_id'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RGB LED')
        .appendField(new Blockly.FieldTextInput('rgb1'), 'ID')
        .appendField('Renk Seç')
        .appendField(new Blockly.FieldTextInput(), 'COLOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Tanımlı RGB LED rengini renk seçiciden ayarlar.');
    }
  };

  Blockly.Blocks['deneyap_rgb_simple_def'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RGB LED Basit Tanımla Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Renk')
        .appendField(new Blockly.FieldTextInput(), 'COLOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Tek pinden tek renk sürme bloğu.');
    }
  };

  Blockly.Blocks['deneyap_rgb_show_values'] = {
    init: function () {
      this.appendValueInput('R').setCheck('Number').appendField('RGB LED Renk Değerleri Göster K');
      this.appendValueInput('G').setCheck('Number').appendField('Y');
      this.appendValueInput('B').setCheck('Number').appendField('M');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Dinamik değişkenlerle RGB değerlerini dahili LED üzerinde gösterir.');
    }
  };

  Blockly.Blocks['deneyap_rgb_color_field'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RGB LED Renk Seçici')
        .appendField(new Blockly.FieldTextInput(), 'COLOR');
      this.setOutput(true, 'Colour');
      this.setColour('#4a148c');
      this.setTooltip('Renk sabiti seçici bloğu.');
    }
  };

  Blockly.Blocks['deneyap_rgb_builtin_set'] = Blockly.Blocks['deneyap_rgb_show_values'];
  Blockly.Blocks['deneyap_rgb_builtin_color'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili RGB LED Rengi')
        .appendField(new Blockly.FieldDropdown([
          ['Kırmızı', 'RED'],
          ['Yeşil', 'GREEN'],
          ['Mavi', 'BLUE'],
          ['Sarı', 'YELLOW'],
          ['Camgöbeği (Cyan)', 'CYAN'],
          ['Mor (Magenta)', 'MAGENTA'],
          ['Beyaz', 'WHITE'],
          ['Kapalı (Söndür)', 'OFF']
        ]), 'COLOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a148c');
      this.setTooltip('Dahili RGB LED için hazır renk seçer.');
    }
  };

  // ==========================================
  // 18. Bluetooth (Camgöbeği / Teal)
  // ==========================================

  Blockly.Blocks['deneyap_bluetooth_begin'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Bluetooth Başlat Cihaz Adı')
        .appendField(new Blockly.FieldTextInput('Deneyap_BT'), 'NAME');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00838f');
      this.setTooltip('Dahili Bluetooth seri haberleşmesini başlatır.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_available'] = {
    init: function () {
      this.appendDummyInput().appendField('Bluetooth Veri Geldi mi?');
      this.setOutput(true, 'Boolean');
      this.setColour('#00838f');
      this.setTooltip('Bluetooth üzerinden yeni veri gelip gelmediğini kontrol eder.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_print_ext'] = {
    init: function () {
      this.appendValueInput('TEXT').appendField('Bluetooth Gönder');
      this.appendDummyInput()
        .appendField('Alt Satıra Geç')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'NEWLINE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00838f');
      this.setTooltip('Bluetooth üzerinden veri gönderir.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_println'] = Blockly.Blocks['deneyap_bluetooth_print_ext'];

  Blockly.Blocks['deneyap_bluetooth_read_ext'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Bluetooth Oku')
        .appendField(new Blockly.FieldDropdown([
          ['Metin', 'STRING'],
          ['Bayt', 'BYTE']
        ]), 'TYPE');
      this.setOutput(true, null);
      this.setColour('#00838f');
      this.setTooltip('Bluetooth üzerinden gelen veriyi okur.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_read'] = Blockly.Blocks['deneyap_bluetooth_read_ext'];

  Blockly.Blocks['deneyap_bluetooth_write_byte'] = {
    init: function () {
      this.appendValueInput('BYTE').appendField('Bluetooth Bayt Yaz');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00838f');
      this.setTooltip('Bluetooth üzerinden tek bayt gönderir.');
    }
  };

  // ==========================================
  // 19. Kızılötesi (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_ir_recv_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kızılötesi Kumanda Alıcı Başlat Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('IR alıcı modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_ir_available'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kızılötesi Veri Geldi mi? Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setOutput(true, 'Boolean');
      this.setColour('#0277bd');
      this.setTooltip('IR kumandadan yeni sinyal alındıysa Doğru döner.');
    }
  };

  Blockly.Blocks['deneyap_ir_read_code'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kızılötesi Kod Oku Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'PIN');
      this.setOutput(true, 'String');
      this.setColour('#0277bd');
      this.setTooltip('IR alıcıdan okunan tuş kodunu onaltılık metin olarak döndürür.');
    }
  };

  Blockly.Blocks['deneyap_ir_send'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kızılötesi Verici Gönder Pin')
        .appendField(new Blockly.FieldDropdown(DENEYAP_PWM_PINS), 'PIN')
        .appendField('Protokol')
        .appendField(new Blockly.FieldDropdown([
          ['NEC', 'NEC'],
          ['Sony', 'SONY'],
          ['RC5', 'RC5']
        ]), 'PROTO')
        .appendField('Kod')
        .appendField(new Blockly.FieldTextInput('0x00FF'), 'CODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('IR verici LED ile kızılötesi sinyal gönderir.');
    }
  };

  // ==========================================
  // 20. RFID (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_rfid_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RFID Okuyucu Başlat SDA')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'SDA')
        .appendField('RST')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'RST');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('SPI RC522 RFID okuyucu modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_rfid_card_present'] = {
    init: function () {
      this.appendDummyInput().appendField('Yeni Kart Okundu mu?');
      this.setOutput(true, 'Boolean');
      this.setColour('#0277bd');
      this.setTooltip('RFID okuyucu alanında yeni bir kart veya anahtarlık varsa Doğru döner.');
    }
  };

  Blockly.Blocks['deneyap_rfid_read_uid'] = {
    init: function () {
      this.appendDummyInput().appendField('Okunan Kart UID');
      this.setOutput(true, 'String');
      this.setColour('#0277bd');
      this.setTooltip('Okunan RFID kartının benzersiz seri kimliğini (UID) metin olarak verir.');
    }
  };

  Blockly.Blocks['deneyap_rfid_uid_equals'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Kart UID')
        .appendField(new Blockly.FieldTextInput('A1 B2 C3 D4'), 'UID')
        .appendField('e eşit mi?');
      this.setOutput(true, 'Boolean');
      this.setColour('#0277bd');
      this.setTooltip('Son okunan kart UID kimliğinin belirtilen kimlikle eşleştiğini kontrol eder.');
    }
  };

  // ==========================================
  // 21. Tuş Takımı (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_keypad_3x4_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('3x4 Tuş Takımı Tanımla Satırlar')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R2')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R3')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R4')
        .appendField('Sütunlar')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C2')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C3');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0288d1');
      this.setTooltip('3x4 tuş takımı matris pinlerini tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_keypad_4x4_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('4x4 Tuş Takımı Tanımla Satırlar')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R2')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R3')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'R4')
        .appendField('Sütunlar')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C1')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C2')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C3')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'C4');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0288d1');
      this.setTooltip('4x4 tuş takımı matris pinlerini tanımlar.');
    }
  };

  Blockly.Blocks['deneyap_keypad_get_key'] = {
    init: function () {
      this.appendDummyInput().appendField('Tuş Takımı Basılan Tuşu Oku');
      this.setOutput(true, 'String');
      this.setColour('#0288d1');
      this.setTooltip('Tuş takımından basılan tuşun karakterini döndürür.');
    }
  };

  Blockly.Blocks['deneyap_keypad_is_pressed'] = {
    init: function () {
      this.appendDummyInput().appendField('Tuş Takımında Bir Tuşa Basıldı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#0288d1');
      this.setTooltip('Herhangi bir tuşa basıldıysa Doğru döner.');
    }
  };

  // ==========================================
  // 22. SD Kart (Amber / Orange)
  // ==========================================

  Blockly.Blocks['deneyap_sd_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('SD Kart Başlat CS')
        .appendField(new Blockly.FieldDropdown(DENEYAP_DIGITAL_PINS), 'CS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f5a623');
      this.setTooltip('SD kart modülünü SPI arayüzü ile başlatır.');
    }
  };

  Blockly.Blocks['deneyap_sd_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('SD Karta Dosya Yaz')
        .appendField(new Blockly.FieldTextInput('/veri.txt'), 'FILE');
      this.appendValueInput('TEXT').appendField('Veri');
      this.appendDummyInput()
        .appendField('Alt Satıra Geç')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'NEWLINE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f5a623');
      this.setTooltip('SD kart üzerindeki dosyaya veri ekler (append).');
    }
  };

  Blockly.Blocks['deneyap_sd_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('SD Karttan Dosya Oku')
        .appendField(new Blockly.FieldTextInput('/veri.txt'), 'FILE');
      this.setOutput(true, 'String');
      this.setColour('#f5a623');
      this.setTooltip('SD karttaki dosya içeriğini okur.');
    }
  };

  Blockly.Blocks['deneyap_sd_exists'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('SD Kartta Dosya Var mı?')
        .appendField(new Blockly.FieldTextInput('/veri.txt'), 'FILE');
      this.setOutput(true, 'Boolean');
      this.setColour('#f5a623');
      this.setTooltip('Dosyanın var olup olmadığını kontrol eder.');
    }
  };

  Blockly.Blocks['deneyap_sd_remove'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('SD Kart Dosya Sil')
        .appendField(new Blockly.FieldTextInput('/veri.txt'), 'FILE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f5a623');
      this.setTooltip('SD karttan belirtilen dosyayı siler.');
    }
  };

  // ==========================================
  // 23. ☁ Nesnelerin İnterneti (Mavi / Blue)
  // ==========================================

  Blockly.Blocks['deneyap_wifi_connect'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('WiFi Bağlan SSID')
        .appendField(new Blockly.FieldTextInput('WiFi_Adi'), 'SSID')
        .appendField('Şifre')
        .appendField(new Blockly.FieldTextInput('12345678'), 'PASS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('Kablosuz WiFi ağına bağlanır.');
    }
  };

  Blockly.Blocks['deneyap_wifi_status'] = {
    init: function () {
      this.appendDummyInput().appendField('WiFi Bağlantı Durumu');
      this.setOutput(true, 'Boolean');
      this.setColour('#0277bd');
      this.setTooltip('WiFi ağına bağlı ise Doğru döner.');
    }
  };

  Blockly.Blocks['deneyap_wifi_ip'] = {
    init: function () {
      this.appendDummyInput().appendField('WiFi IP Adresi');
      this.setOutput(true, 'String');
      this.setColour('#0277bd');
      this.setTooltip('Kartın aldığı yerel IP adresini metin olarak verir.');
    }
  };

  Blockly.Blocks['deneyap_mqtt_connect'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('MQTT Bağlan Sunucu')
        .appendField(new Blockly.FieldTextInput('broker.hivemq.com'), 'SERVER')
        .appendField('Port')
        .appendField(new Blockly.FieldNumber(1883, 1), 'PORT')
        .appendField('İstemci ID')
        .appendField(new Blockly.FieldTextInput('DeneyapClient'), 'CLIENT_ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('MQTT broker sunucusuna bağlanır.');
    }
  };

  Blockly.Blocks['deneyap_mqtt_subscribe'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('MQTT Abone Ol Konu')
        .appendField(new Blockly.FieldTextInput('deneyap/veri'), 'TOPIC');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('Belirtilen MQTT konusuna abone olur.');
    }
  };

  Blockly.Blocks['deneyap_mqtt_publish'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('MQTT Yayınla Konu')
        .appendField(new Blockly.FieldTextInput('deneyap/veri'), 'TOPIC');
      this.appendValueInput('MSG').appendField('Mesaj');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('MQTT konusuna mesaj yayınlar.');
    }
  };

  Blockly.Blocks['deneyap_mqtt_loop'] = {
    init: function () {
      this.appendDummyInput().appendField('MQTT Döngü (Loop)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0277bd');
      this.setTooltip('MQTT istemci döngüsünü çalıştırır (client.loop()).');
    }
  };

  Blockly.Blocks['deneyap_mqtt_message'] = {
    init: function () {
      this.appendDummyInput().appendField('MQTT Gelen Mesajı Oku');
      this.setOutput(true, 'String');
      this.setColour('#0277bd');
      this.setTooltip('MQTT üzerinden gelen son mesaj içeriğini okur.');
    }
  };

  // ==========================================
  // 24. ☪ Deneyap LED Matris (Mor / Purple)
  // ==========================================

  Blockly.Blocks['deneyap_matrix_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris Başlat Adres')
        .appendField(new Blockly.FieldDropdown([
          ['0x70', '0x70'],
          ['0x74', '0x74']
        ]), 'ADDR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('Deneyap LED Matris ekranını I2C üzerinden başlatır.');
    }
  };

  Blockly.Blocks['deneyap_matrix_pattern'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris 7x5 Çizim Deseni')
        .appendField(new Blockly.FieldTextInput('0b00000,0b01010,0b11111,0b01110,0b00100'), 'PATTERN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('7 satır x 5 sütunluk LED matris deseni çizer.');
    }
  };

  Blockly.Blocks['deneyap_matrix_icon'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris İkon Çiz')
        .appendField(new Blockly.FieldDropdown([
          ['Kalp', 'HEART'],
          ['Gülen Yüz', 'SMILE'],
          ['Üzgün Yüz', 'SAD'],
          ['Ok (İleri)', 'ARROW_UP'],
          ['Ok (Geri)', 'ARROW_DOWN'],
          ['Yıldız', 'STAR'],
          ['Tik (Onay)', 'CHECK']
        ]), 'ICON');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('LED Matrise hazır ikon çizer.');
    }
  };

  Blockly.Blocks['deneyap_matrix_pixel'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris Piksel Yak X (0-4)')
        .appendField(new Blockly.FieldNumber(0, 0, 4), 'X')
        .appendField('Y (0-6)')
        .appendField(new Blockly.FieldNumber(0, 0, 6), 'Y')
        .appendField('Durum')
        .appendField(new Blockly.FieldDropdown([
          ['Açık (1)', '1'],
          ['Kapalı (0)', '0']
        ]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('Matris üzerindeki tek bir LED pikselini yakar veya söndürür.');
    }
  };

  Blockly.Blocks['deneyap_matrix_row'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris Satır Yak Satır (0-6)')
        .appendField(new Blockly.FieldNumber(0, 0, 6), 'ROW')
        .appendField('Değer (0b00000)')
        .appendField(new Blockly.FieldTextInput('0b11111'), 'VAL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('Matrisin bir satırını bayt değeriyle yakar.');
    }
  };

  Blockly.Blocks['deneyap_matrix_col'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris Sütun Yak Sütun (0-4)')
        .appendField(new Blockly.FieldNumber(0, 0, 4), 'COL')
        .appendField('Değer (0b0000000)')
        .appendField(new Blockly.FieldTextInput('0b1111111'), 'VAL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('Matrisin bir sütununu yakar.');
    }
  };

  Blockly.Blocks['deneyap_matrix_clear'] = {
    init: function () {
      this.appendDummyInput().appendField('LED Matris Temizle');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('Tüm matris LED lerini söndürür.');
    }
  };

  Blockly.Blocks['deneyap_matrix_brightness'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LED Matris Parlaklık (0-15)')
        .appendField(new Blockly.FieldNumber(10, 0, 15), 'BRIGHT');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#5e35b1');
      this.setTooltip('Matris LED parlaklığını ayarlar.');
    }
  };

  // ==========================================
  // 25. ☪ Deneyap OLED Ekran (Kırmızı / Red)
  // ==========================================

  Blockly.Blocks['deneyap_oled_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Ekran Başlat Adres')
        .appendField(new Blockly.FieldDropdown([
          ['0x78 (0x3C)', '0x3C'],
          ['0x7A (0x3D)', '0x3D']
        ]), 'ADDR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('0.96 inç 128x64 OLED ekranı I2C ile başlatır.');
    }
  };

  Blockly.Blocks['deneyap_oled_print_text'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Metin Yaz X')
        .appendField(new Blockly.FieldNumber(0, 0, 127), 'X')
        .appendField('Y')
        .appendField(new Blockly.FieldNumber(0, 0, 63), 'Y')
        .appendField('Boyut')
        .appendField(new Blockly.FieldNumber(1, 1, 4), 'SIZE');
      this.appendValueInput('TEXT').appendField('Metin');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('OLED ekranın belirtilen koordinatına metin yazar.');
    }
  };

  Blockly.Blocks['deneyap_oled_print_num'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Sayı / Değişken Yaz X')
        .appendField(new Blockly.FieldNumber(0, 0, 127), 'X')
        .appendField('Y')
        .appendField(new Blockly.FieldNumber(0, 0, 63), 'Y')
        .appendField('Boyut')
        .appendField(new Blockly.FieldNumber(1, 1, 4), 'SIZE');
      this.appendValueInput('VAL').appendField('Değer');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('OLED ekrana sayısal değer yazar.');
    }
  };

  Blockly.Blocks['deneyap_oled_clear'] = {
    init: function () {
      this.appendDummyInput().appendField('OLED Ekranı Temizle');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('OLED ekran belleğini temizler.');
    }
  };

  Blockly.Blocks['deneyap_oled_show'] = {
    init: function () {
      this.appendDummyInput().appendField('OLED Ekranı Güncelle (Göster)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Çizimleri ekrana yansıtır (display.display()).');
    }
  };

  Blockly.Blocks['deneyap_oled_draw_line'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Çizgi Çiz X1')
        .appendField(new Blockly.FieldNumber(0, 0, 127), 'X1')
        .appendField('Y1')
        .appendField(new Blockly.FieldNumber(0, 0, 63), 'Y1')
        .appendField('X2')
        .appendField(new Blockly.FieldNumber(127, 0, 127), 'X2')
        .appendField('Y2')
        .appendField(new Blockly.FieldNumber(63, 0, 63), 'Y2');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('İki nokta arasına çizgi çizer.');
    }
  };

  Blockly.Blocks['deneyap_oled_draw_rect'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Dikdörtgen Çiz X')
        .appendField(new Blockly.FieldNumber(0, 0, 127), 'X')
        .appendField('Y')
        .appendField(new Blockly.FieldNumber(0, 0, 63), 'Y')
        .appendField('Genişlik')
        .appendField(new Blockly.FieldNumber(30, 1), 'W')
        .appendField('Yükseklik')
        .appendField(new Blockly.FieldNumber(20, 1), 'H')
        .appendField(new Blockly.FieldDropdown([
          ['İçi Boş', 'EMPTY'],
          ['İçi Dolu', 'FILLED']
        ]), 'FILL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Dikdörtgen çizer.');
    }
  };

  Blockly.Blocks['deneyap_oled_draw_circle'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Çember Çiz X')
        .appendField(new Blockly.FieldNumber(64, 0, 127), 'X')
        .appendField('Y')
        .appendField(new Blockly.FieldNumber(32, 0, 63), 'Y')
        .appendField('Yarıçap')
        .appendField(new Blockly.FieldNumber(15, 1), 'R')
        .appendField(new Blockly.FieldDropdown([
          ['İçi Boş', 'EMPTY'],
          ['İçi Dolu', 'FILLED']
        ]), 'FILL');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Daire / çember çizer.');
    }
  };

  Blockly.Blocks['deneyap_oled_scroll'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('OLED Metin Kaydır')
        .appendField(new Blockly.FieldDropdown([
          ['Sağa', 'RIGHT'],
          ['Sola', 'LEFT'],
          ['Çapraz Sağa', 'DIAG_RIGHT'],
          ['Çapraz Sola', 'DIAG_LEFT'],
          ['Durdur', 'STOP']
        ]), 'DIR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Ekrandaki görüntüyü kaydırır.');
    }
  };

  // ==========================================
  // 26 & 27. ☪ Deneyap Algılayıcılar (Resmi Modül Ailesi / Red)
  // ==========================================

  // Barometre / Basınç
  Blockly.Blocks['deneyap_i2c_barometer_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Basınç Başlat Adres')
        .appendField(new Blockly.FieldDropdown([['0x76', '0x76'], ['0x77', '0x77']]), 'ADDR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Basınç Ölçer sensörünü I2C ile başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_barometer_temp'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Basınç Sıcaklık Oku (°C)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Basınç modülünden ortam sıcaklığını okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_barometer_pressure'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Basınç Oku (hPa)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Hava basıncını hektopaskal (hPa) olarak okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_barometer_altitude'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Yükseklik Oku (m)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Basınç verisine göre deniz seviyesinden yüksekliği metre olarak verir.');
    }
  };

  // BME280
  Blockly.Blocks['deneyap_i2c_bme280_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap BME280 Başlat Adres')
        .appendField(new Blockly.FieldDropdown([['0x76', '0x76'], ['0x77', '0x77']]), 'ADDR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap BME280 Çevre Sensörünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_bme280_temp'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap BME280 Sıcaklık Oku (°C)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('BME280 sensöründen sıcaklık okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_bme280_humidity'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap BME280 Nem Oku (%)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('BME280 sensöründen bağıl nem okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_bme280_pressure'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap BME280 Basınç Oku (hPa)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('BME280 sensöründen hava basıncı okur.');
    }
  };

  // Pusula (Compass)
  Blockly.Blocks['deneyap_i2c_compass_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Pusula Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Pusula modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_compass_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Pusula')
        .appendField(new Blockly.FieldDropdown([['X', 'X'], ['Y', 'Y'], ['Z', 'Z']]), 'AXIS')
        .appendField('Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Manyetik alan eksen değerini okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_compass_angle'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Pusula Açısı Oku (°)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Kuzeye göre pusula açısını (0°-360°) okur.');
    }
  };

  // 6 Eksen Ataletsel (IMU)
  Blockly.Blocks['deneyap_i2c_imu6_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap 6 Eksen Ataletsel Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap 6 Eksen Ataletsel Hareket modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_imu6_accel'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap İvme')
        .appendField(new Blockly.FieldDropdown([['X', 'X'], ['Y', 'Y'], ['Z', 'Z']]), 'AXIS')
        .appendField('Oku (g)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('İvmeölçer eksen değerini okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_imu6_gyro'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Jiroskop')
        .appendField(new Blockly.FieldDropdown([['X', 'X'], ['Y', 'Y'], ['Z', 'Z']]), 'AXIS')
        .appendField('Oku (°/s)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Jiroskop açısal hız değerini okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_imu6_temp'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap IMU Sıcaklık Oku (°C)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('IMU çip sıcaklığını okur.');
    }
  };

  // Jest / Hareket / Renk (APDS9960)
  Blockly.Blocks['deneyap_i2c_apds9960_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Jest & Renk Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Jest Algılama modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_apds9960_gesture'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Jest Oku (Yukarı/Aşağı/Sol/Sağ)');
      this.setOutput(true, 'String');
      this.setColour('#c62828');
      this.setTooltip('El hareket yönünü okur (UP, DOWN, LEFT, RIGHT).');
    }
  };

  Blockly.Blocks['deneyap_i2c_apds9960_color'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Renk Oku')
        .appendField(new Blockly.FieldDropdown([
          ['Kırmızı', 'R'], ['Yeşil', 'G'], ['Mavi', 'B'], ['Ortam Işığı', 'A']
        ]), 'CHANNEL');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Işık ve renk yoğunluğunu okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_apds9960_proximity'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Yakınlık Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Cisme olan yakınlığı okur (0-255).');
    }
  };

  // Sıcaklık & Nem (DHT20 / SHT)
  Blockly.Blocks['deneyap_i2c_dht_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Sıcaklık Nem Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Sıcaklık ve Nem Ölçer modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_dht_temp'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Sıcaklık Oku (°C)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Ortam sıcaklığını okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_dht_humidity'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Nem Oku (%)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Ortam nemini okur.');
    }
  };

  // Derinlik Sensörü
  Blockly.Blocks['deneyap_i2c_depth_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Derinlik Sensörü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Su Altı / Derinlik sensörünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_depth_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Derinlik Oku (cm)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Su derinliğini santimetre olarak okur.');
    }
  };

  // Duman / Gaz Sensörü
  Blockly.Blocks['deneyap_i2c_smoke_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Gaz/Duman Sensörü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Gaz ve Duman Algılayıcıyı başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_smoke_val'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Gaz Değeri Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Gaz yoğunluğu değerini okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_smoke_detected'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Gaz Algılandı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#c62828');
      this.setTooltip('Gaz eşiği aşıldığında Doğru döner.');
    }
  };

  // Joystick (I2C)
  Blockly.Blocks['deneyap_i2c_joystick_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Joystick Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap I2C Joystick modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_joystick_axis'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Joystick')
        .appendField(new Blockly.FieldDropdown([['X Ekseni', 'X'], ['Y Ekseni', 'Y']]), 'AXIS')
        .appendField('Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Joystick konumunu okur (0-1023).');
    }
  };

  Blockly.Blocks['deneyap_i2c_joystick_button'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Joystick Buton Basılı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#c62828');
      this.setTooltip('Joystick butonuna basıldığında Doğru döner.');
    }
  };

  // Çift Çizgi İzleyen
  Blockly.Blocks['deneyap_i2c_line_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Çizgi İzleyen Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Çift Çizgi İzleyici modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_line_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Çizgi')
        .appendField(new Blockly.FieldDropdown([['Sol Sensör', 'LEFT'], ['Sağ Sensör', 'RIGHT']]), 'SIDE')
        .appendField('Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Çizgi sensörü analog yansıma değerini okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_line_status'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Çizgi')
        .appendField(new Blockly.FieldDropdown([['Siyah', 'BLACK'], ['Beyaz', 'WHITE']]), 'COLOR')
        .appendField('Algılandı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#c62828');
      this.setTooltip('Çizgi zemin durumunu kontrol eder.');
    }
  };

  // Lazer Mesafe (VL53L0X)
  Blockly.Blocks['deneyap_i2c_vl53l0x_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Lazer Mesafe Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Lazer Mesafe (VL53L0X) modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_vl53l0x_dist'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Lazer Mesafe Oku (mm)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Milimetre cinsinden hassas lazer mesafesi okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_vl53l0x_ambient'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Ortam Işığı Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Lazer sensöründeki ortam ışık seviyesini okur.');
    }
  };

  // Yağmur Sensörü
  Blockly.Blocks['deneyap_i2c_rain_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Yağmur Sensörü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Yağmur Algılayıcı modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_rain_val'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Yağmur Değeri Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Yağmur yoğunluğunu okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_rain_is_raining'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Yağmur Yağıyor mu?');
      this.setOutput(true, 'Boolean');
      this.setColour('#c62828');
      this.setTooltip('Sensör üzerinde yağmur damlası varsa Doğru döner.');
    }
  };

  // Röle (Relay)
  Blockly.Blocks['deneyap_i2c_relay_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Röle Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Röle modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_relay_set'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Röle')
        .appendField(new Blockly.FieldDropdown([['Kanal 1', '1'], ['Kanal 2', '2']]), 'CH')
        .appendField('Durumu')
        .appendField(new Blockly.FieldDropdown([['Aç (Çek)', 'HIGH'], ['Kapat (Bırak)', 'LOW']]), 'STATE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Röle kanalını açar veya kapatır.');
    }
  };

  // Toprak Nemi
  Blockly.Blocks['deneyap_i2c_soil_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Toprak Nemi Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Toprak Nemi modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_soil_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Toprak Nemi Oku (%)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Toprağın nem oranını yüzde olarak okur.');
    }
  };

  // Dokunmatik Tuş Takımı (Touch Keypad)
  Blockly.Blocks['deneyap_i2c_touch_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Dokunmatik Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Dokunmatik Tuş Takımını başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_touch_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Dokunulan Tuşu Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Dokunulan pad numarasını döndürür.');
    }
  };

  // Kızılötesi Alıcı-Verici (I2C)
  Blockly.Blocks['deneyap_i2c_ir_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap I2C Kızılötesi Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap I2C Kızılötesi Alıcı-Verici modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_ir_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap I2C Kızılötesi Oku');
      this.setOutput(true, 'String');
      this.setColour('#c62828');
      this.setTooltip('Okunan kızılötesi kodunu verir.');
    }
  };

  Blockly.Blocks['deneyap_i2c_ir_send'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap I2C Kızılötesi Gönder')
        .appendField(new Blockly.FieldTextInput('0x00FF'), 'CODE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Kızılötesi kod gönderir.');
    }
  };

  // PIR Hareket Sensörü
  Blockly.Blocks['deneyap_i2c_pir_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Hareket (PIR) Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap PIR Hareket Algılayıcı modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_pir_motion'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Hareket Algılandı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#c62828');
      this.setTooltip('Ortamda insan/canlı hareketi algılandığında Doğru döner.');
    }
  };

  // RTC (I2C Deneyap)
  Blockly.Blocks['deneyap_i2c_rtc_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap I2C RTC Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap I2C Gerçek Zamanlı Saat modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_rtc_reset'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap I2C RTC Zamanı Sıfırla');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('RTC saatini başlangıç değerine sıfırlar.');
    }
  };

  Blockly.Blocks['deneyap_i2c_rtc_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap I2C RTC')
        .appendField(new Blockly.FieldDropdown([['Saat', 'TIME'], ['Tarih', 'DATE']]), 'TYPE')
        .appendField('Oku');
      this.setOutput(true, 'String');
      this.setColour('#c62828');
      this.setTooltip('RTC modülünden saat veya tarih metnini okur.');
    }
  };

  // DC Motor Sürücü (I2C)
  Blockly.Blocks['deneyap_i2c_dcmotor_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Motor Sürücü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap I2C DC Motor Sürücü modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_dcmotor_drive'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Motor Sür Motor')
        .appendField(new Blockly.FieldDropdown([['1', '1'], ['2', '2'], ['1 ve 2', 'BOTH']]), 'MOTOR')
        .appendField('Yön')
        .appendField(new Blockly.FieldDropdown([['İleri', 'FORWARD'], ['Geri', 'BACKWARD']]), 'DIR');
      this.appendValueInput('SPEED').setCheck('Number').appendField('Hız (0-255)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('DC motoru belirtilen yön ve hızda döndürür.');
    }
  };

  Blockly.Blocks['deneyap_i2c_dcmotor_stop'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Deneyap Motor Durdur Motor')
        .appendField(new Blockly.FieldDropdown([['1', '1'], ['2', '2'], ['1 ve 2', 'BOTH']]), 'MOTOR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Motoru durdurur.');
    }
  };

  // Step Motor Sürücü (I2C)
  Blockly.Blocks['deneyap_i2c_stepper_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Step Motor Sürücü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap I2C Step Motor Sürücüyü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_stepper_step'] = {
    init: function () {
      this.appendValueInput('STEPS').setCheck('Number').appendField('Deneyap Step Motor Sür Adım');
      this.appendValueInput('SPEED').setCheck('Number').appendField('Hız (RPM)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Step motora adım attırır.');
    }
  };

  // UV Sensörü
  Blockly.Blocks['deneyap_i2c_uv_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap UV Sensörü Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap Ultraviyole (UV) sensörünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_uv_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap UV İndeksi Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Güneş ışığı ultraviyole indeks değerini okur.');
    }
  };

  // Mikrofon (I2C)
  Blockly.Blocks['deneyap_i2c_mic_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Mikrofon Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap I2C Mikrofon modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_mic_read'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap Mikrofon Ses Şiddeti Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Ortamdaki ses şiddeti seviyesini okur.');
    }
  };

  // GPS
  Blockly.Blocks['deneyap_i2c_gps_init'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap GPS Başlat');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#c62828');
      this.setTooltip('Deneyap GPS konumlandırma modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_i2c_gps_lat'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap GPS Enlem Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Enlem (Latitude) koordinatını okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_gps_lng'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap GPS Boylam Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Boylam (Longitude) koordinatını okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_gps_speed'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap GPS Hız Oku (km/h)');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Hareketi km/s cinsinden okur.');
    }
  };

  Blockly.Blocks['deneyap_i2c_gps_sats'] = {
    init: function () {
      this.appendDummyInput().appendField('Deneyap GPS Uydu Sayısı Oku');
      this.setOutput(true, 'Number');
      this.setColour('#c62828');
      this.setTooltip('Bağlantı kurulan uydu sayısını verir.');
    }
  };
}
