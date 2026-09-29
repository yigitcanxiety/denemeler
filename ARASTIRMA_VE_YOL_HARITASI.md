# AI Makyaj / Güzellik Uygulaması: Araştırma, Kararlar ve Yol Haritası

> Hedef: Space Bunny ile **en hızlı şekilde gelir getiren** bir B2C güzellik uygulaması çıkarmak. Pazar: **Türkiye + Avrupa**.
> Tarih: 29 Eylül 2026

---

## 0. Kısa özet (TL;DR)

1. **İncelenen app** (TrustMRR `b2c-makeup-app`): Kullanıcı selfie yüklüyor, AI yüz analizi yapıyor, ona uygun makyaj görünümlerini **kendi yüzü üzerinde** gösteriyor. Ürün ve ton önerileri ile adım adım video anlatımlar da var. Web, iOS ve Android'de abonelik modeliyle çalışıyor ve Avrupa'da büyüyor. Aynı açıklamayla listelenen ilanda **Stripe'tan doğrulanmış ~8.6K $/ay** gelir var. 2025'te kurulmuş, yani yaklaşık 1 yılda bu seviyeye gelmiş.
2. **Türkiye için en güçlü kanıt:** *Glamour* adlı AI **renk analizi** uygulaması **yalnızca Türkiye'de Meta reklamlarıyla** 10 ayda aylık tekrarlayan gelirini (MRR) 222 $'dan **15.8K $'a** çıkarmış. Churn yaklaşık %9, iade yok. Bu, bu nişin Türkiye'de ücretli reklamla kârlı büyüyebildiğini gösteriyor.
3. **Önerilen ürün:** Tam bir makyaj süper-uygulaması yerine dar ve viral bir çekirdekle başla: **"Selfie → Renk Sezonu Analizi + Sana Uyan 3 Makyaj Görünümü (yüzünde) + Ton/Ürün Önerileri"**. Renk analizi kısmı kanıtlanmış bir kanca, makyaj önizleme kısmı da farklılaşma ve "vay" anı sağlıyor.
4. **Space Bunny'nin rolü:** Space Bunny şu an **ücretsiz ama anonim bir "stealth" önizleme modeli** (1M bağlam, görsel/video girdisi var). **Sadece metin üretiyor, görsel üretemiyor.** Bu yüzden:
   - **Uygulamayı yazmak** (kodlama ajanı olarak, OpenCode/OpenRouter üzerinden) ve **prototip yüz analizi** için kullan.
   - **Yüze makyaj uygulama** (görsel düzenleme) için ayrı bir görsel modeli gerekiyor: Nano Banana 2 / Gemini Image. Maliyeti görsel başına yaklaşık 0.03–0.07 $.
   - Production'da kullanıcı selfie'lerini anonim bir sağlayıcıya göndermek **GDPR/KVKK açısından riskli**. Bu yüzden LLM çağrılarını değiştirilebilir bir katmanın arkasına koy.
5. **Para kazanma:** Uygulama içi abonelik (RevenueCat), **analiz bedava, sonuç paywall arkasında** (bulanık önizleme). TR fiyatı yaklaşık ₺149/hafta veya ₺999/yıl, AB fiyatı yaklaşık €4.99/hafta veya €34.99/yıl.
6. **Zaman planı:** İlk 14 günde mağazaya gönderim, 3–4. haftada Türkiye lansmanı ve Meta/TikTok, 5–8. haftalarda AB'ye (DE, FR, IT, ES, PL, NL) genişleme.

---

## 1. İncelenen uygulama: "B2C Makeup App"

> Not: trustmrr.com bu çalışma ortamından doğrudan açılamadı (ağ politikası engelledi). Aşağıdaki veriler arama motoru indekslerinden ve TrustMRR'ın diğer sayfalarından derlendi. `b2c-makeup-app` ilanı büyük ihtimalle anonimleştirilmiş bir satış ilanı ve açıklama metni birebir aynı. Rakamları satın almadan önce sayfada tekrar kontrol et.

