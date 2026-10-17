# Backend entegrasyonu — 17 Ekim 2026

Kağan’ın `2747013` commit’i fast-forward ile alındı. Endpoint ayrıca yeniden yazılmadı; mevcut FastAPI uygulaması frontend’e bağlandı.

## Alan eşleştirmesi
| Ekran alanı | Backend alanı |
|---|---|
| learning_objective | kazanim |
| student_age | yas_seviye: “N yaş”; sınıf seviyesi çıkarılmaz |
| duration_minutes_per_activity | sure_dakika; her etkinlik için ayrı üst sınır |
| available_materials | malzemeler |
| access | erisim_kosullari metni |
| activities | etkinlikler |
| common_assessment | degerlendirme |
| teacher_notes | uygulanabilirlik_notu |

Frontend varsayılan v2 promptunu ister. v1 baseline backend’de korunur. Dönen her etkinliğin hedef_kazanim alanı özgün kazanımla eşleşmeli; süre üst sınırı aşılmamalı; üç yöntem benzersiz olmalı. Başlığa/indekse göre yöntem tahmini yapılmaz. Eski notebook Türkçe yöntem adları istemci tarafından tanınır, güncel backend kodları reading/hands_on/oral’dır.

## İncelemede düzeltilenler
- Anahtar yokken import sırasında çökme kaldırıldı; /health açılır, üretim MODEL_NOT_CONFIGURED hatası verir.
- Toplam ders süresi söylemi alternatif etkinlik başına üst sınır olarak uyumlandı. API alan adı aynı kaldı; notebook örneği ve promptlar güncellendi.
- Eksik/boş çıktı, yinelenen yöntem, farklı kazanım ve fazla süre reddedilir. Bunlar anlamsal/pedagojik uygunluk garantisi değildir.
- Ham sağlayıcı hatası tarayıcıya gönderilmez; kota, erişim, zaman aşımı ve yapılandırma hataları ayrılır.
- CORS yerel frontend origin’lerine sınırlandı; async istemci kapanışı ve 45 saniye sunucu bekleme sınırı eklendi.
- Python önbellekleri ve .venv repodan hariç tutulur; kurulum için requirements.lock kaydedildi.

## Doğrulama
30 frontend testi ve 17 backend testi ile üretim derlemesi geçti. Backend testlerinde test sağlayıcısı kullanıldı. Değişen malzeme listesinin prompta taşınması, v1/v2 seçimi, şema hataları, CORS ve güvenli hata yanıtları denetlendi. Başarılı fixture yanıtı frontend adapter testlerinden geçti.

İlk entegrasyonda anahtar yapılandırılmamıştı. 17 Ekim canlı denemelerinde temel üretim ve malzeme azaltma HTTP 200 döndü; ayrıntılar aşağıda. Bu küçük deneme seti pedagojik doğruluğu veya hizmet güvenilirliğini kanıtlamaz. Gerçek deneme sırası `GERCEK_SENARYO_DOGRULAMA.md` içindedir. 16 testte geçen sahte sağlayıcı çıktıları canlı model kanıtı diye raporlanmamalıdır.

## Kalan canlı deneme
Yerel .env dosyasına anahtarı ekle → backend’i yeniden başlat → sağlık kontrolü → frontend canlı API modunda üret → taşları kaldırarak yeniden üret → önce/sonra karşılaştır → kaynak ve öğretmen incelemesi → yazdırma. Anahtarı GitHub’a veya sohbete koymayın.

Yerel HTTP/tarayıcı kontrolü: Gerçek uvicorn sunucusu /health için status=ok ve model_configured=false döndürdü. Frontend, yeni endpoint üzerinden sunucuya ulaşıp MODEL_NOT_CONFIGURED hatasını Türkçe gösterdi; örnek yanıta geçmedi. Bu kontrol gerçek frontend–FastAPI bağlantısını doğrular, Gemini üretimini doğrulamaz.

## 17 Ekim 2026 — ilk gerçek Gemini denemeleri
- Yerel anahtar dosyası yapılandırıldı; dosya Git dışındadır, içeriği bu kayda eklenmedi. Model: gemini-3.8-flash.
- İlk deneme SDK şema dönüşümünde, ağ çağrısından önce durdu: pozitif tamsayı için exclusiveMinimum üretilmesi desteklenmiyordu. Süre koşulu ge=1 yapıldı; geçerli süre kümesi değişmedi. Gerçek SDK serileştirmesini ağ kullanmayan HTTP test transportuyla sınayan regresyon testi eklendi.
- Temel 3/4 senaryosu: HTTP 200, yaklaşık 20.11 saniye; üç yöntem, süreler 10/10/8 dakika. Kayıtlı örnek yanıt kullanılmadı.
- Arayüzden temel canlı üretim de tamamlandı; mevcut etkinlik kartları ve öğretmen notu açıldı.
- Arayüzde taşları kaldırma isteğinin bir denemesi hizmet hatası aldı. Önceki plan korundu. Otomatik başarı ya da örnek veri geçişi yapılmadı.
- Azaltılmış malzemeli ayrı canlı tekrar: HTTP 200, yaklaşık 24.97 saniye; üç yöntemde yalnız 1 kâğıt/1 kalem veya ek malzeme yok. Somut etkinlik taş gruplamadan kâğıt katlamaya değişti.
- İçerik incelemesi: ilk temel yanıtta doğru adımlarla çelişen “dörderli grup” ifadesi; azaltılmış yanıtta ölçüt açıklamasında seçilen parça sayısı için yanlışlıkla “payda” denmesi görüldü. Bu yanıtlar doğruluğu onaylanmış öğretim materyali değildir. Öğretmen incelemesi ve düzeltme gerekir.
- Bunlar az sayıda teknik denemedir; öğrenme eşdeğerliği, zaman tasarrufu veya SDG etkisi ölçümü değildir. Kalıcı anahtar, öğrenci kişisel bilgisi ve ham sağlayıcı hatası kayda veya repoya eklenmedi.

Arayüzdeki azaltılmış malzemeli tekrar da başarıyla tamamlandı. Önceki ve sonraki sütunlarda iki gerçek API yanıtı görüntülendi; taş gruplama etkinliği yalnız kâğıt/kalem kullanan katlama etkinliğine dönüştü. Son arayüz yanıtının açılan cevap anahtarında 4 eş parça payda, seçilen 3 parça pay olarak doğru açıklanıyordu. Önceki hatalı örnekler bu başarıyla geçersiz sayılmadı.
