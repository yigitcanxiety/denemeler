# Tonelle: durum, sorunlar ve plan

Son güncelleme: 2026-10-06. Proje yöneticisi: Claude. Bu dosya projenin tek doğru kaynağıdır; her iş
bitiminde güncellenir. Plan körü körüne izlenmez: her faz sonunda "hâlâ doğru mu?" diye sorgulanır.
Uzun araştırma ve gerekçeler: `ARASTIRMA_VE_YOL_HARITASI.md`. Kurulum: `KURULUM.md`. Teknik yapı: `ARCHITECTURE.md`.

## 1. Neredeyiz (çalışan şeyler)

- Canlı site: https://tonelleapp.com (yedek: https://tonelle-taupe.vercel.app) (Vercel `tonelle`, dal `claude/sharp-faraday-2h9ny6`, her push yayınlanır).
- Tam analiz (`/analyze`): rıza → 5 soru → selfie → renk sezonu, palet, fondöten, ruj/allık/far → makyaj görselleri.
- Yalnız renk (`/analyze/color`) ve yalnız cilt (`/analyze/skin`, `/api/analyze-skin`) analizleri: soru ve ödeme yok.
- Yapay zekâ: Google Gemini (`gemini-2.5-flash` analiz, `gemini-2.5-flash-image` görsel). Canlıda test edildi.
- Makyaj görselleri canlıda gerçek: `TONELLE_FREE_RENDERS=1`, ödeme kontrolü yok, IP başı günde 6 görsel.
- Mobil uygulama kodu (`apps/mobile`, Expo + RevenueCat) var, mağazada değil.
- 108 web + 63 ortak test, tip kontrolü ve lint temiz.

## 2. Sorunlar (önem sırasıyla)

1. **Para alınamıyor.** Web paywall'ı mağazalara yönlendiriyor; uygulama mağazada yok, web ödemesi (Paddle) yok.
   Bugün reklam açılsa gelen kullanıcıdan tek lira alınamaz.
