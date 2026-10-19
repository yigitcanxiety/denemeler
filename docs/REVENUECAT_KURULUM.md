# RevenueCat + App Store ürünleri kurulumu

Kod hazır: mobil `apps/mobile/src/purchases/purchases.ts`, sunucu `apps/web/src/server/revenuecat.ts`.
Eksik olan yalnız hesaplar, ürünler ve iki anahtar. Kimlikler koddakiyle **birebir aynı** yazılmalı.

| Kod sabiti | Değer |
|---|---|
| Yetki (entitlement) | `premium` |
| Haftalık abonelik | `tonelle_weekly` |
| Yıllık abonelik | `tonelle_yearly` |
| Tek seferlik rapor | `tonelle_report` |
| Çıkış teklifi offering'i | `exit_offer` |

## 0. Ön koşul (kullanıcı, App Store Connect → Business)
Paid Apps sözleşmesi, vergi (W-8BEN) ve banka bilgisi **Active** olmadan satın alma test edilemez.

## 1. App Store Connect ürünleri (kullanıcı; Claude ekran ekran eşlik edebilir)
Uygulama: Tonelle (id 6822973603) → Monetization.

**Abonelik grubu:** `Tonelle Premium` (üç abonelik aynı grupta; kullanıcı aynı anda ikisine sahip olamaz).

| Ürün kimliği | Süre | TR fiyat | Diğer ülkeler | Tanıtım teklifi |
|---|---|---|---|---|
| `tonelle_yearly` | 1 yıl | 1.799,99 TL | 39,99 € | 7 gün ücretsiz deneme (yeni aboneler) |
| `tonelle_weekly` | 1 hafta | 229,99 TL | 5,99 € | 7 gün ücretsiz deneme (yeni aboneler) |
| `tonelle_yearly_exit` | 1 yıl | 899,99 TL | 19,99 € | yok (çıkış teklifi, %50) |

**Uygulama içi satın alma (Non-Consumable):** `tonelle_report`, 299,99 TL / 9,99 €.

Her ürün için: görünen ad + açıklama (TR ve EN), inceleme ekran görüntüsü (ödeme ekranının
görüntüsü; `apps/mobile/store/screenshots/tr/` içinden), inceleme notu. Fiyatlar `packages/shared/src/pricing.ts`
ile aynı; fiyat değişirse orası da güncellenir.

**Uygulama İçi Satın Alma anahtarı:** Users and Access → Integrations → In-App Purchase → yeni anahtar
(.p8 indir, Key ID ve Issuer ID'yi not et). RevenueCat bunu ister.

## 2. RevenueCat (kullanıcı hesap açar; gerisini birlikte)
1. ✅ 2026-10-19: hesap açıldı, proje `Tonelle` (id 5a80cb3f) ve `premium` yetkisi oluşturuldu. E-posta onayı bekliyor.
2. Apps → **App Store** uygulaması ekle: bundle id `com.tonelleapp.app`, In-App Purchase anahtarı (.p8 + Key ID + Issuer ID).
3. App Store Server Notifications: RevenueCat'in verdiği URL'yi App Store Connect → App Information →
   App Store Server Notifications (Production ve Sandbox, Version 2) alanına yapıştır.
4. Products → dört ürünü App Store'dan içe aktar.
5. Entitlements → `premium` oluştur, **dört ürünü de** bağla.
6. Offerings:
   - `default` (Current): paketler Annual = `tonelle_yearly`, Weekly = `tonelle_weekly`, Custom `report` = `tonelle_report`.
   - `exit_offer`: Annual = `tonelle_yearly_exit`.

## 3. Anahtarlar
- **Herkese açık iOS SDK anahtarı** (`appl_` ile başlar; gizli değildir, uygulamanın içine gömülür):
  kullanıcı Claude'a verir, Claude `apps/mobile/eas.json` → production/preview `env.EXPO_PUBLIC_RC_IOS_KEY` olarak ekler.
  **Aynı commit'te** `EXPO_PUBLIC_ALLOW_DEV_PURCHASES` satırı `eas.json`'dan silinir (şimdilik TestFlight'ta ücretsiz deneme için açık; anahtarsız ve bayraksız sürümde satın alma kapalı kalır, hiçbir şey ücretsiz açılmaz).
- **Gizli anahtar** (`sk_` ile başlar, API Keys → Secret, v1): **yalnız kullanıcı** Vercel → Settings →
  Environment Variables → `REVENUECAT_SECRET_KEY` (Production) olarak ekler. Claude'a yapıştırılmaz.

## 4. Derleme ve test
1. Claude: anahtar eklendikten sonra commit; kullanıcı `zsh apps/mobile/scripts/ios-build.sh` (build 3).
2. TestFlight'ta Sandbox hesabıyla satın alma, geri yükleme, çıkış teklifi denenir.
3. Sorun yoksa App Store Connect'te uygulama adı `Tonelle: Renk Analizi`, ürünler sürüme eklenir, incelemeye gönderilir.

## Açık karar (kullanıcı)
- Tek seferlik rapor (`tonelle_report`) şu an `premium` yetkisini kalıcı açıyor: mobilde sınırsız makyaj
  denemesi demek. İstenirse rapor ayrı bir yetkiye (`report`) bağlanır; kod değişikliği küçük.
- Prod'da `TONELLE_FREE_RENDERS=1` hâlâ açık.
