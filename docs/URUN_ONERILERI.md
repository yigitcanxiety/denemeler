# Ürün önerileri: rakipler, eklenecek özellikler, marka görselleri (2026-10-16)

Kaynak: App Store listeleri (ABD), uygulama yorumları, Apple İnceleme Kuralları. Fiyatlar ABD mağazası;
TR mağazasında farklı olabilir.

## Rakipler ne yapıyor

| Uygulama | Öne çıkan | Fiyat (ABD) | Yorumlarda en çok şikâyet |
|---|---|---|---|
| Dressika (4,3★, 5,6 bin) | Selfie veya test, 12 sezon, 170 makyaj + 180 saç rengi denemesi, gardırop, "bu ürün bana uyar mı" (ürün fotoğrafına uyum puanı) | Haftalık 4,90 $, yıllık 12–29 $, tek seferlik analiz 6–40 $ | Her taramada farklı sezon |
| Vivaldi (4,3★, 2 bin) | Rapor, dijital drape, 200+ ton, bir rengin hangi sezona uyduğunu bulan araç | Aylık 8 $, yıllık 18–36 $, tek seferlik 6 $ (Tonelle ile aynı karışım) | Sezonlar arasındakiler için tutarsız, fiyat |
| StyleIt AI | Drape, kıyafet fotoğrafına puan, takı önerisi, paylaşım kartı | 6–30 $, ömür boyu | Sonuçtan önce puan istiyor |
| Style DNA (4,3★, 7 bin) | Mağazada "bu bana yakışır mı" kamerası, gardırop | Aylık 8–20 $ | İptal zorluğu, sonuçlar genel |
| "Palette" klonları | Selfie + 12 sezon | Haftalık 4,99 $ + 3 gün deneme | Sonuç görmeden ödeme duvarı |
| TikTok filtreleri | Yüzü bütün sezon paletleriyle yan yana gösterir | — | Ana sezonu bulur, alt sezonu kaçırır |

**Ortak desen:** selfie + yedek test, drape standart, haftalık ~5 $ / 3 gün deneme, yıllık 18–40 $.
**Bir numaralı şikâyet:** her taramada farklı sonuç. Sonra: sonuçtan önce ödeme duvarı veya puan isteği, iptal zorluğu.

## Tonelle'de olanlar
Selfie analizi, 12 sezon, test (quiz), renk profili grafiği, en iyi / uzak durulacak renkler, fondöten
alt tonu, ruj/allık/far tonları, 8 makyaj görünümü (kendi fotoğrafında), paylaşım kartı, ipuçları.

## Bu oturumda eklenenler
- Tonlar artık okunur adla görünüyor ("Gül kurusu · Ruj"), dokununca o renk için mağaza araması açılıyor
  (TR: Trendyol, EN: Google Alışveriş). Altında "iş birliği yok" notu.
- **Takı rengin** kartı: altın / gümüş / altın + rose gold / gümüş + beyaz altın (sezon sıcaklığından).

## Eklenmeye değer özellikler (etki / emek sırasıyla; HK = hızlı kazanım, 1 günden az)
1. **Sonuç tutarlılığı:** kaydedilmiş sezon, kullanıcı bilerek yeniden analiz etmedikçe değişmesin;
   ışık/filtre uyarısı belirgin olsun. Rakiplerin bir numaralı şikâyetini hedefler.
2. **Drape karşılaştırması (HK–orta):** kullanıcının fotoğrafı, yüzün altında en iyi ve en kötü renk bandıyla yan yana.
   Reklam videosu 4 (draping) bunun talep gördüğünü gösteriyor.
3. **Palet duvar kâğıdı (HK):** paylaşım kartının 1170×2532 kilit ekranı sürümü; organik yayılma.
4. **Ünlü sezon eşleşmeleri (HK, yalnız isim):** "Senin sezonunda: …". Fotoğraf yok (kişilik hakları).
5. **"Bu renk bana uyar mı?" kamerası (1–3 gün):** fotoğraftan baskın rengi alır, palete uyum puanı verir.
   Dressika ve Style DNA bu özellikle kullanıcıyı geri getiriyor.
6. **Saç rengi denemesi:** talep yüksek ama en pahalı iş; bulanık sonuç eleştiri alıyor. Sonraya.

## Marka ruj görselleri: karar önerisi
- **Resmî ürün fotoğrafları izinsiz kullanılamaz.** Fotoğraflar telifli, ambalaj ve logo marka koruması altında.
  Apple 5.2.1: izinsiz üçüncü taraf marka ve telifli içerik reddedilir.
- **Marka ve ton ADI düz metin olarak** ("MAC Ruby Woo'ya yakın") genelde düşük risk (ABD'de nominatif kullanım;
  Türkiye'de SMK md. 7 benzer, kesin metni doğrulanmadı). Logo yok, "iş birliği yok" notu şart.
  Uygulama adı, ikon, ekran görüntüleri ve anahtar kelimelerde marka adı kullanılmaz.
- **Görsel istenirse yasal yol:** satış ortaklığı (affiliate) ağının şartlarının açıkça izin verdiği görseller
  (ör. Amazon: 24 saatten uzun saklanamaz) veya marka/mağazadan yazılı izin. Türkiye'de Trendyol'un
  influencer bağlantı programı var ama ürün görseli API'si bulunamadı; Gratis, Watsons, Sephora TR için
  program bulunamadı. Open Beauty Facts görselleri CC BY-SA ama kapsamı zayıf.
- **Önerilen yol:** kendi çizdiğimiz ton görseli + renk adı + mağaza araması (şu an yapılan). Sonraki adım:
  doğrulanmış hex değerleriyle küçük bir "benzer ürünler" listesi (marka + ton adı, düz metin) ve
  Trendyol influencer bağlantısı. Hex değerleri tahminle yazılmaz; ölçülmesi gerekir.

## Kod denetimi (2026-10-16)
16 bulgu; düzeltmeler ayrı commit'te. Ödeme öncesi kritik üçlü: anahtarsız sürümde ücretsiz kilit açma,
çıkış teklifi penceresi açıkken sayfa kapanması, "ücret alınmadı" yanlış mesajı.
Kullanıcıya kalan: Vercel'de `OPENROUTER_API_KEY` ve `IMAGE_PROVIDER` tanımlı olmadığını doğrula,
`KIE_API_KEY`'i sil. Böylece fotoğraf yalnız Google Gemini'ye gider ve onay metni birebir doğru kalır.