| Alan | Bilgi |
|---|---|
| Ne yapıyor | Selfie → yüz analizi → kişiye özel makyaj görünümleri → **kendi yüzünde önizleme** → ürün/ton önerisi → adım adım video tutorial |
| Platform | Web + iOS + Android |
| Model | B2C, abonelik |
| Gelir | ~8.6K $/ay (Stripe ile doğrulanmış), MRR ~8.7K $ |
| Kuruluş | 2025 |
| Pazar | Avrupa'da büyüyor |
| Ödeme | **Stripe**, yani büyük ihtimalle **web üzerinden ödeme alan bir funnel** kullanıyor (web-to-app) |

**Neden işe yarıyor?**
- "Önce gör, sonra al" ihtiyacı gerçek: yanlış fondöten tonu ve yanlış ruj rengi çok yaygın ve pahalı hatalar.
- Selfie → kişisel sonuç akışı, sosyal medyada paylaşılabilir bir "before/after" içeriği üretiyor.
- Sonuç kişiye özel olduğu için merak yaratıyor ve kullanıcının ödeme isteği yüksek oluyor.

---

## 2. Benzer örnekler ve öğrenilenler

| Uygulama | Ne yapıyor | Gelir / Ölçek | Ders |
|---|---|---|---|
| **Glamour** (TrustMRR) | Selfie → AI mevsimsel renk analizi (kıyafet, makyaj, aksesuar paleti) | 222 $ → **15.8K $ MRR, 10 ayda, sadece Türkiye Meta reklamları** ile, churn ~%9 | **Türkiye'de Meta reklamı bu niş için kârlı çalışıyor.** Renk analizi güçlü bir kanca. |
| **Glimora** (TrustMRR) | Sanal makyaj denemesi, renk/yüz/cilt/alt ton analizi, "Glow Score", içerik "Clean Score", barkod tarama, 32 dil | RevenueCat abonelik | Özellik listesi çok geniş. Hızlı para için bu kadarına gerek yok, ama **çok dillilik** AB için şart. |
| **Color Analysis AI** (App Store) | Selfie → renk sezonu | TikTok trendiyle **~40K $/ay** raporlanmış | TikTok UGC + tek özellik yeterli olabiliyor. |
| **Umax** (looksmaxxing) | Yüz puanlama + glow-up planı | ~500K $/ay, 3.99 $/hafta, 3.5M+ indirme | **"Tara bedava, sonuç paywall'da"** modeli çok iyi dönüşüm sağlıyor. Ama "çekicilik puanı" etik ve mağaza riski taşıyor, bundan kaçın. |
| **YouCam Makeup / Perfect365** | AR ile gerçek zamanlı makyaj | 300M+ kullanıcı, dev oyuncular | Gerçek zamanlı AR'da onlarla yarışma. **Üretken AI ile "kişiye özel look" tasarımı** tarafında farklılaş. |
| **Makeup AI** (Google Play) | AI görsel üretimiyle fotoğrafa gerçekçi makyaj, 40+ preset | – | Nano Banana tarzı modellerle **AR'dan daha gerçekçi** sonuç alınabiliyor. |

**Çıkarımlar:**
1. **Tek güçlü kanca + hard paywall** bu kategoride en hızlı gelir yolu.
2. **Türkiye Meta reklamı ile başlamak kanıtlanmış bir yol.** CPM düşük, hedef kitle genç ve Instagram yoğun.
3. AB'ye **yerelleştirme** (DE/FR/IT/ES/PL/NL) ile genişlemek, aynı kreatif formatlarıyla ölçek demek.
4. Büyük oyuncularla AR'da yarışma. **"Stilist gibi düşünen AI"** konumlandırması seç.

---

## 3. Ürün kararı (MVP kapsamı)

### İsim
**Tonelle** (yayıncı: Doribleg Trade Ltd). Gerekçe ve kontroller için 10. bölüme bak.

### MVP'de OLACAKLAR (v1.0, 14 gün)
1. **Onboarding quiz (5–7 soru):** cilt tipi, göz rengi, günlük/özel gün tercihi, bütçe, makyaj seviyesi. Bu, kullanıcıya yatırım hissi verir ve dönüşümü artırır.
2. **Selfie çekimi** ve ışık kontrolü (gün ışığı uyarısı, yüz tespiti).
3. **Analiz ekranı:** "yüz şekli, alt ton, kontrast, renk sezonu" animasyonlu "tarama" efekti.
4. **Paywall:** sonuçların **bulanık önizlemesi** + "Sonuçlarını aç". 3 gün ücretsiz deneme + yıllık plan, alternatif olarak haftalık plan.
5. **Sonuçlar (premium):**
   - Renk sezonu + kişisel palet (12 sezon sistemi)
   - **Kendi yüzünde 3 makyaj görünümü** (Günlük / İş / Gece)
   - Fondöten alt ton ve ton aralığı, ruj/allık/far renk önerileri (HEX + genel ürün tipi)
   - Adım adım yazılı uygulama rehberi
