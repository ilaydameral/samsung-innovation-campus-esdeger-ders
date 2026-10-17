# Yapay PDF kontrol örnekleri

Bu iki dosya canlı Gemini çıktısı değildir. Arayüzün kayıtlı 3/4 örneği, uygulamanın `createPrintPlan` öğrenci/öğretmen ayırma fonksiyonundan geçirilerek ReportLab ile referans PDF’lere dönüştürüldü. Her sayfa açıkça yapay örnek olarak etiketlidir.

- `esdeger-ogrenci-test.pdf`: 1 A4 sayfa; soru ve cevap alanı. Kazanımda bulunabilecek cevap ipucu, etkinlik çözümleri ve öğretmen cevap anahtarı eklenmez.
- `esdeger-ogretmen-test.pdf`: 2 A4 sayfa; kazanım, üç etkinlik, ortak soru, cevap anahtarı ve öğretmen notları.

17 Ekim 2026 kontrolü: PDF’ler yeniden açılıp metin ayrımı denetlendi. Tüm sayfalar PNG’ye çevrilerek Türkçe karakterler, satır/sayfa taşması ve başlık/altbilgi düzeni gözle kontrol edildi. Öğrenci çıktısında cevap anahtarı yok; öğretmen çıktısı üç yöntemi içeriyor.

Bu dosyalar PDF yükleme girdisi veya uygulamaya eklenmiş doğrudan PDF indirme özelliği değildir. Uygulamadaki “Yazdır / PDF” tarayıcının penceresini açmaya devam eder. Bu referans PDF’ler tarayıcı baskı motoru ile oluşturulmadığından tarayıcı CSS’i ve o tarayıcının PDF kaydının son düzeni ayrıca kontrol edilmelidir. Öğrenme etkisi veya sınıfta uygulanabilirlik onayı değildir.


## Uygulamadan Chrome ile kaydedilen PDF’ler

17 Ekim 2026: “Çıktı hazırla → Yazdır / PDF → Save as PDF” ile ayrıca gerçek tarayıcı çıktıları kaydedildi:

- `esdeger-ogrenci-chrome.pdf`: 1 A4 sayfa, ortak soru ve cevap alanı; cevap anahtarı ve çözüm adımları yok.
- `esdeger-ogretmen-chrome.pdf`: 2 A4 sayfa, üç yöntem ve öğretmen bölümleri. Tek yöntem filtresi çıktıyı daraltmadı.

Bunlar da kayıtlı örnek veridir; canlı model yanıtı değildir. Chrome üst/altbilgileri ve arka plan grafikleri kapalı; kenar boşlukları varsayılan, tüm sayfalar ve sayfa başına 1 seçildi. PDF üreticisi Skia/PDF m154. Tüm sayfalar PNG’ye çevrilip gözle kontrol edildi. İlk öğretmen baskısındaki altbilgiye ayrılmış üçüncü sayfa, baskı CSS’i düzenlenerek giderildi. Sonuç bu örnek ve bu Chrome sürümü için doğrulanmıştır; uzun model yanıtlarında sayfa sayısı değişebilir. Fiziksel yazıcı sınanmadı.

Dolayısıyla yukarıdaki ayrı tarayıcı kontrolü gereksinimi bu Chrome PDF örnekleri için tamamlandı. Ayrıntılar `docs/FRONTEND_TEST_RAPORU.md` içinde.
