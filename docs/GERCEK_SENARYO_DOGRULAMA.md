# Tek ders senaryosunu gerçekten çözme

## Ürün vaadi
Öğretmenin belirttiği kazanım ve sınıf olanaklarıyla uygulanabilir etkinlik hazırlamasını desteklemek. Üç yöntem alternatiftir; eşit öğrenme etkisi gösterilmiş değildir.

## İlk uygulama senaryosu
9 yaş, etkinlik başına en fazla 10 dakika. Kazanım: dört eş parçadan üçünü 3/4 olarak temsil etme. Malzemeler: 1 kâğıt, 1 kalem, 8 aynı boy taş. Sınıfta internet, ekran ve yazıcı yok. Öğretmen hazırlık sırasında bağlantıya erişebiliyor.

Akış: koşulları gir → canlı model yanıtını al → kaynak taramasını incele → bir yöntem seç → kazanım, uygulama ve cevap anahtarını öğretmen olarak kontrol et → gerekirse koşulları değiştirip yeniden üret → uygun planı sınıfa götür. Sistem içeriği otomatik düzeltmez; açıklama gerekirse manuel inceleme yapılır.

## Bu sürümdeki fark
Kaynak taraması, yanıtın malzeme listesini girdiyle karşılaştırır; miktarları silmez. Kapalı internet/ekran/yazıcı olanaklarına ait bazı sözcüklerin geçtiği ifadeleri gösterir. Bu sözcük taramasıdır: eş anlamlıları, örtük ihtiyaçları veya cümlelerin anlamını tam çözmez. İşaret çıkmaması uygunluk onayı değildir. Öğretmenin seçtiği yöntem için üç inceleme kutusu vardır; pedagojik doğruluk ve yaş uygunluğu öğretmen değerlendirmesidir.

## Canlı entegrasyonda yapılacak denemeler — henüz yapılmadı
| Deneme | Gözlenecek kanıt |
|---|---|
| Yukarıdaki temel senaryo | Üç yöntemin gerçek yanıtı; yeterli malzeme ve süre; öğretmen değerlendirmesi |
| Aynı kazanım, taşları kaldır | Yeni yanıtta taş ihtiyacı kalkıyor mu? Devam ederse tarama/öğretmen yakalıyor mu? |
| Farklı kazanım: suyun katı, sıvı ve gaz hâllerine günlük örnekler verme | Örnek kesir içeriği tekrar edilmeden yeni hedefe uygun yanıt geliyor mu? Güvensiz deney öneriliyor mu? |
| Süreyi 2 dakikaya indir | Uygulanabilir plan veya açık yetersizlik yanıtı; gerçekçi olmayan süre varsa öğretmen kaydı |
| Backend kapalı | Açık bağlantı hatası; örnek veriye gizli dönüş olmaması |

Her denemede tarih, commit, girdi, model sürümü (backendden), ham yanıt, gecikme, öğretmen yorumu ve sonuç kaydedilir. Anahtar veya öğrenci kişisel bilgisi kaydedilmez. Başarısız yanıtlar da tutulur.

## Faydayı sınama
Bir öğretmene aynı senaryoyu önce normal yöntemiyle, sonra uygulamayla hazırlatın. Hazırlık süresini, gerekli düzeltme sayısını ve “yarın sınıfta uygular mısınız, neden?” yanıtını kaydedin. Tek kişi ve sıra etkisi nedeniyle bunu genel başarı iddiası yapmayın; ilk kullanılabilirlik sinyali olarak sunun. Genel amaçlı Gemini ile kıyaslanacaksa aynı girdi ve koşullar kullanılmalı; iyi/kötü çıktılar seçilerek gösterilmemeli.

## Kanıtın sınırı
Yerel birim testleri yazılımın kaynak taraması ve inceleme durumunu kontrol eder. Bunlar model başarısı, öğretmen görüşmesi veya öğrenme etkisi ölçümü değildir. Canlı backend entegrasyonu ve gerçek kullanıcı incelemesi beklenmektedir.
