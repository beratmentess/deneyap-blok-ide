export const DENEYAP_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Deneyap',
      colour: '#0088cc',
      contents: [
        { kind: 'block', type: 'deneyap_button_read' }
      ]
    },
    {
      kind: 'category',
      name: 'Giriş / Çıkış',
      colour: '#4a90e2',
      contents: [
        { kind: 'block', type: 'deneyap_digital_write' },
        { kind: 'block', type: 'deneyap_digital_read' },
        { kind: 'block', type: 'deneyap_analog_read' },
        {
          kind: 'block',
          type: 'deneyap_pwm_write',
          inputs: {
            VALUE: {
              shadow: {
                kind: 'block',
                type: 'math_number',
                fields: { NUM: 128 }
              }
            }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'RGB LED',
      colour: '#e056fd',
      contents: [
        { kind: 'block', type: 'deneyap_rgb_builtin_color' },
        {
          kind: 'block',
          type: 'deneyap_rgb_builtin_set',
          inputs: {
            RED: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 255 } } },
            GREEN: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } },
            BLUE: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Zaman',
      colour: '#00a896',
      contents: [
        {
          kind: 'block',
          type: 'deneyap_delay',
          inputs: {
            DELAY_MS: {
              shadow: {
                kind: 'block',
                type: 'math_number',
                fields: { NUM: 1000 }
              }
            }
          }
        },
        { kind: 'block', type: 'deneyap_millis' }
      ]
    },
    {
      kind: 'category',
      name: 'Mantık',
      colour: '#5b80a5',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' }
      ]
    },
    {
      kind: 'category',
      name: 'Döngü',
      colour: '#5ba55b',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: {
                kind: 'block',
                type: 'math_number',
                fields: { NUM: 10 }
              }
            }
          }
        },
        { kind: 'block', type: 'controls_whileUntil' },
        {
          kind: 'block',
          type: 'controls_for',
          inputs: {
            FROM: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 10 } } },
            BY: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1 } } }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Matematik',
      colour: '#5b67a5',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 100 } } }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Metin',
      colour: '#5ba58c',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' }
      ]
    },
    {
      kind: 'category',
      name: 'Değişkenler',
      colour: '#a55b80',
      custom: 'VARIABLE'
    },
    {
      kind: 'category',
      name: 'Fonksiyonlar',
      colour: '#995ba5',
      custom: 'PROCEDURE'
    },
    {
      kind: 'sep'
    },
    {
      kind: 'category',
      name: 'Seri İletişim',
      colour: '#2ecc71',
      contents: [
        { kind: 'block', type: 'deneyap_serial_begin' },
        {
          kind: 'block',
          type: 'deneyap_serial_print',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Merhaba Deneyap!' } } }
          }
        },
        {
          kind: 'block',
          type: 'deneyap_serial_println',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Merhaba Deneyap!' } } }
          }
        },
        { kind: 'block', type: 'deneyap_serial_available' },
        { kind: 'block', type: 'deneyap_serial_read' }
      ]
    },
    {
      kind: 'category',
      name: 'Servo',
      colour: '#f39c12',
      contents: [
        { kind: 'block', type: 'deneyap_servo_attach' },
        {
          kind: 'block',
          type: 'deneyap_servo_write',
          inputs: {
            ANGLE: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 90 } } }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'Ses',
      colour: '#ff7675',
      contents: [
        {
          kind: 'block',
          type: 'deneyap_buzzer_tone',
          inputs: {
            FREQ: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1000 } } },
            DURATION: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 500 } } }
          }
        },
        { kind: 'block', type: 'deneyap_buzzer_notone' }
      ]
    },
    {
      kind: 'category',
      name: 'LCD I2C',
      colour: '#16a085',
      contents: [
        { kind: 'block', type: 'deneyap_lcd_init' },
        {
          kind: 'block',
          type: 'deneyap_lcd_print',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Deneyap Kart' } } },
            COL: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } },
            ROW: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        { kind: 'block', type: 'deneyap_lcd_clear' }
      ]
    },
    {
      kind: 'category',
      name: 'Step Motor',
      colour: '#d35400',
      contents: [
        { kind: 'block', type: 'deneyap_stepper_init' },
        {
          kind: 'block',
          type: 'deneyap_stepper_speed',
          inputs: {
            SPEED: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 15 } } }
          }
        },
        {
          kind: 'block',
          type: 'deneyap_stepper_step',
          inputs: {
            STEPS: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 2048 } } }
          }
        }
      ]
    },
    {
      kind: 'category',
      name: 'RFID',
      colour: '#8e44ad',
      contents: [
        { kind: 'block', type: 'deneyap_rfid_init' },
        { kind: 'block', type: 'deneyap_rfid_card_present' },
        { kind: 'block', type: 'deneyap_rfid_read_uid' }
      ]
    },
    {
      kind: 'category',
      name: 'Bluetooth',
      colour: '#3498db',
      contents: [
        { kind: 'block', type: 'deneyap_bluetooth_begin' },
        {
          kind: 'block',
          type: 'deneyap_bluetooth_println',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Veri' } } }
          }
        },
        { kind: 'block', type: 'deneyap_bluetooth_available' },
        { kind: 'block', type: 'deneyap_bluetooth_read' }
      ]
    },
    {
      kind: 'category',
      name: 'Algılayıcılar',
      colour: '#1abc9c',
      contents: [
        { kind: 'block', type: 'deneyap_ultrasonic_read' }
      ]
    }
  ]
};
