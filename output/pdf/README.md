# Yapay PDF kontrol örnekleri

Bu iki dosya canlı Gemini çıktısı değildir. Arayüzün kayıtlı 3/4 örneği, uygulamanın `createPrintPlan` öğrenci/öğretmen ayırma fonksiyonundan geçirilerek ReportLab ile referans PDF’lere dönüştürüldü. Her sayfa açıkça yapay örnek olarak etiketlidir.

- `esdeger-ogrenci-test.pdf`: 1 A4 sayfa; soru ve cevap alanı. Kazanımda bulunabilecek cevap ipucu, etkinlik çözümleri ve öğretmen cevap anahtarı eklenmez.
- `esdeger-ogretmen-test.pdf`: 2 A4 sayfa; kazanım, üç etkinlik, ortak soru, cevap anahtarı ve öğretmen notları.

17 Ekim 2026 kontrolü: PDF’ler yeniden açılıp metin ayrımı denetlendi. Tüm sayfalar PNG’ye çevrilerek Türkçe karakterler, satır/sayfa taşması ve başlık/altbilgi düzeni gözle kontrol edildi. Öğrenci çıktısında cevap anahtarı yok; öğretmen çıktısı üç yöntemi içeriyor.

Bu dosyalar PDF yükleme girdisi veya uygulamaya eklenmiş doğrudan PDF indirme özelliği değildir. Uygulamadaki “Yazdır / PDF” tarayıcının penceresini açmaya devam eder. Bu referans PDF’ler tarayıcı baskı motoru ile oluşturulmadığından tarayıcı CSS’i ve o tarayıcının PDF kaydının son düzeni ayrıca kontrol edilmelidir. Öğrenme etkisi veya sınıfta uygulanabilirlik onayı değildir.
