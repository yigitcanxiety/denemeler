# Sınav Gözlem Sistemi — Sıfırdan Üretim Prompt'u

> Bu prompt, bir AI modelin bu projeyi sıfırdan üretip üretemeyeceğini test etmek için hazırlanmıştır.
> Herhangi bir LLM'e (GPT-4o, Gemini, Grok, Llama, vb.) verilebilir.
> Çıktı olarak 3 ayrı HTML dosyası beklenir.

---

## TALİMAT

Aşağıda tanımlanan "Sınav Gözlem Sistemi" projesini sıfırdan oluştur. Proje 3 ayrı HTML dosyasından oluşur. Her birini eksiksiz, çalışır, tek dosya (self-contained) HTML olarak üret. Dosyalar tarayıcıda açıldığında düzgün görünmeli, mobil uyumlu olmalı ve hem açık hem karanlık temayı desteklemelidir.

---

## 1. SİSTEM MİMARİSİ

### Genel Bakış
Bu bir **sınav gözlem sistemidir**. Amacı: Sınav sırasında öğrencinin kağıt üzerindeki çalışmasını (yazma, silme, duraksama sürelerini) izlemek ve gözetmene cevap anahtarı doğrulama + canlı izleme imkanı sunmak.

### Donanım Mimarisi
Sistem 4 ana bileşenden oluşur:

#### A. Düğme Kamera (~20mm çap)
- Öğrencinin **yakasına** takılan, düğme görünümünde gizli kamera
- İçinde: **OV2640 kamera modülü** (8×8mm), 3mm pin-hole lens deliği
- Dikiş delikleri ile yakaya dikilir veya klipslenir
- Amacı: Öğrenci izlendiğini unutsun, doğal davransın
- Sıralar **~15° eğimli** olduğu için kamera doğal olarak kağıda bakar
- **FPC kablosu** (24-pin, 0.5mm pitch, 20-30cm) ile gömlek/ceket içinden cebe giden verici ünitesine bağlanır

#### B. Verici Ünitesi (cepte taşınır)
- **ESP32-S3-WROOM-1** veya **ESP32-CAM (AI-Thinker)**
- Kameradan gelen görüntüyü WiFi üzerinden **MJPEG HTTP stream** olarak yayınlar
- 640×480 çözünürlük, 5-10 fps, JPEG kalite: 12
- 2000mAh LiPo pil (~3-4 saat) veya USB powerbank ile beslenir
- HTTP endpoint: `http://<ESP32_IP>/stream`

#### C. MacBook (Ayrı Odada — İşlem Merkezi)
- Gözetmen odasında, sınav salonundan ayrı
- Python 3.11+ çalıştırır: OpenCV, Tesseract OCR (Türkçe), WebSocket sunucu
- Kamera stream'ini alır → frame analizi → OCR → sayfa tespiti → zamanlama → cevap anahtarı çıkarımı
- SQLite veritabanı ile veri kaydı
- WebSocket sunucu (port 8765) ile gözetmen ekranına veri gönderir

#### D. Gözetmen Ekranı (Kredi Kartı Boyutu: 86×54mm)
- **ESP32-C3-MINI-1** + **2.4" ILI9341 TFT LCD** (240×320, SPI)
- 3 dokunsal buton: Onayla (yeşil), Düzelt (sarı), Atla (gri)
- 500-1000mAh LiPo pil (~6-8 saat)
- **İki mod:**
  1. **Cevap Anahtarı Modu:** OCR ile okunan cevapları gözetmene gösterir. Gözetmen onaylar, düzeltir veya atlar.
  2. **İzleme Modu:** Cevap anahtarı onaylandıktan sonra otomatik geçiş. Her soru için yazma/duraksama/silme sürelerini çubuk grafikle gösterir.
- MacBook'a WiFi + WebSocket ile bağlı

### İletişim Protokolü

