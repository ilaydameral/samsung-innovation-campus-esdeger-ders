# EşdeğerDers

Öğretmenin belirttiği kazanım ve sınıf koşullarından aynı hedefi koruyan üç etkinlik, ortak değerlendirme sorusu ve cevap anahtarı hazırlayan hackathon projesi.

## Mevcut durum

İlayda’nın React + TypeScript + Vite frontend’i ile Kağan’ın FastAPI + Gemini backend’i aynı projede birleştirildi. Frontend, backend’in Türkçe JSON alanlarını ekran veri yapısına dönüştürür. Varsayılan mod kayıtlı örnek veridir. Gerçek model üretimi için backend ortamında GEMINI_API_KEY gerekir; anahtar yoksa sunucu sağlık kontrolünü açar, üretim isteğine açık yapılandırma hatası döner. Canlı model başarısı henüz doğrulanmadı.

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

## Öğretmen çalışma alanı

Sol menü genel bakış, atölye, sonuçtan sonra açılan ortak değerlendirme, örnek senaryo, yöntem rehberi ve bağlantı ayarlarına erişir. Mobilde açılır menü kullanılır. Etkinlik yöntemleri sonuç ekranında filtrelenebilir. Özet kartları formdaki durumu yansıtır; yapay kullanım istatistiği gösterilmez.

Bu sürüm üyeliksizdir. Authentication (kimlik doğrulama), authorization (erişim yetkisi), hesap kaydı ve kullanıcıya özel kalıcı veri bulunmaz. Giriş ekranı eklemek sunucuda yetki kontrolünün yerine geçmez. İleride hesap veya özel veri ihtiyacı olursa backend ile birlikte gerçek erişim denetimi tasarlanır.

## Arayüz akışı

1. Kazanım, yaş, etkinlik başına süre, malzeme ve erişim koşullarını girin.
2. “Örnek senaryoyu yükle” kayıtlı 3/4 girdisini forma ekler.
3. Örnek etkinlikleri göster düğmesi üç etkinliği açar. Başka girdiler örnek modunda reddedilir; sabit cevap farklı kazanıma aitmiş gibi gösterilmez.
4. Ortak değerlendirmeyi ve öğretmen için açılan cevap anahtarını inceleyin.
5. Bir girdiyi veya modu değiştirince önceki çıktı kaldırılır.

## Backend’i çalıştırma ve entegrasyon

Python 3.12 önerilir. Proje kökünde ayrı terminal açın:

```sh
python3.12 -m venv .venv
.venv/bin/python -m pip install -r backend/requirements.lock
cp .env.example .env
```

`.env` zaten varsa kopyalama adımını atlayın. GEMINI_API_KEY değerini yalnız bu yerel dosyaya ekleyin; anahtarı sohbete veya repoya göndermeyin. GEMINI_MODEL varsayılanı `gemini-3.8-flash`; erişim hesabınıza bağlıdır.

