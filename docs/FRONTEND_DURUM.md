> Güncel entegrasyon: Kağan’ın backend’i birleştirildi. Aşağıdaki önceki durum notlarının yerine mevcut bağlantı için [BACKEND_ENTEGRASYON.md](BACKEND_ENTEGRASYON.md) ve kök README kullanılmalıdır.

# Frontend durum kaydı

17 Ekim 2026. React + TypeScript + Vite frontend’i.

## Hazır olanlar

- Kazanım, yaş, etkinlik başına süre, malzeme ve erişim koşulları formu.
- Malzeme ekleme/kaldırma ve internet/ekran/yazıcı seçimleri.
- Üç yöntem için etkinlikler, süre, araçlar, adımlar ve beklenen davranış.
- Ortak değerlendirme sorusu, açılır cevap anahtarı ve öğretmen notları.
- Yükleniyor, iptal, boş durum, form hatası ve bağlantı hatası.
- Girdi veya mod değişince eski yanıtı kaldırma; geç gelen yanıtın yeni durumu bozmaması için istek kimliği.
- Açıkça etiketli örnek veri modu ve ayrı gerçek API istemcisi.
- Mobil ve masaüstü düzeni; klavye odağı, modal içinde odak dolaşımı ve azaltılmış hareket tercihi.

## Çalışma alanı iyileştirmeleri

- Masaüstünde sol gezinme menüsü; mobilde açılır menü. Kapalı mobil menü klavye ve erişilebilirlik ağacından çıkarılır.
- Genel bakış, atölye ve sonuç hazır olduktan sonra ortak değerlendirmeye geçiş.
- Örnek senaryoya, yöntem rehberine ve bağlantı ayarlarına menüden erişim.
- Mevcut girdiye ve sonuca bağlı özet kartları; örnek istatistik veya yapay kullanım sayısı yok.
- Sonuçlarda kısa metin, somut malzeme, sözlü etkileşim ve tüm yöntemler filtresi.
- Üyeliksiz çalışma alanı. Authentication ve authorization eklenmedi; gerçek hesap veya özel veri akışı henüz yok. Giriş ekranı sunucu tarafında yetki kontrolünün yerine geçmez.

## Yapılan kontroller

- TypeScript kontrolü ve Vite üretim derlemesi geçti.
- Girdi/yanıt kontrolleri için 9 otomatik test geçti. Eksik alan, yanlış kazanım, yinelenen yöntem/kimlik, yanlış süre ve eksik cevap anahtarı kapsandı.
- Tarayıcıda boş kazanım hatası, kayıtlı senaryo, üç etkinlik, cevap anahtarı, girdi değişince eski sonucun kaldırılması, örnek modunda farklı girdi reddi ve backend kapalıyken bağlantı hatası görüldü.
- İptal ve malzeme ekleme/kaldırma denendi.
- 1440 piksel masaüstü ve 390 piksel mobil boyutta kontrol yapıldı; mobil görünümde yatay taşma yoktu.

Bu kontroller gerçek Gemini çağrısı, backend entegrasyonu, pedagojik doğruluk veya kullanıcı faydası kanıtı değildir. Tarayıcıda backend yanıtı yerine canlı model sonucu gösterilmedi.

## Entegrasyonda kalanlar

- Kağan ile FastAPI görev sınırı ve JSON alanlarının kesinleşmesi.
- Gerçek backend adresi ve CORS izinleri.
- Gerçek modelle başarılı yanıt, kısıt değişimi ve hata durumları.
- Gerçek örneklerin içerik sorumlusu tarafından incelenmesi.
- Prompt karşılaştırma sonuçları, PDF rapor, İngilizce sunum ve video.

Runtime kontrolü yapısal alanları, yöntemleri ve süreyi denetler; yönergede gizli malzeme veya pedagojik hata olmadığını garanti etmez. API başarısızlığında örnek yanıta sessiz geçiş yapılmaz.

## Yazdırılabilir sınıf çıktısı

