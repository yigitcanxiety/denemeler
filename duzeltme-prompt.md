# DÜZELTİ: Kamera Sistemi Yanlış Anlaşılmış

Ürettiğin çıktıda kamera konseptini yanlış anlamışsın. Düzelt.

## YANLIŞ ANLAMA
Sistem bir masa üstü kamera, webcam, gooseneck kamera veya herhangi bir görünür kamera DEĞİLDİR. Öğrencinin önünde, masasında veya ekranında kamera YOKTUR.

## DOĞRU MİMARİ

### Düğme Kamera Nedir?
- Gerçek bir **giysi düğmesi gibi görünen**, içine kamera modülü gizlenmiş minik bir cihaz
- Çapı: **20-25mm** (normal bir gömlek düğmesinden biraz büyük)
- Kalınlığı: **6-8mm**
- Ortasında **3mm pin-hole lens deliği** var (dışarıdan bakınca düğmenin deseni gibi görünür)
- 4 köşesinde **dikiş delikleri** var — öğrencinin yakasına iplikle dikilir veya klipslenir
- Arkasından **ince bir FPC (Flexible Printed Circuit) kablo** çıkar

### Neden Düğme Şeklinde?
Amaç: **Öğrenci izlendiğini unutsun ve doğal davransın.** Yakasındaki düğme gibi görünen şeyin aslında kamera olduğunu fark etmez. Bu bir gizli kamera değil — öğrenci bilgilendirilmiştir — ama fiziksel olarak göze batmayan, rahatsız etmeyen bir form faktörü.

### Fiziksel Bağlantı Zinciri
```
[Düğme Kasa (yakada)] 
    içinde: OV2640 kamera modülü (8×8mm)
        ↓ FPC kablo (20-30cm, gömlek/ceket içinden geçer)
[Verici Ünitesi (öğrencinin cebinde)]
    ESP32-CAM veya XIAO ESP32S3 Sense
    + pil (powerbank veya LiPo)
        ↓ WiFi (HTTP MJPEG stream)
[MacBook (başka bir odada)]
        ↓ WiFi (WebSocket JSON)
[Gözetmen Ekranı (kredi kartı boyutu, gözetmenin elinde)]
```

### Sıra Neden Eğimli?
Sıralar **~15° eğimlidir**. Öğrenci oturduğunda yakasındaki düğme kamera doğal olarak **aşağıya, kağıda doğru** bakar. Böylece kameranın açısını ayarlamaya gerek kalmaz — yerçekimi ve vücut pozisyonu sayesinde kağıt otomatik olarak kadraj içinde olur.

### Öğrenci Üzerindeki Yerleşim (Bunu SVG olarak çiz)
```
        [Baş]
     /         \
    /   Yaka    \
   |  ● Düğme   |  ← Kamera burada (göğüs üstü, yaka hizası)
   |  Kamera     |
   |      |      |
   |   FPC kablo |  ← Gömlek/ceket altından görünmez şekilde
   |      |      |
   |  [Cep]      |  ← ESP32 + pil burada
   |   Verici    |
   |             |
   ===============  ← Eğimli sıra (~15°)
   |  Sınav      |
   |  Kağıdı     |  ← Kameranın gördüğü alan
   ===============
```

## DÜZELTİLMESİ GEREKENLER

Ürettiğin 3 HTML dosyasında şunları düzelt:

### 1. sinav-gozlem-sistemi.html (Proje Planı)
- Kullanım senaryosu SVG'sinde öğrencinin **yakasında** düğme kamera olmalı, masasında/üstünde değil
- Düğme kamera SVG'si: Yuvarlak, düğme şeklinde kasa, ortada lens deliği, dikiş delikleri, FPC çıkışı
- Mimari diyagramda ilk adım "Düğme Kamera (yakada)" olmalı
- FPC kablo bağlantısı gösterilmeli (kameradan cebe)

### 2. kurulum-rehberi.html (Kurulum Rehberi)  
- "Düğme Kamera Hazırlama" adımı: OV2640 modülünü ESP32-CAM'den söküp FPC uzatma kablosuyla bağlama
- Düğme kasası yapımı: 3D baskı VEYA büyük düğme hack (tuhafiyeden alınan düğmeyi oyma)
- SVG kesit diyagramı: Düğme kasasının içi (OV2640 modülü, lens deliği, FPC çıkışı)
- Öğrenci üzerinde yerleşim SVG'si: Yakada kamera, gömlek altından FPC, cepte verici

### 3. sistem-vitrin.html (Vitrin Sayfası)
- Hero veya "Nasıl Çalışır" bölümünde düğme kameranın yakaya takılı halini göster
- Bileşen galerisinde düğme kameranın SVG çizimi (üstten ve kesit görünüm)
- Demo bölümünde düğme kameranın ne olduğunu açıkla

## ÖNEMLİ: Düğme kamera bu sistemin EN ÖZELLİKLİ parçasıdır. Tüm SVG diyagramlarında, açıklamalarda ve akış şemalarında düğme şeklindeki kameranın yakaya takılı olduğu net bir şekilde gösterilmelidir. Masada, tripod'da veya herhangi bir standda kamera GÖSTERMEYİN.
