# App Store Connect: Tonelle mağaza sayfası

App Store Connect'e kopyala-yapıştır için. ASC uygulama kimliği **6822973603**, bundle id `com.tonelleapp.app`,
satıcı Yiğit Gördebil (bireysel). Kurallar: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/),
görseller için `DEVAM.md` → "Mağaza görselleri kontrol listesi".

> **Doğruluk (2.3.1):** mobil uygulamada cilt analizi yok (yalnız web'de); mağaza metinleri yalnız uygulamadaki özellikleri anlatır.
>
> **İncelemeye gönderme kuralı:** yalnız RevenueCat anahtarıyla (`EXPO_PUBLIC_RC_IOS_KEY`) derlenmiş bir build
> seçilir. Build 1 (2026-10-15) anahtarsızdır: ödeme ekranı "DEV" modunda, satın alma bedava açılır → 2.1 reddi.

## Uygulama bilgileri

| Alan | Değer |
|---|---|
| Ad (TR) | `Tonelle: Renk Analizi` (21/30) |
| Ad (EN) | `Tonelle: Colour Analysis` (24/30) — İngilizce (ABD) yerelleştirmesinde `Tonelle: Color Analysis` |
| Alt başlık (TR) | `Sezonun, paletin, makyaj tonun` (30/30) |
| Alt başlık (EN) | `Your season, palette & shades` (29/30) |
| Birincil kategori | Lifestyle (Yaşam Tarzı) |
| İkincil kategori | Photo & Video (Fotoğraf ve Video) — **Health & Fitness seçme** (sağlık iddiası incelemesi) |
| Birincil dil | Türkçe; ek yerelleştirme English (U.K.) + English (U.S.) |
| Telif (Copyright) | `2026 Doribleg Trade Ltd` (uygulama içindeki satırla aynı) |
| Destek URL | `https://tonelleapp.com/tr/contact` (EN: `/en/contact`) |
| Pazarlama URL | `https://tonelleapp.com` |
| Gizlilik politikası URL | `https://tonelleapp.com/tr/privacy` (EN: `/en/privacy`) |
| Lisans sözleşmesi (EULA) | Apple'ın standart EULA'sı kalsın; Kullanım Koşulları linki açıklamanın sonunda |
| Şifreleme | "Standart dışı şifreleme yok" (`ITSAppUsesNonExemptEncryption=false` zaten Info.plist'te) |
| Fiyat | Ücretsiz (gelir uygulama içi satın almadan) |
| iPad | Yok (`supportsTablet: false`); Apple yine de iPad'de iPhone modunda test eder |

## Anahtar kelimeler (virgülle, boşluksuz; addaki kelimeleri tekrar etme)

- TR (94/100): `sezon,palet,makyaj,ruj,fondöten,ten rengi,alt ton,kış,yaz,ilkbahar,sonbahar,güzellik,allık,far`
- EN (96/100): `season,palette,makeup,undertone,lipstick,foundation,skin tone,winter,summer,spring,autumn,beauty`

## Tanıtım metni (170 karakter, incelemesiz değiştirilebilir)

- TR: `Selfie'den renk sezonunu bul: sana yakışan palet, ruj, allık ve fondöten tonları ve kendi yüzünde makyaj önizlemeleri.`
- EN: `Find your colour season from one selfie: your palette, lipstick, blush and foundation shades and makeup previews on your own face.`

## Açıklama (TR)

```
Hangi renkler seni gerçekten aydınlatıyor? Tonelle tek bir selfie ile ten alt tonunu, kontrastını ve özelliklerini inceler ve seni 12 renk sezonundan birine yerleştirir.

NE ALIRSIN
• Renk sezonun: İlkbahar, Yaz, Sonbahar ya da Kış ailesinden sana en yakın alt sezon
• Kişisel paletin: giysi ve aksesuarda sana yakışan renkler, kaçınman gerekenler
• Makyaj tonların: fondöten alt tonu, ruj, allık ve far önerileri
• Makyaj önizlemeleri: doğal, ofis, akşam gibi hazır görünümleri kendi fotoğrafında gör
• Kısa test: cilt tipin ve tarzına göre öneriler kişiselleşir

GİZLİLİĞİN ÖNCE GELİR
• Fotoğrafın yalnız analiz için işlenir, sunucularımızda saklanmaz ve yapay zekâ eğitiminde kullanılmaz
• Sonuçların sadece senin cihazında durur; Profil'den tek dokunuşla silebilirsin
• Hesap açman gerekmez

Tonelle bir stil ve güzellik rehberidir; tıbbi tavsiye veya teşhis sunmaz.

ABONELİK BİLGİSİ
Tonelle Premium haftalık veya yıllık otomatik yenilenen abonelik olarak ya da tek seferlik rapor olarak satın alınabilir. Ücretsiz deneme sunulan planlarda deneme bitince seçilen planın ücreti alınır. Ödeme, satın alma onaylandığında Apple Kimliği hesabından tahsil edilir. Abonelik, mevcut dönemin bitiminden en az 24 saat önce iptal edilmezse otomatik yenilenir. Aboneliğini App Store hesap ayarlarından yönetebilir ve iptal edebilirsin.

Kullanım Koşulları: https://tonelleapp.com/tr/terms
Gizlilik Politikası: https://tonelleapp.com/tr/privacy
```

## Description (EN)

```
Which colours really light you up? From one selfie, Tonelle looks at your undertone, contrast and features and places you in one of 12 colour seasons.

WHAT YOU GET
• Your colour season: the sub-season of Spring, Summer, Autumn or Winter closest to you
• Your personal palette: colours that suit you in clothes and accessories, and the ones to avoid
• Your makeup shades: foundation undertone, lipstick, blush and eyeshadow picks
• Makeup previews: see ready-made looks such as natural, office or evening on your own photo
• A short quiz tailors the recommendations to your skin and style

YOUR PRIVACY COMES FIRST
• Your photo is processed only for the analysis, is not stored on our servers and is never used to train AI
• Your results stay on your device; delete them anytime from Profile
• No account needed

Tonelle is a style and beauty guide and does not provide medical advice or diagnosis.

SUBSCRIPTION INFORMATION
Tonelle Premium is available as a weekly or yearly auto-renewing subscription, or as a one-time report. On plans with a free trial, the plan price is charged when the trial ends. Payment is charged to your Apple ID account at confirmation of purchase. The subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel it anytime in your App Store account settings.

Terms of Use: https://tonelleapp.com/en/terms
Privacy Policy: https://tonelleapp.com/en/privacy
```

## Uygulama içi satın almalar (ürün kimlikleri koddakiyle aynı olmalı: `packages/shared/src/pricing.ts`)

| Ürün kimliği | Tür | Abonelik grubu | Deneme | Görünen ad (TR / EN) |
|---|---|---|---|---|
| `tonelle_weekly` | Otomatik yenilenen, 1 hafta | `Tonelle Premium` | 7 gün ücretsiz (tanıtım teklifi) | Haftalık Premium / Weekly Premium |
| `tonelle_yearly` | Otomatik yenilenen, 1 yıl | `Tonelle Premium` | 7 gün ücretsiz (tanıtım teklifi) | Yıllık Premium / Yearly Premium |
| `tonelle_report` | Tüketilmeyen (non-consumable) | — | — | Tam Rapor / Full Report |

- Fiyatlar: `pricing.ts`'teki TRY/EUR değerleri; Apple fiyat basamağına en yakın olanı seç. Fiyat değişikliği kullanıcı onayıyla.
- Her ürüne inceleme ekran görüntüsü (ödeme ekranı) ve kısa açıklama gerekir; ürünler ilk sürümle **birlikte** incelemeye gönderilir.
- RevenueCat: entitlement `premium`, varsayılan offering içinde `$rc_weekly`, `$rc_annual` ve özel paket `report`; çıkış teklifi `exit_offer` adlı ayrı offering (ayrı ürün, ör. `tonelle_yearly_offer`), istenirse.

## App Privacy (gizlilik etiketi) cevapları

Takip (tracking): **Hayır** (reklam/izleme SDK'sı yok; Meta SDK eklenirse güncellenir ve ATT gerekir).

| Veri türü | Kullanım amacı | Kimliğe bağlı mı | İzleme |
|---|---|---|---|
| Kullanıcı içeriği → Fotoğraflar | Uygulama işlevselliği | Hayır | Hayır |
| Kullanıcı içeriği → Diğer (test cevapları) | Uygulama işlevselliği | Hayır | Hayır |
| Satın almalar → Satın alma geçmişi | Uygulama işlevselliği | Evet (RevenueCat anonim kimliği) | Hayır |
| Tanımlayıcılar → Kullanıcı kimliği | Uygulama işlevselliği | Evet | Hayır |

Fotoğraf gerçek zamanlı işlenir ve saklanmaz; yine de Google'a iletildiği için beyan etmek en güvenlisi.

## Yaş derecesi anketi

Tüm içerik soruları **Yok/None**; tıbbi bilgi: Yok; sınırsız web erişimi: Hayır; kullanıcı üretimi içerik: Hayır;
kumar/ödül: Hayır. Beklenen sonuç 4+. (Uygulamada yaş veya rıza kutucuğu yok; 2026-10-19 kullanıcı kararı.)

## İnceleme notu (App Review Information → Notes, EN)

```
Tonelle needs no account or sign-in.

How to test:
1. Tap "Start", read the selfie tips and continue (no checkboxes), answer the short quiz if shown.
2. Take a selfie or choose any front-facing portrait photo from the library.
3. After the photo, the paywall appears: the analysis, report and makeup previews are part of Premium, which starts with a 7-day free trial (sandbox purchase, or "Restore Purchases" on the paywall and in Profile). The analysis then runs and the full report opens.

Photos and AI: the selfie is sent over HTTPS to our backend and processed by Google's Gemini API (named on the consent screen) only to produce the analysis and preset makeup previews. Photos are not stored on our servers and not used for training. The app does not use ARKit or TrueDepth face data. Makeup previews only use fixed presets on the user's own photo; there is no free-text prompt.

Data deletion: Profile > "Delete my data" removes all local results; nothing else is retained.

Contact: support@tonelleapp.com
```

İletişim kişisi: Yiğit Gördebil, yigitgordebil@gmail.com, telefon (kullanıcı girer). Demo hesap: gerekmez.

## Sürüm notu (What's New, ilk sürümde boş kalabilir)

- TR: `İlk sürüm.`
- EN: `First release.`

## Ekran görüntüleri (hazır, 2026-10-15)

`apps/mobile/store/screenshots/{tr,en}/01–05.jpg`: 1320×2868 (6,9"), JPEG, alfa yok. 6,9" seti yüklenince küçük
boyutları Apple ölçekler. Sıra: 1 renk sezonu, 2 palet, 3 ruj/allık/far tonları, 4 makyaj önce/sonra, 5 gizlilik.
Kurallara uygun: fiyat, deneme, URL, başka platform logosu yok; gerçek uygulama ekranları (tarayıcı önizlemesi, DEMO
şeridi gizli). Yeniden üretmek için: mobil web önizlemesi + `apps/mobile/store/frame.html?img=…&k=…&t=…&s=…`
(440×956, 3x ölçek). Örnek analiz metni TR'ye çevrilmiş mock; gerçek yüz yok, görseller Gemini portreleri.
