# Tonelle: Kurulum ve Yayın Kontrol Listesi

Kod hazır ve anahtar olmadan **sahte (mock) modda** baştan sona çalışıyor. Gerçek yapay zekâ, gerçek ödeme ve mağaza yayını için aşağıdaki hesap ve anahtarlar gerekiyor. Sırası önemli: en uzun sürenler en üstte.

## 1. Hemen başlatılması gerekenler (onay süresi uzun)

| # | Ne | Neden | Süre |
|---|---|---|---|
| 1 | **D-U-N-S numarası** (Doribleg Trade Ltd adına, ücretsiz) | Apple şirket hesabı için zorunlu | 1–2 hafta |
| 2 | **Apple Developer Program** (şirket hesabı, 99 $/yıl) | iOS yayını, uygulama içi abonelik | D-U-N-S sonrası birkaç gün |
| 3 | **Google Play Console** (şirket hesabı, 25 $) | Android yayını | 1–3 gün (kimlik doğrulama) |
| 4 | **Apple/Google Küçük İşletme Programı** başvurusu | Komisyon %30 → %15 | Hesap açılınca |
| 5 | **tonelle.app** domaini | Web sitesi, yasal sayfalar, API | Anında |

## 2. Bana verilecek anahtarlar (API)

Bunları bana ilet, ben ortam değişkenlerine eklerim. **Anahtarları asla koda veya GitHub'a yazma.**

| Değişken | Nereden | Ne için |
|---|---|---|
| `OPENROUTER_API_KEY` | openrouter.ai → Keys | Selfie analizi (Space Bunny, yedek Gemini Flash) |
| `KIE_API_KEY` | kie.ai → API Key ✅ **alındı** | Tek anahtarla analiz (Gemini 3 Flash) + makyaj görseli (Nano Banana). OpenRouter anahtarı varsa analiz Space Bunny ile yapılır. Not: fotoğraf Kie'nin geçici deposunda en geç 3 gün tutulur (gizlilik metnine eklendi). |
| `GEMINI_API_KEY` | aistudio.google.com → API key (faturalandırma açık) | Makyajı yüze uygulama (Nano Banana) |
| `REVENUECAT_SECRET_KEY` | RevenueCat → Project → API keys → Secret key | Sunucuda premium doğrulama |
| `EXPO_PUBLIC_RC_IOS_KEY` / `EXPO_PUBLIC_RC_ANDROID_KEY` | RevenueCat → Public app-specific keys | Mobil ödeme ekranı |

Alternatif görsel sağlayıcı: `IMAGE_PROVIDER=fal` + `FAL_KEY` (fal.ai).

## 3. Yayına alma (web + API)

1. **Vercel** hesabı aç ve GitHub reposunu bağla. Root directory: `apps/web`. Bölge: **Frankfurt (fra1)** (veri AB'de kalsın).
2. Ortam değişkenlerini gir (`apps/web/.env.example` listesi).
3. Domain: `tonelle.app` → Vercel.
4. `support@tonelle.app` ve `privacy@tonelle.app` e-posta adreslerini aç.

## 4. RevenueCat kurulumu

- **Ürünler** (App Store Connect + Play Console'da oluştur, RevenueCat'e ekle):
  - `tonelle_weekly`: haftalık. TR ₺129,99, ilk hafta ₺39,99 tanıtım fiyatı. AB €3,99.
  - `tonelle_yearly`: yıllık, 3 gün ücretsiz deneme. TR ₺799,99. AB €24,99.
  - `tonelle_report`: tek seferlik rapor, ₺199 / €6,99 (uygulamada henüz gösterilmiyor).
- **Entitlement:** `premium` (iki aboneliğe de bağla).
- **Offerings:**
  - Varsayılan offering: `$rc_weekly` + `$rc_annual`.
  - `exit_offer` adlı offering: %50 indirimli yıllık paket. Bu yoksa vazgeçme teklifi gösterilmez.

## 5. Mobil derleme

- Gerçek ödeme testi için **development build** gerekir (Expo Go ile olmaz): `eas build --profile development`.
- Mağaza görselleri ve ikon: `apps/mobile/assets/images/placeholder-*.png` dosyaları geçici, gerçekleriyle değiştirilmeli.

## 6. Yayından önce doldurulacak yer tutucular

- `apps/web/src/config/company.ts`: şirket adresi, sicil no, KEP adresi, TR/AB temsilcisi (köşeli parantezli alanlar).
- **Yasal metinler taslak**, bir avukata kontrol ettirilmeli. Özellikle KVKK md. 9 yurt dışı aktarım kısmı ve sağlayıcıların veri saklama beyanları.
- Tanıtım sayfası görselleri: gerçek önce/sonra fotoğraflarını `apps/web/public/landing/` klasörüne koy (izinli modelle çekilmiş olmalı).
- Mağaza rozetleri: resmi Apple/Google rozetleriyle değiştir.

## 7. Açık karar

- **Doribleg Trade Ltd hangi ülkede kurulu?** (UK Ltd / TR Ltd. Şti.) Web'den ödeme (Stripe/Paddle), vergi ve KVKK/GDPR veri sorumlusu bilgileri buna göre ayarlanacak.

## Yerelde çalıştırma

```bash
pnpm install
pnpm --filter @tonelle/web dev          # http://localhost:3000 (anahtar yoksa mock modu)
cd apps/mobile && npx expo start        # EXPO_PUBLIC_API_URL=http://<bilgisayar-ip>:3000
pnpm -r typecheck && pnpm -r lint && pnpm -r test
```
