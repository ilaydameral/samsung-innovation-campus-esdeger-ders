# EşdeğerDers frontend ve backend anlaşma taslağı

Bu taslak Kağan ile ortaklaştırılmak üzere hazırlanmıştır. Çalışan bir endpoint veya tamamlanmış backend değildir. JSON örnekleri arayüz geliştirme verisidir; model performansı veya eğitimsel doğrulama sonucu değildir.

## Görev sınırı

- İlayda: React, TypeScript ve Vite ile form, etkinlik kartları, değerlendirme, yükleniyor ve hata ekranları; frontend isteği ve yanıtı gösterme.
- Kağan için önerilen sorumluluk: Python ve FastAPI endpoint’i, Gemini bağlantısı, prompt, çıktı doğrulaması ve backend hataları.
- Ortak iş: alanları kesinleştirme, yerel bağlantıyı kurma ve gerçek uçtan uca deneme. Bu görev sınırı Kağan’la açıkça teyit edilmelidir; konuşmadaki backend ifadesi belirsizdir.

## Önerilen bağlantı

`POST /api/generate-activities`

İstek ve yanıt `application/json` biçimindedir. Başarılı sonuç için HTTP 200 önerilir. Yerel backend adresi ve frontend adresi ayrıca kararlaştırılır; frontend izinleri backend’de tanımlanır. Model API anahtarı backend’de tutulur, frontend’e veya GitHub’a yazılmaz.

## İstek

`request.example.json` ortak form yapısını gösterir. Kazanım boş olmayan metin, yaş pozitif tam sayı, etkinlik başına süre pozitif tam sayı, malzemeler metin listesi, erişim alanları boolean olur. Kullanıcı malzeme olmadığını belirtmek için boş liste gönderebilir. İnternet/ekran/yazıcı alanları öğrencinin etkinlik koşullarıdır; uygulamanın sunucusunun model bağlantısıyla karıştırılmaz.

Süre bu taslakta **etkinlik başına üst sınır** olarak tanımlanmıştır. Toplam süre isteniyorsa alan adı ve kurallar iki tarafta birlikte değiştirilmelidir.

## Başarılı yanıt

`response.example.json` şu zorunlu alanları içerir:

- `learning_objective`: kullanıcının kazanımı.
- `activities`: uygulanabilir başarılı sonuçta tam üç etkinlik.
- Her etkinlik: benzersiz `id`, `method`, `title`, pozitif `duration_minutes`, `materials_used` listesi, boş olmayan `steps` listesi ve `expected_student_behavior`.
- `method`: `reading`, `hands_on` veya `oral`; her yöntem bir kez yer alır. Arayüz bunları Kısa metin, Somut malzeme ve Sözlü etkileşim olarak gösterir.
- `common_assessment`: `question`, `expected_answer`, `evaluation_criteria` listesi.
- `teacher_notes`: boş olabilen metin listesi. Uyarılar sonucun eğitimsel doğruluğunu garanti etmez.

Tüm yanıt düz JSON nesnesidir. Markdown kod çiti veya başında/sonunda ek model açıklaması frontend’e taşınmaz. Başarılı yanıt alanları `null` olmaz. Malzemesiz etkinlikte `materials_used` boş listedir. Her etkinliğin süresi istek sınırını aşmaz; mevcut olmayan malzeme ve erişim olanağı adımlarda da kullanılmaz. Bu içerik kontrollerini yalnız alanların varlığını denetlemek karşılamaz.

## Hata yanıtı

`error.example.json` ortak hata biçimini gösterir. Bütün hatalarda `error.code`, kullanıcıya gösterilebilir `error.message` ve liste biçiminde `error.field_errors` bulunur. Alan hatası yoksa liste boş olur. Sağlayıcının ham hata metni veya gizli bilgi kullanıcıya gönderilmez.

Önerilen HTTP durumları ve kodlar:

| HTTP | Kod | Kullanım |
|---|---|---|
| 422 | VALIDATION_ERROR | Eksik veya geçersiz form alanı |
| 422 | CONSTRAINTS_UNSATISFIABLE | Belirtilen koşullarda üç yöntem uygun biçimde üretilemiyor |
| 502 | MODEL_OUTPUT_INVALID | Üretilen yanıt ortak biçimi veya zorunlu kontrolleri karşılamıyor |
| 503 | MODEL_UNAVAILABLE | Model hizmeti veya erişimi kullanılamıyor |
| 504 | MODEL_TIMEOUT | Model isteği zamanında tamamlanmıyor |

FastAPI’nin varsayılan hata yapısı farklı olabilir; backend bu ortak biçime dönüştürmeli veya frontend ile farklı biçim üzerinde açıkça anlaşılmalıdır. Başarısızlıkta örnek veriler sessizce gerçek yanıt yerine geçirilmez. Öğretmen görünümünde temsili veri kullanılıyorsa açıkça etiketlenir.

## İlk birleştirme kontrolü

1. Frontend örnek yanıtı tam gösterir.
2. Form örnek isteği alan adlarını değiştirmeden oluşturur.
3. Backend aynı yapıda gerçek yanıt döndürür.
4. Eksik kazanım, bağlantı hatası ve uygulanamaz kısıt anlaşılır görünür.
5. Yeni girişte eski sonuç yeni üretim gibi sunulmaz; tekrar üretme çalışır.

## Kağan’a gönderilebilecek mesaj

Ben React + TypeScript + Vite ile frontend’i hazırlayayım; FastAPI endpoint’i, Gemini bağlantısı ve prompt tarafı sende diye anladım. “Backend’de istediğin gibi ilerleyebilirsin” mesajından emin olamadım, görevler karışmasın diye netleştirmek istedim. JSON örneklerini de hazırladım; uygunsa aynı alanlarla ilerleyelim, ben örnek verilerle ekranları kurayım. Gerçek API bağlantısını birlikte test ederiz.
