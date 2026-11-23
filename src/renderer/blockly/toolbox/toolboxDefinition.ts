export const DENEYAP_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    // 1. ☪ Deneyap
    {
      kind: 'category',
      name: '☪ Deneyap',
      colour: '#d32f2f',
      contents: [
        { kind: 'block', type: 'deneyap_include' },
        { kind: 'block', type: 'deneyap_pin_array' },
        { kind: 'block', type: 'deneyap_tanimlama' },
        { kind: 'block', type: 'deneyap_kurulum_dongu' },
        { kind: 'block', type: 'deneyap_raw_code_stmt' },
        { kind: 'block', type: 'deneyap_raw_code_expr' },
        { kind: 'block', type: 'deneyap_to_hex' },
        { kind: 'block', type: 'deneyap_button_read' }
      ]
    },

    // 2. ⇆ Mantık
    {
      kind: 'category',
      name: '⇆ Mantık',
      colour: '#f39c12',
      contents: [
        { kind: 'block', type: 'controls_if' },
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: { kind: 'block', type: 'math_number', fields: { NUM: 10 } }
            }
          }
        },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_flow_statements' },
        { kind: 'block', type: 'deneyap_logic_constant' },
        { kind: 'block', type: 'logic_operation' },
        {
          kind: 'block',
          type: 'controls_for',
          inputs: {
            FROM: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 10 } } },
            BY: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1 } } }
          }
        },
        { kind: 'block', type: 'deneyap_switch_case' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_null' }
      ]
    },

    // 3. ⏱ Zaman
    {
      kind: 'category',
      name: '⏱ Zaman',
      colour: '#00838f',
      contents: [
        {
          kind: 'block',
          type: 'deneyap_delay_unit',
          inputs: {
            TIME: {
              shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1000 } }
            }
          }
        },
        { kind: 'block', type: 'deneyap_interval' },
        { kind: 'block', type: 'deneyap_time_read' },
        { kind: 'block', type: 'deneyap_pulse_in' }
      ]
    },

    // 4. ∑ Matematik
    {
      kind: 'category',
      name: '∑ Matematik',
      colour: '#d32f2f',
      contents: [
        {
          kind: 'block',
          type: 'deneyap_math_map',
          inputs: {
            VAL: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 50 } } },
            F_LOW: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } },
            F_HIGH: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1023 } } },
            T_LOW: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } },
            T_HIGH: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 255 } } }
          }
        },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 100 } } }
          }
        },
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'deneyap_math_angle' },
        { kind: 'block', type: 'deneyap_math_analog_pin' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'deneyap_math_chained_compare' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property' },
        { kind: 'block', type: 'math_modulo' }
      ]
    },

    // 5. “ Metin
    {
      kind: 'category',
      name: '“ Metin',
      colour: '#f5a623',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'deneyap_text_char' },
        { kind: 'block', type: 'deneyap_text_compare' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_isEmpty' }
      ]
    },

    // 6. ∿ Değişken
    {
      kind: 'category',
      name: '∿ Değişken',
      colour: '#2980b9',
      custom: 'VARIABLE',
      contents: [
        { kind: 'block', type: 'deneyap_variable_address' }
      ]
    },

    // 7. ∫∫ Fonksiyon
    {
      kind: 'category',
      name: '∫∫ Fonksiyon',
      colour: '#d32f2f',
      custom: 'PROCEDURE',
      contents: [
        { kind: 'block', type: 'deneyap_procedure_defreturn_typed' }
      ]
    },

    // 8. ⇅ Giriş/Çıkış
    {
      kind: 'category',
      name: '⇅ Giriş/Çıkış',
      colour: '#008b8b',
      contents: [
        { kind: 'block', type: 'deneyap_digital_read' },
        { kind: 'block', type: 'deneyap_digital_write' },
        { kind: 'block', type: 'deneyap_analog_read' },
        {
          kind: 'block',
          type: 'deneyap_analog_write',
          inputs: {
            VALUE: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 128 } } }
          }
        },
        { kind: 'block', type: 'deneyap_digital_read_pullup' },
        { kind: 'block', type: 'deneyap_attach_interrupt' },
        { kind: 'block', type: 'deneyap_detach_interrupt' },
        { kind: 'block', type: 'deneyap_pin_mode' },
        { kind: 'block', type: 'deneyap_pwm_setup' },
        {
          kind: 'block',
          type: 'deneyap_pwm_custom_write',
          inputs: {
            VAL: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 128 } } }
          }
        },
        { kind: 'block', type: 'deneyap_pin_toggle' }
      ]
    },

    // 9. Saat (RTC)
    {
      kind: 'category',
      name: 'Saat (RTC)',
      colour: '#1e88e5',
      contents: [
        { kind: 'block', type: 'deneyap_rtc_set_time' },
        { kind: 'block', type: 'deneyap_rtc_refresh' },
        { kind: 'block', type: 'deneyap_rtc_get_part' },
        { kind: 'block', type: 'deneyap_rtc_get_date' },
        { kind: 'block', type: 'deneyap_rtc_get_time' }
      ]
    },

    // 10. ▦ Dizi
    {
      kind: 'category',
      name: '▦ Dizi',
      colour: '#e65100',
      contents: [
        { kind: 'block', type: 'deneyap_array_define' },
        {
          kind: 'block',
          type: 'deneyap_array_set',
          inputs: {
            INDEX: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } },
            VAL: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 10 } } }
          }
        },
        {
          kind: 'block',
          type: 'deneyap_array_get',
          inputs: {
            INDEX: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        { kind: 'block', type: 'deneyap_array_size' }
      ]
    },

    // 11. ↻ Step Motor
    {
      kind: 'category',
      name: '↻ Step Motor',
      colour: '#303f9f',
      contents: [
        { kind: 'block', type: 'deneyap_l298n_init' },
        {
          kind: 'block',
          type: 'deneyap_l298n_drive',
          inputs: {
            SPEED: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 255 } } }
          }
        },
        { kind: 'block', type: 'deneyap_stepper_def' },
        {
          kind: 'block',
          type: 'deneyap_stepper_set_speed',
          inputs: {
            SPEED: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 60 } } }
          }
        },
        {
          kind: 'block',
          type: 'deneyap_stepper_step_custom',
          inputs: {
            STEPS: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 100 } } }
          }
        }
      ]
    },

    // 12. ∿ Servo
    {
      kind: 'category',
      name: '∿ Servo',
      colour: '#1565c0',
      contents: [
        { kind: 'block', type: 'deneyap_servo_full' },
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

    // 13. 🗎 LCD I2C
    {
      kind: 'category',
      name: '🗎 LCD I2C',
      colour: '#4a148c',
      contents: [
        { kind: 'block', type: 'deneyap_lcd_init' },
        { kind: 'block', type: 'deneyap_lcd_set_cursor' },
        {
          kind: 'block',
          type: 'deneyap_lcd_print_val',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Merhaba' } } }
          }
        },
        { kind: 'block', type: 'deneyap_lcd_write_char' },
        { kind: 'block', type: 'deneyap_lcd_create_char' },
        { kind: 'block', type: 'deneyap_lcd_write_custom_char' },
        { kind: 'block', type: 'deneyap_lcd_clear' },
        { kind: 'block', type: 'deneyap_lcd_home' },
        { kind: 'block', type: 'deneyap_lcd_display_power' },
        { kind: 'block', type: 'deneyap_lcd_scroll' },
        { kind: 'block', type: 'deneyap_lcd_backlight' },
        { kind: 'block', type: 'deneyap_lcd_cursor_mode' },
        { kind: 'block', type: 'deneyap_lcd_blink_mode' }
      ]
    },

    // 14. ♫ Ses
    {
      kind: 'category',
      name: '♫ Ses',
      colour: '#c62828',
      contents: [
        { kind: 'block', type: 'deneyap_buzzer_tone_full' },
        { kind: 'block', type: 'deneyap_buzzer_note' },
        { kind: 'block', type: 'deneyap_buzzer_notone' },
        { kind: 'block', type: 'deneyap_music_note_const' },
        { kind: 'block', type: 'deneyap_speaker_init' },
        { kind: 'block', type: 'deneyap_play_melody' }
      ]
    },

    // 15. ☎ Seri İletişim
    {
      kind: 'category',
      name: '☎ Seri İletişim',
      colour: '#f5a623',
      contents: [
        { kind: 'block', type: 'deneyap_serial_begin' },
        { kind: 'block', type: 'deneyap_serial_available' },
        {
          kind: 'block',
          type: 'deneyap_serial_print_ext',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Deneyap Kart' } } }
          }
        },
        { kind: 'block', type: 'deneyap_serial_read_type' },
        { kind: 'block', type: 'deneyap_serial_write_byte' },
        { kind: 'block', type: 'deneyap_i2c_init' },
        { kind: 'block', type: 'deneyap_i2c_begin_transmission' },
        { kind: 'block', type: 'deneyap_i2c_end_transmission' },
        { kind: 'block', type: 'deneyap_i2c_read' }
      ]
    },

    // 16. ⇊ Algılayıcılar
    {
      kind: 'category',
      name: '⇊ Algılayıcılar',
      colour: '#c62828',
      contents: [
        { kind: 'block', type: 'deneyap_imu_read' },
        { kind: 'block', type: 'deneyap_ultrasonic_read' },
        { kind: 'block', type: 'deneyap_dht11_read' },
        { kind: 'block', type: 'deneyap_mic_read' },
        { kind: 'block', type: 'deneyap_magnetic_read' },
        { kind: 'block', type: 'deneyap_tcs34725_init' },
        { kind: 'block', type: 'deneyap_tcs34725_read' },
        { kind: 'block', type: 'deneyap_tcs34725_is_color' }
      ]
    },

    // 17. ⚚ RGB Led
    {
      kind: 'category',
      name: '⚚ RGB Led',
      colour: '#4a148c',
      contents: [
        { kind: 'block', type: 'deneyap_rgb_builtin_blink' },
        { kind: 'block', type: 'deneyap_rgb_led_picker' },
        { kind: 'block', type: 'deneyap_rgb_builtin_pwm' },
        { kind: 'block', type: 'deneyap_rgb_neopixel' },
        { kind: 'block', type: 'deneyap_rgb_def_id' },
        { kind: 'block', type: 'deneyap_rgb_set_id' },
        { kind: 'block', type: 'deneyap_rgb_pick_id' },
        { kind: 'block', type: 'deneyap_rgb_simple_def' },
        {
          kind: 'block',
          type: 'deneyap_rgb_show_values',
          inputs: {
            R: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 255 } } },
            G: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } },
            B: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 0 } } }
          }
        },
        { kind: 'block', type: 'deneyap_rgb_color_field' },
        { kind: 'block', type: 'deneyap_rgb_builtin_color' }
      ]
    },

    // 18. Bluetooth
    {
      kind: 'category',
      name: 'Bluetooth',
      colour: '#00838f',
      contents: [
        { kind: 'block', type: 'deneyap_bluetooth_begin' },
        { kind: 'block', type: 'deneyap_bluetooth_available' },
        {
          kind: 'block',
          type: 'deneyap_bluetooth_print_ext',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Merhaba BT' } } }
          }
        },
        { kind: 'block', type: 'deneyap_bluetooth_read_ext' },
        { kind: 'block', type: 'deneyap_bluetooth_write_byte' }
      ]
    },

    // 19. Kızılötesi
    {
      kind: 'category',
      name: 'Kızılötesi',
      colour: '#0277bd',
      contents: [
        { kind: 'block', type: 'deneyap_ir_recv_init' },
        { kind: 'block', type: 'deneyap_ir_available' },
        { kind: 'block', type: 'deneyap_ir_read_code' },
        { kind: 'block', type: 'deneyap_ir_send' }
      ]
    },

    // 20. RFID
    {
      kind: 'category',
      name: 'RFID',
      colour: '#0277bd',
      contents: [
        { kind: 'block', type: 'deneyap_rfid_init' },
        { kind: 'block', type: 'deneyap_rfid_card_present' },
        { kind: 'block', type: 'deneyap_rfid_read_uid' },
        { kind: 'block', type: 'deneyap_rfid_uid_equals' }
      ]
    },

    // 21. Tuş Takımı
    {
      kind: 'category',
      name: 'Tuş Takımı',
      colour: '#0288d1',
      contents: [
        { kind: 'block', type: 'deneyap_keypad_3x4_init' },
        { kind: 'block', type: 'deneyap_keypad_4x4_init' },
        { kind: 'block', type: 'deneyap_keypad_get_key' },
        { kind: 'block', type: 'deneyap_keypad_is_pressed' }
      ]
    },

    // 22. SD Kart
    {
      kind: 'category',
      name: 'SD Kart',
      colour: '#f5a623',
      contents: [
        { kind: 'block', type: 'deneyap_sd_init' },
        {
          kind: 'block',
          type: 'deneyap_sd_write',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'Kayit satiri' } } }
          }
        },
        { kind: 'block', type: 'deneyap_sd_read' },
        { kind: 'block', type: 'deneyap_sd_exists' },
        { kind: 'block', type: 'deneyap_sd_remove' }
      ]
    },

    // 23. ☁ Nesnelerin İnterneti
    {
      kind: 'category',
      name: '☁ Nesnelerin İnterneti',
      colour: '#0277bd',
      contents: [
        { kind: 'block', type: 'deneyap_wifi_connect' },
        { kind: 'block', type: 'deneyap_wifi_status' },
        { kind: 'block', type: 'deneyap_wifi_ip' },
        { kind: 'block', type: 'deneyap_mqtt_connect' },
        { kind: 'block', type: 'deneyap_mqtt_subscribe' },
        {
          kind: 'block',
          type: 'deneyap_mqtt_publish',
          inputs: {
            MSG: { shadow: { kind: 'block', type: 'text', fields: { TEXT: '1' } } }
          }
        },
        { kind: 'block', type: 'deneyap_mqtt_loop' },
        { kind: 'block', type: 'deneyap_mqtt_message' }
      ]
    },

    // 24. ☪ Deneyap LED Matris
    {
      kind: 'category',
      name: '☪ Deneyap LED Matris',
      colour: '#5e35b1',
      contents: [
        { kind: 'block', type: 'deneyap_matrix_init' },
        { kind: 'block', type: 'deneyap_matrix_pattern' },
        { kind: 'block', type: 'deneyap_matrix_icon' },
        { kind: 'block', type: 'deneyap_matrix_pixel' },
        { kind: 'block', type: 'deneyap_matrix_row' },
        { kind: 'block', type: 'deneyap_matrix_col' },
        { kind: 'block', type: 'deneyap_matrix_clear' },
        { kind: 'block', type: 'deneyap_matrix_brightness' }
      ]
    },

    // 25. ☪ Deneyap OLED Ekran
    {
      kind: 'category',
      name: '☪ Deneyap OLED Ekran',
      colour: '#c62828',
      contents: [
        { kind: 'block', type: 'deneyap_oled_init' },
        {
          kind: 'block',
          type: 'deneyap_oled_print_text',
          inputs: {
            TEXT: { shadow: { kind: 'block', type: 'text', fields: { TEXT: 'DENEYAP' } } }
          }
        },
        {
          kind: 'block',
          type: 'deneyap_oled_print_num',
          inputs: {
            VAL: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 123 } } }
          }
        },
        { kind: 'block', type: 'deneyap_oled_clear' },
        { kind: 'block', type: 'deneyap_oled_show' },
        { kind: 'block', type: 'deneyap_oled_draw_line' },
        { kind: 'block', type: 'deneyap_oled_draw_rect' },
        { kind: 'block', type: 'deneyap_oled_draw_circle' },
        { kind: 'block', type: 'deneyap_oled_scroll' }
      ]
    },

    // 26. ☪ Deneyap Algılayıcılar
    {
      kind: 'category',
      name: '☪ Deneyap Algılayıcılar',
      colour: '#c62828',
      contents: [
        // Barometre / Basınç
        { kind: 'block', type: 'deneyap_i2c_barometer_init' },
        { kind: 'block', type: 'deneyap_i2c_barometer_temp' },
        { kind: 'block', type: 'deneyap_i2c_barometer_pressure' },
        { kind: 'block', type: 'deneyap_i2c_barometer_altitude' },

        // BME280
        { kind: 'block', type: 'deneyap_i2c_bme280_init' },
        { kind: 'block', type: 'deneyap_i2c_bme280_temp' },
        { kind: 'block', type: 'deneyap_i2c_bme280_humidity' },
        { kind: 'block', type: 'deneyap_i2c_bme280_pressure' },

        // Pusula
        { kind: 'block', type: 'deneyap_i2c_compass_init' },
        { kind: 'block', type: 'deneyap_i2c_compass_read' },
        { kind: 'block', type: 'deneyap_i2c_compass_angle' },

        // 6 Eksen Ataletsel (IMU)
        { kind: 'block', type: 'deneyap_i2c_imu6_init' },
        { kind: 'block', type: 'deneyap_i2c_imu6_accel' },
        { kind: 'block', type: 'deneyap_i2c_imu6_gyro' },
        { kind: 'block', type: 'deneyap_i2c_imu6_temp' },

        // Jest & Renk (APDS9960)
        { kind: 'block', type: 'deneyap_i2c_apds9960_init' },
        { kind: 'block', type: 'deneyap_i2c_apds9960_gesture' },
        { kind: 'block', type: 'deneyap_i2c_apds9960_color' },
        { kind: 'block', type: 'deneyap_i2c_apds9960_proximity' },

        // Sıcaklık Nem
        { kind: 'block', type: 'deneyap_i2c_dht_init' },
        { kind: 'block', type: 'deneyap_i2c_dht_temp' },
        { kind: 'block', type: 'deneyap_i2c_dht_humidity' },

        // Derinlik
        { kind: 'block', type: 'deneyap_i2c_depth_init' },
        { kind: 'block', type: 'deneyap_i2c_depth_read' },

        // Duman / Gaz
        { kind: 'block', type: 'deneyap_i2c_smoke_init' },
        { kind: 'block', type: 'deneyap_i2c_smoke_val' },
        { kind: 'block', type: 'deneyap_i2c_smoke_detected' },

        // Joystick
        { kind: 'block', type: 'deneyap_i2c_joystick_init' },
        { kind: 'block', type: 'deneyap_i2c_joystick_axis' },
        { kind: 'block', type: 'deneyap_i2c_joystick_button' },

        // Çizgi İzleyen
        { kind: 'block', type: 'deneyap_i2c_line_init' },
        { kind: 'block', type: 'deneyap_i2c_line_read' },
        { kind: 'block', type: 'deneyap_i2c_line_status' },

        // Lazer Mesafe (VL53L0X)
        { kind: 'block', type: 'deneyap_i2c_vl53l0x_init' },
        { kind: 'block', type: 'deneyap_i2c_vl53l0x_dist' },
        { kind: 'block', type: 'deneyap_i2c_vl53l0x_ambient' },

        // Yağmur Sensörü
        { kind: 'block', type: 'deneyap_i2c_rain_init' },
        { kind: 'block', type: 'deneyap_i2c_rain_val' },
        { kind: 'block', type: 'deneyap_i2c_rain_is_raining' },

        // Röle
        { kind: 'block', type: 'deneyap_i2c_relay_init' },
        { kind: 'block', type: 'deneyap_i2c_relay_set' },

        // Toprak Nemi
        { kind: 'block', type: 'deneyap_i2c_soil_init' },
        { kind: 'block', type: 'deneyap_i2c_soil_read' },

        // Dokunmatik
        { kind: 'block', type: 'deneyap_i2c_touch_init' },
        { kind: 'block', type: 'deneyap_i2c_touch_read' },

        // Kızılötesi I2C
        { kind: 'block', type: 'deneyap_i2c_ir_init' },
        { kind: 'block', type: 'deneyap_i2c_ir_read' },
        { kind: 'block', type: 'deneyap_i2c_ir_send' },

        // PIR
        { kind: 'block', type: 'deneyap_i2c_pir_init' },
        { kind: 'block', type: 'deneyap_i2c_pir_motion' },

        // RTC I2C
        { kind: 'block', type: 'deneyap_i2c_rtc_init' },
        { kind: 'block', type: 'deneyap_i2c_rtc_reset' },
        { kind: 'block', type: 'deneyap_i2c_rtc_read' },

        // Motor Sürücüler
        { kind: 'block', type: 'deneyap_i2c_dcmotor_init' },
        {
          kind: 'block',
          type: 'deneyap_i2c_dcmotor_drive',
          inputs: {
            SPEED: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 200 } } }
          }
        },
        { kind: 'block', type: 'deneyap_i2c_dcmotor_stop' },
        { kind: 'block', type: 'deneyap_i2c_stepper_init' },
        {
          kind: 'block',
          type: 'deneyap_i2c_stepper_step',
          inputs: {
            STEPS: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 100 } } },
            SPEED: { shadow: { kind: 'block', type: 'math_number', fields: { NUM: 60 } } }
          }
        },

        // UV, Mikrofon, GPS
        { kind: 'block', type: 'deneyap_i2c_uv_init' },
        { kind: 'block', type: 'deneyap_i2c_uv_read' },
        { kind: 'block', type: 'deneyap_i2c_mic_init' },
        { kind: 'block', type: 'deneyap_i2c_mic_read' },
        { kind: 'block', type: 'deneyap_i2c_gps_init' },
        { kind: 'block', type: 'deneyap_i2c_gps_lat' },
        { kind: 'block', type: 'deneyap_i2c_gps_lng' },
        { kind: 'block', type: 'deneyap_i2c_gps_speed' },
        { kind: 'block', type: 'deneyap_i2c_gps_sats' }
      ]
    }
  ]
};