```
Düğme Kamera --[FPC]--> Verici --[WiFi/HTTP MJPEG]--> MacBook
MacBook --[WiFi/WebSocket JSON]--> Gözetmen Ekranı
Gözetmen Ekranı --[WiFi/WebSocket JSON]--> MacBook (buton yanıtları)
```

### WebSocket Mesaj Formatları

```json
// MacBook → Ekran: Cevap anahtarı modu
{
  "type": "ANSWER_KEY",
  "question": 3,
  "total": 10,
  "ocr_text": "F = m × a",
  "confidence": 0.87
}

// MacBook → Ekran: İzleme modu
{
  "type": "TIMING_UPDATE",
  "questions": [
    {"q": 1, "write": 180, "pause": 45, "erase": 0, "active": false},
    {"q": 2, "write": 95, "pause": 12, "erase": 8, "active": true}
  ],
  "current_page": 1,
  "total_pages": 3,
  "elapsed": "00:24:15"
}

// Ekran → MacBook: Buton yanıtı
{
  "type": "BUTTON",
  "action": "CONFIRM",
  "question": 3
}
```

### SQLite Veritabanı Şeması (6 Tablo)

```sql
-- 1. Sınav oturumları
CREATE TABLE exam_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    status TEXT DEFAULT 'active'
);

-- 2. Sayfa yakalamaları
CREATE TABLE page_captures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES exam_sessions(id),
    page_number INTEGER NOT NULL,
    capture_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_path TEXT,
    ocr_text TEXT
);

-- 3. Cevap anahtarı
CREATE TABLE answer_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES exam_sessions(id),
    question_number INTEGER NOT NULL,
    ocr_answer TEXT,
    confirmed_answer TEXT,
    status TEXT DEFAULT 'pending',
    confidence REAL
);

-- 4. Aktivite olayları
CREATE TABLE activity_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES exam_sessions(id),
    event_type TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    region TEXT,
    details TEXT
);

-- 5. Soru zamanlama
CREATE TABLE question_timings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES exam_sessions(id),
    question_number INTEGER NOT NULL,
    write_duration INTEGER DEFAULT 0,
    pause_duration INTEGER DEFAULT 0,
    erase_duration INTEGER DEFAULT 0,
    first_touch DATETIME,
    last_touch DATETIME
);

-- 6. Erişim günlüğü
CREATE TABLE access_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES exam_sessions(id),
    accessor TEXT NOT NULL,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT
);
```

### Python Yazılım Modülleri

```
sinav-gozlem/
├── firmware/
│   ├── camera_stream/        # ESP32-CAM Arduino firmware
│   │   ├── camera_stream.ino
│   │   └── config.h
│   └── display_client/       # ESP32-C3 ekran firmware
│       ├── display_client.ino
│       ├── ui_renderer.h
│       └── config.h
├── server/
│   ├── main.py               # Ana giriş noktası
│   ├── capture.py            # MJPEG stream yakalama
│   ├── frame_analyzer.py     # Frame karşılaştırma, hareket tespiti
│   ├── page_detector.py      # Sayfa kenar tespiti, perspektif düzeltme
│   ├── document_stitcher.py  # Çoklu frame birleştirme
│   ├── timing_engine.py      # Yazma/duraksama/silme zamanlama
│   ├── answer_key.py         # OCR + cevap anahtarı yönetimi
│   ├── display_server.py     # WebSocket sunucu
│   ├── db.py                 # SQLite işlemleri
│   ├── config.py             # Yapılandırma
│   └── privacy.py            # Gizlilik kontrolleri
├── hardware/                 # STL dosyaları, kablolama şemaları
├── recordings/               # Ham kayıtlar (geçici)
├── captures/                 # Sayfa yakalamaları
├── exam_data.db              # SQLite veritabanı
└── requirements.txt
```

---

## 2. GÜVENLİK VE GİZLİLİK KISITLARI (ZORUNLU)