Sonuçlardan **Çıktı hazırla** ile öğrenci soru kâğıdı veya öğretmen planı açılır. Öğrenci çıktısı yalnız soru ve boş cevap alanını içerir; kazanım metni ve öğretmene yönelik etkinlik adımları cevap içerebildiği için eklenmez. Öğretmen çıktısı üç yöntemi, cevap anahtarını, ölçütleri ve notları içerir. Ekrandaki yöntem filtresi çıktı kapsamını değiştirmez. Her çıktıda örnek veri / AI üretimi bilgisi korunur.

**Yazdır / PDF** tarayıcının yazdırma penceresini açar; PDF kaydı tarayıcının sunduğu seçenektir. Üretim için internet/API gerekir; hazırlanan kâğıt sınıfta ekransız kullanılabilir. Bu, uygulamanın çevrimdışı AI üretimi yaptığı anlamına gelmez. Öğrenci soru metninin uygunluğunu dağıtmadan önce öğretmen kontrol etmelidir.

## Sınıfta uygulanabilirlik incelemesi
Sonuç ekranına kaynak taraması, uygulanacak yöntem seçimi ve üç öğretmen kontrolü eklendi. JSON sözleşmesi değişmedi; yeni API/model çağrısı yok. Kontroller oturum içi ve seçilen yönteme bağlıdır. Malzeme eşleşmesi ve sözcük taraması öğretmenin incelemesine yardımcı olur; pedagojik doğruluğu ya da eşdeğer öğrenmeyi doğrulamaz. Canlı deneme planı: `GERCEK_SENARYO_DOGRULAMA.md`.

## “Bu malzeme de yok”
Sonuç ekranında mevcut malzemelerden biri veya tamamı çıkarılabilir. Kazanım, yaş, süre ve erişim alanları korunur. Canlı modda aynı endpoint’e güncel malzeme listesiyle yeni istek gönderilir; JSON sözleşmesi değişmedi. Bu, önceki metni düzenleyen özel bir backend endpoint’i değildir; aynı hedef ve yeni koşullarla yeniden üretimdir.

Örnek modunda yalnız yeni koşullar hazırlanır, sahte uyarlanmış yanıt gösterilmez. “Canlı API ile yeni plan iste” açıkça canlı moda geçip istek gönderir; çalışır backend gerektirir. Önceki koşullar ve plan oturum içinde saklanır; hata/iptal veya başarılı üretim sonrası geri dönülebilir. Geri dönüş, devam eden isteği iptal eder ve eski koşulları da geri yükler. Formda sıradan düzenleme veya mod değişikliği bu geçici geri dönüş kaydını temizler. Kalıcı kayıt eklenmedi. Oturum içi önce/sonra karşılaştırması aşağıda açıklanmıştır.

Yeni yanıtta çıkarılan malzemelerin gerçekten gerekmemesi henüz semantik olarak garanti edilmez. Kaynak taraması ve öğretmen incelemesi yeniden yapılmalıdır.

## Önce / sonra karşılaştırması
Malzeme uyarlaması başlatıldığında önceki koşullar ve plan yeni koşullarla yan yana gösterilir. Yeni yanıt henüz yoksa sağ taraf açıkça bekleme durumundadır; eski etkinlik yeniymiş gibi kopyalanmaz. Başarılı yanıt geldiğinde üç yöntem ayrı ayrı seçilerek başlık, bildirilen malzemeler, süre, adımlar ve gözlemlenecek davranış karşılaştırılır. Ortak soru da açılır bölümde gösterilir. Yöntem eşleştirmesi yanıt sırası veya kimliğe göre değil `method` alanına göre yapılır.

Metin değişti/aynı etiketleri anlam veya öğrenme etkisi değerlendirmesi değildir. Önceki ve sonraki yanıtların örnek veri/canlı API kaynak etiketleri bağımsızdır. Karşılaştırma yalnız mevcut uyarlama oturumundadır; geri dönüş ve normal form düzenlemesiyle temizlenir.

Doğrulama: 24 birim testi ve üretim derlemesi geçti. Bekleyen karşılaştırma uygulamada; yeni yanıtla dolan görünüm açıkça yapay veri etiketli geçici test sayfasında kontrol edildi. Yöntem seçimi, aynı/değişen adımlar, soru karşılaştırması ve mobil taşma kontrol edildi. Geçici test sayfası kaldırıldı. Canlı model uyarlaması henüz doğrulanmadı.
