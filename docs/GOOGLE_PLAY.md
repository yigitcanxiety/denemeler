# Google Play: Tonelle yayın rehberi

Paket adı `com.tonelleapp.app` (app.config.ts). Uygulama kodu Android'e hazır; eksik olan hesaplar ve mağaza girişleri.
Sıra önemli: 3. adımdaki kapalı test 14 gün sürer, o yüzden hesap bir an önce açılmalı.

## 1. Play Console hesabı (Yiğit, ~30 dk + kimlik onayı 1-3 gün)
- https://play.google.com/console → **Kişisel** hesap (bireysel, Yiğit Gördebil), $25 tek sefer.
- Kimlik doğrulama (kimlik + adres) ve Android cihazla telefon doğrulaması istenir.
- Kişisel hesaplarda kural (Kasım 2023 sonrası açılanlar): üretime çıkmadan önce **en az 12 test kullanıcısıyla
  14 gün kesintisiz kapalı test** zorunlu. Kuruluş hesabı (D-U-N-S) bu kuraldan muaf ama Apple'da da bireysel seçildi.

## 2. Uygulamayı oluştur ve ilk derleme (Claude + Yiğit)
- Console → Uygulama oluştur: ad `Tonelle: Renk Analizi`, varsayılan dil Türkçe, Uygulama, Ücretsiz.
- Derleme: `cd apps/mobile && npx eas-cli build --platform android --profile production` (imza anahtarını EAS üretir ve saklar).
- **İlk .aab elle yüklenir** (Google API ile ilk yüklemeye izin vermez): Test → Dahili test → yeni sürüm → .aab.
- Sonraki sürümler için servis hesabı: Google Cloud → IAM → Service account → JSON anahtar →
  `apps/mobile/google-play-service-account.json` (gitignore'da) → Play Console → Kullanıcılar ve izinler → davet et.
  Ardından `npx eas-cli submit --platform android` dahili teste taslak gönderir (eas.json).

## 3. Kapalı test (14 gün, 12+ kişi)
- Test → Kapalı test → e-posta listesi (12+ Gmail adresi) → katılım bağlantısını paylaş.
- Testçiler uygulamayı 14 gün boyunca yüklü tutmalı. Bitince Console "Üretime erişim başvurusu" açılır (kısa anket).

## 4. Abonelikler (RevenueCat ile, Apple'la aynı fiyatlar)
- Para kazanma → Abonelikler: `tonelle_weekly` (temel plan `weekly`, 1 hafta) ve `tonelle_yearly` (temel plan `yearly`, 1 yıl);
  her ikisine 7 gün ücretsiz deneme teklifi. Tek seferlik `tonelle_report` (uygulama içi ürün).
  Sunucudaki görsel kotası ürün adında `yearly` geçmesine bakar; adları böyle tut.
- Fiyatlar `packages/shared/src/pricing.ts` (TR ₺229,99 / ₺1.799,99 / ₺299,99).
- Ödeme profili (banka hesabı, vergi bilgisi) Console'da Yiğit tarafından girilir.
- RevenueCat → Android uygulaması ekle → servis hesabı JSON'u → `EXPO_PUBLIC_RC_ANDROID_KEY` (public SDK key) eas.json'a.

## 5. Mağaza girişi ve politikalar (Claude metinleri hazırlar, Yiğit yapıştırır)
- Kısa açıklama (80): `Selfie'den renk sezonunu bul, makyajı kendi yüzünde dene.`
- Uzun açıklama: `APP_STORE_LISTING.md`'deki açıklama (abonelik bölümünde "App Store" yerine "Google Play").
- Grafikler: simge 512×512, öne çıkan görsel 1024×500, en az 2 telefon ekran görüntüsü (mevcut set kullanılabilir).
- Gizlilik politikası URL: `https://tonelleapp.com/tr/privacy`.
- İçerik derecelendirmesi anketi: şiddet/cinsellik yok → herkes / 3+.
- Hedef kitle: **16 ve üzeri** seçilir (13 altı seçilirse Aileler politikası devreye girer).
- Reklam içeriyor mu: Hayır. Uygulama erişimi: giriş yok, tüm özellikler açık (ödeme duvarı hariç).
- Sağlık uygulaması beyanı: Hayır (kozmetik öneri).

### Veri güvenliği (Data safety) cevapları
| Veri | Toplanıyor mu | Paylaşılıyor mu | Amaç | Not |
|---|---|---|---|---|
| Fotoğraflar | Evet (geçici) | Evet, hizmet sağlayıcı (Google Gemini) | Uygulama işlevselliği | Saklanmaz, istek bitince silinir |
| Uygulama etkinliği → diğer (test cevapları) | Evet | Evet, hizmet sağlayıcı | Uygulama işlevselliği | |
| Satın alma geçmişi | Evet | Hayır | Uygulama işlevselliği | RevenueCat anonim kimlik |
| Cihaz veya diğer kimlikler | Evet (anonim uygulama kimliği) | Hayır | Uygulama işlevselliği | |
- Veriler aktarım sırasında şifreleniyor: **Evet** (HTTPS). Silme talebi: **Evet** (Profil > Verilerimi sil, e-posta).

## 6. Yasal metinler
Play sürümü üretime çıkmadan önce gizlilik ve koşullara Google Play satın alma, iptal (Play Store > Abonelikler) ve
iade (Google Play iade politikası) satırları eklenir; site düğmelerine Google Play rozeti eklenir.