2. **Ölçüm yok.** Meta Pixel, Conversions API, analitik yok. Reklam açılırsa Meta neyin işe yaradığını öğrenemez, para yanar.
3. **İsim çakışması (kısmen çözüldü).** Alan adımız `tonelleapp.com` (GoDaddy, 2026-10-11 alındı, Vercel'e eklendi).
   `tonelle.app` başka bir "Tonelle"ye ait (kuaför/salon uygulaması); marka (sınıf 44) riski sürüyor.
   `support@` ve `privacy@tonelleapp.com` e-postaları henüz açılmadı: yasal sayfalarda yazıyor, açılması şart.
4. **Gizlilik iddiası doğrulanmadı.** Sitede "fotoğraf model eğitiminde kullanılmaz" diyoruz. Gemini anahtarı ücretsiz
   katmandaysa Google veriyi eğitimde kullanabilir. Faturalandırmanın açık olduğu doğrulanmalı.
   Cilt sayfasındaki açık rıza metni hâlâ "renk ve makyaj analizi" diyor.
5. **Maliyet koruması zayıf.** Görsel sınırı bellek içi (sunucu kopyası başına); `?demo=1` ile herkes sonuçları açabiliyor.
   Reklam trafiğinden önce kalıcı sayaç (Upstash Redis) ve gerçek ödeme şart.
6. **İzleme yok.** Canlı analiz günlerce (Kie.ai hatası) bozuk kaldı, kimse fark etmedi. Günlük otomatik canlı test gerekli.
7. **Sızmış anahtar.** Kie.ai anahtarı sohbette paylaşılmıştı; artık kullanılmıyor ama Vercel'de duruyor ve iptal edilmedi.

## 3. Yönetici görüşü: ilk plandan sapmalar

- İlk plan "14 günde mağaza, sonra reklam" idi. Apple hesabı ve D-U-N-S beklediği için bu yol tıkalı.
  **Karar: önce web.** Satış web'de (Paddle), uygulama sonra. Artısı: mağaza komisyonu yok, fiyat testi hızlı.
  Eksisi: web dönüşümü uygulamadan düşük olabilir. Faz C'deki sayılar bunu söyleyecek.
- **Odak: renk analizi.** Türkiye'de kanıtlanmış kanca bu (Glamour vakası). Cilt analizi ikincil kalır;
  ilk reklam bütçesi bölünmez. Cilt reklamı ancak renk kampanyası kârlı olduktan sonra test edilir.
- **Reklam, ödeme ve ölçüm olmadan açılmaz.** Bu kural pazarlık konusu değil.

## 4. Plan

### Faz A: satılabilir ve ölçülebilir hale getir (1. hafta)

| # | İş | Kim |
|---|---|---|
| A1 | İsim/alan adı kararı: uygun alan adlarını kontrol et, öner; satın alma | Claude öneri, Yiğit ödeme |
| A2 | Paddle hesabı (Doribleg Trade Ltd) | Yiğit başvuru, Claude başvuru metinleri |
| A3 | Paddle'ı `PaymentProvider`'a bağla; `?demo=1` kilidini canlıda kapat | Claude |
| A4 | Meta Pixel + Conversions API + PostHog: selfie → analiz → paywall → ödeme olayları | Claude (Yiğit Pixel ID verir) |
| A5 | Gemini faturalandırması açık mı doğrula; cilt rıza metnini güncelle | Claude kontrol, Yiğit onay |
| A6 | Kalıcı kullanım sayacı (Upstash Redis, Vercel Marketplace) | Claude |
| A7 | Günlük otomatik canlı test (analiz + görsel), bozulunca bildirim | Claude |
| A8 | Kie anahtarını Kie panelinden iptal et, Vercel'den sil | Yiğit iptal, Claude siler |

**Kapı A:** test kullanıcısı web'de ödeme yapabiliyor ve olay Meta'da görünüyor. Bu olmadan Faz C başlamaz.

### Faz B: reklam hazırlığı (2. hafta, Faz A ile paralel başlar)

- Meta Ads Library'de TR rakip analizi ("renk analizi", "renk sezonu", "makyaj AI"): uzun süredir yayında kalan kancalar.
- 10 kreatif: 5 UGC senaryosu ("Yanlış fondöten kullanıyormuşum", "AI sezonumu buldu", öncesi/sonrası) + 5 üretilmiş video.
- Reklamın indiği sayfa tek mesaj: "Renk sezonunu 1 dakikada bul". Doğrudan `/analyze/color` veya tam analiz; A/B.
- Instagram ve TikTok hesapları (isim kararına bağlı).

### Faz C: Türkiye test kampanyası (3. hafta)

- Bütçe: günlük ₺750 × 7 gün (~₺5.250 + %5 Meta konum ücreti). Optimizasyon: satın alma.
- Ölçülecekler ve eşikler:

| Metrik | İyi | Durdur / değiştir |
|---|---|---|
| Tıklama → selfie tamamlama | > %40 | < %20: sayfa/akış sorunu |
| Analiz → paywall görüntüleme | > %70 | < %50: teaser zayıf |
| Paywall → ödeme | > %3 | < %1: fiyat/teklif değiştir |
| Satın alma maliyeti (CPA) | < ₺250 | > ₺500 (3 gün üst üste): kreatifi kes |

**Kapı C:** 7 gün sonunda CPA, haftalık planın net getirisinin (~₺80) kaç katı? Abonelik ortalama 3+ hafta
sürüyorsa ölçeklenir; değilse fiyat veya teklif değişir, ya da yön sorgulanır.

### Faz D: mobil uygulama (web kârlıysa)

Apple Developer + D-U-N-S, RevenueCat, mağaza görselleri, TestFlight. Web'de kanıtlanmış akış taşınır.

**Mağaza görselleri kontrol listesi** (Apple asset best practices, 2026-10-15; görsel/ikon/video işine başlamadan kullanıcıya hatırlat):
- iPhone dikey 1320×2868 (6,9") + 1284×2778 (6,5"), PNG, alfa yok, 1–10 adet; iPad yok (`supportsTablet: false`).
- Görselde **yok**: fiyat, "7 gün ücretsiz", indirim, web adresi, ©, "en doğru AI" gibi doğrulanamaz iddia, Android/Instagram/TikTok logosu. Hepsi 4+ uygun.
- Gerçek arayüz, en güçlü özellik önce (sezon sonucu → palet → ton önerileri → makyaj görünümleri; mobilde cilt analizi yok), kısa metin, ortada odak, TR + EN ayrı set, farklı ten tonlarından yüzler.
- Önizleme videosu (isteğe bağlı, ≤3): sessiz çalışır, ilk saniyede değer, sorunsuz döngü.
- Yüklemeden önce App Store Connect ürün sayfası önizleme aracı. Ayrıntı: vault `knowledge/concepts/app-store-gorselleri.md`.

### Faz E: Avrupa

Önce PL, ES, IT (ucuz gösterim), sonra DE, FR, NL. Çeviri + yerel kreatif.

## 5. Fiyat ve sınır kararları (önerilen, henüz uygulanmadı)

| Plan | Fiyat (TR) | Analiz | Makyaj görseli |
|---|---|---|---|
| Ücretsiz | – | 1 | 1 |
| Haftalık | ₺129,99, 7 gün ücretsiz (2026-10-11 kullanıcı kararı; ilk hafta ₺39,99 indirimi kaldırıldı) | haftada 5 | haftada 40 |
| Yıllık | ₺799,99, 7 gün ücretsiz (2026-10-11 kullanıcı kararı) | haftada 5 | haftada 40 |
| Tek rapor | ₺199 | 1 | 10 |

İptal yolu (2026-10-11 kullanıcı kararı): sitede belirgin iptal düğmesi yok; Paddle'ın sipariş e-postasındaki bağlantı + koşullardaki "bize yaz" yeterli (Apple'daki gibi). Faz E'de Almanya'ya satış açılınca oradaki zorunlu "Kündigungsbutton" yalnız DE kullanıcılarına eklenecek.

