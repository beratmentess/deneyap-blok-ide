# Deneyap Blok IDE (Windows Çevrimdışı Masaüstü IDE)

Windows üzerinde **tamamen internet bağlantısı olmadan (offline)** çalışan, Deneyap Kart ailesi için blok tabanlı görsel programlama, yerel C++ kod üretimi, yerel derleme (offline compiler), USB firmware yükleme ve dahili seri monitör aracı.

---

## 🎯 Özellikler

1. **%100 Çevrimdışı Çalışma (No Internet Required):**
   - Google Blockly yerel olarak paketlenmiştir (CDN kullanılmaz).
   - `arduino-cli`, Deneyap Arduino Core (`deneyap:esp32@2.1.1`), Xtensa GCC (`esp-x32`), RISC-V GCC (`esp-rv32`) ve `esptool` derleyici araçları uygulamanın içine gömülüdür (`toolchain`).
   - İnternet bağlantısı kesildiğinde dahi kod derleme ve USB yükleme eksiksiz çalışır.

2. **Görsel Blok Programlama (Google Blockly - Türkçe):**
   - **Deneyap:** Dahili buton (GPKEY), kart özellikleri.
   - **Giriş / Çıkış (GPIO):** Dijital pin yaz/oku, Analog pin oku (0-4095), PWM çıkışı (0-255).
   - **Dahili RGB LED:** Renk seçimi veya K/Y/M (0-255) parlaklık ayarı (Active-Low sürücü desteği).
   - **Zaman:** Gecikme (ms), `millis()` çalışma zamanı.
   - **Mantık & Döngü & Matematik & Metin & Değişken & Fonksiyon:** Standart C++ karşılıkları.
   - **Servo Motor:** `ESP32Servo` tabanlı açı konumlandırma (0-180°).
   - **Ses (Buzzer):** Frekans ve süreye göre ton çalma / susturma.
   - **Seri İletişim:** `Serial.begin`, `Serial.print`, `Serial.println`, veri kontrolü ve okuma.
   - **Bluetooth:** Dahili `BluetoothSerial` ile veri gönderme / alma.
   - **LCD I2C:** `LiquidCrystal_I2C` ile 16x2 ve 20x4 ekran başlatma, satır/sütun yazı yazdırma, temizleme.
   - **Step Motor:** `Stepper.h` ile 28BYJ-48 / ULN2003 adım kontrolü ve hız (RPM) ayarı.
   - **RFID:** `MFRC522` SPI kart algılama ve UID okuma.
   - **Algılayıcılar:** Ultrasonik mesafe ölçümü (cm).

3. **Canlı C++ Kod Önizleme:**
   - Bloklar sürüklendikçe sağ panelde gerçek zamanlı olarak Arduino/ESP32 C++ kodu (`#include <Arduino.h>`, `setup()`, `loop()`) oluşturulur.
   - Sözdizimi renklendirmesi, satır numaraları ve tek tıkla kopyalama özelliği.

4. **Desteklenen Deneyap Kart Modelleri:**
   - **Deneyap Kart** (`deneyap:esp32:deneyapkart` - ESP32-WROVER)
   - **Deneyap Kart 1A** (`deneyap:esp32:deneyapkart1A` - ESP32-WROOM-32)
   - **Deneyap Kart 1A v2** (`deneyap:esp32:deneyapkart1Av2` - ESP32-S3)
   - **Deneyap Kart G** (`deneyap:esp32:deneyapkartg` - ESP32-C3)
   - **Deneyap Mini** (`deneyap:esp32:deneyapmini` - ESP32-S2)
   - **Deneyap Mini v2** (`deneyap:esp32:deneyapminiv2` - ESP32-S2)
   - **Deneyap Kart v2** (`deneyap:esp32:deneyapkartv2` - ESP32-S3)

5. **Otomatik COM Port Algılama & USB Yükleme:**
   - Takılı olan Deneyap ve ESP32 kartlarının USB VID/PID (0x303A, 0x10C4, 0x1A86 vb.) bilgilerine göre otomatik tanınması.
   - Tek tıkla "Yükle": Blok -> C++ -> Lokal Derleme -> USB Flash -> Başarı bildirimi.

6. **Dahili Seri Monitör:**
   - Bağlan / Bağlantıyı Kes, Baud rate seçimi (9600 - 921600), anlık veri akışı, karta komut gönderme, otomatik kaydırma ve ekran temizleme.

7. **Proje Yönetimi (.dblock):**
   - "Yeni Proje", "Aç (.dblock)", "Kaydet (.dblock)".
   - Blokların durumu, seçilen kart ve proje ayarları tek dosyada saklanır.

---

## 🚀 Çalıştırma

### 1. Hazır Windows `.exe` Çalıştırılabilir Dosyası:
Doğrudan derlenen hazır sürümü çalıştırmak için:
```
release\win-unpacked\Deneyap Blok IDE.exe
```

### 2. Geliştirici Modunda Çalıştırma:
```bash
# Bağımlılıkları yükleyin
npm install

# Yerel derleyici toolchain'ini kurun (ilk seferde)
npm run setup-toolchain

# Geliştirme sunucusunu başlatın
npm run dev
```

### 3. Yeniden Paketleme:
```bash
npm run package
```
Üretilen paket `release\win-unpacked\` klasörüne yazılır.