Bu kısıtlar **her üç HTML dosyasında** da açıkça belirtilmeli ve tasarımın temelini oluşturmalıdır:

1. **Stres, duygu, psikolojik durum veya kopya niyeti çıkarımı YAPILMAZ**
2. **Otomatik öğrenci değerlendirmesi YAPILMAZ**
3. Kamera **yalnızca kağıt ve el hareketlerini** kaydeder — yüz tanıma veya biyometrik analiz YOK
4. Katılımcılar kayıt amacı ve ekranın işlevi konusunda **önceden bilgilendirilir**
5. Kayıtlara erişim, saklama ve silme süreleri **sınırlandırılır**
6. Ham görüntüler sınav bitiminde **silinir**, yalnızca istatistiksel veriler saklanır

---

## 3. TASARIM SİSTEMİ

Her üç HTML dosyası aynı tasarım sistemini kullanmalıdır:

### Renkler (CSS Custom Properties)
```css
:root {
  --bg: #fafaf9;
  --fg: #1c1917;
  --fg-muted: #78716c;
  --surface: #ffffff;
  --surface-alt: #f5f5f4;
  --border: #e7e5e4;
  --accent: #2563eb;
  --accent-soft: #dbeafe;
  --accent-fg: #1e40af;
  --warn: #d97706;
  --warn-soft: #fef3c7;
  --success: #059669;
  --success-soft: #d1fae5;
  --danger: #dc2626;
  --danger-soft: #fee2e2;
  --radius: 10px;
}
```

