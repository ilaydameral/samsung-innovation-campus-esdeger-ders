# Responsible AI değerlendirmesi

Bu değerlendirme sağlanan kod ve sentetik testlere dayanır; mevzuata uygunluk sertifikası, canlı model güvenliği veya gerçek öğretmen onayı değildir. Önceki canlı raporlar bu tur tekrar doğrulanmadı.

| Risk | Seviye | Mevcut kontrol | Test yöntemi ve bulgu | İyileştirme / sorumlu |
|---|---|---|---|---|
| Serbest metinde kişisel veri | High | Ayrı öğrenci adı/tanı alanı yok; rehber gereksiz olduğunu söyler | App.tsx, backend/app.py: kazanım, yaş/seviye, malzeme ve erişim metni SDK contents alanına doğrudan gider. Serbest metin kişisel veri içerebilir; otomatik redaksiyon yok. Sentetik saldırı veri istememe sınırı mock ile incelendi; canlı BLOCKED | Form yanında veri minimizasyonu uyarısı; sınıf bağlamı dışında kimlik yazılmaması; gereksinime göre maskeleme/ret politikası. Kişi 1/2 |
| Hassas verinin loglara sızması | Medium | Backend ham sağlayıcı hatasını istemciye döndürmez; frontend yerel mesaj kullanır | Mevcut hata testleri sentinel sağlayıcı ayrıntısının response içinde bulunmadığını doğrular. Uygulamada request body logger görülmedi; altyapı/sağlayıcı logları incelenmedi | Prod log ve saklama yapılandırmasını ayrıca gözden geçir; response gizliliğini log gizliliği sayma. Kişi 2 |
| Düşük kaynaklı sınıfı dışlama | High | v2 yalnız verilen malzemeleri kullanma ve erişim kuralları; arayüz kaynak taraması | Kısıt ihlalli mock yanıtın backend'de kabul edilmesi test edilir. Sözcüksel tarama uyarı verir, engellemez; miktar/eş anlamlı/adımda gizli kaynak belirsizdir | Liste ve miktar kontrolleri; belirsiz durumlarda açık uyarı; öğretmen onayı. Kişi 2/3 |
| İnternet gereksiniminin karıştırılması | Medium | README sınıf erişimi ile AI uygulamasının internet gereksinimini ayırır | access=false online Gemini hizmetini çevrimdışı yapmaz. Canlı üretim için ağ gerekir | UI'da üretimin internet istediğini açıklama; kayıtlı örnek ayrı etiketli kalmalı. Kişi 1 |
| AI kaynağı/hata şeffaflığı | Medium | Örnek veri etiketi; canlı modda model üretimi ifadesi; öğretmen incelemesi ve doğruluk sınırı | App.tsx ve print modülü; mevcut baskı veri ayrımı testleri. Bu tur gerçek tarayıcı PDF kontrolü yapılmadı | Kısa AI hata ihtimali uyarısını her dışa aktarılan çıktıda koru. Kişi 1/5 |
| İnsan denetiminin formaliteye dönüşmesi | High | Son söz öğretmende; üç kontrol kutusu; yerel oturum içi durum | Kod hiçbir öğretmen kutusunu uzman doğrulaması/öğrenme kanıtı saymaz. Kontroller içerik doğruluğunu hesaplamaz | Kritik matematik ve kaynak kontrollerini uzman rubriğiyle destekle. Kişi 3 |
| Yanlış matematik/cevap anahtarı | High | Dolu alan, kazanım metni ve süre kontrolü | Mutasyona uğramış yanlış anahtar teknik şemayı geçebilir. Fixture içindeki 8 × 3/4 = 6 sabit kontrolü genel doğruluk testi değildir | Denetlenebilir soru türlerinde matematik kontrolü; diğerlerinde açık insan incelemesi. Kişi 2/3 |
| Tanı/başarı etiketi üretme | High | v2 çocuk hakları kuralı tanı ve yeterlik kararını yasaklar | Sistem promptu incelendi; gerçek modelin tüm cevapları sınanmadı. Öğrenci tanısı girdi alanı yok | Tanı/etiket kırmızı takım denemeleri ve insan incelemesi. Kişi 2/3 |
| Prompt injection | High | Sistem mesajı ile kullanıcı contents ayrı; v2 injection savunması; şema üç yöntem ister | Dört saldırı testte kullanıcı metni olarak kalır. Mock testlerin PASS olması gerçek modelin talimata dirençli olduğunu kanıtlamaz. LIVE-10..13 BLOCKED | Gerçek modelde tekrarlı adversarial test; yapı/anlam post-validation; kişisel veri talebi reddi. Kişi 2 |
| v1 alternatifinde daha zayıf güvenlik | Medium | Ortak OUTPUT_CONTRACT kullanıcı komutlarını sınırlar; UI v2 kullanır | API v1'i kabul eder. Malzeme/çocuk hakkı ayrıntıları v1 sistem mesajında yok | Baseline erişimini deney/test ortamına sınırlama veya ortak güvenlik tabanı. Kişi 2 |
| Kötüye kullanım/maliyet | Medium | Timeout ve sınırlı CORS var | API'de kimlik doğrulama, boyut sınırı ve uygulama rate limiter görülmedi. CORS sunucu çağrılarına erişim kontrolü değildir | Dışa açılmadan önce istek boyutu/kota ve gerekliyse erişim politikası. Kişi 2 |

