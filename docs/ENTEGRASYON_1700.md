> Güncel entegrasyon: Kağan’ın backend’i birleştirildi. Aşağıdaki önceki durum notlarının yerine mevcut bağlantı için [BACKEND_ENTEGRASYON.md](BACKEND_ENTEGRASYON.md) ve kök README kullanılmalıdır.

# 17 Ekim 17.00 entegrasyon görüşmesi

## İlk netleştirilecek görev sınırı

İlayda frontend’i; Kağan FastAPI endpoint’i, Gemini bağlantısı ve promptu yürütür. Gerçek akışı birleştirme ve bağlantı sorunları ortak ele alınır. Kağan ile bu dağılım teyit edilmeli; önceki konuşmadaki backend ifadesi belirsizdi.

## Görüşmeye hazır malzemeler

- React + TypeScript + Vite arayüzü ve yerel çalıştırma adımları.
- `docs/contracts/` altında istek, başarılı yanıt ve hata örnekleri.
- Ayrı örnek veri/canlı API seçimi; gerçek istemci hazır, anahtar içermez.
- Form, yaş, süre, malzeme ve erişim alanları; üç yöntem, ortak soru ve cevap anahtarı.

## Birlikte karar verilecek noktalar

1. Endpoint `POST /api/generate-activities` uygun mu?
2. Süre **etkinlik başına üst sınır** mı? Taslak şu an böyle.
3. Başarılı yanıt doğrudan JSON nesnesi mi? Ek `data` sarmalayıcısı yok.
4. Yöntemler `reading`, `hands_on`, `oral`; kimlikler benzersiz mi?
5. HTTP hataları ortak `error` biçimine dönüyor mu? FastAPI varsayılan 422 biçimi farklı olabilir.
6. Backend yerel adresi, origin/CORS izinleri ve model bekleme süresi nedir?
7. Gerçek Gemini çağrısı ve kota Kağan’ın ortamında doğrulandı mı?

## Sırayla gerçek deneme

- Backend’i başlat; frontend adresini CORS’a ekle.
- Frontend `.env.local` dosyasına backend adresini yaz; Vite’ı yeniden başlat.
- Canlı API moduna geç; örnek girdiyi gönder.
- Üç yöntemi, ortak soruyu, doğru cevabı ve notları kontrol et.
- Kazanım, süre ve malzemeyi değiştirip yeni yanıt al. Önceki sonucun temizlendiğini gör.
- Boş kazanım, eksik alan, kısa süre ve kapalı backend senaryolarını dene.
- Aynı sürümde test kaydı tut. Kayıtlı örnekler canlı model başarısı diye raporlanmaz.

## Repo adımı

İlk frontend sürümü için özel repo oluşturuldu: https://github.com/ilaydameral/samsung-innovation-campus-esdeger-ders. İlk dal `codex/frontend`. Aynı kökte `frontend/`, Kağan’ın ekleyeceği `backend/`, `docs/`, daha sonra prompt/test dosyaları bulunabilir. Kağan’ın collaborator erişimi ve olası görünürlük değişikliği henüz yapılmadı. Anahtar, `.env.local`, `node_modules` ve üst çalışma alanının kişisel dosyaları paylaşılmamalı.
