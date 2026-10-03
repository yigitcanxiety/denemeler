# Devam notu (bulut oturumundan yerele geçiş)

Son güncelleme: 2026-10-03. Bu dosya, bulut sohbetinde alınan kararları ve yarım kalan işleri özetler.
Kurulum adımları için `KURULUM.md`, teknik yapı için `ARCHITECTURE.md`.

## Durum

- Canlı site: https://tonelle-taupe.vercel.app (Vercel projesi `tonelle`, bu dalı yayınlıyor:
  `claude/sharp-faraday-2h9ny6`).
- **Analiz canlıda çalışmıyor:** Kie.ai isteği başarısız oluyor ("Yapay zekâ servisimiz şu anda yoğun").
  Kie entegrasyonu hiç canlı denenemedi.
- Çözüm hazır: analiz artık doğrudan Google Gemini'ye bağlanabiliyor. `GEMINI_API_KEY` tanımlıysa
  analiz (`gemini-2.5-flash`) ve makyaj görseli (`gemini-2.5-flash-image`) Gemini'den gelir.
  Sıra: OpenRouter → Gemini → Kie.

## Yapılacaklar (sırayla)

1. Google AI Studio'dan anahtar al, faturalandırmayı aç (ücretsiz kotada veriler eğitimde kullanılabilir).
   `GEMINI_API_KEY` değerini Vercel ortam değişkenlerine ve yerelde `apps/web/.env.local` dosyasına ekle.
   Kie anahtarını kaldır ya da yenile (sohbette paylaşıldı).
2. Canlı selfie testi; gerçek maliyeti Google panelinden kontrol et.
3. Kişi bazlı kalıcı kullanım sayacı (Upstash Redis, Vercel Marketplace). Şu anki
   `apps/web/src/server/rate-limit.ts` bellek içi ve sunucu kopyası başına sayıyor.
4. Web ödemesi: **Paddle** (satıcı Paddle olur; AB KDV'sini Paddle halleder). Stripe ve Shopify Payments
   istenmedi. Doribleg Trade Ltd (İngiltere) adına hesap açılacak; mümkünse kendi alan adıyla başvurulacak.
   Kod tarafında mevcut `PaymentProvider` soyutlamasına bağlanacak.
5. Yeni site tasarımı (v4) onay bekliyor: `docs/design/prototype-v4/index.html` (tarayıcıda açılır).
   Onaylanırsa `apps/web` içine taşınacak.
6. UGC videoları için çekim senaryoları; trafik doğrudan siteye.

## Fiyat ve sınır kararları (önerilen, henüz uygulanmadı)

| Plan | Fiyat (TR) | Analiz | Makyaj görseli |
|---|---|---|---|
| Ücretsiz | – | 1 | 1 |
| Haftalık | ₺129,99 (web'de ilk hafta indirimi yok) | haftada 5 | haftada 40 |
| Yıllık | ₺799,99, 3 gün ücretsiz | haftada 5 | haftada 40 |
| Tek rapor | ₺199 | 1 | 10 |

Tahmini maliyet: analiz ~₺0,10, görsel ~₺1,70 (~$0,04). Haftalık plan net ~₺80 (KDV ve Paddle sonrası).
Sınırlar uygulanınca paywall'daki "Sınırsız görünüm" metni "Haftada 40 görünüm" olarak değişmeli.

## Bekleyen hesaplar

Apple Developer + D-U-N-S, Expo, RevenueCat anahtarları, Paddle, Gemini anahtarı,
Vercel bağlantısının log okuma izni.
