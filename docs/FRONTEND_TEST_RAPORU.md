# Frontend ve entegrasyon test kaydı

Tarih: 17 Ekim 2026 (Türkiye). Başlangıç commit’i: 09cab27. Kapsam: İlayda’nın arayüzü ve FastAPI bağlantısı. Bu tur backend şemaları/promptları değiştirilmedi.

## Sonuç
38 otomatik frontend testi ve üretim derlemesi geçti. Tarayıcıdaki temel akış kontrollerinde tamamlamayı engelleyen bir sorun görülmedi. Bir iptal sınıflandırma hatası düzeltildi. Bu sonuç sınıfta öğrenme başarısı veya tüm model yanıtlarının doğruluğu anlamına gelmez.

## Otomatik kontroller
Komutlar, frontend klasöründen:
```sh
npm test
npm run build
```

Mevcut 30 teste sekiz ağ sınırı testi eklendi. Bunlar gerçek Gemini çağrısı yapmaz; denetlenebilir test yanıtları kullanır:
- Doğru endpoint’e güncel malzeme listesi, süre, yaş ve erişim bilgisinin POST edilmesi; tam yanıtın kart/soru alanlarına dönüşmesi.
- Ağ hatasının yerel hata mesajına dönüşmesi; örnek veriyle gizli başarı üretmemesi.
- JSON olmayan yanıt ile şeması bozuk başarılı yanıtın ayrılması.
- Backend alan hatalarında biçimi geçerli alan bilgilerinin korunması.
- Kota, eksik anahtar, erişim ve zaman aşımı mesajlarının ayrılması; ham sağlayıcı ayrıntısının gösterilmemesi.
- Bilinmeyen HTTP hatasında genel yerel mesaj.
- Başlamadan iptal edilen isteğin ağa ulaşmaması.
- Yanıt gövdesi okunurken iptalin INVALID_JSON olarak etiketlenmemesi.

Gerçek ağ kodu `backendClient.ts` içine ayrıldı; `api.ts` mevcut dış arayüzünü korur. GenerationError aynı sınıf olarak yeniden dışa aktarılır. Endpoint, JSON sözleşmesi ve backend anahtar kullanımı değişmedi.

## Bu tur tarayıcıda sınananlar
| Senaryo | Veri türü | Sonuç |
|---|---|---|
| Boş kazanım | Form | Alan mesajı gösterildi. |
| Yaş 0, süre 1.5 | Form | Pozitif tamsayı mesajları gösterildi. |
| Yazılıp listeye eklenmemiş malzeme | Form | Üretim engellendi, malzeme açıklaması gösterildi. |
| İptal | Kayıtlı örnek isteği | İptal durumu gösterildi; sonraki isteğe eski yanıt taşınmadı. |
| Farklı kazanımı örnek modunda isteme | Kayıtlı örnek | Açık hata; kesir örneği yeni kazanıma aitmiş gibi gösterilmedi. |
| Yöntem filtresi | Kayıtlı örnek | Tek yöntem seçilince bir kart kaldı. |
| Cevap anahtarı | Kayıtlı örnek | Başta kapalı; düğmeyle açıldı. |
| Öğrenci çıktısı, ekranda cevap anahtarı açıkken | Kayıtlı örnek | Cevap ve etkinlik çözüm bölümleri öğrenci önizlemesinde bulunmadı. |
| Öğretmen çıktısı, ekranda tek yöntem filtreliyken | Kayıtlı örnek | Üç etkinlik ve cevap anahtarı korundu. |
| Önizlemede Escape | Arayüz | Pencere kapandı; odak Çıktı hazırla düğmesine döndü. |
| Kazanım düzenleme | Arayüz | Eski kartlar kaldırıldı. |
| Canlı/örnek mod değişimi | Arayüz | Önceki sonuç temizlendi. |
| Malzeme azaltma hazırlığı | Kayıtlı örnek | Önceki plan gösterildi; yeni plan tarafı açıkça bekledi. |
| Önceki koşullara dönüş | Kayıtlı örnek | Üç kart ve taş malzemesi geri geldi; karşılaştırma temizlendi. |
| Öğretmen incelemesinde yöntem değişimi | Kayıtlı örnek | Önceki işaretler sıfırlandı. |
| Mobil menü/rehber | 390 px | Açılma, rehbere geçme ve Escape ile kapanma çalıştı. |
| Mobil yatay taşma | 390 px | document.scrollWidth = viewport genişliği (390). |
| Farklı kazanımla gerçek üretim | Gemini | “Bir cümledeki isim ve fiili ayırt eder.” için üç yeni etkinlik geldi; kesir örneği tekrarlanmadı. |
| Canlı öğrenci çıktısı | Gemini | AI kaynak etiketi korundu; cevap anahtarı öğrenci çıktısına eklenmedi. |

## Gerçek model denemesi
Girdi: 9 yaş, her etkinlik en fazla 10 dakika, 1 kâğıt ve 1 kalem; internet/ekran/yazıcı yok. Kazanım: “Bir cümledeki isim ve fiili ayırt eder.”

Yanıt: okuma/işaretleme, kâğıtta sınıflandırma ve sözlü/bedensel ayrım olmak üzere üç yöntem. Her biri 10 dakika olarak döndü. Ortak soru “Ayşe bahçede koştu.” cümlesinde isimleri ve fiili ayırt etmeydi. Arayüz bunları ve cevap anahtarını doğru alanlara yerleştirdi. Bu tek deneme model kalitesini veya yaşa uygunluğu genel olarak doğrulamaz.

Önceki gerçek 3/4 üretimi, taş çıkarma ve canlı önce/sonra karşılaştırması `BACKEND_ENTEGRASYON.md` içinde kayıtlıdır. Bu tur karşılaştırmanın hazırlık/geri dönüş sınırları kayıtlı örnekle ayrıca kontrol edildi; tekrar gerçek uyarlama çağrısı yapılmadı.

## Açık sınırlar ve ekip devri
- Fiziksel yazdırma veya tarayıcıdan kaydedilmiş PDF’nin son sayfa düzeni bu tur doğrulanmadı. Önizleme ve öğrenci/öğretmen veri ayrımı doğrulandı. Demo öncesinde kullanılan tarayıcıyla bir kez PDF kaydedilip gözle kontrol edilmeli.
- Cümle içeriğinin pedagojik kalitesi, tüm kısıtların anlamsal uygunluğu ve öğrenme eşdeğerliği otomatik onaylanmaz. Önceki model içerik hataları geçerliliğini korur; prompt/içerik iyileştirmeleri için Kağan bu kayıtların üstüne devam edebilir.
- Ağ/kota/zaman aşımı gibi hata testleri bu tur kontrollü transport ile yapıldı; gerçek hizmette bu hatalar bilerek üretilmedi. Önceki canlı hizmet hatası ayrıca kaydedilmiştir.
- Anahtar yalnız yerel .env içindedir; test raporunda veya commit’te yer almaz.

Kağan yeni backend değişiklikleri eklediğinde yeniden kontrol: `npm test`, `npm run build`, farklı kazanımla canlı üretim, malzeme azaltma ve karşılaştırma. Alanları değiştirdiyse `backendAdapter.ts` ve paylaşılan fixture birlikte güncellenmelidir.