Deneme süresi sınırı (2026-10-11 kullanıcı kararı): 7 günlük denemede toplam en fazla 10 makyaj görseli; sayaç ödeme entegrasyonuyla birlikte kurulacak (Faz A3/A6).

Tahmini maliyet: analiz ~₺0,10, görsel ~₺1,70 (~$0,04). Haftalık plan net ~₺80 (KDV ve Paddle sonrası).
Paywall metni 2026-10-15'te "Tüm makyaj görünümleri kendi fotoğrafında" oldu (App Review: "sınırsız" iddiası yok); sınırlar gelince "Haftada N görünüm" yazılabilir.

## 6. Ortam değişkenleri (Vercel, Production)

`GEMINI_API_KEY` (gizli), `TONELLE_FREE_RENDERS=1`, `TONELLE_ACCESS_CODES` (davet kodları),
`NEXT_PUBLIC_SITE_URL=https://tonelleapp.com` (DNS 2026-10-11 bağlandı),
`KIE_API_KEY` (silinecek).

## 7. Değişiklik günlüğü

- 2026-10-12: **Paddle başvuruyu reddetti** (alan adı incelemesi: "Creative Generative AI", AUP dışı). İtiraz 2026-10-12 gönderildi (3 iş günü, ~2026-10-15); argüman: ana ürün renk analizi (sınıflandırma/öneri), makyaj önizlemesi yalnız kendi selfie + sabit görünümler, gerekirse web'den kaldırılır. Yedek: Stripe Managed Payments doğrulaması öne alındı.
- 2026-10-15 (gece, otonom): Build 1 TestFlight'a yüklendi (ASC app 6822973603; App Store adı geçici "Tonelle (6f0e04)", "Tonelle" alınmış). App Review denetimi + düzeltmeler: paywall'da Koşullar/Gizlilik linki ve faturalanan fiyat önde, ödeme öncesi deneme/fiyat yazısı kaldırıldı, iOS deneme uygunluk kontrolü, kamera ön ekranı "Devam et", release'te mock yanıt hata, izin metninde Google Gemini adı, uygulamadan açılan yasal sayfalarda site gezinmesi gizli (`?app=1`). Expo yama sürümleri (doctor 21/21). 3 yeni portre + 8 görünüm örneği (Gemini, ~$1,5), ton kartlarında ürün şekilleri. Mağaza metinleri/ürünler/gizlilik etiketi `docs/APP_STORE_LISTING.md`, ekran görüntüleri `apps/mobile/store/screenshots/`. Build 2 (bu düzeltmelerle) kullanıcı başlatacak: `apps/mobile/scripts/ios-build.sh`.
- 2026-10-16 (öğleden sonra, kullanıcı dışarıdayken): kod denetimi (16 bulgu) ve düzeltmeler: anahtarsız sürümde satın alma kapalı (`EXPO_PUBLIC_ALLOW_DEV_PURCHASES` yalnız şimdilik eas.json'da; RC anahtarıyla birlikte silinecek), çıkış teklifi kapanışı, bekleyen satın alma, "ücret alınmadı" yanlış iddiası kaldırıldı, `dismissTo`, 110 sn zaman aşımı + analizde İptal, tanışma süresi metni, örnek etiketi, `@types/react` tekilleştirildi. Yeni: tonlara renk adı (CIELAB) + "Mağazada bul" (Trendyol / Google Alışveriş araması), Takı rengi kartı. Rakip analizi ve marka görseli kararı: `docs/URUN_ONERILERI.md`. Kalan denetim maddeleri (kullanıcı kararı): IP başına analiz sınırı (10/saat, CGNAT riski), dil değişince eski dilde kalan yapay zekâ metni, Vercel'de OPENROUTER/IMAGE_PROVIDER yok mu doğrula + KIE_API_KEY sil.
- 2026-10-16: **Yeni ikon** (lavanta zeminde cam pudra paleti, marka renkleri; Codex image_gen + 4K, kaynak `~/claude/tonelle-logo/cikti/`) mobil ve webe kondu, `ICON_BG #E4DCEC`. RevenueCat kurulum rehberi: `docs/REVENUECAT_KURULUM.md` (ürün kimlikleri, fiyatlar, offering, anahtarların kimde olduğu). Sıradaki (kullanıcı): Paid Apps/vergi/banka aktif → ASC ürünleri → RevenueCat hesabı.
- 2026-10-15: **Apple Developer bireysel hesap onaylandı.** EAS projesi bağlandı (@yigitcanxiety/tonelle, projectId app.config.ts'de). İlk derleme: `apps/mobile/scripts/ios-build.sh` (EAS bulut derlemesi + TestFlight'a otomatik gönderim; Apple girişi kullanıcıda). Sıradaki (kullanıcı, App Store Connect): Paid Apps sözleşmesi, vergi (W-8BEN), banka (20/B için ayrı TR hesabı), Small Business Program. Sonra Claude: RevenueCat + abonelik ürünleri.
- 2026-10-11: Apple Developer bireysel başvurusu Apple Developer uygulamasından yapıldı (Apple ID yigitcanxiety@icloud.com, iletişim yigitgordebil@gmail.com; ikisi de Claude'un okuyamadığı kutular). Onay e-postası bekleniyor. Sıradaki: Expo hesabı (kullanıcı), 20/B istisna belgesi + ayrı banka hesabı (kullanıcı), ikon ve mağaza görselleri (Claude).
- 2026-10-11 (güncel, kullanıcı kararı): App Store = **Yiğit Gördebil bireysel Apple hesabı** (ileride gerekirse Apple desteğiyle şirkete çevrilir veya App Transfer) + GVK mük. 20/B istisnası (mağaza geliri gerçek kişiye, banka %15 stopaj, 2026 sınırı 5,3 M TL, istisna belgesi + özel TR banka hesabı; D-U-N-S gerekmez). Web (Paddle) geliri şirkette kalır, 20/B kapsamı dışında. Muhasebeci teyidi önerildi.
- 2026-10-11 (eski): App Store kararı (kullanıcı): **şirket hesabı** (Doribleg Trade Ltd; Eminhan D-U-N-S + Apple Developer, Yiğit Admin). Bundle id `com.tonelleapp.app` (eski `app.tonelle` alan adımız değildi), `eas.json` eklendi; Xcode yok → EAS bulut derlemesi. Bekleyen: Expo hesabı (kullanıcı), D-U-N-S (Eminhan), gerçek ikon, mağaza görselleri/metinleri, RevenueCat + App Store Connect ürünleri.
- 2026-10-11: Stripe yedek ödeme hesabı açılıyor (kullanıcı kararı: ikisi paralel, satış Paddle'dan; Stripe yalnız Paddle reddeder/uzarsa). Stripe **Managed Payments** seçildi = Stripe da satıcı kaydı (MoR), vergi Stripe'ta; ek %3,5 ücret, düşük fiyatlı haftalık planda Paddle'dan ucuz olabilir. Stripe kodu yazılmadı.
- 2026-10-11: Paddle webhook canlıda (`/api/paddle/webhook`, imza doğrulamalı; canlı hedef `ntfset_01m4mkyewbjg1zgfrhtrqzb1s4`, `PADDLE_WEBHOOK_SECRET` Vercel'de). Paddle simülasyonu 200 döndü. Ödeme/deneme olaylarını Meta CAPI'ye iletir (yalnız reklam izni verenler; event_id = txn id). Kalan: `META_CAPI_TOKEN`. Veritabanı hâlâ yok; e-postayla geri yükleme ayrı iş.
- 2026-10-11: Paddle canlı katalog kuruldu (`paddle-catalog.mjs --live`). Paddle MCP kuruldu (`paddle-sandbox`, `paddle-live`, yalnız silmeyen araçlar; anahtar `~/.config/paddle-mcp/`). Sandbox anahtarı ~2027-01-09 bitiyor (yalnız yerel test ve sandbox MCP etkilenir; yeni anahtar oluşturulur). Canlı anahtar 2027-10-11 bitiyor: ondan önce yenisi oluşturulup Vercel ve `~/.config/paddle-mcp/live.key` güncellenmeli. Onay gelince Vercel'e eklenecek açık değerler:

```
NEXT_PUBLIC_PADDLE_ENV=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_b2cfd2d1ecd53b2acd89cea1ca4
NEXT_PUBLIC_PADDLE_PRICE_WEEKLY=pri_01m4mk7g89g1a9aypxx1fazkxy
NEXT_PUBLIC_PADDLE_PRICE_YEARLY=pri_01m4mk7gdm0vv4camndjdwqwjw
NEXT_PUBLIC_PADDLE_PRICE_REPORT=pri_01m4mk7gxz8g3gmxgm7cbsf6r7
NEXT_PUBLIC_PADDLE_DISCOUNT_EXIT=dsc_01m4mk7h7nxfqsrqaf7j2k0s94
```

- 2026-10-11: Paddle canlı hesap doğrulama formu gönderildi (Doribleg Trade Ltd, 17049929, kuruluş 24.02.2026; kişisel bilgiler Eminhan); durum "We're reviewing your details", Paddle e-postayla dönecek. Ayrı fiyat sayfası `/[locale]/pricing` eklendi (Paddle formunda istendi), fiyat notu Paddle'a göre düzeltildi.
- 2026-10-11: Meta Pixel (4429254560625034) canlıda, çerez izni bildirimiyle: "Kabul et" → PageView Meta'ya gitti,
  "Reddet" → hiç yüklenmiyor (ikisi de tonelleapp.com'da doğrulandı). Olaylar: Lead, ViewContent, InitiateCheckout,
  StartTrial, Purchase. Kalan: Meta'da alan adı doğrulaması (DNS TXT), Conversions API (webhook ile).
- 2026-10-11: Paddle web ödemesi yazıldı ve sandbox'ta uçtan uca test edildi (7 gün deneme, claim, gerçek render,
  sayaç 1, başka kullanıcı 402). Canlı için kalan: canlı katalog (`scripts/paddle-catalog.mjs --live`), Vercel'e
  `PADDLE_API_KEY` + `NEXT_PUBLIC_PADDLE_*`, canlıda Default payment link, `TONELLE_FREE_RENDERS` kapatma, alan adı onayı
  ve Eminhan'ın doğrulaması. Webhook henüz yok (RevenueCat bağlanırken eklenecek).
- 2026-10-11: `tonelleapp.com` alındı, Vercel'e eklendi; koddaki tüm `tonelle.app` adresleri (site, e-postalar,
  mobil API, paylaşım kartı) `tonelleapp.com` yapıldı. DNS bağlandı; bekleyen: e-posta yönlendirme.
- 2026-10-07: davet kodları (`/api/redeem`, ödeme ekranında kod kutusu).
- 2026-10-06: Gemini canlıya bağlandı; Gemini'nin JSON'u kesmesi düzeltildi; renk ve cilt bölümleri;
  canlıda gerçek makyaj görseli; site adresi başkasının alan adından bizim Vercel adresine çevrildi.
- 2026-10-03: Gemini sağlayıcısı eklendi, Vercel'e yayın.
