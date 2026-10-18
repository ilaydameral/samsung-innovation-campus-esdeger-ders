# Test sonuçları — 18 Ekim 2026 (Türkiye)

| Metrik | Değer |
|---|---|
| planned | 106 |
| executed | 82 |
| PASS | 74 |
| FAIL | 8 |
| BLOCKED | 13 |
| NOT RUN | 11 |
| success_rate | 90.24 |
| open_critical | 0 |
| product_retests | 0 |
| retests | 1 |

Özet: **81 otomatik test: 73 geçti, 8 başarısız; derleme başarılı.**

Derleme dahil kontrol geçme oranı PASS / (PASS + FAIL) × 100. %90,24 model doğruluğu, öğrenme başarısı veya genel güvenilirlik oranı değildir. BLOCKED ve NOT RUN paydaya dahil değildir. Derleme tek ayrı planlı kontroldür. 81 otomatik testcase: 73 PASS / 8 FAIL; ayrıca 1 başarılı derleme = 82 çalıştırılmış kontrol, 74 PASS / 8 FAIL. Canlı 13 BLOCKED; 10 içerik + 1 gerçek tarayıcı kontrolü NOT RUN. Çalıştırılan sayı benzersiz nihai senaryo sayısıdır; tekrar koşular ve ilk 38-test baseline ayrıca toplama eklenmez.

## Teknik analiz

React 19 + TypeScript + Vite; FastAPI, Pydantic, python-dotenv ve Google Gen AI SDK. GET /health yapılandırma varlığını gösterir; anahtar geçerliliğini kanıtlamaz. POST /api/esdeger-ders/generate Türkçe girdi/çıktı sözleşmesi kullanır. frontend/backendAdapter yaş, erişim ve alanları dönüştürür. v1 baseline ile v2 kısıt/etik promptu ayrıdır. SDK JSON response_schema kullanır; backend üç yöntem, aynı kazanım ve süreyi doğrular. Malzeme ve içerik anlamını doğrulamaz.

Frontend form doğrulama, loading kilidi, requestId ile eski isteği eleme, AbortController ve 60 saniye sınırı içerir. Backend bekleme sınırı 45 saniyedir. Uygulama düzeyinde otomatik retry yok; kullanıcı yeniden gönderir. SDK kendi transport retry davranışı bu tur ayrı doğrulanmadı.

## Çalıştırma

Normal kurulum sonrası proje kökünden:
```powershell
powershell -File scripts/run-qa.ps1 -Python .venv/Scripts/python.exe
```
Ayrı komutlar:
```powershell
cd frontend
npm ci
npm test
npm run test:components
npm run build
cd ..
python -m pytest backend/tests -q --junitxml=docs/evidence/backend.xml
```
Bu ortamda npm komutu PATH üzerinde olmadığı için indirilen npm 11.6.2 CLI ve node ile kurulum yapıldı. Python 3.13.3 venv ensurepip erişim sorunu sonrası sistem pip'in --python seçeneğiyle çalışma alanındaki venv'e kuruldu. Önce ağ DNS hatası görüldü; izin verilen ağ erişimiyle tekrar denendi. Windows'ta requirements.lock içindeki uvloop taşınabilir değildir; requirements-dev.txt kullanıldı. Gerçek paket sürümleri evidence/python-freeze.txt ve frontend/package-lock.json içindedir.

## Kanıt ve kapsam

JUnit: evidence/frontend.xml, components.xml, backend.xml. Build: evidence/build.log. Çıkışlar: evidence/exits.json. İlk jsdom koşusundaki matchMedia eksikliği test ortamına aitti; mock eklendi, nihai bileşen sonuçları yeniden alındı. Ürün kodu düzeltilmedi; bu bir ürün retesti değildir. Mevcut pytest fixture dosyası açık UTF-8 okuma ile düzeltildi; aynı fixture testi ve mevcut başarılı API testi yeniden geçti. Toplam retest 1 (test altyapısı), ürün retesti 0. Mevcut testler son koşuda regresyon olarak yeniden çalıştırıldı.

Git durumu: kaynak ZIP ve çalışma klasörü .git içermiyor; git status/branch/rev-parse başarısız. Test edilen commit: DOĞRULANAMADI. Eski raporlardaki 09cab27 ve 2747013 bu ZIP'in doğrulanmış HEAD'i değildir. ZIP SHA256: D527FF0FF9CBAE5F97822D4E8ECF5EDB194772803678A54680BB46154A64F2B2. Dosya hash manifesti evidence/source-sha256.csv içindedir.

Geri bildirim revizyonunda aynı mevcut snapshot üzerinde testler tekrar çalıştırıldı. Önceki koşu evidence/previous-20261018 altında korunmuştur; bu tekrar ürün düzeltmesi sonrası retest değildir. Son ekip sürümü sağlanmadı; yeni commit eski koşuya atanmadı. Canlı HTTP denemesi evidence/feedback-live-smoke.json dosyasındadır: ilk denemede yerel backend erişilemedi. Ağ erişimi sağlandıktan sonra evidence/feedback-live-smoke-retry.json kaydında GET /health HTTP 200, model_configured=false doğrulandı; API anahtarı olmadığından üç üretim akışı BLOCKED. Bu ön kontrol 106 satırlık planın dışında ek test başarısı olarak sayılmadı.

Geçmiş raporlar korunmuştur; geçmiş canlı başarı/hatalar yeni koşuya dahil edilmedi. Canlı üretim, prompt injection dayanıklılığı ve öğretmen görüşü bu raporda onaylanmış sayılmaz. Ayrıntılı başarısızlıklar BUG_REPORT.md içindedir.