## Pedagojik doğrulama sınırları ve Kişi 3 devri

| Kontrol | Kişi 4 kanıtı | Kalan uzman işi |
|---|---|---|
| Ortak kazanım | Her etkinlikte aynı metin; mismatch mock reddi | Aynı metin içeriğin eşdeğerliğini kanıtlamaz |
| Matematik | Fixture'da sekiz taş dört ikili grup; üç grup altı taş; Fraction ile 6 doğrulanır | Tüm yeni içerik ve dilsel gerekçe |
| Malzeme | Fixture 1 kâğıt/1 kalem/8 taş; azaltmada taş uyarısı | Adımdaki gizli kaynak, miktar ve güvenli kullanım |
| İnternet/cihaz | Yasak kaynak sözcükleri üç yöntemde uyarı üretir | Olumsuz cümle yanlış pozitifi ve anlam |
| Süre | Fixture 8/10/7, her biri 10 sınırında; aşım reddedilir | Sınıfta uygulama ve okuma süresi |
| Farklılık | Üç ayrı yöntem kodu; fixture çizim, taş gruplama ve sözlü anlatım içerir | Kod dışında gerçek pedagojik çeşitlilik |
| Ortak soru | Fixture eş parça/seçili parça sorar | Ölçme geçerliği |
| Anahtar | Fixture 3/4; pay/payda açıklaması tutarlı | Yeni üretimlerde doğruluk ve kabul rubriği |
| Düzey | Yaş gönderilir, sınıf uydurulmaz | Gerçek yaş/sınıf uygunluğu |
| Eksik bilgi | v2 uygulanabilirlik notu ister | Varsayım, açıklama isteme ve imkânsızlık davranışı |

Bu inceleme QA tarafından sabit fixture üzerinde yapılmıştır. Öğretmen görüşmesi, öğrenci uygulaması, öğrenme kazanımı ölçümü ve Kişi 3 uzman onayı yapılmadı. PED-01..10 NOT RUN. Paylaşılan geçmiş raporlardaki “dörderli grup” ve “payda” hataları tarihsel bulgu olarak korunur; bu tur yeniden üretilmiş yeni bug sayılmaz.

## Ekip içi geri bildirimle bağlantı

Değerlendirme notunda anılan su döngüsü açıklaması P3-01, yönler sorusu kapsamı P3-02 olarak ortak kayıtta. Özgün çıktılar/sürümler paylaşılmadığından doğrulanmış bulgu veya dış öğretmen/uzman onayı sayılmadı. Pedagojik NOT RUN satırları korunur.
