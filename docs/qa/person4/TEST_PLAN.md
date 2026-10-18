# Kişi 4 test planı

18 Ekim 2026, Europe/Istanbul. Amaç: arşivdeki gerçek uygulamanın sözleşmesini, hata yönetimini, kullanıcı akışını ve Responsible AI kontrollerini kanıtla değerlendirmek. Önce README, backend app/schemas/prompts, frontend App/types/lib, mevcut yedi test dosyası, notebook ve önceki QA raporları incelendi. Önceki sonuçlar devralınmadı.

## Kapsam ve yöntem

- Mevcut Node test runner ve pytest korunur. React bileşen etkileşimleri için ayrı Vitest + jsdom eklenir; mevcut test komutu değişmez.
- Başlangıç regresyonu: 38 mevcut frontend testi. Son koşuda tüm mevcut backend/frontend testleri ve yeni testler birlikte çalışır.
- Backend sağlayıcısı dependency override + AsyncMock ile değiştirilir. SDK sözleşme testi HTTP MockTransport kullanır. Gerçek Gemini ağ çağrısı yoktur.
- Yeni kabul testleri kısıt ve girdi ihlallerini reddetme beklentisini açık assertion ile gösterir; mevcut ürün boşlukları FAIL kalır, xfail veya skip ile gizlenmez.
- JSON için SDK parsed=None, boş nesne ve metin; eksik alan, yöntem tekrarı, kazanım/süre uyuşmazlığı; ağ, yetki, kota, timeout ve yeniden gönderme sınanır.
- Prompt injection dört saldırı cümlesiyle sistem/kullanıcı mesaj sınırında sınanır. Mock cevap kural bağlılığını kanıtlamaz; canlı test satırları ayrı BLOCKED olur.
- İnsan değerlendirmesi gereken on pedagojik başlık Kişi 3'e devredilir. Kişi 4 yalnız teknik/sabit örnek incelemesi yapar.

## Girdi ve çıktı

Frontend: learning_objective metin, student_age pozitif tam sayı, duration_minutes_per_activity pozitif tam sayı, available_materials metin listesi; access.internet/screen/printer boolean. API bunları kazanim, yas_seviye metni, sure_dakika, malzemeler, erisim_kosullari metni ve prompt_version olarak alır.

Çıktı: tam üç etkinlik; reading/hands_on/oral; ad, hedef_kazanim, kullanilan_malzemeler, tahmini_sure_dakika, uygulama_adimlari, beklenen_ogrenci_davranisi. Ortak değerlendirme soru/cevap/ölçüt metinleri ve uygulanabilirlik_notu içerir. Metnin dolu olması doğruluğu anlamına gelmez.

## Ortam ve çalıştırma

Windows; Node 24.19.0; Python 3.13.3. Frontend npm lock ile; backend requirements-dev.txt ile ayrı venv'e kurulur. requirements.lock Linux uvloop girdisi içerdiğinden Windows kurulumu için birebir kullanılmadı; evidence/python-freeze.txt gerçek çözümü kaydeder. Komutlar TEST_RESULTS.md ve scripts/run-qa.ps1 içinde.

Test verisi sentetiktir. Öğrenci adı, özel belge, gerçek anahtar veya ham sağlayıcı hatası test çıktısına eklenmez. Ortam kaydı yalnız anahtar VAR/YOK bilgisini tutar.

## Çıkış ölçütü

Bütün koşular kaydedilir, FAIL açıklanır, BLOCKED/NOT RUN ayrılır; hiçbir FAIL başarı diye sunulmaz. Release önerisi: açık High bulgular giderilmeden ve Kişi 3 içerik incelemesi tamamlanmadan pedagojik doğruluk garantisi verilmemeli. Düzeltmeler backend için Kağan/Kişi 2, frontend için İlayda/Kişi 1 ile koordine edilmelidir. Bu tur ürün kodu değişmez; ürün retesti 0'dır. Kişi 5'e belge ve sunum devri yapılır.

## Geri bildirim revizyonu

Hata ve bağlı matris satırları aynı etki derecesini kullanır. Kişi 3 incelemesi ekip içi içerik değerlendirmesidir; dış uzman onayı ayrı kanıt ister. Yeni ürün düzeltmesi sağlandığında hedef vaka ve benzer regresyon ayrı kaydedilir (HEDEFLI_RETEST.csv). Son demo kazanım/malzeme/soru/anahtarı Kişi 3 ile incelenir. Canlı smoke kayıtları otomatik olarak pedagojik PASS üretmez.
