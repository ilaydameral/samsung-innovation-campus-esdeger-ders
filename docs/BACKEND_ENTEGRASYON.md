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
30 frontend testi ve 16 backend testi ile üretim derlemesi geçti. Backend testlerinde test sağlayıcısı kullanıldı. Değişen malzeme listesinin prompta taşınması, v1/v2 seçimi, şema hataları, CORS ve güvenli hata yanıtları denetlendi. Başarılı fixture yanıtı frontend adapter testlerinden geçti.

Gerçek model anahtarı henüz bu ortamda yapılandırılmadı. Bu nedenle Gemini çıktısının niteliği, gerçek gecikme/kota ve malzeme uyarlama başarısı henüz doğrulanmadı. Gerçek deneme sırası `GERCEK_SENARYO_DOGRULAMA.md` içindedir. 16 testte geçen sahte sağlayıcı çıktıları canlı model kanıtı diye raporlanmamalıdır.

## Kalan canlı deneme
Yerel .env dosyasına anahtarı ekle → backend’i yeniden başlat → sağlık kontrolü → frontend canlı API modunda üret → taşları kaldırarak yeniden üret → önce/sonra karşılaştır → kaynak ve öğretmen incelemesi → yazdırma. Anahtarı GitHub’a veya sohbete koymayın.

Yerel HTTP/tarayıcı kontrolü: Gerçek uvicorn sunucusu /health için status=ok ve model_configured=false döndürdü. Frontend, yeni endpoint üzerinden sunucuya ulaşıp MODEL_NOT_CONFIGURED hatasını Türkçe gösterdi; örnek yanıta geçmedi. Bu kontrol gerçek frontend–FastAPI bağlantısını doğrular, Gemini üretimini doğrulamaz.