### Karanlık Tema
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0c0a09;
    --fg: #e7e5e4;
    --fg-muted: #a8a29e;
    --surface: #1c1917;
    --surface-alt: #292524;
    --border: #44403c;
    --accent: #60a5fa;
    --accent-soft: #1e3a5f;
    --accent-fg: #93bbfd;
    --warn: #fbbf24;
    --warn-soft: #422006;
    --success: #34d399;
    --success-soft: #064e3b;
    --danger: #f87171;
    --danger-soft: #450a0a;
  }
}
```

### Fontlar
- Başlıklar: **Space Grotesk** (Google Fonts)
- Gövde: **Inter** (Google Fonts)
- Kod: **JetBrains Mono** (Google Fonts)
- `text-wrap: balance` başlıklarda
- Satır genişliği max ~820px

### Genel Kurallar
- Mobil uyumlu (min 400px genişlik)
- `body` background her zaman açık belirtilmeli
- 16px yan kenar boşluğu
- Her dosya kendi başına çalışan tek HTML dosyası olmalı (self-contained)
- SVG diyagramlar inline olmalı, harici dosya referansı olmamalı
- Harici kaynak sadece Google Fonts ve cdnjs.cloudflare.com'dan yüklenebilir

---

## 4. DOSYA 1: sinav-gozlem-sistemi.html — Proje Planı

Bu dosya teknik proje planıdır. İçermesi gerekenler:

### İçerik Yapısı
1. **Gizlilik kutusu** — Sayfanın en üstünde, kırmızı kenarlıklı uyarı kutusu. 6 gizlilik kısıtını listeleyin.
2. **Mimari akış diyagramı** — Düğme Kamera → FPC → Verici → WiFi → MacBook → WebSocket → Ekran akışını gösteren SVG diyagram
3. **Kullanım senaryosu SVG** — İki oda gösteren geniş bir SVG:
   - Sol: Sınav salonu (eğimli sıralar, öğrenci, düğme kamera, verici)
   - Sağ: Gözetmen odası (MacBook, gözetmen, küçük ekran)
   - Aralarında duvar ve WiFi dalgaları
4. **Düğme kamera SVG** — Ölçülü teknik çizim (20mm çap, 6mm yükseklik, lens deliği, FPC çıkışı, dikiş delikleri)
5. **Kredi kartı ekran SVG** — Ölçülü teknik çizim (86×54mm, ekran alanı, 3 buton, USB-C şarj, yan kesit ~8mm kalınlık)
6. **Parça listesi tablosu** — 14 parça, her biri için: isim, açıklama, miktar, tahmini fiyat (TL), etiket (Donanım/Yazılım/Firmware)
7. **Yazılım mimarisi** — 9 Python modülü, her biri için kısa açıklama
8. **SQLite şeması** — 6 tablo tanımı (yukarıdaki SQL)
9. **İletişim protokolleri** — HTTP MJPEG ve WebSocket JSON formatları
10. **WebSocket mesaj formatı** — Yukarıdaki 3 mesaj tipi
11. **Proje dosya yapısı** — Ağaç görünümünde dizin yapısı
12. **10 günlük geliştirme planı** — Her gün için yapılacaklar
13. **10 test senaryosu** — Numaralı, kontrol listesi formatında
14. **Risk tablosu** — En az 6 risk, her biri için: risk, olasılık, etki, önlem
15. **Bütçe özeti** — Öğrenci seti başına ~1.100 TL, toplam 10.000 TL bütçe

### Ek Renk Token'ları (Bu dosyaya özel)
```css
--tag-hw: #7c3aed;     /* Donanım etiketi: mor */
--tag-hw-soft: #ede9fe;
--tag-sw: #0891b2;     /* Yazılım etiketi: cyan */
--tag-sw-soft: #cffafe;
--tag-fw: #c2410c;     /* Firmware etiketi: turuncu */
--tag-fw-soft: #fff7ed;
```

---

## 5. DOSYA 2: kurulum-rehberi.html — Kurulum Rehberi

Bu dosya Türkiye'de bulunan ürünlerle pratik kurulum rehberidir. İçermesi gerekenler:

### İçerik Yapısı
1. **İçindekiler** — Tıklanabilir bağlantılarla 10 bölüm
2. **Alışveriş listesi** — Türk mağazaları (Robotistan, Direnc.net, Robocombo, AliExpress TR, Amazon TR, Samm Market) ile grid kartlar
3. **İki yapım seçeneği:**
   - **Seçenek A:** ESP32-CAM (AI-Thinker) — kolay bulunur, ~790 TL
   - **Seçenek B:** XIAO ESP32S3 Sense — daha küçük, ~670 TL (yurt dışı sipariş)
4. **Gözetmen ekranı parça tablosu** — ESP32-C3 + ILI9341 TFT + TP4056 + butonlar, ~395 TL
5. **Ortak malzemeler** — Jumper kablo, breadboard, lehim, makaron, kasa ~165 TL
6. **Bütçe özeti** — Toplam 1.230-1.350 TL
7. **Gerekli araçlar kontrol listesi** — Havya, pense, multimetre vb.
8. **Adım 1: Düğme kamera hazırlama** — FPC kablo ile kamera modülü ayırma/bağlama, düğme kasası yapımı (3D baskı ve alternatif), SVG kesit diyagramı
9. **Adım 2: Verici ünitesi montajı** — Güç bağlantısı (her iki seçenek için), SVG öğrenci üzerinde yerleşim diyagramı (kamera, FPC, cep, WiFi, eğimli sıra)
10. **Adım 3: Gözetmen ekranı montajı** — SPI pin tablosu (ESP32-C3 ↔ ILI9341), buton bağlantı tablosu, güç devresi (TP4056), SVG kasa iç yerleşim diyagramı (önden ve yandan kesit, ölçülerle)
11. **Adım 4: Firmware yükleme** — Arduino IDE kurulumu, ESP32 board ekleme, kütüphane kurulumu. Her iki ESP32 için tam çalışır Arduino sketch kodu:
    - ESP32-CAM: WiFi bağlantı + MJPEG HTTP stream sunucu
    - ESP32-C3: WiFi + WebSocket client + TFT_eSPI ekran + 3 buton okuma + cevap anahtarı/izleme modları
12. **Adım 5: Mac yazılım kurulumu** — Python venv, pip install, Tesseract OCR (brew + Türkçe dil paketi)
13. **Adım 6: WiFi ağı kurulumu** — Özel router veya Mac hotspot yöntemi, IP adresleri tablosu
14. **Adım 7: Test ve kalibrasyon** — Kamera testi, ekran testi (WebSocket test kodu dahil), uçtan uca test kontrol listesi
15. **Sorun giderme** — 5 kategori: kamera, WiFi, ekran, WebSocket, OCR

---

## 6. DOSYA 3: sistem-vitrin.html — Vitrin/Tanıtım Sayfası

Bu dosya sistemi tanıtan interaktif bir vitrin/landing sayfasıdır. İçermesi gerekenler:

### İçerik Yapısı
1. **Hero bölümü** — Büyük başlık, kısa açıklama, animasyonlu SVG veya görsel
2. **"Nasıl Çalışır" akış diyagramı** — 4 adımlık görsel akış (Düğme Kamera → Verici → MacBook → Ekran)
3. **Özellikler grid'i** — 6 özellik kartı:
   - Gizli gözlem (düğme kamera)
   - Kablosuz iletişim
   - Gerçek zamanlı OCR
   - Cevap anahtarı doğrulama
   - Zamanlama analizi
   - Gizlilik öncelikli tasarım
4. **Canlı demo simülasyonu** — JavaScript ile çalışan interaktif bir demo:
   - Sahte bir sınav kağıdı görüntüsü
   - OCR çıktısı animasyonu
   - Zamanlama çubukları
   - Onayla/Düzelt/Atla butonları (tıklanabilir)
5. **Teknik özellikler tablosu** — Çözünürlük, FPS, gecikme, pil ömrü, menzil vb.
6. **Bileşen galerisi** — Düğme kamera, verici, ekran SVG çizimleri yan yana
7. **Gizlilik taahhüdü bölümü** — 6 madde, ikonlu
8. **Bütçe özeti** — Toplam maliyet
9. **İletişim/başlangıç CTA** — Alt bölüm

### İnteraktif Özellikler
- Smooth scroll navigasyon
- Kartlara hover efektleri
- Demo bölümünde gerçek zamanlı animasyon
- Sayfa yüklendiğinde fade-in animasyonları

---

## 7. KALİTE KRİTERLERİ

Her dosya şu kriterleri karşılamalıdır:

- [ ] Tek başına çalışan, geçerli HTML dosyası
- [ ] Mobil uyumlu (400px'den itibaren)
- [ ] Açık ve karanlık tema desteği
- [ ] Tüm SVG diyagramlar inline ve temaya uyumlu (CSS custom property kullanmalı)
- [ ] Türkçe içerik (başlıklar, açıklamalar, buton etiketleri)
- [ ] Gizlilik kısıtları her dosyada belirgin şekilde mevcut
- [ ] Gerçek fiyatlar TL cinsinden (yaklaşık)
- [ ] Tüm teknik detaylar (pin numaraları, protokoller, SQL şemaları) doğru
- [ ] Firmware kodları derlenir ve çalışır (ESP32-CAM, ESP32-C3 için)
- [ ] Python kurulum komutları gerçek paket isimlerini kullanır
- [ ] Her dosya 50KB-80KB arasında (makul boyut)
- [ ] Harici bağımlılık sadece Google Fonts

---

## 8. YANIT FORMATI

Her dosyayı şu formatta ver:

```
### Dosya: [dosya_adı.html]

\`\`\`html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>...</title>
  <!-- Tüm CSS ve inline kaynaklar -->
</head>
<body>
  <!-- Tüm içerik -->
</body>
</html>
\`\`\`
```

Üç dosyayı da **eksiksiz** ver. Kısaltma yapma, "..." ile geçiştirme, "buraya devam edin" deme. Tam kodu üret.
