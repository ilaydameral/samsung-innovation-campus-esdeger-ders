from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

class TextModel(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, str_min_length=1)

class EsdegerDersRequest(TextModel):
    kazanim: str
    yas_seviye: str
    malzemeler: list[str]
    sure_dakika: int = Field(gt=0, strict=True, description="Her bir alternatif etkinlik için dakika üst sınırı; toplam ders süresi değildir.")
    erisim_kosullari: str
    prompt_version: Literal['v1', 'v2'] = 'v2'

class Activity(TextModel):
    ad: str
    yontem: Literal['reading', 'hands_on', 'oral']
    hedef_kazanim: str
    kullanilan_malzemeler: list[str]
    tahmini_sure_dakika: int = Field(ge=1, strict=True)
    uygulama_adimlari: list[str] = Field(min_length=1)
    beklenen_ogrenci_davranisi: str

class Assessment(TextModel):
    ortak_soru: str
    dogru_cevap: str
    degerlendirme_olcutu_ve_gerekce: str

class EsdegerDersResponse(TextModel):
    prompt_version_used: Literal['v1', 'v2']
    uygulanabilirlik_notu: str
    etkinlikler: list[Activity] = Field(min_length=3, max_length=3)
    degerlendirme: Assessment

    @model_validator(mode='after')
    def distinct_methods(self):
        if {item.yontem for item in self.etkinlikler} != {'reading', 'hands_on', 'oral'}:
            raise ValueError('Her yöntemden bir etkinlik gerekli.')
        return self
