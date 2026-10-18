# Bilinen sınırlar

- Kaynak ZIP .git içermiyor. Commit/branch bilinmiyor; eski dokümandaki hash HEAD kanıtı değil. Yeni bir Git geçmişi oluşturup kaynak geçmişiymiş gibi sunulmadı.
- Gerçek Gemini anahtarı yok; canlı üretim, hizmet yetkisi, canlı injection, anlamsız/çelişkili ve imkânsız koşullar BLOCKED. Anahtar geçerliliği /health ile kanıtlanamaz.
- Mock ve jsdom testleri deterministik teknik davranışı doğrular. Gerçek tarayıcı, görsel responsive, ekran okuyucu, gerçek PDF ve fiziksel yazıcı bu tur çalıştırılmadı; eski raporlardaki sonuçlar yeni PASS sayılmadı.
- Öğretmen/Kişi 3 incelemesi ve sınıf çalışması yok. Matematik için sabit fixture kontrolü bütün model cevaplarının doğruluğunu kanıtlamaz. Üç yöntem kodu etkinliklerin eşdeğerliğini kanıtlamaz.
- Sözcüksel kaynak kontrolü uyarı amaçlıdır. Malzeme miktarı, eş anlamlılar ve gizli ihtiyaçlar kaçabilir; olumsuz cümleler yanlış alarm verebilir.
- Ürün düzeltmesi yapılmadı, açık hatalar ve başarısız kabul testleri korunur. Başarı oranı model kalitesinin veya eğitim etkisinin oranı değildir.
- Python kilidi Linux uvloop içerir. Bu Windows turunda requirements-dev.txt kuruldu; freeze kanıtı vardır. Ortam temiz kurulumda farklı çözüm oluşturabilir.
- Uygulama otomatik retry uygulamaz. SDK iç retry/kota/maliyet ve sağlayıcı veri saklama politikası bu kod incelemesiyle doğrulanmadı.
- Kişisel veri serbest metinle yanlışlıkla taşınabilir. Kişisel/hassas veri ve gerçek öğrenci kaydı testlerde kullanılmadı.

## Geri bildirim devri

Son ekip kodu ve ayrıntılı Kişi 3 raporu sağlanmadı. P3-01/P3-02 ekip bildirimi niteliğinde; tam çıktı, sürüm ve düzeltme kanıtı bekleniyor. Dış öğretmen onayı sayılmaz. Yerel HTTP smoke denemesi backend erişimi yokken BLOCKED kaldı. Eski commit sonradan bu koşuya atanmadı.

Son ön kontrol: ağ erişimi sonrası yerel backend başlatıldı. GET /health HTTP 200, model_configured=false; anahtar yokluğu doğrulandı. Kanıt: docs/evidence/feedback-live-smoke-retry.json (docs içinden evidence/feedback-live-smoke-retry.json). Canlı üretim, azaltma ve gerçek hata sonrası retry BLOCKED; Gemini çağrısı yapılmadı. Önceki erişim hatası kaydı korunmuştur.
