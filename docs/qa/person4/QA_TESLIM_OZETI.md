# EşdeğerDers — Kişi 4 QA teslimi

18 Ekim 2026. Sağlanan ZIP incelendi; uygulamanın üretim kodu değiştirilmedi. Testler gerçekten çalıştırıldı.

| Kapsam | Sonuç |
|---|---|
| Mevcut + yeni Node frontend testleri | 41 PASS / 1 FAIL |
| React/jsdom bileşen testleri | 6 PASS |
| Pytest backend testleri | 26 PASS / 7 FAIL |
| TypeScript + Vite üretim derlemesi | PASS |
| Canlı Gemini | 13 BLOCKED — anahtar yok |
| Uzman / gerçek tarayıcı | 11 NOT RUN |

**81 otomatik test: 73 geçti, 8 başarısız; derleme başarılı.**

Toplam 106 planlı kontrol; 82 çalıştırıldı: 74 PASS, 8 FAIL. Derleme dahil kontrol geçme oranı %90,24; model doğruluğu, öğrenme başarısı veya genel güvenilirlik oranı değildir. Yalnız otomatik testler: 81 test, 73 PASS, 8 FAIL; %90,12. Açık Critical 0; 3 High + 2 Medium açık hata; UTF-8 fixture okuma sorunu Low olarak düzeltildi, retest PASS. Retest 1; ürün düzeltmesi olmadığı için ürün retesti 0.

## Oluşturulan dosyalar

İstenen 10 dosyanın tamamı docs altında: TEST_PLAN.md, TEST_MATRIX.md, TEST_MATRIX.csv, TEST_RESULTS.md, ETHICAL_EVALUATION.md, BUG_REPORT.md, BUG_REPORT.csv, KNOWN_LIMITATIONS.md, PERSON5_HANDOFF.md, KISI4_KONUSMA_METNI.md.

Yeni testler: frontend/tests/person4.test.ts, frontend/qa/App.spec.tsx, backend/tests/test_person4.py. Vitest yapılandırması ve ayrı test:components komutu eklendi. Mevcut test_app.py fixture okuması açık UTF-8 ile düzeltildi. scripts/run-qa.ps1 koşuları, scripts/qa_report.py rapor/matris/bug üretimini tekrarlar. docs/evidence ham JUnit, log, ortam, paket sürümleri ve hash kayıtlarını içerir.

## Teknik ve etik bulgular

React/TypeScript/Vite arayüzü, FastAPI/Pydantic backend, Gemini SDK ve v1/v2 promptları incelendi. GET /health ve POST /api/esdeger-ders/generate uçları değerlendirildi. Şema üç yöntem, kazanım metni ve süreyi kontrol ediyor; malzeme/cihaz kısıtlarını ve cevap doğruluğunu garanti etmiyor. Beş açık bug: listede olmayan malzeme, yasak internet/ekran/yazıcı adımları, aşırı uzun kazanım, anlamsız yaş/seviye ve yanlış cevap anahtarı kabulü. Kontrollü mock sonuçları modelin bu hataları gerçekten ürettiği iddiası değildir.

Kişisel veri için ayrı alan yok; serbest metne eklenen bilgi Gemini'ye gidebilir. v2 injection savunması ve öğretmen denetimi olumlu; gerçek injection dayanıklılığı ve pedagojik eşdeğerlik henüz doğrulanmadı. Ayrıntılı Kişi 3 raporu sağlanmadı; PDF’de anılan iki konu ortak kayıtta EVIDENCE PENDING. Dış öğretmen/uzman değerlendirmesi yapılmadı.

## Yeniden çalıştırma

Önce frontend içinde npm ci; backend için venv ve requirements-dev.txt kurulumu. Normal komutlar:
```powershell
cd frontend
npm test
npm run test:components
npm run build
cd ..
python -m pytest backend/tests -q
```
Toplu koşu ve rapor: `powershell -File scripts/run-qa.ps1 -Python .venv/Scripts/python.exe`. Bilinen açık kabul hataları nedeniyle toplu komutun çıkış kodu 1 olması beklenir. Bu ortamda kullanılan doğrudan node CLI komutları scriptte, bağımlılık kurulum ayrıntıları TEST_RESULTS.md içindedir.

## Ekip ve GitHub

Kişi 2/Kağan: sunucu girdi/çıktı kontrolleri; Kişi 1/İlayda: girdi sınırları; Kişi 3: pedagojik ve matematiksel uzman incelemesi. Kişi 5 için doğrulanmış iddialar, demo sınırları ve Git adımları PERSON5_HANDOFF.md; 2–3 dakikalık Türkçe sunum KISI4_KONUSMA_METNI.md içinde.

ZIP .git içermiyor; test edilen commit doğrulanamadı. Kaynak ZIP SHA256 D527FF0FF9CBAE5F97822D4E8ECF5EDB194772803678A54680BB46154A64F2B2. Kaynak dosya hashleri kanıtta. Gerçek clone'da git status/branch/rev-parse ile durumu kaydedin, uygunsa qa/person4 dalı açın, yalnız değişen QA dosyalarını inceleyerek aktarın, testleri yeniden çalıştırıp gerçek hash'i rapora ekleyin. Push/merge yapılmadı; kullanıcı onayı olmadan yapılmamalı. .env, anahtar, node_modules ve venv teslim paketine eklenmedi.

## Geri bildirim revizyonu

Hata ve matris önemleri eşitlendi. Kişi 3 su döngüsü/yönler bildirimleri doğrulanmamış ayrı kayıtlar olarak eklendi; NOT RUN durumları değiştirilmedi. Canlı üretim/malzeme azaltma/gerçek hata sonrası yeniden deneme için scripts/live_smoke.py ve docs/SON_DEMO_KONTROLU.md eklendi. Yerel HTTP denemesi backend erişimi olmadığı için BLOCKED; anahtar ve son ekip sürümü sağlanmadı. Ürün düzeltmesi sonrası retest yapılmadı. docs/HEDEFLI_RETEST.csv vaka + benzer regresyon girdilerini ayrı tutar. Önceki koşu korundu; mevcut snapshot testleri yeniden çalıştırıldı. Kopyalanacak dosyalar DEGISIKLIKLER.md listesine göre seçilmelidir.

Son ön kontrol: ağ erişimi sonrası yerel backend başlatıldı. GET /health HTTP 200, model_configured=false; anahtar yokluğu doğrulandı. Kanıt: docs/evidence/feedback-live-smoke-retry.json (docs içinden evidence/feedback-live-smoke-retry.json). Canlı üretim, azaltma ve gerçek hata sonrası retry BLOCKED; Gemini çağrısı yapılmadı. Önceki erişim hatası kaydı korunmuştur.
