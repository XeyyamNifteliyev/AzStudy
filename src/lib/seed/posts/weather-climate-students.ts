import type { LocalizedString } from "@/types";

/**
 * Deep-content override for `azerbaijan-weather-climate-students` (b-12).
 * Fully localized in all 18 locales so no blog locale falls below the
 * 200-char thin-content threshold (which would trigger noindex).
 */
export const postWeatherClimateStudents: {
  excerpt: LocalizedString;
  content: LocalizedString;
} = {
  excerpt: {
    en: "A complete guide to Azerbaijan's diverse climate zones — from Baku's mild winters to the Caucasus mountains.",
    tr: "Azerbaycan'in farkli iklim bolgeleri hakkinda tam rehber.",
    az: "Azerbaycanin mxtelif iqlim zonlari haqqinda tam rehber.",
    ru: "Polnoe rukovodstvo po klimaticheskim zonam Azerbaydzhana.",
    de: "Was Studierende über das Wetter und Klima in Aserbaidschan wissen müssen.",
    fr: "Ce que les étudiants doivent savoir sur la météo et le climat en Azerbaïdjan.",
    fa: "آنچه دانشجویان باید درباره آب و هوای آذربایجان بدانند.",
    ar: "ما يجب على الطلاب معرفته عن الطقس والمناخ في أذربيجان.",
    tk: "Azerbaýjanda howa we iýlim hakda ögransi bilmen gerek.",
    kk: "Студенттер Азербайжанның ауа-райы мен климаты туралы не білуі керек.",
    ky: "Студенттер Азербайжандын аба ырайы жана климаты жөнүндө эмне билиши керек.",
    zh: "学生需要了解的阿塞拜疆天气和气候信息。",
    bg: "Какво трябва да знаят студентите за времето и климата в Азербайджан.",
    ur: "طالب علموں کو آذربائیجان کے موسم کے بارے میں کیا معلوم ہونا چاہیے۔",
    uz: "Talabalar Ozarbayjon ob-havosi va iqlimi haqida nima bilmalari kerak.",
    sw: "Wanafunzi wajue kuhusu hali ya hewa na tabianchi ya Azerbaijan.",
    so: "Waxa ay Ardaydu U Baahan Yihiin Inay Ka Ogaadaan Cimilada Azerbaijan.",
    id: "Yang perlu diketahui mahasiswa tentang cuaca dan iklim Azerbaijan.",
  },
  content: {
    en: `Azerbaijan has remarkably diverse climate zones despite its small size. The country ranges from subtropical coasts to alpine peaks, offering students a variety of weather experiences throughout the year.

## Climate Zones

### 1. Absheron Peninsula (Baku)
- Semi-arid climate
- Mild, windy winters (2-6°C)
- Warm, dry summers (25-30°C)
- Annual rainfall: 200-300mm

### 2. Central Lowlands
- Continental climate
- Cold winters (-5 to 0°C)
- Hot summers (28-35°C)
- Annual rainfall: 300-500mm

### 3. Greater Caucasus Mountains
- Alpine climate
- Heavy snowfall in winter
- Cool summers (15-20°C)
- Annual rainfall: 1,000-1,500mm

### 4. Southern Coast (Lankaran)
- Subtropical climate
- Mild winters (3-8°C)
- Warm, humid summers (24-28°C)
- Annual rainfall: 1,200-1,700mm

## Monthly Weather in Baku

| Month | Avg High | Avg Low | Rainfall |
|-------|----------|---------|----------|
| Jan | 6°C | 2°C | 20mm |
| Feb | 6°C | 2°C | 20mm |
| Mar | 10°C | 5°C | 25mm |
| Apr | 16°C | 9°C | 30mm |
| May | 21°C | 14°C | 20mm |
| Jun | 26°C | 19°C | 10mm |
| Jul | 30°C | 23°C | 5mm |
| Aug | 29°C | 22°C | 5mm |
| Sep | 25°C | 18°C | 10mm |
| Oct | 19°C | 13°C | 25mm |
| Nov | 13°C | 8°C | 30mm |
| Dec | 8°C | 4°C | 25mm |

## What to Pack

### For Baku Students
- Light layers for spring/autumn
- Warm coat for winter
- Windbreaker (Baku is windy!)
- Comfortable walking shoes

### For Mountain Areas
- Hiking boots
- Waterproof jacket
- Thermal layers
- Sun protection

## Best Times to Travel

### Spring (March-May)
- Mild weather, cherry blossoms
- Great for sightseeing
- Novruz celebrations

### Summer (June-August)
- Warm, beach season
- Perfect for mountain hiking
- Long daylight hours

### Autumn (September-November)
- Comfortable temperatures
- Wine festivals
- Autumn foliage

### Winter (December-February)
- Skiing in Gabala
- Cozy cafes in Baku
- Indoor cultural activities`,
    tr: `Azerbaycan, küçük boyutuna rağmen dikkat çekici derecede çeşitli iklim bölgelerine sahiptir. Ülke, subtropikal kıyılardan alp zirvelerine kadar uzanır ve öğrencilere yıl boyunca çeşitli hava deneyimleri sunar.

## İklim Bölgeleri

### 1. Abşeron Yarımadası (Bakü)
- Yarı kurak iklim
- Ilıman, rüzgârlı kışlar (2-6°C)
- Sıcak, kurak yazlar (25-30°C)
- Yıllık yağış: 200-300 mm

### 2. Orta Ovalar
- Karasal iklim
- Soğuk kışlar (-5 ile 0°C)
- Sıcak yazlar (28-35°C)
- Yıllık yağış: 300-500 mm

### 3. Büyük Kafkas Dağları
- Alp iklimi
- Kışın yoğun kar yağışı
- Serin yazlar (15-20°C)
- Yıllık yağış: 1.000-1.500 mm

### 4. Güney Kıyısı (Lenkeran)
- Subtropikal iklim
- Ilıman kışlar (3-8°C)
- Sıcak, nemli yazlar (24-28°C)
- Yıllık yağış: 1.200-1.700 mm

## Bakü'de Aylık Hava Durumu

| Ay | Ort. En Yüksek | Ort. En Düşük | Yağış |
|-------|----------|---------|----------|
| Oca | 6°C | 2°C | 20 mm |
| Şub | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Nis | 16°C | 9°C | 30 mm |
| May | 21°C | 14°C | 20 mm |
| Haz | 26°C | 19°C | 10 mm |
| Tem | 30°C | 23°C | 5 mm |
| Ağu | 29°C | 22°C | 5 mm |
| Eyl | 25°C | 18°C | 10 mm |
| Eki | 19°C | 13°C | 25 mm |
| Kas | 13°C | 8°C | 30 mm |
| Ara | 8°C | 4°C | 25 mm |

## Neler Paketlenmeli

### Bakü'de Okuyanlar İçin
- İlkbahar/sonbahar için hafif katmanlar
- Kış için kalın palto
- Rüzgârlık (Bakü rüzgârlıdır!)
- Rahat yürüyüş ayakkabıları

### Dağlık Bölgeler İçin
- Yürüyüş botları
- Su geçirmez ceket
- Termal katmanlar
- Güneş koruması

## Seyahat İçin En İyi Zamanlar

### İlkbahar (Mart-Mayıs)
- Ilıman hava, kiraz çiçekleri
- Gezi için harika
- Novruz kutlamaları

### Yaz (Haziran-Ağustos)
- Sıcak, plaj sezonu
- Dağ yürüyüşleri için mükemmel
- Uzun gündüz saatleri

### Sonbahar (Eylül-Kasım)
- Konforlu sıcaklıklar
- Şarap festivalleri
- Sonbahar yaprakları

### Kış (Aralık-Şubat)
- Gabala'da kayak
- Bakü'de sıcak kafeler
- Kapalı mekân kültürel etkinlikleri`,
    az: `Azərbaycan kiçik ərazisinə baxmayaraq olduqca müxtəlif iqlim zonalarına malikdir. Ölkə subtropik sahillərdən alp zirvələrinə qədər uzanır və tələbələrə il boyu müxtəlif hava təcrübələri təqdim edir.

## İqlim Zonaları

### 1. Abşeron Yarımadası (Bakı)
- Yarı quraq iqlim
- Mülayim, küləkli qışlar (2-6°C)
- İsti, quru yaylar (25-30°C)
- İllik yağıntı: 200-300 mm

### 2. Mərkəzi Düzənliklər
- Kontinental iqlim
- Soyuq qışlar (-5 ilə 0°C)
- İsti yaylar (28-35°C)
- İllik yağıntı: 300-500 mm

### 3. Böyük Qafqaz Dağları
- Alp iqlimi
- Qışda güclü qar yağışı
- Sərin yaylar (15-20°C)
- İllik yağıntı: 1000-1500 mm

### 4. Cənub Sahili (Lənkəran)
- Subtropik iqlim
- Mülayim qışlar (3-8°C)
- İsti, rütubətli yaylar (24-28°C)
- İllik yağıntı: 1200-1700 mm

## Bakıda Aylıq Hava

| Ay | Ort. Maks | Ort. Min | Yağıntı |
|-------|----------|---------|----------|
| Yan | 6°C | 2°C | 20 mm |
| Fev | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Apr | 16°C | 9°C | 30 mm |
| May | 21°C | 14°C | 20 mm |
| İyn | 26°C | 19°C | 10 mm |
| İyl | 30°C | 23°C | 5 mm |
| Avq | 29°C | 22°C | 5 mm |
| Sen | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Noy | 13°C | 8°C | 30 mm |
| Dek | 8°C | 4°C | 25 mm |

## Nə Götürmək Lazımdır

### Bakıda Oxuyanlar Üçün
- Yaz/payız üçün yüngül geyimlər
- Qış üçün isti palto
- Küləkdən qoruyan gödəkçə (Bakı küləkli şəhərdir!)
- Rahat gəzinti ayaqqabısı

### Dağlıq Ərazilər Üçün
- Gəzinti çəkmələri
- Su keçirməyən gödəkçə
- Termal alt paltar
- Günəşdən qorunma

## Səyahət Üçün Ən Yaxşı Vaxtlar

### Yaz (Mart-May)
- Mülayim hava, albalı çiçəkləri
- Gəzinti üçün əla
- Novruz bayramı

### Yay (İyun-Avqust)
- İsti, çimərlik mövsümü
- Dağ gəzintiləri üçün mükəmməl
- Uzun gündüz saatları

### Payız (Sentyabr-Noyabr)
- Rahat temperaturlar
- Şərab festivalları
- Payız yarpaqları

### Qış (Dekabr-Fevral)
- Qəbələdə xizək sürmək
- Bakıda isti kafelər
- Qapalı məkan mədəni tədbirləri`,
    ru: `Азербайджан, несмотря на небольшие размеры, отличается удивительно разнообразными климатическими зонами. Страна простирается от субтропических побережий до альпийских вершин, предлагая студентам разнообразные погодные условия в течение всего года.

## Климатические зоны

### 1. Апшеронский полуостров (Баку)
- Полузасушливый климат
- Мягкая ветреная зима (2-6°C)
- Тёплое сухое лето (25-30°C)
- Годовое количество осадков: 200-300 мм

### 2. Центральные низменности
- Континентальный климат
- Холодная зима (-5...0°C)
- Жаркое лето (28-35°C)
- Годовое количество осадков: 300-500 мм

### 3. Большой Кавказский хребет
- Альпийский климат
- Обильные снегопады зимой
- Прохладное лето (15-20°C)
- Годовое количество осадков: 1000-1500 мм

### 4. Южное побережье (Ленкорань)
- Субтропический климат
- Мягкая зима (3-8°C)
- Тёплое влажное лето (24-28°C)
- Годовое количество осадков: 1200-1700 мм

## Погода в Баку по месяцам

| Месяц | Ср. макс | Ср. мин | Осадки |
|-------|----------|---------|----------|
| Янв | 6°C | 2°C | 20 мм |
| Фев | 6°C | 2°C | 20 мм |
| Мар | 10°C | 5°C | 25 мм |
| Апр | 16°C | 9°C | 30 мм |
| Май | 21°C | 14°C | 20 мм |
| Июн | 26°C | 19°C | 10 мм |
| Июл | 30°C | 23°C | 5 мм |
| Авг | 29°C | 22°C | 5 мм |
| Сен | 25°C | 18°C | 10 мм |
| Окт | 19°C | 13°C | 25 мм |
| Ноя | 13°C | 8°C | 30 мм |
| Дек | 8°C | 4°C | 25 мм |

## Что взять с собой

### Для студентов в Баку
- Лёгкие слои одежды на весну/осень
- Тёплое пальто на зиму
- Ветровка (в Баку ветрено!)
- Удобная обувь для прогулок

### Для горных районов
- Треккинговые ботинки
- Водонепроницаемая куртка
- Термобельё
- Защита от солнца

## Лучшее время для путешествий

### Весна (март-май)
- Мягкая погода, цветение вишни
- Отлично для экскурсий
- Праздник Новруз

### Лето (июнь-август)
- Тёплая погода, пляжный сезон
- Идеально для горных походов
- Долгий световой день

### Осень (сентябрь-ноябрь)
- Комфортные температуры
- Винные фестивали
- Осенняя листва

### Зима (декабрь-февраль)
- Горнолыжный курорт в Габале
- Уютные кафе в Баку
- Культурные мероприятия в помещении`,
    de: `Aserbaidschan hat trotz seiner geringen Größe bemerkenswert vielfältige Klimazonen. Das Land reicht von subtropischen Küsten bis zu alpinen Gipfeln und bietet Studenten das ganze Jahr über vielfältige Wettererfahrungen.

## Klimazonen

### 1. Halbinsel Abşeron (Baku)
- Halbtrockenes Klima
- Milde, windige Winter (2-6°C)
- Warme, trockene Sommer (25-30°C)
- Jährlicher Niederschlag: 200-300 mm

### 2. Zentrale Tiefebenen
- Kontinentalklima
- Kalte Winter (-5 bis 0°C)
- Heiße Sommer (28-35°C)
- Jährlicher Niederschlag: 300-500 mm

### 3. Großer Kaukasus
- Alpines Klima
- Starke Schneefälle im Winter
- Kühle Sommer (15-20°C)
- Jährlicher Niederschlag: 1.000-1.500 mm

### 4. Südküste (Lənkəran)
- Subtropisches Klima
- Milde Winter (3-8°C)
- Warme, feuchte Sommer (24-28°C)
- Jährlicher Niederschlag: 1.200-1.700 mm

## Monatliches Wetter in Baku

| Monat | Ø Max | Ø Min | Niederschlag |
|-------|------|------|-------------|
| Jan | 6°C | 2°C | 20 mm |
| Feb | 6°C | 2°C | 20 mm |
| Mär | 10°C | 5°C | 25 mm |
| Apr | 16°C | 9°C | 30 mm |
| Mai | 21°C | 14°C | 20 mm |
| Jun | 26°C | 19°C | 10 mm |
| Jul | 30°C | 23°C | 5 mm |
| Aug | 29°C | 22°C | 5 mm |
| Sep | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Nov | 13°C | 8°C | 30 mm |
| Dez | 8°C | 4°C | 25 mm |

## Was Sie einpacken sollten

### Für Studenten in Baku
- Leichte Schichten für Frühling/Herbst
- Warmer Mantel für den Winter
- Windjacke (in Baku ist es windig!)
- Bequeme Wanderschuhe

### Für Bergregionen
- Wanderschuhe
- Wasserdichte Jacke
- Thermounterwäsche
- Sonnenschutz

## Beste Reisezeiten

### Frühling (März-Mai)
- Mildes Wetter, Kirschblüte
- Ideal für Besichtigungen
- Novruz-Feiern

### Sommer (Juni-August)
- Warm, Badesaison
- Perfekt für Bergwanderungen
- Lange Tage

### Herbst (September-November)
- Angenehme Temperaturen
- Weinfeste
- Herbstlaub

### Winter (Dezember-Februar)
- Skifahren in Qəbələ
- Gemütliche Cafés in Baku
- Kulturelle Aktivitäten in Innenräumen`,
    fr: `Malgré sa petite taille, l'Azerbaïdjan possède des zones climatiques remarquablement diverses. Le pays s'étend des côtes subtropicales aux sommets alpins, offrant aux étudiants une grande variété de conditions météorologiques tout au long de l'année.

## Zones climatiques

### 1. Péninsule d'Abşeron (Bakou)
- Climat semi-aride
- Hivers doux et venteux (2-6°C)
- Étés chauds et secs (25-30°C)
- Précipitations annuelles : 200-300 mm

### 2. Basses terres centrales
- Climat continental
- Hivers froids (-5 à 0°C)
- Étés chauds (28-35°C)
- Précipitations annuelles : 300-500 mm

### 3. Grand Caucase
- Climat alpin
- Fortes chutes de neige en hiver
- Étés frais (15-20°C)
- Précipitations annuelles : 1 000-1 500 mm

### 4. Côte sud (Lənkəran)
- Climat subtropical
- Hivers doux (3-8°C)
- Étés chauds et humides (24-28°C)
- Précipitations annuelles : 1 200-1 700 mm

## Météo mensuelle à Bakou

| Mois | Moy. max | Moy. min | Précipitations |
|-------|----------|---------|----------|
| Jan | 6°C | 2°C | 20 mm |
| Fév | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Avr | 16°C | 9°C | 30 mm |
| Mai | 21°C | 14°C | 20 mm |
| Jui | 26°C | 19°C | 10 mm |
| Jui | 30°C | 23°C | 5 mm |
| Aoû | 29°C | 22°C | 5 mm |
| Sep | 25°C | 18°C | 10 mm |
| Oct | 19°C | 13°C | 25 mm |
| Nov | 13°C | 8°C | 30 mm |
| Déc | 8°C | 4°C | 25 mm |

## Que mettre dans sa valise

### Pour les étudiants à Bakou
- Couches légères pour le printemps/automne
- Manteau chaud pour l'hiver
- Coupe-vent (il y a du vent à Bakou !)
- Chaussures de marche confortables

### Pour les zones montagneuses
- Chaussures de randonnée
- Veste imperméable
- Sous-vêtements thermiques
- Protection solaire

## Meilleures périodes pour voyager

### Printemps (mars-mai)
- Temps doux, cerisiers en fleurs
- Idéal pour visiter
- Célébrations de Novruz

### Été (juin-août)
- Chaud, saison balnéaire
- Parfait pour la randonnée en montagne
- Longues journées

### Automne (septembre-novembre)
- Températures agréables
- Festivals du vin
- Feuillage d'automne

### Hiver (décembre-février)
- Ski à Qəbələ
- Cafés chaleureux à Bakou
- Activités culturelles en intérieur`,
    fa: `آذربایجان با وجود وسعت کم، مناطق اقلیمی شگفت‌انگیزاً متنوعی دارد. این کشور از سواحل نیمه‌گرمسیری تا قله‌های آلپی امتداد دارد و تجربه‌های آب‌وهوایی متنوعی را در طول سال به دانشجویان ارائه می‌دهد.

## مناطق اقلیمی

### ۱. شبه‌جزیره آبشوران (باکو)
- اقلیم نیمه‌خشک
- زمستان‌های ملایم و بادی (۲-۶ درجه)
- تابستان‌های گرم و خشک (۲۵-۳۰ درجه)
- بارش سالانه: ۲۰۰-۳۰۰ میلی‌متر

### ۲. دشت‌های مرکزی
- اقلیم قاره‌ای
- زمستان‌های سرد (۵- تا ۰ درجه)
- تابستان‌های گرم (۲۸-۳۵ درجه)
- بارش سالانه: ۳۰۰-۵۰۰ میلی‌متر

### ۳. کوه‌های قفقاز بزرگ
- اقلیم آلپی
- بارش سنگین برف در زمستان
- تابستان‌های خنک (۱۵-۲۰ درجه)
- بارش سالانه: ۱۰۰۰-۱۵۰۰ میلی‌متر

### ۴. ساحل جنوبی (لنکران)
- اقلیم نیمه‌گرمسیری
- زمستان‌های ملایم (۳-۸ درجه)
- تابستان‌های گرم و مرطوب (۲۴-۲۸ درجه)
- بارش سالانه: ۱۲۰۰-۱۷۰۰ میلی‌متر

## آب‌وهوای ماهانه باکو

| ماه | حداکثر | حداقل | بارش |
|-------|----------|---------|----------|
| ژانویه | ۶° | ۲° | ۲۰ میلی‌متر |
| فوریه | ۶° | ۲° | ۲۰ میلی‌متر |
| مارس | ۱۰° | ۵° | ۲۵ میلی‌متر |
| آوریل | ۱۶° | ۹° | ۳۰ میلی‌متر |
| مه | ۲۱° | ۱۴° | ۲۰ میلی‌متر |
| ژوئن | ۲۶° | ۱۹° | ۱۰ میلی‌متر |
| ژوئیه | ۳۰° | ۲۳° | ۵ میلی‌متر |
| اوت | ۲۹° | ۲۲° | ۵ میلی‌متر |
| سپتامبر | ۲۵° | ۱۸° | ۱۰ میلی‌متر |
| اکتبر | ۱۹° | ۱۳° | ۲۵ میلی‌متر |
| نوامبر | ۱۳° | ۸° | ۳۰ میلی‌متر |
| دسامبر | ۸° | ۴° | ۲۵ میلی‌متر |

## چه چیزهایی ببندید

### برای دانشجویان باکو
- لایه‌های سبک برای بهار/پاییز
- کت گرم برای زمستان
- بادگیر (باکو بادی است!)
- کفش پیاده‌روی راحت

### برای مناطق کوهستانی
- چکمه‌های کوهنوردی
- ژاکت ضدآب
- لباس گرم زیر
- محافظ آفتاب

## بهترین زمان سفر

### بهار (مارس تا مه)
- هوای ملایم، شکوفه گیلاس
- عالی برای گشت‌وگذار
- جشن نوروز

### تابستان (ژوئن تا اوت)
- گرم، فصل ساحل
- عالی برای کوهنوردی
- روزهای طولانی

### پاییز (سپتامبر تا نوامبر)
- دمای مطبوع
- جشنواره‌های شراب
- برگ‌های پاییزی

### زمستان (دسامبر تا فوریه)
- اسکی در قبله
- کافه‌های دنج در باکو
- فعالیت‌های فرهنگی سرپوشیده`,
    ar: `رغم مساحتها الصغيرة، تمتلك أذربيجان مناطق مناخية متنوعة بشكل لافت. تمتد البلاد من سواحل شبه استوائية إلى قمم جبال الألب، مما يمنح الطلاب تجارب طقس متنوعة على مدار العام.

## المناطق المناخية

### 1. شبه جزيرة أبشيرون (باكو)
- مناخ شبه جاف
- شتاء معتدل وعاصف (2-6°م)
- صيف حار وجاف (25-30°م)
- هطول سنوي: 200-300 ملم

### 2. الأراضي المنخفضة الوسطى
- مناخ قاري
- شتاء بارد (-5 إلى 0°م)
- صيف حار (28-35°م)
- هطول سنوي: 300-500 ملم

### 3. جبال القوقاز الكبرى
- مناخ جبلي
- تساقط ثلوج كثيف في الشتاء
- صيف بارد (15-20°م)
- هطول سنوي: 1000-1500 ملم

### 4. الساحل الجنوبي (لنكران)
- مناخ شبه استوائي
- شتاء معتدل (3-8°م)
- صيف حار ورطب (24-28°م)
- هطول سنوي: 1200-1700 ملم

## طقس باكو شهرياً

| الشهر | أعلى متوسط | أدنى متوسط | الأمطار |
|-------|----------|---------|----------|
| يناير | 6°م | 2°م | 20 ملم |
| فبراير | 6°م | 2°م | 20 ملم |
| مارس | 10°م | 5°م | 25 ملم |
| أبريل | 16°م | 9°م | 30 ملم |
| مايو | 21°م | 14°م | 20 ملم |
| يونيو | 26°م | 19°م | 10 ملم |
| يوليو | 30°م | 23°م | 5 ملم |
| أغسطس | 29°م | 22°م | 5 ملم |
| سبتمبر | 25°م | 18°م | 10 ملم |
| أكتوبر | 19°م | 13°م | 25 ملم |
| نوفمبر | 13°م | 8°م | 30 ملم |
| ديسمبر | 8°م | 4°م | 25 ملم |

## ماذا تحزم

### لطلاب باكو
- طبقات خفيفة للربيع/الخريف
- معطف دافئ للشتاء
- سترة واقية من الرياح (باكو عاصفة!)
- أحذية مريحة للمشي

### للمناطق الجبلية
- أحذية المشي لمسافات طويلة
- سترة مقاومة للماء
- طبقات حرارية
- واقٍ من الشمس

## أفضل أوقات السفر

### الربيع (مارس-مايو)
- طقس معتدل، أزهار الكرز
- رائع لمشاهدة المعالم
- احتفالات نوروز

### الصيف (يونيو-أغسطس)
- دافئ، موسم الشاطئ
- مثالي للمشي في الجبال
- ساعات نهار طويلة

### الخريف (سبتمبر-نوفمبر)
- درجات حرارة مريحة
- مهرجانات النبيذ
- أوراق الخريف

### الشتاء (ديسمبر-فبراير)
- التزلج في غابالا
- مقاهي دافئة في باكو
- أنشطة ثقافية داخلية`,
    zh: `尽管国土面积不大，阿塞拜疆却拥有极为多样化的气候带。从亚热带海岸到高山之巅，这个国家全年为学生提供丰富多彩的天气体验。

## 气候带

### 1. 阿布歇隆半岛（巴库）
- 半干旱气候
- 温和多风的冬季（2-6°C）
- 温暖干燥的夏季（25-30°C）
- 年降水量：200-300毫米

### 2. 中部低地
- 大陆性气候
- 寒冷的冬季（-5至0°C）
- 炎热的夏季（28-35°C）
- 年降水量：300-500毫米

### 3. 大高加索山脉
- 高山气候
- 冬季大雪纷飞
- 凉爽的夏季（15-20°C）
- 年降水量：1000-1500毫米

### 4. 南部海岸（连科兰）
- 亚热带气候
- 温和的冬季（3-8°C）
- 温暖潮湿的夏季（24-28°C）
- 年降水量：1200-1700毫米

## 巴库每月天气

| 月份 | 平均最高 | 平均最低 | 降水量 |
|-------|----------|---------|----------|
| 1月 | 6°C | 2°C | 20毫米 |
| 2月 | 6°C | 2°C | 20毫米 |
| 3月 | 10°C | 5°C | 25毫米 |
| 4月 | 16°C | 9°C | 30毫米 |
| 5月 | 21°C | 14°C | 20毫米 |
| 6月 | 26°C | 19°C | 10毫米 |
| 7月 | 30°C | 23°C | 5毫米 |
| 8月 | 29°C | 22°C | 5毫米 |
| 9月 | 25°C | 18°C | 10毫米 |
| 10月 | 19°C | 13°C | 25毫米 |
| 11月 | 13°C | 8°C | 30毫米 |
| 12月 | 8°C | 4°C | 25毫米 |

## 打包清单

### 巴库学生
- 春秋轻便多层衣物
- 冬季保暖大衣
- 防风外套（巴库多风！）
- 舒适的步行鞋

### 山区
- 登山靴
- 防水夹克
- 保暖内衣层
- 防晒用品

## 最佳旅行时间

### 春季（3-5月）
- 天气温和，樱花盛开
- 非常适合观光
- 诺鲁孜节庆祝活动

### 夏季（6-8月）
- 温暖，海滩季节
- 适合山地徒步
- 白昼时间长

### 秋季（9-11月）
- 温度舒适
- 葡萄酒节
- 秋叶美景

### 冬季（12-2月）
- 盖巴拉滑雪
- 巴库舒适的咖啡馆
- 室内文化活动`,
    tk: `Azerbaýjan kiçi meýdanyna garamazdan diýseň dürli howa zolaklaryna eýedir. Ýurt subtropik kenarlardan alp depelerine çenli uzap, talyplara ýyl boýy dürli howa tejribelerini hödürleýär.

## Howa Zolaklary

### 1. Abşeron Ýarym adasy (Baku)
- Ýarym gurak howa
- Müläým, şemally gyşlar (2-6°C)
- Yssy, gurak tomuslar (25-30°C)
- Ýyllyk ýagyş: 200-300 mm

### 2. Merkezi Düzlükler
- Kontinental howa
- Sowuk gyşlar (-5-den 0°C-e çenli)
- Yssy tomuslar (28-35°C)
- Ýyllyk ýagyş: 300-500 mm

### 3. Beýik Kawkaz Daglary
- Alp howasy
- Gyşda güýçli gar ýagyşy
- Salkyn tomuslar (15-20°C)
- Ýyllyk ýagyş: 1000-1500 mm

### 4. Günorta Kenary (Lankaran)
- Subtropik howa
- Müläým gyşlar (3-8°C)
- Yssy, çygly tomuslar (24-28°C)
- Ýyllyk ýagyş: 1200-1700 mm

## Bakuda Aýlyk Howa

| Aý | Ort. iň ýokary | Ort. iň pes | Ýagyş |
|-------|----------|---------|----------|
| Ýan | 6°C | 2°C | 20 mm |
| Few | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Apr | 16°C | 9°C | 30 mm |
| Maý | 21°C | 14°C | 20 mm |
| Iýun | 26°C | 19°C | 10 mm |
| Iýul | 30°C | 23°C | 5 mm |
| Awg | 29°C | 22°C | 5 mm |
| Sen | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Noý | 13°C | 8°C | 30 mm |
| Dek | 8°C | 4°C | 25 mm |

## Näme Alyp Gitmeli

### Bakuda Okaýanlar Üçin
- Bahar/güýz üçin ýeňil geýim gatlaklary
- Gyş üçin ýyly palto
- Şemal geçirmeýän köwüş (Baku şemally şäher!)
- Rahat ýöriş aýakgaby

### Daglyk Sebitler Üçin
- Ýöriş ädikleri
- Suw geçirmeýän penjek
- Termal geýim gatlaklary
- Gün goragy

## Syýahat Üçin Iň Gowy Wagtlar

### Bahar (Mart-Maý)
- Müläým howa, alça gülleri
- Gezelenç üçin ajaýyp
- Nowruz baýramçylyklary

### Tomus (Iýun-Awgus)
- Yssy, kenar möwsümi
- Dag ýörişleri üçin ajaýyp
- Uzyn gündiz wagty

### Güýz (Sentýabr-Noýabr)
- Rahat temperaturlar
- Çakyr festiwallary
- Güýz ýapraklary

### Gyş (Dekabr-Fewral)
- Gebeleýde lyža sürmek
- Bakuda jygar kafeler
- Içerki medeni çäreler`,
    kk: `Әзірбайжан кішігірім аумағына қарамастан таңғаларлықтай әртүрлі климаттық белдеулерге ие. Ел субтропиктік жағалаулардан альпі шыңдарына дейін созылып, студенттерге жыл бойы сан алуан ауа райы тәжірибесін ұсынады.

## Климаттық белдеулер

### 1. Абшерон түбегі (Баку)
- Жартылай қуаң климат
- Жұмсақ, желді қыстар (2-6°C)
- Жылы, құрғақ жаздар (25-30°C)
- Жылдық жауын-шашын: 200-300 мм

### 2. Орталық ойпаттар
- Континенттік климат
- Суық қыстар (-5...0°C)
- Ыстық жаздар (28-35°C)
- Жылдық жауын-шашын: 300-500 мм

### 3. Үлкен Кавказ таулары
- Альпілік климат
- Қыста қар мол жауады
- Салқын жаздар (15-20°C)
- Жылдық жауын-шашын: 1000-1500 мм

### 4. Оңтүстік жағалау (Ләнкәран)
- Субтропиктік климат
- Жұмсақ қыстар (3-8°C)
- Жылы, ылғалды жаздар (24-28°C)
- Жылдық жауын-шашын: 1200-1700 мм

## Бакудегі айлық ауа райы

| Ай | Орт. жоғары | Орт. төмен | Жауын-шашын |
|-------|----------|---------|----------|
| Қаң | 6°C | 2°C | 20 мм |
| Ақп | 6°C | 2°C | 20 мм |
| Нау | 10°C | 5°C | 25 мм |
| Сәу | 16°C | 9°C | 30 мм |
| Мам | 21°C | 14°C | 20 мм |
| Мау | 26°C | 19°C | 10 мм |
| Шіл | 30°C | 23°C | 5 мм |
| Там | 29°C | 22°C | 5 мм |
| Қыр | 25°C | 18°C | 10 мм |
| Қаз | 19°C | 13°C | 25 мм |
| Қар | 13°C | 8°C | 30 мм |
| Жел | 8°C | 4°C | 25 мм |

## Не жинау керек

### Бакуде оқитындарға
- Көктем/күзге арналған жеңіл киімдер
- Қысқа арналған жылы пальто
- Желден қорғайтын куртка (Бакуде жел көп!)
- Ыңғайлы жүру аяқ киімі

### Таулы аймақтарға
- Треккинг етіктері
- Су өткізбейтін куртка
- Термо іш киім
- Күннен қорғаныс

## Саяхаттың ең жақсы уақыты

### Көктем (наурыз-мамыр)
- Жұмсақ ауа райы, шие гүлдері
- Тамашалау үшін тамаша
- Наурыз мерекесі

### Жаз (маусым-тамыз)
- Жылы, жағажай маусымы
- Тауда серуендеуге өте қолайлы
- Ұзақ күндізгі уақыт

### Күз (қыркүйек-қараша)
- Ыңғайлы температура
- Шарап фестивальдары
- Күзгі жапырақтар

### Қыс (желтоқсан-ақпан)
- Қәбәләде шаңғы тебу
- Бакудегі жайлы кафелер
- Үй ішіндегі мәдени іс-шаралар`,
    ky: `Азербайжан кичинекей аймагына карабастан таң каларлык түрдүү климаттык алкактарга ээ. Өлкө субтропик жээктеринен альп чокуларына чейин созулуп, студенттерге жыл бою ар кандай аба ырайы тажрыйбасын сунуштайт.

## Климаттык алкактар

### 1. Абшерон жарым аралы (Баку)
- Жарым кургак климат
- Жумшак, шамалдуу кыштар (2-6°C)
- Жылуу, кургак жайлар (25-30°C)
- Жылдык жаан-чачын: 200-300 мм

### 2. Борбордук түздүктөр
- Континенттик климат
- Суук кыштар (-5...0°C)
- ысык жайлар (28-35°C)
- Жылдык жаан-чачын: 300-500 мм

### 3. Улуу Кавказ тоолору
- Альп климаты
- Кышында кар калың жаайт
- Салкын жайлар (15-20°C)
- Жылдык жаан-чачын: 1000-1500 мм

### 4. Түштүк жээк (Ленкоран)
- Субтропик климаты
- Жумшак кыштар (3-8°C)
- Жылуу, нымдуу жайлар (24-28°C)
- Жылдык жаан-чачын: 1200-1700 мм

## Бакудагы айлык аба ырайы

| Ай | Орт. жогорку | Орт. төмөн | Жаан-чачын |
|-------|----------|---------|----------|
| Үчтүн | 6°C | 2°C | 20 мм |
| Бирдин | 6°C | 2°C | 20 мм |
| Жалган | 10°C | 5°C | 25 мм |
| Чын | 16°C | 9°C | 30 мм |
| Бугу | 21°C | 14°C | 20 мм |
| Кулжа | 26°C | 19°C | 10 мм |
| Теке | 30°C | 23°C | 5 мм |
| Баш оона | 29°C | 22°C | 5 мм |
| Аяк оона | 25°C | 18°C | 10 мм |
| Тогуздун | 19°C | 13°C | 25 мм |
| Жетинин | 13°C | 8°C | 30 мм |
| Бештин | 8°C | 4°C | 25 мм |

## Эмне жыйноо керек

### Бакуда окугандар үчүн
- Жаз/күз үчүн жеңил кийим катмарлары
- Кыш үчүн жылуу пальто
- Шамал өткөрбөс куртка (Баку шамалдуу шаар!)
- Ыңгайлуу басуу бут кийими

### Тоолуу аймактар үчүн
- Треккинг бут кийимдери
- Суу өткөрбөс куртка
- Термо ич кийимдер
- Күндөн коргоо

## Саякаттын эң жакшы убактысы

### Жаз (март-май)
- Жумшак аба ырайы, алча гүлдөрү
- Сейилдөө үчүн мыкты
- Нооруз майрамы

### Жай (июнь-август)
- Жылуу, пляж сезону
- Тоо басуу үчүн эң сонун
- Узун күндүзгү убакыт

### Күз (сентябрь-ноябрь)
- Ыңгайлуу температура
- Шарап фестивалдары
- Күзгү жалбырактар

### Кыш (декабрь-февраль)
- Габалада лыжа тебүү
- Бакудагы жайлуу кафелер
- Үй ичиндеги маданий иш-чаралар`,
    bg: `Азербайджан, въпреки малката си площ, има забележително разнообразни климатични зони. Страната се простира от субтропични крайбрежия до алпийски върхове, предлагайки на студентите разнообразни метеорологични преживявания през цялата година.

## Климатични зони

### 1. Абшеронски полуостров (Баку)
- Полупустинен климат
- Меки, ветровити зими (2-6°C)
- Топли, сухи лета (25-30°C)
- Годишни валежи: 200-300 мм

### 2. Централни низини
- Континентален климат
- Студени зими (-5 до 0°C)
- Горещи лета (28-35°C)
- Годишни валежи: 300-500 мм

### 3. Голям Кавказ
- Алпийски климат
- Обилни снеговалежи през зимата
- Прохладни лета (15-20°C)
- Годишни валежи: 1000-1500 мм

### 4. Южно крайбрежие (Ленкоран)
- Субтропичен климат
- Меки зими (3-8°C)
- Топли, влажни лета (24-28°C)
- Годишни валежи: 1200-1700 мм

## Месечно време в Баку

| Месец | Ср. макс | Ср. мин | Валежи |
|-------|----------|---------|----------|
| Яну | 6°C | 2°C | 20 мм |
| Фев | 6°C | 2°C | 20 мм |
| Мар | 10°C | 5°C | 25 мм |
| Апр | 16°C | 9°C | 30 мм |
| Май | 21°C | 14°C | 20 мм |
| Юни | 26°C | 19°C | 10 мм |
| Юли | 30°C | 23°C | 5 мм |
| Авг | 29°C | 22°C | 5 мм |
| Сеп | 25°C | 18°C | 10 мм |
| Окт | 19°C | 13°C | 25 мм |
| Ное | 13°C | 8°C | 30 мм |
| Дек | 8°C | 4°C | 25 мм |

## Какво да опаковате

### За студенти в Баку
- Леки дрехи за пролет/есен
- Топло палто за зимата
- Ветроустойчиво яке (в Баку е ветровито!)
- Удобни обувки за ходене

### За планински райони
- Туристически обувки
- Водоустойчиво яке
- Термобельо
- Слънцезащита

## Най-добро време за пътуване

### Пролет (март-май)
- Меко време, черешов цвят
- Чудесно за разглеждане
- Празненства за Новруз

### Лято (юни-август)
- Топло, плажен сезон
- Перфектно за планински преходи
- Дълги дни

### Есен (септември-ноември)
- Комфортни температури
- Винени фестивали
- Есенна шума

### Зима (декември-февруари)
- Ски в Габала
- Уютни кафенета в Баку
- Културни дейности на закрито`,
    ur: `آذربائیجان اپنے چھوٹے سائز کے باوجود حیرت انگیز طور پر متنوع موسمی علاقوں کا حامل ہے۔ یہ ملک ذیلی اشنکٹبندیی ساحلوں سے لے کر بلند پہاڑی چوٹیوں تک پھیلا ہوا ہے، جو طلبہ کو سال بھر موسم کے متنوع تجربات فراہم کرتا ہے۔

## موسمی علاقے

### 1. ابشیرون جزیرہ نما (باکو)
- نیم خشک آب و ہوا
- معتدل، ہوا دار سردیاں (2-6°C)
- گرم، خشک گرمیاں (25-30°C)
- سالانہ بارش: 200-300 ملی میٹر

### 2. مرکزی نشیبی علاقے
- براعظمی آب و ہوا
- سرد سردیاں (-5 تا 0°C)
- گرم گرمیاں (28-35°C)
- سالانہ بارش: 300-500 ملی میٹر

### 3. عظیم قفقاز کے پہاڑ
- الپائن آب و ہوا
- سردیوں میں شدید برف باری
- ٹھنڈی گرمیاں (15-20°C)
- سالانہ بارش: 1000-1500 ملی میٹر

### 4. جنوبی ساحل (لنکران)
- ذیلی اشنکٹبندیی آب و ہوا
- معتدل سردیاں (3-8°C)
- گرم، مرطوب گرمیاں (24-28°C)
- سالانہ بارش: 1200-1700 ملی میٹر

## باکو کا ماہانہ موسم

| مہینہ | اوسط زیادہ | اوسط کم | بارش |
|-------|----------|---------|----------|
| جنوری | 6°C | 2°C | 20 ملی میٹر |
| فروری | 6°C | 2°C | 20 ملی میٹر |
| مارچ | 10°C | 5°C | 25 ملی میٹر |
| اپریل | 16°C | 9°C | 30 ملی میٹر |
| مئی | 21°C | 14°C | 20 ملی میٹر |
| جون | 26°C | 19°C | 10 ملی میٹر |
| جولائی | 30°C | 23°C | 5 ملی میٹر |
| اگست | 29°C | 22°C | 5 ملی میٹر |
| ستمبر | 25°C | 18°C | 10 ملی میٹر |
| اکتوبر | 19°C | 13°C | 25 ملی میٹر |
| نومبر | 13°C | 8°C | 30 ملی میٹر |
| دسمبر | 8°C | 4°C | 25 ملی میٹر |

## کیا پیک کریں

### باکو کے طلبہ کے لیے
- بہار/خزاں کے لیے ہلکے کپڑے
- سردی کے لیے گرم کوٹ
- ہوا سے بچانے والی جیکٹ (باکو ہوا دار ہے!)
- آرام دہ چلنے کے جوتے

### پہاڑی علاقوں کے لیے
- پیدل سفر کے جوتے
- واٹر پروف جیکٹ
- تھرمل لائیرز
- دھوپ سے حفاظت

## سفر کا بہترین وقت

### بہار (مارچ-مئی)
- معتدل موسم، چیری کے پھول
- سیاحت کے لیے بہترین
- نوروز کی تقریبات

### گرمی (جون-اگست)
- گرم، ساحل کا موسم
- پہاڑی پیدل سفر کے لیے بہترین
- لمبے دن

### خزاں (ستمبر-نومبر)
- آرام دہ درجہ حرارت
- شراب کے میلے
- خزاں کے پتے

### سردی (دسمبر-فروری)
- گابالہ میں اسکیئنگ
- باکو کے آرام دہ کیفے
- گھر کے اندر ثقافتی سرگرمیاں`,
    uz: `Ozarbayjon kichik maydoniga qaramay hayratlanarli darajada xilma-xil iqlim zonalariga ega. Mamlakat subtropik qirgʻoqlardan alp choʻqqilarigacha choʻzilgan boʻlib, talabalarga yil davomida turli ob-havo tajribalarini taqdim etadi.

## Iqlim zonalari

### 1. Absheron yarim oroli (Boku)
- Yarim quruq iqlim
- Yumshoq, shamolli qishlar (2-6°C)
- Issiq, quruq yozlar (25-30°C)
- Yillik yogʻin: 200-300 mm

### 2. Markaziy pasttekisliklar
- Kontinental iqlim
- Sovuq qishlar (-5 dan 0°C gacha)
- Issiq yozlar (28-35°C)
- Yillik yogʻin: 300-500 mm

### 3. Katta Kavkaz togʻlari
- Alp iqlimi
- Qishda kuchli qor yogʻishi
- Salqin yozlar (15-20°C)
- Yillik yogʻin: 1000-1500 mm

### 4. Janubiy qirgʻoq (Lankaron)
- Subtropik iqlim
- Yumshoq qishlar (3-8°C)
- Issiq, nam yozlar (24-28°C)
- Yillik yogʻin: 1200-1700 mm

## Bokuda oylik ob-havo

| Oy | Oʻrt. yuqori | Oʻrt. past | Yogʻin |
|-------|----------|---------|----------|
| Yan | 6°C | 2°C | 20 mm |
| Fev | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Apr | 16°C | 9°C | 30 mm |
| May | 21°C | 14°C | 20 mm |
| Iyn | 26°C | 19°C | 10 mm |
| Iyl | 30°C | 23°C | 5 mm |
| Avg | 29°C | 22°C | 5 mm |
| Sen | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Noy | 13°C | 8°C | 30 mm |
| Dek | 8°C | 4°C | 25 mm |

## Nima olib ketish kerak

### Bokuda oʻqiydiganlar uchun
- Bahor/kuz uchun yengil kiyimlar
- Qish uchun issiq palto
- Shamoldan himoya qiladigan kurtka (Boku shamolli shahar!)
- Qulay yurish poyabzali

### Togʻli hududlar uchun
- Trekking etiklari
- Suv oʻtkazmaydigan kurtka
- Termal ichki kiyim
- Quyoshdan himoya

## Sayohat uchun eng yaxshi vaqt

### Bahor (mart-may)
- Yumshoq ob-havo, gilos gullari
- Sayohat uchun ajoyib
- Navroʻz bayramlari

### Yoz (iyun-avgust)
- Issiq, plyaj mavsumi
- Togʻ sayohatlari uchun mukammal
- Uzoq kunduz vaqti

### Kuz (sentabr-noyabr)
- Qulay harorat
- Vino festivallari
- Kuzgi barglar

### Qish (dekabr-fevral)
- Gabalada changʻi uchish
- Bokudagi shinam kafelar
- Yopiq madaniy tadbirlar`,
    sw: `Azabajani, licha ya udogo wake, ina maeneo ya hali ya hewa tofauti sana. Nchi hii inaanzia kwenye pwani za kitropiki hadi vilele vya milima mirefu, ikiwapa wanafunzi uzoefu mbalimbali wa hali ya hewa mwaka mzima.

## Maeneo ya Hali ya Hewa

### 1. Rasi ya Absheron (Baku)
- Hali ya hewa ya nusu ukame
- Majira ya baridi ya wastani na ya upepo (2-6°C)
- Majira ya joto na ukame (25-30°C)
- Mvua ya kila mwaka: 200-300 mm

### 2. Nyanda za chini za Kati
- Hali ya hewa ya bara
- Majira ya baridi ya baridi (-5 hadi 0°C)
- Majira ya joto (28-35°C)
- Mvua ya kila mwaka: 300-500 mm

### 3. Milima ya Caucasus Kubwa
- Hali ya hewa ya Alpine
- Theluji nyingi wakati wa baridi
- Majira ya joto ya baridi (15-20°C)
- Mvua ya kila mwaka: 1000-1500 mm

### 4. Pwani ya Kusini (Lankaran)
- Hali ya hewa ya kitropiki
- Majira ya baridi ya wastani (3-8°C)
- Majira ya joto na unyevu (24-28°C)
- Mvua ya kila mwaka: 1200-1700 mm

## Hali ya Hewa ya Kila Mwezi Baku

| Mwezi | Wastani wa juu | Wastani wa chini | Mvua |
|-------|----------|---------|----------|
| Jan | 6°C | 2°C | 20 mm |
| Feb | 6°C | 2°C | 20 mm |
| Mac | 10°C | 5°C | 25 mm |
| Apr | 16°C | 9°C | 30 mm |
| Mei | 21°C | 14°C | 20 mm |
| Jun | 26°C | 19°C | 10 mm |
| Jul | 30°C | 23°C | 5 mm |
| Ago | 29°C | 22°C | 5 mm |
| Sep | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Nov | 13°C | 8°C | 30 mm |
| Des | 8°C | 4°C | 25 mm |

## Nini Uweke Kwenye Safari

### Kwa Wanafunzi wa Baku
- Nguo nyepesi za kupachika kwa machipuo/kuanguka
- Kanzu ya joto kwa majira ya baridi
- Koti ya kukinga upepo (Baku kuna upepo!)
- Viatu vizuri vya kutembea

### Kwa Maeneo ya Milimani
- Viatu vya kupanda milima
- Koti isiyopitisha maji
- Nguo za joto za ndani
- Kinga ya jua

## Nyakati Bora za Kusafiri

### Machipuo (Machi-Mei)
- Hali ya hewa ya wastani, maua ya cherry
- Bora kwa kutazama
- Sherehe za Novruz

### Majira ya Joto (Juni-Agosti)
- Joto, msimu wa pwani
- Bora kwa kupanda milima
- Saa ndefu za mchana

### Kuanguka (Septemba-Novemba)
- Joto la kustarehesha
- Sherehe za divai
- Majani ya kuanguka

### Majira ya Baridi (Desemba-Februari)
- Skiing Gabala
- Mikahawa ya kupendeza Baku
- Shughuli za kitamaduni za ndani`,
    so: `Azerbaijan inkasta oo ay ku yar tahay dhulkeeda, waxay leedahay aagag cimilo oo aad u kala duwan. Dalku wuxuu u fidsan yahay xeebaha kulaala ilaa meelaha sare ee buuraha, isagoo ardayda siinaya khibrado cimilo oo kala duwan sanadka oo dhan.

## Aagagga Cimilada

### 1. Jasiiradda Absheron (Baku)
- Cimilo qallayl nus ah
- Jiilaal qabow oo dhexdhexaad ah oo dabayl leh (2-6°C)
- Xagaago kulul oo qallalan (25-30°C)
- Roobka sanadlaha ah: 200-300 mm

### 2. Dhulka Hoose ee Bartamaha
- Cimilo qaarad ah
- Jiilaal qabow (-5 ilaa 0°C)
- Xagaago kulul (28-35°C)
- Roobka sanadlaha ah: 300-500 mm

### 3. Buuraha Qawqaz ee Waaweyn
- Cimilo buureed
- Baraf culus jiilaalka
- Xagaago qabow (15-20°C)
- Roobka sanadlaha ah: 1000-1500 mm

### 4. Xeebta Koonfureed (Lankaran)
- Cimilo kulaal ah
- Jiilaal dhexdhexaad ah (3-8°C)
- Xagaago kulul oo qoyan (24-28°C)
- Roobka sanadlaha ah: 1200-1700 mm

## Cimilada Baku ee Bisha Kasta

| Bisha | Ugu sarreeya | Ugu hooseeya | Roob |
|-------|----------|---------|----------|
| Jan | 6°C | 2°C | 20 mm |
| Feb | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Abr | 16°C | 9°C | 30 mm |
| May | 21°C | 14°C | 20 mm |
| Jun | 26°C | 19°C | 10 mm |
| Jul | 30°C | 23°C | 5 mm |
| Ago | 29°C | 22°C | 5 mm |
| Seb | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Nof | 13°C | 8°C | 30 mm |
| Dis | 8°C | 4°C | 25 mm |

## Maxaa La Raritaa

### Ardayda Baku
- Dharka fudud ee lakabyada ah ee gu'ga/dayrta
- Jaakad diiran jiilaalka
- Jaakad dabaysha ka ilaasha (Baku waa magaalo dabayle ah!)
- Kabo raaxo leh oo lugaynta ah

### Meelaha Buuraleyda Ah
- Kabo buuraha laga socdo
- Jaakad biyaha aan gudbin
- Dharka kuleylka ah ee hoose
- Ka difaaca qorraxda

## Waqtiyada Ugu Fiican ee Safarka

### Gu'ga (Mar-May)
- Cimilo dhexdhexaad ah, ubaxa cherry
- Wax lagu xoqo oo aad u fiican
- Dabaaldegyada Novruz

### Xagaaga (Jun-Ago)
- Kulul, xilli xeebeed
- Ku fiican socodka buuraha
- Saacado dhaadheer oo maalimeed

### Dayrta (Seb-Nof)
- Heerkul raaxo leh
- Dabaaldegyada khamriga
- Caleemaha dayrta

### Jiilaalka (Dis-Feb)
- Barafka Gabala
- Kafateeriyada diiran ee Baku
- Waxqabadyada dhaqameed ee gudaha`,
    id: `Meskipun ukurannya kecil, Azerbaijan memiliki zona iklim yang sangat beragam. Negara ini membentang dari pesisir subtropis hingga puncak pegunungan alpen, memberikan pengalaman cuaca yang bervariasi kepada mahasiswa sepanjang tahun.

## Zona Iklim

### 1. Semenanjung Absheron (Baku)
- Iklim semi-kering
- Musim dingin sejuk dan berangin (2-6°C)
- Musim panas hangat dan kering (25-30°C)
- Curah hujan tahunan: 200-300 mm

### 2. Dataran Rendah Tengah
- Iklim kontinental
- Musim dingin dingin (-5 hingga 0°C)
- Musim panas panas (28-35°C)
- Curah hujan tahunan: 300-500 mm

### 3. Pegunungan Kaukasus Besar
- Iklim alpen
- Salju lebat di musim dingin
- Musim panas sejuk (15-20°C)
- Curah hujan tahunan: 1000-1500 mm

### 4. Pantai Selatan (Lankaran)
- Iklim subtropis
- Musim dingin sejuk (3-8°C)
- Musim panas hangat dan lembap (24-28°C)
- Curah hujan tahunan: 1200-1700 mm

## Cuaca Bulanan di Baku

| Bulan | Rata-rata Tertinggi | Rata-rata Terendah | Curah Hujan |
|-------|----------|---------|----------|
| Jan | 6°C | 2°C | 20 mm |
| Feb | 6°C | 2°C | 20 mm |
| Mar | 10°C | 5°C | 25 mm |
| Apr | 16°C | 9°C | 30 mm |
| Mei | 21°C | 14°C | 20 mm |
| Jun | 26°C | 19°C | 10 mm |
| Jul | 30°C | 23°C | 5 mm |
| Agu | 29°C | 22°C | 5 mm |
| Sep | 25°C | 18°C | 10 mm |
| Okt | 19°C | 13°C | 25 mm |
| Nov | 13°C | 8°C | 30 mm |
| Des | 8°C | 4°C | 25 mm |

## Yang Perlu Dikemas

### Untuk Mahasiswa di Baku
- Pakaian berlapis ringan untuk musim semi/gugur
- Mantel hangat untuk musim dingin
- Jaket anti-angin (Baku berangin!)
- Sepatu jalan yang nyaman

### Untuk Area Pegunungan
- Sepatu hiking
- Jaket tahan air
- Lapisan termal
- Pelindung matahari

## Waktu Terbaik untuk Bepergian

### Musim Semi (Maret-Mei)
- Cuaca sejuk, bunga sakura
- Sangat baik untuk wisata
- Perayaan Novruz

### Musim Panas (Juni-Agustus)
- Hangat, musim pantai
- Sempurna untuk hiking gunung
- Siang hari yang panjang

### Musim Gugur (September-November)
- Suhu nyaman
- Festival anggur
- Dedaunan musim gugur

### Musim Dingin (Desember-Februari)
- Ski di Gabala
- Kafe nyaman di Baku
- Aktivitas budaya dalam ruangan`,
  },
};
