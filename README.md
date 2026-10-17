# EşdeğerDers

Öğretmenin belirttiği kazanım ve sınıf koşullarından aynı hedefi koruyan üç etkinlik, ortak değerlendirme sorusu ve cevap anahtarı hazırlayan hackathon projesi.

## Mevcut durum

İlayda’nın frontend’i React + TypeScript + Vite ile hazırlanıyor. Kağan’ın Python + FastAPI backend’i ve Gemini bağlantısı bu klasöre henüz eklenmedi. Varsayılan mod kayıtlı örnek veridir; gerçek AI üretimi gibi gösterilmez. Frontend gerçek backend’e bağlanacak istemciyi de içerir.

## Çalıştırma

Node.js 22.12 veya üstü kullanın. Terminalde bu klasörü açıp:

```sh
cd frontend
npm ci
npm run dev
```

Yerel adres: http://127.0.0.1:5173

Bağımlılıklar kurulduktan sonra sonraki açılışlar için `npm run dev` yeterlidir.

```sh
npm run test
npm run build
```

`npm run build` TypeScript kontrolü ve üretim derlemesini çalıştırır. Testler şema/girdi kontrolleridir; öğrenme, pedagojik doğruluk veya canlı model başarısı testi değildir.

## Arayüz akışı

1. Kazanım, yaş, etkinlik başına süre, malzeme ve erişim koşullarını girin.
2. “Örnek senaryoyu yükle” kayıtlı 3/4 girdisini forma ekler.
3. Örnek etkinlikleri göster düğmesi üç etkinliği açar. Başka girdiler örnek modunda reddedilir; sabit cevap farklı kazanıma aitmiş gibi gösterilmez.
4. Ortak değerlendirmeyi ve öğretmen için açılan cevap anahtarını inceleyin.
5. Bir girdiyi veya modu değiştirince önceki çıktı kaldırılır.

## Kağan ile entegrasyon

1. `docs/contracts/` altındaki istek ve yanıt alanlarını birlikte kesinleştirin.
2. FastAPI’de `POST /api/generate-activities` endpoint’i aynı alanlarla yanıt vermeli.
3. Frontend’de `.env.example` dosyasını `.env.local` olarak kopyalayıp yalnız backend adresini ayarlayın:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

4. Ortam ayarı değişince Vite’ı yeniden başlatın.
5. Sağ üstteki bağlantı menüsünden **Canlı API** seçin. Bu seçim bağlantı testi değildir; gerçek üretim isteği backend’i sınar.
6. Backend’in CORS ayarında frontend’in gerçek origin’ine izin verin (örn. `http://127.0.0.1:5173`; `localhost` kullanılıyorsa o origin de ayrıca).

Gemini API anahtarı yalnız backend’de tutulur. `VITE_` ile başlayan ayarlar tarayıcıya açıktır; bu alanlara gizli anahtar yazmayın. API hatasında örnek yanıta sessiz geçiş yoktur. İstemci 60 saniye sonra beklemeyi bırakır; bu, sunucuda başlamış model çağrısını veya maliyeti kesin olarak durdurmaz.

## Dosyalar ve sorumluluklar

- `frontend/src/App.tsx`: form, arayüz durumları, etkinlikler ve değerlendirme.
- `frontend/src/styles.css`: masaüstü ve mobil görünüm.
- `frontend/src/types.ts`: frontend veri tipleri.
- `frontend/src/lib/api.ts`: örnek veri ve gerçek API istemcisi.
- `frontend/src/lib/validation.ts`: girdi ve gelen yanıtın yapısal kontrolleri.
- `frontend/src/data/`: mevcut JSON taslağının örnekleri.
- `frontend/tests/`: sözleşmeyi bozan yanıtlar için kontroller.
- `docs/contracts/`: Kağan’a iletilecek anlaşma ve örnekler.
- `docs/ENTEGRASYON_1700.md`: toplantı ve birleştirme kontrol listesi.

## Eğitim ve etik

Ana bağ SDG 4’tür. Kaynak kısıtlarında aynı kazanımı koruma hedeflenir; öğrenme veya eşitsizlikte azalma henüz ölçülmedi. Etkinlikler ve cevaplar öğretmen incelemesi gerektirir. Öğrenci adı, tanı veya özel belge toplanmaz. Şema ve süre kontrolü, adımlardaki bütün malzeme hatalarını ya da pedagojik yanlışları tespit etmez.

## Teslim hazırlığı

Hackathon planına göre kod/prompt/README içeren GitHub reposu, repoda 1–2 sayfalık PDF rapor, İngilizce sunum ve yaklaşık beş dakikalık İngilizce sunum + canlı demo videosu hazırlanacak. Bu frontend klasörü bunların tamamının hazır olduğu anlamına gelmez. Teknik akış birleştirildikten sonra test sonuçları ve promptlar gerçek kayıtlardan eklenecek.

GitHub reposu: https://github.com/ilaydameral/esdeger-ders — başlangıç erişimi özel. İlk çalışma dalı `codex/frontend`.

GitHub’a yalnız bu `esdeger-ders` proje klasörü aktarılır. Üst çalışma alanındaki sohbet araştırmaları, geçici dosyalar veya kişisel kayıtlar topluca eklenmemeli. Lisans ekipçe seçilmedi. Açık bir repo yayın izni otomatik kod lisansı oluşturmaz.

## Geliştirme belgeleri

- [React ile uygulama kurma](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite başlangıç kılavuzu](https://vite.dev/guide/)

Tasarım fontları çevrim içi yüklenir; erişilemezse sistem sans-serif fontlarına düşer. Öğrencinin internet erişimi seçeneği, sınıf etkinliklerinin gereksinimidir; AI uygulamasının internet olmadan üretim yapacağı anlamına gelmez.
