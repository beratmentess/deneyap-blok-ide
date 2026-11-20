import * as Blockly from 'blockly/core';

export function registerDeneyapBlocks() {
  // 1. Kart & Buton
  Blockly.Blocks['deneyap_button_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili Buton (GPKEY) Basılı mı?');
      this.setOutput(true, 'Boolean');
      this.setColour('#0088cc');
      this.setTooltip('Deneyap Kart üzerindeki dahili buton basılı olduğunda Doğru (true) döner.');
    }
  };

  // 2. Zaman
  Blockly.Blocks['deneyap_delay'] = {
    init: function () {
      this.appendValueInput('DELAY_MS')
        .setCheck('Number')
        .appendField('Bekle (ms)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#00a896');
      this.setTooltip('Belirtilen milisaniye kadar bekler.');
    }
  };

  Blockly.Blocks['deneyap_millis'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Çalışma Zamanı (milisaniye)');
      this.setOutput(true, 'Number');
      this.setColour('#00a896');
      this.setTooltip('Kartın açılışından itibaren geçen süreyi milisaniye olarak verir.');
    }
  };

  // 3. Giriş / Çıkış (GPIO)
  Blockly.Blocks['deneyap_digital_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dijital Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'],
          ['D4', 'D4'], ['D5', 'D5'], ['D6', 'D6'], ['D7', 'D7'],
          ['D8', 'D8'], ['D9', 'D9'], ['D10', 'D10'], ['D11', 'D11'],
          ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN')
        .appendField('Durumu')
        .appendField(new Blockly.FieldDropdown([
          ['YÜKSEK (Açık)', 'HIGH'],
          ['DÜŞÜK (Kapalı)', 'LOW']
        ]), 'STATE')
        .appendField('yap');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a90e2');
      this.setTooltip('Belirtilen dijital pini YÜKSEK veya DÜŞÜK yapar.');
    }
  };

  Blockly.Blocks['deneyap_digital_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dijital Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'],
          ['D4', 'D4'], ['D5', 'D5'], ['D6', 'D6'], ['D7', 'D7'],
          ['D8', 'D8'], ['D9', 'D9'], ['D10', 'D10'], ['D11', 'D11'],
          ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN')
        .appendField('oku');
      this.setOutput(true, 'Boolean');
      this.setColour('#4a90e2');
      this.setTooltip('Dijital pinin lojik durumunu (1 veya 0) okur.');
    }
  };

  Blockly.Blocks['deneyap_analog_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Analog Pin')
        .appendField(new Blockly.FieldDropdown([
          ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'],
          ['A3', 'A3'], ['A4', 'A4'], ['A5', 'A5']
        ]), 'PIN')
        .appendField('oku');
      this.setOutput(true, 'Number');
      this.setColour('#4a90e2');
      this.setTooltip('Analog pinden 12-bit analog değer okur (0 - 4095).');
    }
  };

  Blockly.Blocks['deneyap_pwm_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('PWM Çıkışı Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D9', 'D9'], ['D10', 'D10'],
          ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN');
      this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('Değer (0-255)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4a90e2');
      this.setTooltip('Pinden PWM sinyali üretir (0-255 arası parlaklık/hız).');
    }
  };

  // 4. Dahili RGB LED
  Blockly.Blocks['deneyap_rgb_builtin_set'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Dahili RGB LED');
      this.appendValueInput('RED')
        .setCheck('Number')
        .appendField('Kırmızı (0-255)');
      this.appendValueInput('GREEN')
        .setCheck('Number')
        .appendField('Yeşil (0-255)');
      this.appendValueInput('BLUE')
        .setCheck('Number')
        .appendField('Mavi (0-255)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e056fd');
      this.setTooltip('Kart üzerindeki dahili RGB LED rengini ayarlar.');
    }
  };

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
      this.setColour('#e056fd');
      this.setTooltip('Dahili RGB LED için hazır renk seçer.');
    }
  };

  // 5. Servo Motor
  Blockly.Blocks['deneyap_servo_attach'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Servo Başlat Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D9', 'D9'], ['D10', 'D10'],
          ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f39c12');
      this.setTooltip('Seçilen pinde servo motoru başlatır.');
    }
  };

  Blockly.Blocks['deneyap_servo_write'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Servo Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D9', 'D9'], ['D10', 'D10'],
          ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN');
      this.appendValueInput('ANGLE')
        .setCheck('Number')
        .appendField('Açısını (0-180°) yap');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f39c12');
      this.setTooltip('Servo motorun açısını 0 ile 180 derece arasında konumlandırır.');
    }
  };

  // 6. Ses (Buzzer)
  Blockly.Blocks['deneyap_buzzer_tone'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Buzzer Çal Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9'],
          ['D10', 'D10'], ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN');
      this.appendValueInput('FREQ')
        .setCheck('Number')
        .appendField('Frekans (Hz)');
      this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('Süre (ms)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ff7675');
      this.setTooltip('Buzzer ile belirtilen frekans ve sürede ses üretir.');
    }
  };

  Blockly.Blocks['deneyap_buzzer_notone'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Buzzer Sustur Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9'],
          ['D10', 'D10'], ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'PIN');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ff7675');
      this.setTooltip('Buzzer sesini durdurur.');
    }
  };

  // 7. Seri İletişim
  Blockly.Blocks['deneyap_serial_begin'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Seri İletişimi Başlat (Baud)')
        .appendField(new Blockly.FieldDropdown([
          ['115200', '115200'],
          ['9600', '9600'],
          ['57600', '57600']
        ]), 'BAUD');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2ecc71');
      this.setTooltip('Seri port haberleşmesini başlatır.');
    }
  };

  Blockly.Blocks['deneyap_serial_print'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .appendField('Seri Porta Yaz');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2ecc71');
      this.setTooltip('Seri monitöre veri yazdırır.');
    }
  };

  Blockly.Blocks['deneyap_serial_println'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .appendField('Seri Porta Satır Yaz (Alt satıra geç)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2ecc71');
      this.setTooltip('Seri monitöre veri yazdırır ve alt satıra geçer.');
    }
  };

  Blockly.Blocks['deneyap_serial_available'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Seri Veri Geldi mi?');
      this.setOutput(true, 'Boolean');
      this.setColour('#2ecc71');
      this.setTooltip('Seri porttan okunacak yeni veri varsa Doğru döner.');
    }
  };

  Blockly.Blocks['deneyap_serial_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Seri Veriyi Oku');
      this.setOutput(true, 'String');
      this.setColour('#2ecc71');
      this.setTooltip('Seri porttan gelen veriyi metin olarak okur.');
    }
  };

  // 8. Bluetooth (Classic)
  Blockly.Blocks['deneyap_bluetooth_begin'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Bluetooth Başlat Cihaz Adı')
        .appendField(new Blockly.FieldTextInput('Deneyap_BT'), 'NAME');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#3498db');
      this.setTooltip('Dahili Bluetooth seri haberleşmesini başlatır.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_println'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .appendField('Bluetooth ile Gönder');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#3498db');
      this.setTooltip('Bluetooth üzerinden bağlı cihaza veri gönderir.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_available'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Bluetooth Veri Geldi mi?');
      this.setOutput(true, 'Boolean');
      this.setColour('#3498db');
      this.setTooltip('Bluetooth üzerinden yeni veri gelip gelmediğini kontrol eder.');
    }
  };

  Blockly.Blocks['deneyap_bluetooth_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Bluetooth Verisini Oku');
      this.setOutput(true, 'String');
      this.setColour('#3498db');
      this.setTooltip('Bluetooth üzerinden gelen karakteri okur.');
    }
  };

  // 9. LCD I2C (LiquidCrystal_I2C)
  Blockly.Blocks['deneyap_lcd_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD Ekranı Başlat')
        .appendField('Adres')
        .appendField(new Blockly.FieldDropdown([
          ['0x27', '0x27'],
          ['0x3F', '0x3F']
        ]), 'ADDR')
        .appendField('Boyut')
        .appendField(new Blockly.FieldDropdown([
          ['16x2', '16, 2'],
          ['20x4', '20, 4']
        ]), 'SIZE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#16a085');
      this.setTooltip('I2C arayüzlü LCD ekranı başlatır ve arka ışığını açar.');
    }
  };

  Blockly.Blocks['deneyap_lcd_print'] = {
    init: function () {
      this.appendValueInput('TEXT')
        .appendField('LCD Yaz');
      this.appendValueInput('COL')
        .setCheck('Number')
        .appendField('Sütun');
      this.appendValueInput('ROW')
        .setCheck('Number')
        .appendField('Satır');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#16a085');
      this.setTooltip('LCD ekranın belirtilen satır ve sütununa metin yazdırır.');
    }
  };

  Blockly.Blocks['deneyap_lcd_clear'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('LCD Ekranı Temizle');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#16a085');
      this.setTooltip('LCD ekranı siler ve imleci başa alır.');
    }
  };

  // 10. Step Motor
  Blockly.Blocks['deneyap_stepper_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Step Motor Başlat (Adım/Tur: 2048)')
        .appendField('IN1: D0, IN2: D2, IN3: D1, IN4: D3');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d35400');
      this.setTooltip('28BYJ-48 veya benzeri step motor sürücüsünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_stepper_speed'] = {
    init: function () {
      this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Step Motor Hızı (RPM)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d35400');
      this.setTooltip('Step motor dönüş hızını ayarlar (RPM).');
    }
  };

  Blockly.Blocks['deneyap_stepper_step'] = {
    init: function () {
      this.appendValueInput('STEPS')
        .setCheck('Number')
        .appendField('Step Motor Adım Attır');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d35400');
      this.setTooltip('Step motoru pozitif veya negatif yönde belirtilen adım kadar döndürür.');
    }
  };

  // 11. RFID (MFRC522)
  Blockly.Blocks['deneyap_rfid_init'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('RFID Okuyucu Başlat (SDA: D10, RST: D9)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#8e44ad');
      this.setTooltip('SPI arayüzlü RC522 RFID okuyucu modülünü başlatır.');
    }
  };

  Blockly.Blocks['deneyap_rfid_card_present'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Yeni RFID Kart Okundu mu?');
      this.setOutput(true, 'Boolean');
      this.setColour('#8e44ad');
      this.setTooltip('RFID okuyucu alanında yeni bir kart varsa Doğru döner.');
    }
  };

  Blockly.Blocks['deneyap_rfid_read_uid'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Okunan RFID Kart UID');
      this.setOutput(true, 'String');
      this.setColour('#8e44ad');
      this.setTooltip('Okunan kartın benzersiz seri numarasını (UID) döndürür.');
    }
  };

  // 12. Algılayıcılar: Ultrasonik Mesafe
  Blockly.Blocks['deneyap_ultrasonic_read'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Mesafe Oku (cm) Trig:')
        .appendField(new Blockly.FieldDropdown([
          ['D0', 'D0'], ['D1', 'D1'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9'],
          ['D10', 'D10'], ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'TRIG')
        .appendField('Echo:')
        .appendField(new Blockly.FieldDropdown([
          ['D1', 'D1'], ['D0', 'D0'], ['D4', 'D4'], ['D5', 'D5'],
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9'],
          ['D10', 'D10'], ['D11', 'D11'], ['D12', 'D12'], ['D13', 'D13'], ['D14', 'D14'], ['D15', 'D15']
        ]), 'ECHO');
      this.setOutput(true, 'Number');
      this.setColour('#1abc9c');
      this.setTooltip('HC-SR04 veya Deneyap Mesafe Ölçer modülünden santimetre cinsinden mesafe okur.');
    }
  };
}