```sh
.venv/bin/python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

`.env` değişince backend’i durdurup yeniden başlatın. API dokümanı http://127.0.0.1:8000/docs, sağlık kontrolü http://127.0.0.1:8000/health. Sağlık yanıtındaki `model_configured`, anahtarın mevcut olduğunu söyler; geçerli olduğunu veya kotayı doğrulamaz.

Frontend varsayılan olarak bu adrese `POST /api/esdeger-ders/generate` gönderir. Farklı adres için `frontend/.env.example` dosyasını `frontend/.env.local` olarak kopyalayıp VITE_API_BASE_URL ayarlayın, sonra Vite’ı yeniden başlatın. Sağ üst menüden **Canlı API** seçin; mod seçimi tek başına bağlantı testi değildir.

`sure_dakika`, her alternatif etkinlik için ayrı üst sınırdır; toplam ders süresine bölünmez. `yontem` kodları reading, hands_on, oral’dır. API’nin Türkçe alanları `frontend/src/lib/backendAdapter.ts` içinde mevcut ekranlara eşlenir. Yaştan sınıf seviyesi uydurulmaz. Her etkinliğin kazanımı ve süresi ayrıca doğrulanır. Kaynakların anlamsal uygunluğu öğretmen incelemesi gerektirir.

CORS varsayılanı localhost ve 127.0.0.1 için 5173 portudur; farklı frontend origin’i CORS_ORIGINS ortam değişkeniyle ekleyin. API hatasında örnek yanıta sessiz geçiş yoktur. Backend model isteğine 45 saniye sınır koyar; frontend 60 saniye bekler. İptal/timeout sağlayıcıdaki işlemin veya ücretin kesin durduğunu garanti etmez.

```sh
.venv/bin/python -m pytest backend/tests -q
```

Backend testleri gerçek Gemini yerine test sağlayıcısı kullanır. Paylaşılan sabit JSON hem backend hem frontend sözleşme testlerinde kullanılır; model üretimi veya sınıf başarısı kanıtı değildir. Notebook entegrasyon örneklerini gösterir; uygulamayı başlatmak için notebook çalıştırmanız gerekmez.

SDK ve model belgeleri: [Google Gen AI SDK](https://googleapis.github.io/python-genai/), [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash).

## Dosyalar ve sorumluluklar

- `frontend/src/App.tsx`: form, arayüz durumları, etkinlikler ve değerlendirme.
- `frontend/src/styles.css`: masaüstü ve mobil görünüm.
- `frontend/src/types.ts`: frontend veri tipleri.
- `frontend/src/lib/api.ts`: örnek veri ve gerçek API istemcisi.
- `frontend/src/lib/backendAdapter.ts`: Türkçe backend sözleşmesi ve ekran tipleri arasında eşleştirme.
- `backend/`: FastAPI uygulaması, Gemini istemcisi, promptlar ve şemalar.
- `backend/tests/`: test sağlayıcısıyla backend kontrolleri ve paylaşılan yanıt örneği.
- `frontend/src/lib/validation.ts`: girdi ve gelen yanıtın yapısal kontrolleri.
- `frontend/src/data/`: mevcut JSON taslağının örnekleri.
- `frontend/tests/`: sözleşmeyi bozan yanıtlar için kontroller.
- `docs/contracts/`: ilk frontend sözleşme taslağı; mevcut wire sözleşmesi için `docs/BACKEND_ENTEGRASYON.md` kullanın.
- `docs/ENTEGRASYON_1700.md`: toplantı ve birleştirme kontrol listesi.

## Eğitim ve etik

Ana bağ SDG 4’tür. Kaynak kısıtlarında aynı kazanımı koruma hedeflenir; öğrenme veya eşitsizlikte azalma henüz ölçülmedi. Etkinlikler ve cevaplar öğretmen incelemesi gerektirir. Öğrenci adı, tanı veya özel belge toplanmaz. Şema ve süre kontrolü, adımlardaki bütün malzeme hatalarını ya da pedagojik yanlışları tespit etmez.

## Teslim hazırlığı

Hackathon planına göre kod/prompt/README içeren GitHub reposu, repoda 1–2 sayfalık PDF rapor, İngilizce sunum ve yaklaşık beş dakikalık İngilizce sunum + canlı demo videosu hazırlanacak. Bu frontend klasörü bunların tamamının hazır olduğu anlamına gelmez. Teknik akış birleştirildikten sonra test sonuçları ve promptlar gerçek kayıtlardan eklenecek.

GitHub reposu: https://github.com/ilaydameral/samsung-innovation-campus-esdeger-ders — başlangıç erişimi özel. İlk çalışma dalı `codex/frontend`.

GitHub’a yalnız bu `esdeger-ders` proje klasörü aktarılır. Üst çalışma alanındaki sohbet araştırmaları, geçici dosyalar veya kişisel kayıtlar topluca eklenmemeli. Lisans ekipçe seçilmedi. Açık bir repo yayın izni otomatik kod lisansı oluşturmaz.

## Geliştirme belgeleri

- [React ile uygulama kurma](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite başlangıç kılavuzu](https://vite.dev/guide/)

Tasarım fontları çevrim içi yüklenir; erişilemezse sistem sans-serif fontlarına düşer. Öğrencinin internet erişimi seçeneği, sınıf etkinliklerinin gereksinimidir; AI uygulamasının internet olmadan üretim yapacağı anlamına gelmez.
