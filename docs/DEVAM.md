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

### Faz E: Avrupa

Önce PL, ES, IT (ucuz gösterim), sonra DE, FR, NL. Çeviri + yerel kreatif.

## 5. Fiyat ve sınır kararları (önerilen, henüz uygulanmadı)

| Plan | Fiyat (TR) | Analiz | Makyaj görseli |
|---|---|---|---|
| Ücretsiz | – | 1 | 1 |
| Haftalık | ₺129,99 (web'de ilk hafta indirimi yok) | haftada 5 | haftada 40 |
| Yıllık | ₺799,99, 7 gün ücretsiz (2026-10-11 kullanıcı kararı) | haftada 5 | haftada 40 |
| Tek rapor | ₺199 | 1 | 10 |

Tahmini maliyet: analiz ~₺0,10, görsel ~₺1,70 (~$0,04). Haftalık plan net ~₺80 (KDV ve Paddle sonrası).
Sınırlar uygulanınca paywall'daki "Sınırsız görünüm" metni "Haftada 40 görünüm" olarak değişmeli.

## 6. Ortam değişkenleri (Vercel, Production)

`GEMINI_API_KEY` (gizli), `TONELLE_FREE_RENDERS=1`, `TONELLE_ACCESS_CODES` (davet kodları),
`NEXT_PUBLIC_SITE_URL=https://tonelleapp.com` (DNS 2026-10-11 bağlandı),
`KIE_API_KEY` (silinecek).

## 7. Değişiklik günlüğü

- 2026-10-11: `tonelleapp.com` alındı, Vercel'e eklendi; koddaki tüm `tonelle.app` adresleri (site, e-postalar,
  mobil API, paylaşım kartı) `tonelleapp.com` yapıldı. DNS bağlandı; bekleyen: e-posta yönlendirme.
- 2026-10-07: davet kodları (`/api/redeem`, ödeme ekranında kod kutusu).
- 2026-10-06: Gemini canlıya bağlandı; Gemini'nin JSON'u kesmesi düzeltildi; renk ve cilt bölümleri;
  canlıda gerçek makyaj görseli; site adresi başkasının alan adından bizim Vercel adresine çevrildi.
- 2026-10-03: Gemini sağlayıcısı eklendi, Vercel'e yayın.
