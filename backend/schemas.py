from typing import List, Optional
from pydantic import BaseModel, Field

# --- Frontend'den Gelecek İstek ---
class EsdegerDersRequest(BaseModel):
    kazanim: str = Field(..., example="4 eş parçadan 3'ünü 3/4 olarak temsil eder.")
    yas_seviye: str = Field(..., example="9 yaş / 3. Sınıf")
    malzemeler: List[str] = Field(..., example=["1 adet kâğıt", "1 kurşun kalem", "8 adet aynı boy taş"])
    sure_dakika: int = Field(..., gt=0, example=30, description="Ders süresi (dakika)")
    erisim_kosullari: str = Field(..., example="İnternet yok, ekran yok, yazıcı yok, makas yok.")
    prompt_version: Optional[str] = Field(default="v2", description="'v1' (baseline) veya 'v2' (gelismis)")

# --- Etkinlik Alanları ---
class Activity(BaseModel):
    ad: str = Field(..., description="Etkinliğin kısa başlığı")
    yontem: str = Field(..., description="Kısa okuma / Somut malzeme / Sözlü etkileşim")
    hedef_kazanim: str = Field(..., description="Korunan ana kazanım")
    kullanilan_malzemeler: List[str] = Field(..., description="SADECE verilen listeden seçilen malzemeler")
    tahmini_sure_dakika: int = Field(..., description="Etkinlik süresi")
    uygulama_adimlari: List[str] = Field(..., description="Öğretmenin adım adım yönergeleri")
    beklenen_ogrenci_davranisi: str = Field(..., description="Öğrencinin yapacağı eylem/çıktı")

# --- Ortak Değerlendirme ---
class Assessment(BaseModel):
    ortak_soru: str = Field(..., description="3 etkinliğin de hedefini sınayan ortak değerlendirme sorusu")
    dogru_cevap: str = Field(..., description="Doğru kabul edilen yanıt")
    degerlendirme_olcutu_ve_gerekce: str = Field(..., description="Öğretmenin puanlarken/bakarken kullanacağı ölçüt")

# --- Frontend'e Dönecek Nihai Çıktı ---
class EsdegerDersResponse(BaseModel):
    prompt_version_used: str
    uygulanabilirlik_notu: str = Field(..., description="Kısıtlar veya eksiklikler hakkında öğretmen kontrol uyarısı")
    etkinlikler: List[Activity] = Field(..., min_length=3, max_length=3, description="Tam olarak 3 etkinlik")
    degerlendirme: Assessment