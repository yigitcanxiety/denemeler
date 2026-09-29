import { COMPANY } from '@/config/company';
import type { SiteContent } from './types';

const C = COMPANY;

export const tr: SiteContent = {
  meta: {
    homeTitle: 'Tonelle · Sana yakışan makyajı kendi yüzünde gör',
    homeDescription:
      'Tek bir selfie çek. Tonelle alt tonunu ve renk sezonunu bulur, kişisel paletini çıkarır ve makyaj görünümlerini kendi yüzünde gösterir. Fotoğrafın asla saklanmaz.',
    analyzeTitle: 'Ücretsiz renk ve makyaj analizi',
    analyzeDescription:
      'Renk sezonunu, alt tonunu ve sana yakışan makyaj tonlarını yaklaşık bir dakikada öğren. Fotoğrafın asla saklanmaz.',
    ogAlt: 'Tonelle: yapay zekâ ile renk sezonu ve makyaj analizi',
    keywords: [
      'renk analizi',
      'renk sezonu testi',
      'alt ton testi',
      'makyaj deneme',
      'yapay zekâ makyaj',
      'fondöten tonu',
      'sezonsal renk analizi',
    ],
  },
  nav: {
    skipToContent: 'İçeriğe geç',
    home: 'Tonelle ana sayfa',
    howItWorks: 'Nasıl çalışır',
    looks: 'Görünümler',
    pricing: 'Fiyatlar',
    faq: 'SSS',
    startCta: 'Ücretsiz dene',
    primaryNavLabel: 'Ana menü',
  },
  hero: {
    eyebrow: 'Yapay zekâ ile renk ve makyaj analizi',
    title: 'Sana yakışan makyajı kendi yüzünde gör',
    subtitle:
      'Tek bir selfie yeterli. Tonelle alt tonunu okur, renk sezonunu bulur; sana özel görünümleri, tonları ve adım adım rehberleri gösterir.',
    cta: 'Ücretsiz analizimi başlat',
    ctaNote: 'Ücretsiz analiz · Yaklaşık 1 dakika · Üyelik yok',
    trustPoints: ['Fotoğrafın asla saklanmaz', '12 renk sezonu', 'Sıcak ve zeytin tenler için'],
    storesLabel: 'Telefonunda da',
    illustrationLabel:
      'İllüstrasyon: aynı yüzün, renklerine uygun yumuşak bir makyaj görünümünden önceki ve sonraki hâli; AI ile oluşturuldu etiketiyle.',
  },
  how: {
    title: 'Nasıl çalışır?',
    subtitle: 'Selfie’den kişisel makyaj rehberine üç basit adım.',
    steps: [
      {
        title: 'Bir selfie çek',
        body: 'Yumuşak gün ışığına dön, filtre kullanma. Net ve karşıdan çekilmiş bir fotoğraf renklerini en doğru şekilde okumamızı sağlar.',
      },
      {
        title: 'Renk sezonunu öğren',
        body: 'Yapay zekâmız alt tonunu, ten derinliğini ve kontrastını okuyup seni 12 sezondan biriyle eşleştirir; en iyi renklerini ve kaçınman gerekenleri gösterir.',
      },
      {
        title: 'Görünümleri yüzünde gör',
        body: 'Doğal, ofis, glam ya da gece makyajlarını kendi fotoğrafında dene; ruj, allık ve far tonları ile kolay adımlar seni bekliyor.',
      },
    ],
  },
  looks: {
    title: 'Renklerine göre hazırlanmış görünümler',
    subtitle: 'Her görünüm paletinden seçilmiş tonlar ve seviyene uygun adım adım bir rehberle gelir.',
    cta: 'Görünümlerimi bul',
  },
  tones: {
    eyebrow: 'Bizim tenimiz için',
    title: 'Türk ve Akdeniz ten tonları için tasarlandı',
    body: 'Çoğu renk aracı çok açık tenler düşünülerek geliştirildi. Tonelle, Türkiye’de ve Akdeniz’de sık görülen sıcak, zeytin ve altın alt tonlara göre ayarlandı; böylece fondöten ve ruj tonların gerçekten uyuyor.',
    points: [
      'Sadece “sıcak” ya da “soğuk” değil, zeytin alt tonu da tanır',
      'Açıktan koyuya her ten için fondöten rehberi',
      'Koyu saç ve göz kontrastına saygı duyan paletler',
    ],
    seasonsTitle: '12 renk sezonu',
  },
  privacy: {
    title: 'Fotoğrafın sende kalır',
    body: 'Tonelle’i gizliliği önceleyerek tasarladık. Selfie’n yalnızca analizini oluşturmak için kullanılır ve sunucularımızda asla saklanmaz.',
    points: [
      'Fotoğraflar bellekte işlenir ve analizin hazır olur olmaz silinir',
      'Yapay zekâ modellerini eğitmek için asla kullanılmaz',
      'Sonuçların yalnızca cihazında saklanır; tek dokunuşla silebilirsin',
      'Görünüşünü asla puanlamayız',
    ],
    link: 'Gizlilik Politikası’nı oku',
  },
  pricing: {
    title: 'Sade fiyatlandırma',
    subtitle: 'Analiz ücretsiz. Tam raporunu ve kendi yüzündeki görünümleri Premium ile aç.',
    cta: 'Ücretsiz analizi başlat',
    note: 'Fiyatlara KDV dahildir. Abonelikler Apple veya Google tarafından ücretlendirilir ve yönetilir; ülkene ait kesin fiyatı mağaza gösterir.',
  },
  faq: {
    title: 'Merak edilenler',
    subtitle: 'Selfie’ni çekmeden önce bilmen gereken her şey.',
    items: [
      {
        q: 'Fotoğrafımı saklıyor musunuz?',
        a: 'Hayır. Selfie’n yalnızca analizini (ve Premium’da makyaj önizlemelerini) oluşturmak için yapay zekâ sağlayıcımıza güvenli şekilde gönderilir. Bellekte işlenir ve istek biter bitmez silinir. Sunucularımıza kaydedilmez ve yapay zekâ modellerini eğitmek için kullanılmaz. Sonuçların yalnızca cihazında saklanır.',
      },
      {
        q: 'Analiz ne kadar doğru?',
        a: 'Tonelle sana sağlam bir başlangıç noktası sunar, kesin bir hüküm değil. Işık, kamera kalitesi, filtreler ve makyaj fotoğraftaki renkleri etkiler; en iyi sonuç için selfie’ni yumuşak gün ışığında, makyajsız çek. Analiz ton seçimine yardımcı bir rehberdir; profesyonel ya da tıbbi bir değerlendirme değildir.',
      },
      {
        q: 'Makyajlı görseller gerçek mi?',
        a: 'Hayır ve bunu her zaman belirtiyoruz. Makyaj önizlemeleri fotoğrafından yapay zekâ ile oluşturulur ve “AI ile oluşturuldu” etiketi taşır. Bir görünümün nasıl durabileceğini simüle eder; gerçek ürünler ve uygulama biraz farklı görünebilir.',
      },
      {
        q: 'Neler ücretsiz, neler Premium?',
        a: 'Renk analizin ve sezonun ücretsizdir. Premium tam raporunu açar: en iyi ve kaçınman gereken renkler, fondöten aralığı, ruj, allık ve far tonları, kendi fotoğrafında görünümler ve adım adım rehberler.',
      },
      {
        q: 'Aboneliğimi nasıl iptal ederim?',
        a: 'Abonelikler Apple veya Google tarafından yönetilir. Tekrar ücretlendirilmemek için mevcut dönemin (veya ücretsiz denemenin) bitiminden en az 24 saat önce App Store ya da Google Play hesap ayarlarından dilediğin zaman iptal edebilirsin. Uygulamayı silmek aboneliği iptal etmez.',
      },
      {
        q: 'Zeytin ve koyu tenlerde de çalışıyor mu?',
        a: 'Evet. Tonelle Türk ve Akdeniz renk özellikleri düşünülerek tasarlandı; zeytin alt tonları ve açıktan koyuya tüm ten derinliklerini tanır.',
      },
      {
        q: 'Hesap açmam gerekiyor mu?',
        a: 'Hayır. Üye olman ya da adını veya e-postanı vermen gerekmez. Satın almalar anonim bir kimlik ve mağaza hesabınla ilişkilendirilir.',
      },
      {
        q: 'Bu tıbbi ya da cilt bakımı tavsiyesi mi?',
        a: 'Hayır. Tonelle yalnızca kozmetik renk ve makyaj önerileri sunar. Bir cilt rahatsızlığın, alerjin ya da tahrişin varsa bir dermatoloğa danış ve yeni ürünleri mutlaka önce küçük bir alanda dene.',
      },
    ],
  },
  finalCta: {
    title: 'Renklerinle tanışmaya hazır mısın?',
    body: 'Tek bir selfie çek, renk sezonunu yaklaşık bir dakikada öğren. Ücretsiz, gizli, üyeliksiz.',
    button: 'Ücretsiz analizimi başlat',
  },
  footer: {
    tagline: 'Sana neyin yakıştığını kendi yüzünde gösteren yapay zekâ destekli renk ve makyaj analizi.',
    productTitle: 'Ürün',
    legalTitle: 'Yasal',
    companyTitle: 'Şirket',
    registration: 'Sicil no.',
  },
  stores: {
    appStoreTop: 'İndirin',
    appStoreBottom: 'App Store',
    playTop: 'Hemen edinin',
    playBottom: 'Google Play',
  },
  legalCommon: {
    lastUpdated: 'Son güncelleme: {date}',
    draftNotice: 'Taslak metindir; yayımlanmadan önce hukuk danışmanı tarafından incelenecektir.',
    tocTitle: 'İçindekiler',
    otherDocs: 'Diğer yasal metinler',
    backHome: 'Ana sayfaya dön',
  },
  legal: {
    privacy: {
      title: 'Gizlilik Politikası',
      metaDescription:
        'Tonelle (Doribleg Trade Ltd) kişisel verilerini nasıl işler: fotoğraf saklanmaz, sonuçlar cihazında kalır, GDPR kapsamındaki hakların.',
      intro: [
        `Bu Gizlilik Politikası, Tonelle web sitesini ve mobil uygulamalarını (birlikte “Hizmet”) kullandığında ${C.legalName} (“biz”) tarafından kişisel verilerinin nasıl işlendiğini açıklar. Tonelle’i mümkün olan en az kişisel veriyi işleyecek şekilde tasarladık: fotoğraflarını saklamayız, hesap açmanı istemeyiz ve sonuçların kendi cihazında tutulur.`,
        'Bu politika Avrupa Ekonomik Alanı (AEA) ve diğer ülkelerdeki kullanıcılar için geçerlidir. Türkiye’deysen lütfen KVKK Aydınlatma Metni’ni de oku.',
      ],
      sections: [
        {
          id: 'controller',
          heading: '1. Verilerinden kim sorumlu?',
          blocks: [
            `Kişisel verilerinin sorumlusu ${C.legalName}, ${C.address} (sicil no. ${C.registrationNumber}) şirketidir.`,
            `Gizlilikle ilgili her soru ve talebin için ${C.privacyEmail} adresine yazabilirsin.`,
            `AB temsilcisi (GDPR md. 27): ${C.euRepresentative}.`,
          ],
        },
        {
          id: 'data',
          heading: '2. Hangi verileri işliyoruz?',
          blocks: [
            {
              list: [
                'Yüz görüntüsü (selfie): analiz için çektiğin ya da yüklediğin fotoğraf. Yüzünü gösterdiği için, seni tanımlamak amacıyla asla kullanmasak da, özel nitelikli verilere tanınan korumayı uygularız.',
                'Analiz sonuçları: alt ton, ten derinliği, kontrast, yüz ve göz şekli, renk sezonu ve önerilen tonlar gibi fotoğrafından türetilen bilgiler. Yalnızca cihazında saklanır.',
                'Soru cevapları: sonuçları kişiselleştirmek için fotoğrafınla birlikte gönderilen cilt tipi, göz rengi, kullanım amacı, bütçe ve deneyim düzeyi.',
                'Anonim uygulama kullanıcı kimliği: cihazında oluşturulan ve yalnızca aktif bir Premium aboneliğin olup olmadığını kontrol etmek için kullanılan rastgele bir tanımlayıcı.',
                'Satın alma ve abonelik durumu: bir abonelik veya tek seferlik satın almanın aktif olup olmadığı, ürünü ve yenileme tarihleri. Ödeme bilgilerini Apple veya Google işler; kart bilgilerini asla görmeyiz.',
                'Teknik veriler: güvenlik, kullanım sınırı ve hata giderme için IP adresi, tarayıcı veya cihaz türü, işletim sistemi ve istek zamanları.',
                'İletişim: bize yazarsan e-posta adresin ve mesajın.',
              ],
            },
            'Hizmeti kullanmak için adını, e-postanı veya telefon numaranı istemeyiz ve görünüşünü asla puanlamayız.',
          ],
        },
        {
          id: 'purposes',
          heading: '3. Neden ve hangi hukuki dayanakla işliyoruz?',
          blocks: [
            {
              rows: [
                [
                  'Renk özelliklerini ve renk sezonunu belirlemek için yüz görüntünü analiz etmek ve (Premium) fotoğrafında makyaj önizlemeleri oluşturmak',
                  'Açık rızan (GDPR md. 6(1)(a) ve md. 9(2)(a)). Analizden önce onay kutusunu işaretleyerek verirsin; dilediğin zaman geri alabilirsin.',
                ],
                [
                  'Soru cevaplarına göre kişiselleştirilmiş öneriler dahil talep ettiğin Hizmeti sunmak ve Premium özellikleri açmak',
                  'Sözleşmenin ifası (md. 6(1)(b)).',
                ],
                ['Anonim kullanıcı kimliğinle RevenueCat üzerinden abonelik durumunu kontrol etmek', 'Sözleşmenin ifası (md. 6(1)(b)).'],
                [
                  'Hizmeti güvende tutmak, kötüye kullanımı ve dolandırıcılığı önlemek, kullanım sınırı uygulamak ve hataları gidermek',
                  'Güvenli ve güvenilir bir hizmet işletmeye yönelik meşru menfaatlerimiz (md. 6(1)(f)).',
                ],
                ['Mesajlarını ve taleplerini yanıtlamak', 'Sözleşmenin ifası veya meşru menfaatlerimiz (md. 6(1)(b) veya (f)).'],
                ['Vergi, muhasebe veya tüketici mevzuatının gerektirdiği kayıtları tutmak', 'Hukuki yükümlülüklere uyum (md. 6(1)(c)).'],
              ],
            },
            'Açık rıza vermezsen fotoğrafını analiz edemeyiz. Yine de web sitesini gezebilir ve Hizmet hakkında bilgi alabilirsin.',
          ],
        },
        {
          id: 'photos',
          heading: '4. Fotoğrafın nasıl işlenir?',
          blocks: [
            {
              list: [
                'Fotoğrafın cihazında küçültülür ve şifreli bir bağlantı (HTTPS) üzerinden sunucumuza gönderilir.',
                'Sunucumuz fotoğrafı, analizini ya da makyaj önizlemeni oluşturması için yapay zekâ sağlayıcımıza iletir ve istek biter bitmez, genellikle birkaç saniye içinde siler.',
                'Fotoğrafını hiçbir veritabanına, dosya depolamasına veya kayda (log) yazmayız.',
                'Yapay zekâ sağlayıcılarımıza fotoğrafını modellerini eğitmek için kullanmamalarını bildiririz ve mümkün olan yerlerde veri saklamayı en aza indiren ya da kapatan ayarları seçeriz.',
                'Senin için oluşturulan makyaj önizlemeleri cihazına gönderilir ve tarafımızca saklanmaz.',
              ],
            },
          ],
        },
        {
          id: 'device',
          heading: '5. Cihazında saklanan veriler',
          blocks: [
            'Web sitesi son analiz sonuçlarını, anonim kullanıcı kimliğini ve dil tercihini tarayıcının yerel depolamasında veya zorunlu bir çerezde (tonelle_locale) saklar. Fotoğrafın burada asla saklanmaz. Bu verileri sonuç sayfasındaki “Verilerimi sil” ile veya tarayıcı verilerini temizleyerek dilediğin zaman silebilirsin.',
            'Şu anda reklam veya analitik çerezleri kullanmıyoruz. Kullanmaya başlarsak, gerekli olduğu durumlarda önce onayını isteriz.',
          ],
        },
        {
          id: 'processors',
          heading: '6. Verileri kimlerle paylaşıyoruz?',
          blocks: [
            'Yalnızca talimatlarımız doğrultusunda ve veri işleme sözleşmeleri kapsamında hareket eden, özenle seçilmiş hizmet sağlayıcılar (veri işleyenler) kullanıyoruz:',
            {
              rows: [
                ['Vercel Inc. (ABD; sunucular AB’de, Frankfurt)', 'Web sitesi ve API barındırma; teknik verileri ve aktarım sırasında geçici olarak fotoğrafı alır.'],
                ['OpenRouter, Inc. (ABD)', 'Fotoğrafını ve soru cevaplarını analizi yapan yapay zekâ görüntü modeline yönlendirir.'],
                ['OpenRouter üzerinden erişilen model sağlayıcı (ör. Google LLC)', 'Fotoğrafının analizini yapar.'],
                ['Google LLC (Gemini API) veya Features & Labels, Inc. (fal.ai) (ABD)', 'Fotoğrafında makyaj önizlemeleri oluşturur (yalnızca Premium).'],
                ['RevenueCat, Inc. (ABD)', 'Anonim kullanıcı kimliğinle bağlantılı abonelik durumunu yönetir.'],
              ],
            },
            'Apple Inc. (App Store) ve Google LLC (Google Play), satın alma ve ödeme işlemlerini kendi gizlilik politikaları kapsamında bağımsız veri sorumlusu olarak yürütür.',
            'Kanunen zorunlu olduğunda verileri yetkili makamlarla paylaşabiliriz. Kişisel verilerini asla satmayız.',
          ],
        },
        {
          id: 'transfers',
          heading: '7. Uluslararası aktarımlar',
          blocks: [
            'Bazı sağlayıcılarımız Amerika Birleşik Devletleri’nde veya AEA dışındaki başka ülkelerde bulunur ya da verilere oradan erişebilir. Yeterlilik kararı bulunmayan ülkeler için AB–ABD Veri Gizliliği Çerçevesi’ne (sağlayıcı sertifikalıysa) veya Avrupa Komisyonu Standart Sözleşme Maddeleri’ne (GDPR md. 46(2)(c)) dayanırız; aktarım sırasında şifreleme ve fotoğrafların saklanmaması gibi ek önlemler uygularız. İlgili güvencelerin bir kopyasını bizden talep edebilirsin.',
          ],
        },
        {
          id: 'retention',
          heading: '8. Verileri ne kadar süre saklıyoruz?',
          blocks: [
            {
              rows: [
                ['Yüz görüntüsü', 'Saklanmaz. Analiz veya önizleme isteği bittiğinde silinir.'],
                ['Analiz sonuçları', 'Yalnızca cihazında, sen silene kadar.'],
                ['Teknik kayıtlar (fotoğraf içermez)', 'Bir güvenlik olayının incelenmesi gerekmedikçe en fazla 30 gün.'],
                ['Kullanım sınırı sayaçları (IP adresi veya kullanıcı kimliği)', 'En fazla 1 saat.'],
                ['Abonelik kayıtları (RevenueCat)', 'Aboneliğin aktif olduğu sürece ve sonrasında kanunun gerektirdiği süre boyunca.'],
                ['Destek e-postaları', 'Yazışmanın bitiminden itibaren en fazla 2 yıl.'],
              ],
            },
          ],
        },
        {
          id: 'automated',
          heading: '9. Otomatik işleme',
          blocks: [
            'Analiz yapay zekâ tarafından otomatik olarak yapılır. Yalnızca kozmetik öneriler üretir; senin hakkında hukuki ya da benzer ölçüde önemli etkiler doğuran kararlar vermez (GDPR md. 22). Yapay zekâ ile oluşturulan görseller açıkça bu şekilde etiketlenir.',
          ],
        },
        {
          id: 'rights',
          heading: '10. Hakların',
          blocks: [
            'Yaşadığın yere bağlı olarak şu haklara sahipsin:',
            {
              list: [
                'kişisel verilerine erişme ve bir kopyasını alma;',
                'yanlış verilerin düzeltilmesini isteme;',
                'verilerinin silinmesini isteme;',
                'meşru menfaate dayalı işleme dahil, işlemenin kısıtlanmasını isteme veya itiraz etme;',
                'veri taşınabilirliği;',
                'geri almadan önceki işlemeleri etkilemeksizin rızanı dilediğin zaman geri alma;',
                'özellikle yaşadığın veya çalıştığın AB ülkesindeki veri koruma otoritesine şikâyette bulunma.',
              ],
            },
            `Haklarını kullanmak için ${C.privacyEmail} adresine yaz. Fotoğraf veya hesap saklamadığımız için verilerinin çoğu cihazındadır ve bunları kendin silebilirsin. En geç bir ay içinde yanıt veririz.`,
          ],
        },
        {
          id: 'children',
          heading: '11. Yaş sınırı',
          blocks: [
            'Hizmet 16 yaş ve üzeri kişiler içindir. 16 yaşından küçük çocukların verilerini bilerek işlemeyiz. Bir çocuğun Hizmeti kullandığını düşünüyorsan bize yaz; verilerin silinmesine yardımcı olalım.',
          ],
        },
        {
          id: 'security',
          heading: '12. Güvenlik',
          blocks: [
            'Verilerini korumak için aktarım sırasında şifreleme, sıkı erişim kontrolleri, asgari veri toplama ve fotoğrafların saklanmaması gibi önlemler kullanırız. Hiçbir sistem tamamen güvenli değildir; ancak riskleri olabildiğince düşük tutmak için çalışırız.',
          ],
        },
        {
          id: 'changes',
          heading: '13. Bu politikadaki değişiklikler',
          blocks: [
            'Hizmet veya mevzuat değiştiğinde bu politikayı güncelleyebiliriz. Son sürümün tarihini bu sayfanın başında gösteririz; önemli değişiklikleri uygulamada veya web sitesinde ayrıca duyururuz.',
          ],
        },
      ],
    },
    kvkk: {
      title: 'KVKK Aydınlatma Metni',
      metaDescription:
        '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Tonelle kullanıcılarına yönelik aydınlatma metni.',
      intro: [
        `İşbu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“KVKK”) 10. maddesi ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu sıfatıyla ${C.legalName} tarafından Tonelle kullanıcılarını kişisel verilerinin işlenmesi hakkında bilgilendirmek amacıyla hazırlanmıştır.`,
      ],
      sections: [
        {
          id: 'controller',
          heading: '1. Veri sorumlusu',
          blocks: [
            {
              rows: [
                ['Veri sorumlusu', `${C.legalName}`],
                ['Adres', C.address],
                ['Veri sorumlusu temsilcisi (Türkiye)', C.turkeyRepresentative],
                ['E-posta', C.privacyEmail],
              ],
            },
          ],
        },
        {
          id: 'data',
          heading: '2. İşlenen kişisel veriler',
          blocks: [
            {
              list: [
                'Görsel veriler: yüz görüntün (selfie). Yüz görüntüsü biyometrik veri, dolayısıyla özel nitelikli kişisel veri olarak değerlendirilebileceğinden yalnızca açık rızanla işlenir.',
                'Analiz verileri: fotoğrafından türetilen alt ton, ten derinliği, kontrast, yüz ve göz şekli, renk sezonu ve ton önerileri (yalnızca cihazında saklanır).',
                'Tercih verileri: soru cevapların (cilt tipi, göz rengi, kullanım amacı, bütçe, deneyim).',
                'Müşteri işlem verileri: anonim uygulama kullanıcı kimliği, abonelik ve satın alma durumu.',
                'İşlem güvenliği verileri: IP adresi, cihaz/tarayıcı bilgileri, istek zamanları.',
                'İletişim verileri: bize yazman hâlinde e-posta adresin ve mesaj içeriği.',
              ],
            },
          ],
        },
        {
          id: 'purposes',
          heading: '3. Kişisel verilerin işlenme amaçları',
          blocks: [
            {
              list: [
                'Yüz görüntün üzerinde renk ve makyaj analizi yapılması ve Premium kullanıcılar için makyaj önizlemeleri oluşturulması;',
                'Kişiselleştirilmiş görünüm, ton ve adım adım öneriler sunulması;',
                'Abonelik ve satın alma süreçlerinin yönetilmesi ve Premium hakkının kontrol edilmesi;',
                'Bilgi ve işlem güvenliğinin sağlanması, kötüye kullanımın önlenmesi, kullanım sınırlarının uygulanması;',
                'Talep ve şikâyetlerin yanıtlanması;',
                'Hukuki yükümlülüklerin yerine getirilmesi ve yetkili kamu kurumlarının taleplerinin karşılanması.',
              ],
            },
          ],
        },
        {
          id: 'grounds',
          heading: '4. Toplama yöntemi ve hukuki sebepler',
          blocks: [
            'Kişisel verilerin; Tonelle web sitesi ve mobil uygulamaları aracılığıyla, fotoğraf çektiğinde veya yüklediğinde, soruları yanıtladığında, satın alma yaptığında ya da bizimle iletişime geçtiğinde elektronik ortamda, kısmen otomatik yollarla toplanır.',
            {
              list: [
                'Yüz görüntüsü: açık rızan (KVKK md. 6/2).',
                'Tercih ve müşteri işlem verileri: bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (md. 5/2-c).',
                'İşlem güvenliği verileri: temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaatlerimiz için zorunlu olması (md. 5/2-f).',
                'Kanunen tutulması gereken kayıtlar: hukuki yükümlülüğümüzü yerine getirebilmek için zorunlu olması (md. 5/2-ç).',
                'İletişim verileri: sözleşmenin kurulması veya ifası ve meşru menfaatlerimiz (md. 5/2-c ve f).',
              ],
            },
            'Fotoğrafın saklanmaz: analiz isteği sona erdiğinde silinir. Analiz sonuçları yalnızca cihazında tutulur.',
          ],
        },
        {
          id: 'transfer',
          heading: '5. Kişisel verilerin aktarılması (yurt dışına aktarım, md. 9)',
          blocks: [
            'Hizmeti sunabilmek için kişisel verilerini yurt dışında bulunan hizmet sağlayıcılara aktarırız: barındırma (Vercel Inc., sunucular AB’de), yapay zekâ analizi (OpenRouter, Inc. ve yönlendirdiği model sağlayıcı, ör. Google LLC, ABD), yapay zekâ ile görsel oluşturma (Google LLC veya Features & Labels, Inc. / fal.ai, ABD) ve abonelik yönetimi (RevenueCat, Inc., ABD). Ödemeler Apple Inc. ve Google LLC tarafından işlenir.',
            'Yurt dışına aktarımlar KVKK’nın 9. maddesine uygun olarak; öncelikle Kişisel Verileri Koruma Kurulu tarafından ilan edilen standart sözleşmelere dayanılarak ve sözleşmenin imzalanmasından itibaren beş iş günü içinde Kuruma bildirilmesi suretiyle (md. 9/4) gerçekleştirilir. Bu güvencelerin uygulanamadığı hâllerde veriler yalnızca arızi olarak ve açık rızana dayanılarak aktarılır (md. 9/6-a).',
            'Kişisel verilerin, kanunen yetkili kamu kurum ve kuruluşlarıyla, talep hâlinde ve mevzuatın izin verdiği ölçüde paylaşılabilir.',
          ],
        },
        {
          id: 'rights',
          heading: '6. KVKK md. 11 kapsamındaki hakların',
          blocks: [
            'Veri sorumlusuna başvurarak;',
            {
              list: [
                'kişisel verilerinin işlenip işlenmediğini öğrenme,',
                'işlenmişse buna ilişkin bilgi talep etme,',
                'işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,',
                'yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,',
                'eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,',
                'KVKK md. 7’de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
                'düzeltme, silme veya yok etme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
                'işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme,',
                'kanuna aykırı olarak işlenmesi sebebiyle zarara uğraman hâlinde zararın giderilmesini talep etme',
              ],
            },
            'haklarına sahipsin.',
          ],
        },
        {
          id: 'application',
          heading: '7. Başvuru yolu',
          blocks: [
            `Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca taleplerini; ${C.address} adresine yazılı olarak, ${C.kepAddress} kayıtlı elektronik posta (KEP) adresine ya da daha önce bize bildirdiğin ve sistemimizde kayıtlı e-posta adresinden ${C.privacyEmail} adresine iletebilirsin. Başvurunda adın soyadın, yazılı başvurularda imzan, tebligata esas adresin ve talep konunun açıkça yer alması gerekir.`,
            'Başvurunu en geç 30 gün içinde ücretsiz olarak sonuçlandırırız. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul tarafından belirlenen tarifedeki ücret alınabilir. Başvurunun reddedilmesi, verilen cevabın yetersiz bulunması veya süresinde cevap verilmemesi hâlinde KVKK md. 14 uyarınca Kişisel Verileri Koruma Kurulu’na şikâyette bulunabilirsin.',
          ],
        },
      ],
    },
    consent: {
      title: 'Açık Rıza Metni',
      metaDescription: 'Tonelle’de yüz görüntünün işlenmesi ve kişisel verilerinin yurt dışına aktarılmasına ilişkin açık rıza metni.',
      intro: [
        `Bu metin, ${C.legalName} tarafından GDPR md. 9(2)(a) ile KVKK md. 6 ve md. 9 kapsamında açık rızana dayanılarak yapılacak işlemeleri açıklar. Lütfen Gizlilik Politikası’nı ve KVKK Aydınlatma Metni’ni de oku. Rıza vermek tamamen isteğe bağlıdır.`,
      ],
      sections: [
        {
          id: 'face',
          heading: '1. Yüz görüntümün işlenmesi',
          blocks: [
            'Çektiğim ya da yüklediğim, biyometrik / özel nitelikli kişisel veri niteliği taşıyabilecek yüz fotoğrafımın Tonelle tarafından yalnızca aşağıdaki amaçlarla işlenmesine açık rıza veriyorum:',
            {
              list: [
                'alt tonumun, ten derinliğimin, kontrastımın, yüz ve göz şeklimin ve renk sezonumun belirlenmesi;',
                'bana özel renk, ton ve makyaj önerilerinin oluşturulması;',
                'Premium kullanıcıysam, fotoğrafım üzerinde yapay zekâ ile makyaj önizlemeleri oluşturulması.',
              ],
            },
            'Fotoğrafımın saklanmadığını, istek sona erdiğinde silindiğini, kimliğimi tespit etmek için kullanılmadığını ve yapay zekâ modellerini eğitmek için kullanılmadığını biliyorum.',
          ],
        },
        {
          id: 'transfer',
          heading: '2. Yurt dışına aktarım',
          blocks: [
            'Analizin yapılabilmesi için fotoğrafımın ve soru cevaplarımın yurt dışında bulunan yapay zekâ hizmet sağlayıcılarına (OpenRouter, Inc. ve yönlendirdiği model sağlayıcı, Google LLC veya Features & Labels, Inc. / fal.ai, ABD) gönderildiğini ve barındırma hizmetinin Vercel Inc. tarafından sağlandığını biliyorum. Bu aktarımlar öncelikle standart sözleşmelere dayanır. Bu güvencelerin uygulanamadığı hâllerde verilerimin bu amaçlarla arızi olarak yurt dışına aktarılmasına açık rıza veriyorum (KVKK md. 9/6-a).',
          ],
        },
        {
          id: 'withdraw',
          heading: '3. Rızanın geri alınması',
          blocks: [
            `Rızanı dilediğin zaman; analizi kullanmayı bırakarak, uygulamada veya web sitesinde verilerini silerek ve ${C.privacyEmail} adresine yazarak geri alabilirsin. Geri alma ileriye dönük sonuç doğurur, önceki işlemeleri etkilemez.`,
            'Rıza vermezsen fotoğrafını analiz edemeyiz; bunun dışında senin için hiçbir olumsuz sonucu yoktur.',
          ],
        },
        {
          id: 'how',
          heading: '4. Rıza nasıl verilir?',
          blocks: [
            'Rızanı, fotoğrafını çekmeden veya yüklemeden önce işaretlenmemiş olarak sunulan “Yüz fotoğrafımın … işlenmesine açık rızamı veriyorum” kutusunu işaretleyerek verirsin. Sessiz kalmayı, önceden işaretlenmiş kutuları veya kullanıma devam etmeyi rıza olarak kabul etmeyiz.',
          ],
        },
      ],
    },
    terms: {
      title: 'Kullanım Koşulları',
      metaDescription:
        'Tonelle Kullanım Koşulları: abonelikler, ücretsiz deneme, otomatik yenileme, iptal, iade ve yapay zekâ çıktısı sorumluluk reddi.',
      intro: [
        `Bu Kullanım Koşulları (“Koşullar”), ${C.legalName}, ${C.address} (“biz”) tarafından sunulan Tonelle web sitesi ve mobil uygulamalarının (“Hizmet”) kullanımını düzenler. Hizmeti kullanarak bu Koşulları kabul etmiş olursun. Kabul etmiyorsan lütfen Hizmeti kullanma.`,
      ],
      sections: [
        {
          id: 'eligibility',
          heading: '1. Tonelle’i kimler kullanabilir?',
          blocks: [
            'Hizmeti kullanmak için en az 16 yaşında olmalısın. Hizmeti kullanarak bu şartı karşıladığını ve bağlayıcı bir sözleşme yapabileceğini onaylarsın.',
          ],
        },
        {
          id: 'service',
          heading: '2. Hizmet',
          blocks: [
            'Tonelle, yüz fotoğrafını analiz ederek renk, makyaj tonu ve görünüm önerileri sunmak ve (Premium kullanıcılar için) fotoğrafında makyaj görünümü önizlemeleri oluşturmak için yapay zekâ kullanır. Özellikler web sitesi ile uygulamalar arasında farklılık gösterebilir.',
          ],
        },
        {
          id: 'ai',
          heading: '3. Yapay zekâ çıktısı: yalnızca kozmetik öneriler',
          blocks: [
            {
              list: [
                'Tüm sonuçlar yalnızca kozmetik amaçlı, otomatik ve yapay zekâ ile oluşturulmuş önerilerdir. Tıbbi, dermatolojik veya profesyonel tavsiye değildir ve hiçbir şekilde teşhis niteliği taşımaz.',
                'Sonuçlar fotoğraftaki ışığa, kameraya, filtrelere ve makyaja bağlıdır ve hatalı olabilir. Ürün seçerken kendi değerlendirmeni yap.',
                'Makyaj önizlemeleri “AI ile oluşturuldu” etiketli yapay zekâ simülasyonlarıdır ve gerçek ürünlerin sende nasıl göründüğünden farklı olabilir.',
                'Ürün içeriklerini mutlaka oku ve yeni kozmetikleri önce küçük bir alanda dene. Bir cilt rahatsızlığın, alerjin veya tahrişin varsa dermatoloğa danış.',
                'Çekiciliğini asla puanlamayız veya derecelendirmeyiz.',
              ],
            },
          ],
        },
        {
          id: 'photos',
          heading: '4. Fotoğrafların',
          blocks: [
            'Yalnızca kendi fotoğrafını ya da izin almış olduğun başka bir yetişkinin fotoğrafını yükle. Çocuklara ait fotoğraf yükleme. Fotoğraflarının tüm hakları sende kalır; bize yalnızca Hizmeti sunmak amacıyla sınırlı bir işleme izni verirsin. Gizlilik Politikası’nda açıklandığı üzere fotoğraflarını saklamayız.',
          ],
        },
        {
          id: 'acceptable-use',
          heading: '5. Kabul edilebilir kullanım',
          blocks: [
            'Aşağıdakileri yapmamayı kabul edersin:',
            {
              list: [
                'başkalarının rızası olmadan fotoğraflarını, reşit olmayanların fotoğraflarını ya da hukuka aykırı, cinsel, şiddet içeren veya saldırgan içerik yüklemek;',
                'oluşturulan görselleri birini aldatmak, taklit etmek, taciz etmek veya karalamak için kullanmak ya da “AI ile oluşturuldu” etiketini kaldırarak gerçekmiş gibi sunmak;',
                'kullanım sınırlarını, ödeme veya güvenlik önlemlerini aşmaya çalışmak ya da Hizmeti tersine mühendislikle çözmek;',
                'Hizmete otomatik yollarla erişmek veya aşırı yük bindirmek;',
                'Hizmeti hukuka aykırı herhangi bir amaçla kullanmak.',
              ],
            },
            'Bu kurallara uymaman hâlinde erişimini askıya alabiliriz.',
          ],
        },
        {
          id: 'subscriptions',
          heading: '6. Premium abonelikler ve satın almalar',
          blocks: [
            'Premium; otomatik yenilenen haftalık veya yıllık abonelik olarak ve sunulduğu yerlerde tek seferlik rapor olarak sunulur. Satın almalar Tonelle uygulamasında Apple App Store veya Google Play üzerinden yapılır ve bu mağazaların koşullarına tabidir. Web sitesinde gösterilen fiyatlar bilgilendirme amaçlıdır; ödeme sırasında mağazanın gösterdiği, vergiler dahil fiyat geçerlidir.',
            'Ödeme, satın almayı onayladığında Apple Kimliği veya Google Play hesabından tahsil edilir.',
          ],
        },
        {
          id: 'trials',
          heading: '7. Ücretsiz deneme ve tanıtım teklifleri',
          blocks: [
            'Bazı planlar ücretsiz deneme (örneğin yıllık planda 3 gün) veya ilk dönem için indirimli tanıtım fiyatı (örneğin haftalık planın ilk haftası) içerir. Deneme veya tanıtım dönemi sona erdiğinde, bitiminden en az 24 saat önce iptal etmediğin sürece abonelik normal fiyattan otomatik olarak yenilenir. Denemeler kullanıcı ve mağaza hesabı başına bir kez sunulur.',
          ],
        },
        {
          id: 'renewal',
          heading: '8. Otomatik yenileme ve iptal',
          blocks: [
            'Abonelikler iptal edilene kadar her dönemin sonunda aynı süre ve fiyatla otomatik olarak yenilenir. Yenileme ücreti mevcut dönemin bitiminden önceki 24 saat içinde hesabından tahsil edilir.',
            'Dilediğin zaman App Store veya Google Play hesap ayarlarından iptal edebilirsin. Bir sonraki ücretlendirmeden kaçınmak için iptalin mevcut dönemin bitiminden en az 24 saat önce yapılması gerekir; ödemesini yaptığın dönemin sonuna kadar Premium erişimin devam eder. Uygulamayı veya yerel verilerini silmek aboneliği iptal etmez.',
          ],
        },
        {
          id: 'refunds',
          heading: '9. İadeler',
          blocks: [
            'Satın almalar Apple veya Google tarafından işlendiğinden, iade talepleri bu şirketlerin iade politikaları kapsamında kendilerine yapılmalıdır (Apple: reportaproblem.apple.com; Google Play: Google Play sipariş geçmişin). Mağaza satın almaları için doğrudan iade yapamayız.',
            'Anında ifa edilen dijital içeriklerde cayma hakkı, açık onayın ve bilgin dahilinde ifaya başlanmasıyla sona erebilir (Mesafeli Sözleşmeler Yönetmeliği md. 15). Bu durum, ayıplı dijital içerik dahil tüketici olarak sahip olduğun diğer yasal hakları etkilemez.',
          ],
        },
        {
          id: 'ip',
          heading: '10. Fikri mülkiyet',
          blocks: [
            'Hizmet, tasarımı, metinleri, görünüm rehberleri, yazılımı ve markaları bize veya lisans verenlerimize aittir. Oluşturulan görselleri ve paylaşım kartını, “AI ile oluşturuldu” etiketini koruyarak kişisel ve ticari olmayan amaçlarla kullanabilirsin.',
          ],
        },
        {
          id: 'availability',
          heading: '11. Erişilebilirlik ve değişiklikler',
          blocks: [
            'Hizmeti erişilebilir tutmak için çalışırız ancak her zaman kesintisiz veya hatasız olacağını garanti edemeyiz. Özellikleri değiştirebilir veya sonlandırabiliriz; bir değişiklik ücretli bir özelliği önemli ölçüde etkilerse seni bilgilendiririz ve aboneliğini iptal edebilirsin.',
          ],
        },
        {
          id: 'liability',
          heading: '12. Sorumluluk',
          blocks: [
            'Bu Koşullardaki hiçbir hüküm; ihmalden kaynaklanan ölüm veya yaralanma, hile ya da tüketici olarak sahip olduğun emredici haklar gibi kanunen sınırlandırılamayan sorumlulukları sınırlamaz. Bu saklı kalmak kaydıyla; yapay zekâ önerilerine dayanarak aldığın kararlardan, üçüncü kişilerden satın aldığın ürünlerden veya dolaylı zararlardan sorumlu değiliz. Sana karşı toplam sorumluluğumuz, talepten önceki 12 ayda Hizmet için ödediğin tutarla sınırlıdır.',
          ],
        },
        {
          id: 'termination',
          heading: '13. İlişkinin sona ermesi',
          blocks: [
            'Hizmeti dilediğin zaman kullanmayı bırakabilir ve cihazındaki verilerini silebilirsin. Bu Koşulların ciddi veya tekrarlanan ihlali hâlinde erişimini askıya alabilir veya sonlandırabiliriz.',
          ],
        },
        {
          id: 'law',
          heading: '14. Uygulanacak hukuk ve uyuşmazlıklar',
          blocks: [
            `Bu Koşullar ${C.governingLaw} hukukuna tabidir; ancak bu, tüketicileri ikamet ettikleri ülkenin emredici hükümlerinin sağladığı korumadan yoksun bırakmaz. AB’deki tüketiciler ikamet ettikleri ülkenin mahkemelerinde dava açabilir. Türkiye’deki tüketiciler, her yıl belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyetlerine veya Tüketici Mahkemelerine başvurabilir.`,
          ],
        },
        {
          id: 'changes',
          heading: '15. Bu Koşullardaki değişiklikler',
          blocks: [
            'Bu Koşulları güncelleyebiliriz. Son sürümün tarihini sayfanın başında gösterir, önemli değişiklikleri makul bir süre önce duyururuz. Değişiklikler yürürlüğe girdikten sonra Hizmeti kullanmaya devam edersen güncel Koşullar geçerli olur.',
          ],
        },
        {
          id: 'contact',
          heading: '16. İletişim',
          blocks: [`Bu Koşullarla ilgili soruların için: ${C.supportEmail}.`],
        },
      ],
    },
  },
  contact: {
    title: 'İletişim',
    metaDescription: 'Tonelle destek ve gizlilik ekibiyle iletişime geç (Doribleg Trade Ltd).',
    intro: 'Sonuçların, aboneliğin veya gizlilikle ilgili sorularında yardımcı olmaktan memnuniyet duyarız.',
    cards: [
      {
        kind: 'support',
        title: 'Destek',
        body: 'Uygulama, sonuçların veya aboneliğinle ilgili sorular. İade talepleri için lütfen doğrudan Apple veya Google ile iletişime geç.',
      },
      {
        kind: 'privacy',
        title: 'Gizlilik ve veri talepleri',
        body: 'KVKK ve GDPR başvuruları, rızanın geri alınması ve veri korumayla ilgili sorular.',
      },
      {
        kind: 'company',
        title: 'Şirket',
        body: 'Tonelle, Doribleg Trade Ltd tarafından yayımlanır.',
      },
    ],
    responseTime: 'Genellikle 2 iş günü içinde yanıt veririz.',
    addressLabel: 'Adres',
    registrationLabel: 'Sicil no.',
    kepLabel: 'KEP adresi',
    representativeLabel: 'Türkiye temsilcisi',
  },
  analyze: {
    consentTermsCheckbox: '16 yaşından büyüğüm ve {terms}’nı kabul ediyorum.',
    consentTermsLink: 'Kullanım Koşulları',
    quizLabel: 'Sorular',
    selfieDrop: 'veya bir fotoğrafı buraya sürükleyip bırak',
    selfiePreparing: 'Fotoğrafın hazırlanıyor…',
    selfieReady: 'Harika bir fotoğraf. Hazır olduğunda başlayalım.',
    selfieAnalyze: 'Renklerimi analiz et',
    selfieTipsTitle: 'En iyi sonuç için',
    cameraStarting: 'Kamera açılıyor…',
    cameraClose: 'Kamerayı kapat',
    cameraGuideLabel: 'Oval yüz kılavuzlu kamera önizlemesi',
    scanningLabel: 'Analiz sürüyor',
    teaserHidden: 'Kilidi açınca görünür',
    paywallClose: 'Kapat',
    paywallPlansLabel: 'Bir plan seç',
    chooseStoreTitle: 'Tonelle uygulamasında devam et',
    chooseStoreBody:
      'Planlar App Store veya Google Play üzerinden güvenle satın alınır. Tam raporunu açmak için uygulamayı indir.',
    comingSoonTitle: 'Tonelle uygulaması çok yakında',
    comingSoonBody:
      'Premium satın alma, uygulamamızın yayına girmesiyle birlikte açılacak. Bize bir not bırak, yayına girdiği an haber verelim.',
    notifyCta: 'Yayına girince haber ver',
    notifySubject: 'Tonelle yayına girince bana haber verin',
    demoUnlock: 'Demo: tüm sonuçları aç',
    demoNote: 'Yalnızca geliştirme ve demo modunda görünür.',
    resultsLookLocked: 'Premium: bu görünümü yüzünde gör',
    resultsUnlockCta: 'Kilidi aç',
    resultsPhotoNeeded:
      'Fotoğrafını saklamadığımız için, sayfayı yeniledikten sonra önizlemeler için yeni bir selfie gerekir.',
    resultsNewSelfie: 'Yeni selfie çek',
    resultsStartOver: 'Baştan başla',
    resultsFoundationHint: 'Satın almadan önce tonları gün ışığında çene hattında dene.',
    resultsShareCta: 'Paylaşım kartımı oluştur',
    shareClose: 'Kapat',
    shareFailed: 'Görsel oluşturulamadı. Lütfen tekrar dene.',
    renderFailed: 'Bu önizleme oluşturulamadı.',
    homeLink: 'Tonelle ana sayfa',
  },
};