6. **Paylaş kartı:** "Benim sezonum: Soft Autumn" story görseli (uygulama logosuyla). Organik büyümenin motoru bu.
7. **Diller:** TR + EN ile başla, 2. haftada DE/FR/ES/IT/PL/NL ekle (LLM çeviri + kontrol).

### MVP'de OLMAYACAKLAR (sonraki sürümler)
- Gerçek zamanlı AR kamera
- Barkod tarama, içerik analizi
- Topluluk/feed
- Marka affiliate entegrasyonu (v1.2'de: Trendyol, Sephora, Douglas, Flormar affiliate linkleri. Ek gelir kanalı.)
- Video tutorial üretimi

### Kaçınılacaklar
- **Çekicilik/güzellik puanı** vermek. Apple incelemesinde ve reklam politikalarında risk yaratır, gençler üzerinde de olumsuz etkisi var. "Senin için en uygun renkler" gibi olumlu bir dil kullan.
- Tıbbi iddialar ("akne tedavisi" vb.).
- 16 yaş altı kullanıcı. Yaş kapısı koy ve mağazada yaş derecelendirmesini 12+/16+ olarak ayarla.

---

## 4. Teknik mimari ve materyal kararları

### 4.1 Space Bunny: nedir, nerede kullanılır?

| Özellik | Durum |
|---|---|
| Tür | Anonim "stealth" önizleme LLM'i (topluluk MiniMax M3 olduğunu tahmin ediyor) |
| Yayın | 23 Eylül 2026 |
| Fiyat | **Önizleme süresince 0 $.** Kalıcı değil, sonra fiyatlanacak. |
| Bağlam | 1M token, 524K maksimum çıktı |
| Girdi / Çıktı | Metin, görsel ve video girdisi alıyor, **yalnızca metin çıktısı** veriyor. Tool calling ve yapılandırılmış çıktı (JSON) destekliyor. |
| Veri | OpenRouter üzerinden prompt'lar sağlayıcıda **saklanabilir** (eğitimde kullanılmıyor). OpenCode'un ücretsiz yolu "sıfır saklama" diyor. |

**Karar:**
- ✅ **Geliştirme için kullan:** Kodlama ajanı olarak Expo uygulamasını, backend fonksiyonlarını, paywall ekranlarını, 8 dildeki çevirileri ve mağaza metinlerini yazdır. Ücretsiz ve 1M bağlam tüm projeyi tek seferde görebiliyor.
- ✅ **Prototip analiz için kullan:** Selfie → JSON (alt ton, sezon, yüz şekli, önerilen renkler) prompt'unu Space Bunny ile tasarlayıp test et.
- ⚠️ **Production'da kullanıcı selfie'si için dikkat:** Sağlayıcı anonim ve kalıcı fiyatı belli değil. Sağlayıcının kim olduğu ve verinin nerede işlendiği belirsiz olduğu için GDPR veri aktarımı ve KVKK yurt dışı aktarım yükümlülüklerini karşılamak zor. Bu yüzden:
  - Tüm LLM çağrılarını **tek bir `analyzeFace()` servis katmanının** arkasına koy (OpenRouter uyumlu API).
  - Model adını **config'den** oku. Başlangıçta Space Bunny, yedekte `google/gemini-2.5-flash` gibi kurumsal sözleşmeli ve AB uyumlu bir model olsun. Space Bunny ücretli hale gelirse ya da kaybolursa tek satırla geçiş yap.
- ❌ **Görsel üretimi için kullanamazsın.** Makyajı yüze uygulamak için görsel düzenleme modeli gerekiyor.

### 4.2 Stack (en hızlı yol)

| Katman | Seçim | Neden |
|---|---|---|
| Mobil | **Expo (React Native) + TypeScript** | Tek kod tabanıyla iOS ve Android çıkıyor, EAS Build/Submit ile mağazaya hızlı gönderim, AI ile kod üretimi kolay |
| Backend | **Supabase (AB bölgesi: Frankfurt)**: Auth (anonim + Apple/Google), Storage, Edge Functions | Sunucu yönetimi yok ve veri AB'de kalıyor (GDPR) |
| Analiz LLM | Space Bunny (geliştirme) → Gemini Flash / eşdeğeri (production yedeği), OpenRouter üzerinden | Maliyet analiz başına ~0.002–0.01 $ |
| Makyaj görseli | **Nano Banana 2 Edit** (Gemini API veya fal.ai) | ~0.04–0.07 $/görsel, AR'dan daha gerçekçi sonuç veriyor |
| Abonelik | **RevenueCat** (+ Paywalls veya Superwall ile A/B) | IAP, deneme süresi ve fiyat testleri tek yerden, TrustMRR doğrulaması da destekli (ileride satış opsiyonu) |
| Analitik | PostHog (AB hosting) veya Mixpanel + RevenueCat | Funnel: yükleme → selfie → paywall → deneme → ödeme |
| Atıf | Meta SDK + SKAdNetwork/AEM, ileride AppsFlyer/Adjust | Reklam optimizasyonu için şart |
| Crash | Sentry | – |
| Landing | Tek sayfa (Next.js/Framer), gizlilik politikası, KVKK aydınlatma metni, kullanım şartları | Mağaza başvurusu için zorunlu |

### 4.3 Birim ekonomisi (kullanıcı başına AI maliyeti)

| Kalem | Maliyet |
|---|---|
| Yüz analizi (1 çağrı) | ~0.005 $ |
| 3 makyaj görseli | ~0.12–0.20 $ |
| **Premium kullanıcı başına ilk sonuç** | **~0.2 $** |

- **Görselleri sadece ödeme ya da deneme başladıktan sonra üret.** Bedava kullanıcıya bulanık önizleme göster. Önizleme, preset bir örnek görsel ya da düşük çözünürlüklü tek görsel olabilir.
- Premium kullanıcıya haftalık kota koy (ör. 20 yeni look/hafta), maliyet patlamasın.

---

## 5. Para kazanma modeli ve fiyatlandırma

### Paywall stratejisi
- **Hard paywall, onboarding sonrasında:** "Analizin hazır" → bulanık sonuç → paywall. Umax ve renk analizi uygulamalarının kanıtlanmış akışı bu.
- İki plan göster: **Yıllık (3 gün ücretsiz deneme, "en popüler")** + **Haftalık**. Aylık planı ekleme, haftalık plan dönüşümü daha yüksek.
- Paywall reddedilirse **tek seferlik indirim teklifi** göster (yıllık planda %50).

### Önerilen fiyatlar (başlangıç, A/B test edilecek)

| Pazar | Haftalık | Yıllık (3 gün deneme) |
|---|---|---|
| Türkiye | ₺149.99 | ₺999.99 |
| AB (DE/FR/NL/…) | €4.99 | €34.99 |
| AB (PL/ES/IT, düşük alım gücü) | €3.99 | €24.99 |

> Apple ve Google, TR ile AB'de KDV'yi fiyatın içinden kendileri öder. **Küçük İşletme Programı**na başvur (Apple ve Google): komisyon ilk 1M $'a kadar %30 yerine %15.

### İkinci aşama gelir kanalları (2. aydan sonra)
1. **Web-to-app funnel:** İncelenen app'in Stripe kullanması bunu gösteriyor. Reklamı web quiz'e yönlendir, ödemeyi web'de al, kullanıcı uygulamaya giriş yapsın. %15–30 mağaza komisyonundan kurtulursun ve fiyat testleri hızlanır. TR'deki şahıs veya şirket için Stripe açılamıyor. **Paddle / Lemon Squeezy** gibi bir *Merchant of Record* kullan (TR'den satıcı kabulünü kontrol et) ya da iyzico kullan.
2. **Affiliate:** Önerilen ton ve renkler için Trendyol / Hepsiburada (TR), Douglas / Notino / Sephora (AB) ürün linkleri.
3. **B2B (ileride):** Kozmetik markalarına "sanal deneme" widget'ı.

---

## 6. Hukuk ve uyumluluk (TR + AB), ihmal etme

| Konu | Yapılacak |
|---|---|
| **GDPR (AB)** | Yüz fotoğrafı + yüz analizi hassas veri olarak kabul edilebilir (Md. 9). Güvenli yol: **açık rıza** checkbox'ı (ayrı ve önceden işaretlenmemiş), **fotoğrafı 24 saat içinde otomatik sil**, sadece analiz sonucunu (JSON) sakla, **model eğitiminde kullanma**, veriyi AB'de tut (Supabase Frankfurt). Alt işleyicilerle DPA imzala. |
| **KVKK (TR)** | Biyometrik veri özel nitelikli veri kategorisinde: **açık rıza metni + aydınlatma metni** ayrı ayrı gerekli. Yurt dışına aktarım (AB sunucusu, AI API'si) için aktarım mekanizmasını aydınlatma metninde belirt. VERBİS kayıt eşiklerini kontrol et. |
| **EU AI Act** | Güzellik analizi yasaklı kategoride değil. **Md. 50 şeffaflık (Ağustos 2026'dan itibaren geçerli):** AI ile üretilen/düzenlenen görselleri "AI ile oluşturuldu" diye etiketle (görselin köşesine + metadata). |
| **DSA / App Store "Trader" statüsü** | AB App Store'da satış için tacir bilgisi (adres, telefon, e-posta) **herkese açık** gösteriliyor. Şahıs olarak yayınlıyorsan buna hazırlıklı ol. Gerekirse şirket veya sanal ofis adresi kullan. |
| **Apple incelemesi** | Gizlilik "nutrition label" doğru doldurulmalı, yüz verisinin kullanımını açıkla (Guideline 5.1.2). Abonelik şartları paywall'da görünür olmalı (fiyat, süre, iptal). |
| **Şirket / vergi** | Yayıncı **Doribleg Trade Ltd**. Mağaza gelirleri şirkete faturalanacak. Şirketin kurulu olduğu ülke (UK Ltd mi, TR Ltd. Şti. mi) vergiyi, web ödeme sağlayıcısını ve KVKK/GDPR'da veri sorumlusunu belirliyor. Bir mali müşavirle konuş. |
| **Meta reklam ücreti** | Temmuz 2026'dan beri Türkiye'de reklamlara %5, FR/IT/ES'te %3, AT'de %5 konum ücreti ekleniyor. Bütçeyi buna göre planla. |

---

## 7. Yol haritası (hıza optimize)

### Faz 0: Hazırlık (Gün 0–2)
- [ ] Apple Developer (99 $/yıl) ve Google Play Console (25 $) hesaplarını aç. **Apple onayı birkaç gün sürebilir, hemen başla.**
- [ ] İsim seç, domain al, App Store/Play'de isim uygunluğunu kontrol et.
- [ ] Supabase (Frankfurt), RevenueCat, OpenRouter (Space Bunny), Gemini API / fal.ai hesaplarını aç.
- [ ] **Rakip reklamlarını incele:** Meta Ads Library'de "renk analizi", "makyaj AI", "color analysis", "Farbanalyse" araması yap. Hangi hook'ların uzun süredir yayında kaldığına bak (uzun süre yayında kalan reklam kârlı reklamdır).

### Faz 1: MVP geliştirme (Gün 3–12), Space Bunny ile kodlama
- [ ] Expo projesi, navigasyon, tasarım sistemi (pembe/nude palet, serif başlık)
- [ ] Onboarding quiz + selfie kamera + yüz tespiti
- [ ] `analyze-face` Edge Function: Space Bunny ile JSON şemalı analiz, model config'den okunacak
- [ ] `render-looks` Edge Function: Nano Banana 2 Edit ile 3 look üretimi, sadece premium kullanıcı için
- [ ] RevenueCat paywall (yıllık + haftalık + indirim teklifi)
- [ ] Sonuç ekranı + paylaşım kartı
- [ ] TR + EN dil desteği, gizlilik/KVKK/şartlar sayfaları, rıza ekranı, 24 saatte fotoğraf silme cron'u
- [ ] PostHog funnel eventleri + Meta SDK

### Faz 2: Mağaza (Gün 12–16)
- [ ] Mağaza görselleri (before/after, "Senin sezonun hangisi?"). Higgsfield/Canva ile üretilebilir.
- [ ] ASO anahtar kelimeleri. TR: "renk analizi", "makyaj", "ton bulma", "sezon analizi". EN/DE: "color analysis", "makeup try on", "Farbanalyse".
- [ ] TestFlight'ta 10–20 kişiyle test, ardından gönderim. Apple reddederse (genelde 5.1.x veya 3.1.2 abonelik metni gerekçesiyle) düzelt ve 24 saatte tekrar gönder.

### Faz 3: Türkiye lansmanı (Hafta 3–4), hedef: ilk gelir
- [ ] **Organik:** TikTok + Instagram Reels, günde 2–3 video. Formatlar: "AI benim sezonumu buldu", "Yanlış fondöten kullanıyormuşum", before/after. 3–5 hesapla paralel paylaş.
- [ ] **UGC:** 5–10 mikro influencer (5K–50K takipçi) ile ücretli veya affiliate anlaşma.
- [ ] **Meta reklamları:** günlük ₺750–1.500 ile başla. Kampanya tipi Advantage+ App, optimizasyon "trial started / purchase". Haftada 10+ kreatif test et.
- [ ] Ölçülecek KPI'lar:

| Metrik | Hedef |
|---|---|
| Yükleme → selfie tamamlama | > %60 |
| Paywall görüntüleme → deneme başlatma | > %8–12 |
| Deneme → ücretli dönüşüm | > %35–50 |
| CPI (TR, Meta) | < 0.5–1 $ |
| ROAS (D7) | > 0.4, D30'da > 1 |

### Faz 4: Optimizasyon + AB genişleme (Hafta 5–8)
- [ ] Paywall ve fiyat A/B testleri (RevenueCat Experiments).
- [ ] DE, FR, IT, ES, PL, NL yerelleştirmesi: uygulama + mağaza + reklam kreatifleri. Space Bunny ile çevir, anadil konuşanına kontrol ettir.
- [ ] AB Meta kampanyaları: önce **PL, ES, IT** (daha ucuz CPM), sonra **DE, FR, NL** (daha yüksek LTV).
- [ ] Web-to-app funnel'ın ilk versiyonu.

### Faz 5: Ölçek (Ay 3+)
- [ ] Affiliate ürün önerileri, "Look of the week" bildirimleri (retention), yeni özellik olarak saç rengi önerisi.
- [ ] Space Bunny'nin kalıcı fiyatı ve sağlayıcısı netleşince production kararını ver: kalmak mı, geçmek mi.
- [ ] RevenueCat'i TrustMRR'a bağla. Doğrulanmış gelir ileride **satış/exit** için değer katar (incelenen app şu an ilanda).

---

## 8. Bütçe (ilk 60 gün, tahmini)

| Kalem | Tutar |
|---|---|
| Apple + Google hesapları | ~125 $ |
| Domain + landing | ~20 $ |
| AI API (test + ilk 1.000 premium kullanıcı) | ~200–300 $ |
| Supabase / RevenueCat / PostHog | 0 $ (ücretsiz katmanlar, RevenueCat 2.5K $ MTR'ye kadar ücretsiz) |
| UGC / influencer | ~300–800 $ |
| Meta reklam (TR test + ölçek) | ~1.000–2.000 $ |
| **Toplam** | **~1.7K–3.2K $** |

> Space Bunny ücretsiz önizlemedeyken geliştirmenin büyük kısmını bitir. Fiyatlandırma gelince kodlama maliyeti ortaya çıkacak.

---

## 9. Riskler ve önlemler

| Risk | Önlem |
|---|---|
| Space Bunny ücretli hale gelir veya kapanır | Model config'den okunuyor, yedek model hazır, prompt'lar modelden bağımsız yazılıyor |
| Görsel modelin yüzü bozması (kimliği değiştirmesi) | Prompt'ta "kimliği koru, sadece makyajı değiştir" talimatı ver ve referans görsel kullan. Çıkan sonucu yüz benzerlik kontrolünden geçir. |
| Apple reddi (abonelik metni, gizlilik) | Paywall'da fiyat, süre ve iptal bilgisini açıkça yaz. Gizlilik etiketini eksiksiz doldur. |
| Reklam maliyetlerinin artması | Organik TikTok/UGC motoru ve paylaşım kartı ile viral döngü kur |
| GDPR/KVKK şikâyeti | Açık rıza al, 24 saatte silme uygula, veriyi AB'de tut, DPA'ları imzala, talep üzerine silme butonu koy |
| Kopyalanma | Hız, marka ve yerelleştirme kalitesiyle öne geç. TR'de Türkçe içerik üretimi bir avantaj. |

---

## 10. Kararlar

### Verilen kararlar
- [x] **Yayıncı:** **Doribleg Trade Ltd** (şirket hesabı). Apple şirket hesabı için **D-U-N-S numarası** gerekiyor (ücretsiz, 1–2 hafta sürebilir, hemen başvur). AB App Store'da trader bilgisi olarak şirket adresi görünecek.
- [x] **Uygulama adı:** **Tonelle**
  - *Ton* (TR "ton", EN "tone") + *-elle* (FR "o/kadın", zarif ve kadınsı çağrışım). TR, DE, FR, IT, ES, PL ve NL'de kolay okunuyor ve olumsuz bir anlamı yok.
  - Arama sonucu (29.09.2026): App Store, Google Play ve web'de "Tonelle" adında bir uygulama ya da güzellik markası çıkmadı. Elenen adaylar: Tonely, Palettia, Hueva, Glowmi, Seasona (hepsi kullanımda).
  - Mağaza başlıkları:
    - TR: **Tonelle: AI Makyaj & Renk Analizi**
    - EN: **Tonelle: AI Makeup & Color Match**
    - DE: **Tonelle: KI Make-up & Farbanalyse**
  - Yedek isim: **Palora**
  - Yapılacaklar: `tonelle.app` domainini al. TÜRKPATENT ve EUIPO'da sınıf 9 (yazılım) + 3 (kozmetik) + 44 (güzellik hizmetleri) için marka araştırması yap ve başvur. Instagram ve TikTok'ta `@tonelle.app` / `@tonelleapp` kullanıcı adlarını al.
- [x] **Kapsam:** Renk analizi + 3 makyaj görünümü (önerilen kapsam)

### Açık kararlar
- [ ] **İlk platform:** iOS + Android birlikte (önerilen, Expo) mi, önce iOS mu?
- [ ] **Reklam bütçesi:** ilk 30 gün için günlük ₺750 mi, ₺1.500 mü?
- [ ] **Görsel modeli:** Gemini API mı, fal.ai mı?

---

## Kaynaklar

- TrustMRR – AI Designer (aynı açıklamalı makyaj uygulaması): https://trustmrr.com/startup/ai-designer
- TrustMRR – Liinks: https://trustmrr.com/startup/liinks
- TrustMRR – Türkiye startupları: https://trustmrr.com/country/TR
- TrustMRR – Mobile Apps kategorisi: https://trustmrr.com/category/mobile-apps
- Glimora (App Store): https://apps.apple.com/sg/app/glimora-ai-beauty-glow-up/id6775999458
- Color Analysis AI vakası: https://www.shortimize.com/blog/color-analysis-ai-how-a-tiktok-trend-turned-into-a-40k-monthly-cash-cow
- Umax gelir haberi: https://finance.yahoo.com/news/looksmaxxing-apps-rate-teen-boys-163942148.html
- Umax fiyatı: https://realworldappeal.com/en/blog/umax-ai
- Makeup AI (Google Play): https://play.google.com/store/apps/details?id=com.bulpara.makeupai
- Space Bunny Alpha – OpenRouter: https://openrouter.ai/stealth/space-bunny-alpha
- Space Bunny inceleme: https://blog.buildfastwithai.com/space-bunny-review
- Space Bunny / MiniMax ipuçları: https://cellcog.ai/blog/what-is-space-bunny-alpha/
- OpenCode Space Bunny (sıfır veri saklama): https://x.com/opencode/status/2102767716666941864
- Nano Banana fiyatları: https://www.virse.ai/blog/nano-banana-pricing
- KVKK ve GDPR'da biyometrik veri: https://www.mondaq.com/turkey/data-protection/1497800/processing-of-biometric-data-in-terms-of-kvkk-and-gdpr
- Meta Avrupa konum ücretleri: https://www.digitalapplied.com/blog/meta-europe-location-fees-july-2026-advertiser-guide
- Meta güzellik reklam benchmark'ları: https://www.webtonic.io/blog/beauty-skincare-facebook-ads-statistics
- En iyi renk analizi uygulamaları 2026: https://beautyspark.me/blog/best-seasonal-color-analysis-apps-2026
