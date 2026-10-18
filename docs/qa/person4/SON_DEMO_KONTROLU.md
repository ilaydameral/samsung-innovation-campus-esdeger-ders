# Son demo ve canlı kontrol — kısa ekip devri

Mevcut durum: Son ekip sürümü ve API erişimi sağlanmadı. Mevcut snapshot için yerel HTTP denemesinde backend erişilemedi; anahtar da yok. Üç akış BLOCKED. Kanıt: evidence/feedback-live-smoke.json. Bu kayıt canlı Gemini başarısı, UI testi veya ürün retesti değildir.

## API erişimi olan ekip üyesi

1. Gerçek clone'da `git status --short`, `git rev-parse HEAD` ve tarih/saat kaydedilir; kirli çalışma ağacı varsa değişen dosyalar da belirtilir. Eski koşuya yeni commit atanmaz.
2. Anahtar yalnız backend ortamında yapılandırılır; rapora/sohbete yazılmaz. Backend başlatılır; health `model_configured=true` yalnız varlık göstergesidir, anahtar geçerliliği üretimle sınanır.
3. Proje kökünde aşağıdaki komut, sentetik 3/4 girdisiyle temel üretim ve taşları kaldırarak malzeme azaltmayı dener. İstek, sürüm hash'i, saat ve teknik sonuç kaydedilir:
```powershell
python scripts/live_smoke.py --base-url http://127.0.0.1:8000 --output docs/evidence/live-demo-YENI-KOSU.json
```
Araç yalnız yerel HTTP backend'e gider. Çıktı dosyası zaten varsa üzerine yazmaz. Anahtara erişmez. Gerçek model yapılandırılmışsa en fazla üç ücretli üretim isteği olabilir: temel, azaltılmış, gözlenen hata sonrası bir yeniden deneme. Gerçek hata gözlenmezse hata sonrası retry NOT RUN kalır. HTTP 200 yalnız teknik kurtulmadır, içerik doğruluğu onayı değildir. Çıkış 2 BLOCKED, 1 FAIL, 0 yalnız teknik kontrolün tamamlanmasıdır.
4. Aynı girdileri frontend canlı modunda ayrıca açın. Loading/iptal, malzeme azaltma, hata varsa yeniden gönderme ve eski çıktı temizliğini gözleyin. Ekran görüntüsünde anahtar, kişisel bilgi veya terminal sırları bulunmasın. Python smoke aracı bu UI kontrolünün yerine geçmez.
5. Demo için üç etkinliğin kazanımı, tüm malzemeleri/miktarları, ortak sorusu ve cevap anahtarı Kişi 3 ile tek tek incelenir. Bu ekip içi incelemedir; dış öğretmen/uzman onayı diye yazılmaz.

## Doldurulacak demo kaydı

| Alan | Şimdiki durum |
|---|---|
| Kod sürümü / commit + kirli dosyalar | ZIP; commit doğrulanamadı; son ekip sürümü sağlanmadı |
| Tarih / saat / model | HTTP denemesi evidence/feedback-live-smoke.json içinde; model doğrulanamadı |
| Tam demo girdisi | Aynı JSON kaydındaki sentetik 3/4 girdisi; 9 yaş; 10 dk; kâğıt, kalem, 8 taş |
| Temel üretim | BLOCKED |
| Azaltılmış malzeme | BLOCKED — taş çıkarılır, kâğıt/kalem kalır |
| Gerçek hata ve yeniden deneme | BLOCKED; yapay başarı kaydı yok |
| Üç kazanım + kaynak + soru + anahtar | NOT RUN — canlı çıktı yok |
| Kişi 3 inceleyen / gerekçe / çıktı sürümü | NOT RUN |
| Ekran görüntüsü yolu | Yok |
| Düzeltme / retest / benzer regresyon | HEDEFLI_RETEST.csv; NOT RUN |

Bu şablondaki durumlar kanıtla değiştirilir; dosyanın hazırlanması testin yapıldığı anlamına gelmez. Yeni canlı sonuçlar ana matrise ilgili LIVE/PED satırı ve tam kanıt referansı üzerinden eklenir; otomatik senaryoların sonucunu değiştirmez.

Son ön kontrol: ağ erişimi sonrası yerel backend başlatıldı. GET /health HTTP 200, model_configured=false; anahtar yokluğu doğrulandı. Kanıt: docs/evidence/feedback-live-smoke-retry.json (docs içinden evidence/feedback-live-smoke-retry.json). Canlı üretim, azaltma ve gerçek hata sonrası retry BLOCKED; Gemini çağrısı yapılmadı. Önceki erişim hatası kaydı korunmuştur.
