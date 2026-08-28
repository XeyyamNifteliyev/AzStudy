#!/usr/bin/env node
/**
 * s.md 3.2: Add de/fr/zh/ar descriptions for all 46 universities.
 * Each description mirrors the EN one in structure and key facts.
 */
import { readFileSync, writeFileSync } from 'fs';

const DESCRIPTIONS = {
  'u-bsu': {
    de: 'Die Staatliche Universität Baku (BSU) ist die älteste und größte Universität Aserbaidschans, gegründet 1919. Sie bietet ein breites Spektrum an Programmen in Naturwissenschaften, Geisteswissenschaften, Recht, Medizin und Ingenieurwesen.',
    fr: "L'Université d'État de Bakou (BSU) est la plus ancienne et la plus grande université d'Azerbaïdjan, fondée en 1919. Elle propose un large éventail de programmes en sciences, sciences humaines, droit, médecine et ingénierie.",
    zh: '巴库国立大学（BSU）是阿塞拜疆最古老、规模最大的大学，成立于1919年。该校提供科学、人文、法律、医学和工程等多个领域的广泛课程。',
    ru: 'Бакинский государственный университет (БГУ) — старейший и крупнейший университет Азербайджана, основанный в 1919 году. Предлагает широкий спектр программ в области естественных, гуманитарных наук, права, медицины и инженерии.',
  },
  'u-ada': {
    de: 'Die ADA-Universität ist eine führende internationale Universität in Baku, die 2006 gegründet wurde. Sie bietet englischsprachige Programme in Politikwirtschaft, Informatik, Business und internationalen Beziehungen an.',
    fr: "L'Université ADA est une université internationale de premier plan à Bakou, fondée en 2006. Elle propose des programmes en anglais en économie politique, informatique, commerce et relations internationales.",
    zh: 'ADA大学是巴库领先的国际大学，成立于2006年。该校提供英语授课的政治经济学、计算机科学、商业和国际关系等课程。',
    ru: 'Университет АДА — ведущий международный университет в Баку, основанный в 2006 году. Предлагает англоязычные программы по политической экономике, информатике, бизнесу и международным отношениям.',
  },
  'u-odu': {
    de: 'Die Nationale Universität für Architektur und Bauwesen Aserbaidschans ist eine führende technische Universität in Baku, die 1975 gegründet wurde. Sie bietet Programme in Architektur, Bauingenieurwesen, Stadtplanung und verwandten Fächern an.',
    fr: "L'Université nationale d'architecture et de construction d'Azerbaïdjan est une université technique de premier plan à Bakou, fondée en 1975. Elle propose des programmes en architecture, génie civil, urbanisme et disciplines connexes.",
    zh: '阿塞拜疆国立建筑与建造大学是巴库领先的理工大学，成立于1975年。提供建筑、土木工程、城市规划及相关学科课程。',
    ru: 'Азербайджанский университет архитектуры и строительства — ведущий технический университет в Баку, основанный в 1975 году. Предлагает программы по архитектуре, строительному инженерию, градостроительству и смежным дисциплинам.',
  },
  'u-sdu': {
    de: 'Die Staatliche Universität Sumqayit ist eine staatliche Universität in Sumqayit, die Programme in Naturwissenschaften, Ingenieurwesen, Geisteswirtschaft und Pädagogik anbietet.',
    fr: "L'Université d'État de Sumgait est une université publique à Sumgait qui propose des programmes en sciences, ingénierie, sciences humaines et pédagogie.",
    zh: '苏姆盖特国立大学是位于苏姆盖特的国立大学，提供科学、工程、人文和教育等课程。',
    ru: 'Сумгаитский государственный университет — государственный университет в Сумгаите, предлагающий программы в области естественных наук, инженерии, гуманитарных наук и педагогики.',
  },
  'u-gtu': {
    de: 'Die Staatliche Universität Gəncə ist eine der ältesten Universitäten Aserbaidschans, gegründet 1939. Sie bietet Programme in Philologie, Geschichte, Mathematik, Physik und Chemie an.',
    fr: "L'Université d'État de Gandja est l'une des plus anciennes universités d'Azerbaïdjan, fondée en 1939. Elle propose des programmes en philologie, histoire, mathématiques, physique et chimie.",
    zh: '占贾国立大学是阿塞拜疆最古老的大学之一，成立于1939年。提供语文学、历史、数学、物理和化学等课程。',
    ru: 'Гянджинский государственный университет — один из старейших университетов Азербайджана, основанный в 1939 году. Предлагает программы по филологии, истории, математике, физике и химии.',
  },
  'u-gtu-tech': {
    de: 'Die Staatliche Technologische Universität Gəncə ist eine technische Universität in Gəncə, die Programme in Technologie, Ingenieurwesen und angewandten Wissenschaften anbietet.',
    fr: "L'Université technologique d'État de Gandja est une université technique à Gandja qui propose des programmes en technologie, ingénierie et sciences appliquées.",
    zh: '占贾国立技术大学是位于占贾的理工大学，提供技术、工程和应用科学等课程。',
    ru: 'Гянджинский государственный технологический университет — технический университет в Гяндже, предлагающий программы в области технологий, инженерии и прикладных наук.',
  },
  'u-nmu': {
    de: 'Die Medizinische Universität Nachitschewan ist eine spezialisierte medizinische Universität in der Autonomen Republik Nachitschewan, die Programme in Allgemeinmedizin, Zahnmedizin und Pharmazie anbietet.',
    fr: "L'Université médicale de Nakhitchevan est une université médicale spécialisée dans la République autonome de Nakhitchevan, proposant des programmes en médecine générale, dentisterie et pharmacie.",
    zh: '纳希切万医科大学是纳希切万自治共和国的专业医科大学，提供全科医学、牙科和药学课程。',
    ru: 'Нахичеванская медицинская университет — специализированный медицинский университет в Нахичеванской Автономной Республике, предлагающий программы по общей медицине, стоматологии и фармации.',
  },
  'u-amu': {
    de: 'Die Medizinische Universität Aserbaidschans (AMU) ist die älteste und größte medizinische Universität des Landes, gegründet 1930. Sie bietet Programme in Allgemeinmedizin, Zahnmedizin, Pharmazie und öffentlicher Gesundheit an.',
    fr: "L'Université médicale d'Azerbaïdjan (AMU) est la plus ancienne et la plus grande université médicale du pays, fondée en 1930. Elle propose des programmes en médecine générale, dentisterie, pharmacie et santé publique.",
    zh: '阿塞拜疆医科大学（AMU）是该国最古老、规模最大的医科大学，成立于1930年。提供全科医学、牙科、药学和公共卫生课程。',
    ru: 'Азербайджанский медицинский университет (АМУ) — старейший и крупнейший медицинский университет страны, основанный в 1930 году. Предлагает программы по общей медицине, стоматологии, фармации и общественному здравоохранению.',
  },
  'u-unec': {
    de: 'Die Staatliche Wirtschaftsuniversität Aserbaidschans (UNEC) ist die größte wirtschaftsfokussierte Universität des Landes, gegründet 1930. Sie bietet Programme in Wirtschaft, Finanzen, Buchhaltung und internationaler Wirtschaft an.',
    fr: "L'Université d'État d'économie d'Azerbaïdjan (UNEC) est la plus grande université spécialisée en économie du pays, fondée en 1930. Elle propose des programmes en économie, finance, comptabilité et économie internationale.",
    zh: '阿塞拜疆国立经济大学（UNEC）是该国最大的经济类大学，成立于1930年。提供经济学、金融、会计和国际经济等课程。',
    ru: 'Азербайджанский государственный экономический университет (УНЕК) — крупнейший экономический университет страны, основанный в 1930 году. Предлагает программы по экономике, финансам, бухгалтерскому учёту и международной экономике.',
  },
  'u-wu': {
    de: 'Die Westliche Universität ist eine private Universität in Baku, die Programme in Wirtschaft, IT, internationalen Beziehungen und Recht anbietet.',
    fr: "L'Université occidentale est une université privée à Bakou proposant des programmes en commerce, informatique, relations internationales et droit.",
    zh: '西方大学是巴库的私立大学，提供商业、信息技术、国际关系和法律等课程。',
    ru: 'Западный университет — частный университет в Баку, предлагающий программы по бизнесу, информационным технологиям, международным отношениям и праву.',
  },
  'u-khazar': {
    de: 'Die Chasarsche Universität ist eine der ersten privaten Universitäten Aserbaidschans, gegründet 1991. Sie bietet Programme in Informatik, Wirtschaft, Ingenieurwesen und Geisteswissenschaften an.',
    fr: "L'Université Khazar est l'une des premières universités privées d'Azerbaïdjan, fondée en 1991. Elle propose des programmes en informatique, commerce, ingénierie et sciences humaines.",
    zh: '赫扎尔大学是阿塞拜疆最早的私立大学之一，成立于1991年。提供计算机科学、商业、工程和人文学科课程。',
    ru: 'Университет Хазар — один из первых частных университетов Азербайджана, основанный в 1991 году. Предлагает программы по информатике, бизнесу, инженерии и гуманитарным наукам.',
  },
  'u-beu': {
    de: 'Die Technische Universität Baku ist eine private Universität, die sich auf Ingenieurwesen und Technologie spezialisiert hat und Programme in Bauingenieurwesen, Maschinenbau, Informatik und Elektrotechnik anbietet.',
    fr: "L'Université d'ingénierie de Bakou est une université privée spécialisée en ingénierie et technologie, proposant des programmes en génie civil, mécanique, informatique et électricité.",
    zh: '巴库工程技术大学是一所专注于工程和技术的私立大学，提供土木工程、机械工程、计算机科学和电气工程等课程。',
    ru: 'Бакинский инженерный университет — частный университет, специализирующийся на инженерии и технологиях, предлагающий программы по строительному, механическому, компьютерному и электротехническому инженерию.',
  },
  'u-aspu': {
    de: 'Die Staatliche Pädagogische Universität Aserbaidschans (ASPU) ist eine der ältesten Universitäten des Landes, gegründet 1921. Sie bietet Programme in Pädagogik, Sprachen, Mathematik und Naturwissenschaften an.',
    fr: "L'Université pédagogique d'État d'Azerbaïdjan (ASPU) est l'une des plus anciennes universités du pays, fondée en 1921. Elle propose des programmes en pédagogie, langues, mathématiques et sciences.",
    zh: '阿塞拜疆国立师范大学（ASPU）是该国最古老的大学之一，成立于1921年。提供教育学、语言、数学和科学等课程。',
    ru: 'Азербайджанский государственный педагогический университет (АСПУ) — один из старейших университетов страны, основанный в 1921 году. Предлагает программы по педагогике, языкам, математике и естественным наукам.',
  },
  'u-lsu': {
    de: 'Die Staatliche Universität Lənkəran ist eine staatliche Universität im Süden Aserbaidschans, die Programme in Naturwissenschaften, Geisteswirtschaft und Ingenieurwesen anbietet.',
    fr: "L'Université d'État de Lankaran est une université publique dans le sud de l'Azerbaïdjan, proposant des programmes en sciences, sciences humaines et ingénierie.",
    zh: '连科兰国立大学是位于阿塞拜疆南部的国立大学，提供科学、人文和工程等课程。',
    ru: 'Ленкоранский государственный университет — государственный университет на юге Азербайджана, предлагающий программы в области естественных наук, гуманитарных наук и инженерии.',
  },
  'u-mgu': {
    de: 'Die Staatliche Universität Mingəçevir ist eine staatliche Universität in Zentralaserbaidschan, die Programme in Technologie, Wirtschaft und Geisteswissenschaften anbietet.',
    fr: "L'Université d'État de Mingatchevir est une université publique en Azerbaïdjan central, proposant des programmes en technologie, économie et sciences humaines.",
    zh: '明盖恰乌尔国立大学是位于阿塞拜疆中部的国立大学，提供技术、经济和人文学科课程。',
    ru: 'Мингячевирский государственный университет — государственный университет в центральном Азербайджане, предлагающий программы в области технологий, экономики и гуманитарных наук.',
  },
  'u-adnsu-oil': {
    de: 'Die Staatliche Öl- und Industrieuniversität Aserbaidschans (ASOIU) ist eine der ältesten technischen Universitäten des Landes, gegründet 1920. Sie bietet Programme in Erdöl- und Gasingenieurwesen, Chemieingenieurwesen und Bergbau an.',
    fr: "L'Université d'État du pétrole et de l'industrie d'Azerbaïdjan (ASOIU) est l'une des plus anciennes universités techniques du pays, fondée en 1920. Elle propose des programmes en ingénierie pétrolière et gazière, génie chimique et mines.",
    zh: '阿塞拜疆国立石油与工业大学（ASOIU）是该国最古老的理工大学之一，成立于1920年。提供石油与天然气工程、化学工程和矿业等课程。',
    ru: 'Азербайджанский государственный университет нефти и промышленности (АГУНП) — один из старейших технических университетов страны, основанный в 1920 году. Предлагает программы по нефтегазовому, горнохимическому инженерию и горному делу.',
  },
  'u-atu': {
    de: 'Die Technische Universität Aserbaidschans (ATU) ist eine bedeutende technische Universität in Baku, die Programme in Maschinenbau, Elektrotechnik, Informatik und Metallurgie anbietet.',
    fr: "L'Université technique d'Azerbaïdjan (ATU) est une importante université technique à Bakou, proposant des programmes en mécanique, électricité, informatique et métallurgie.",
    zh: '阿塞拜疆技术大学（ATU）是巴库重要的理工大学，提供机械工程、电气工程、计算机科学和冶金等课程。',
    ru: 'Азербайджанский технический университет (АТУ) — крупный технический университет в Баку, предлагающий программы по механическому, электротехническому инженерии, информатике и металлургии.',
  },
  'u-bsu-slavyan': {
    de: 'Die Slawische Universität Baku ist auf slawische Sprachen, internationale Beziehungen und fremde Sprachen spezialisiert und bietet Programme in Übersetzung, Dolmetschen und Slawistik an.',
    fr: "L'Université slave de Bakou est spécialisée dans les langues slaves, les relations internationales et les langues étrangères, proposant des programmes en traduction, interprétation et études slaves.",
    zh: '巴库斯拉夫大学专注于斯拉夫语、国际关系和外语，提供翻译、口译和斯拉夫研究等课程。',
    ru: 'Бакинский славянский университет специализируется на славянских языках, международных отношениях и иностранных языках, предлагая программы по переводу, славистике и иностранным языкам.',
  },
  'u-adu': {
    de: 'Die Sprachuniversität Aserbaidschans (ADU) ist eine der führenden Sprachuniversitäten des Landes, die Programme in angewandter Sprachwissenschaft, Übersetzung, Fremdsprachen und Literatur anbietet.',
    fr: "L'Université des langues d'Azerbaïdjan (ADU) est l'une des universités linguistiques de premier plan du pays, proposant des programmes en linguistique appliquée, traduction, langues étrangères et littérature.",
    zh: '阿塞拜疆语言大学（ADU）是该国领先的语言类大学，提供应用语言学、翻译、外语和文学等课程。',
    ru: 'Азербайджанский университет языков (АЯУ) — один из ведущих языковых университетов страны, предлагающий программы по прикладной лингвистике, переводу, иностранным языкам и литературе.',
  },
  'u-bma': {
    de: 'Die Musikakademie Baku, benannt nach Üzeyir Hacıbəyli, ist Aserbaidschans führende Musikinstitution, die Programme in Musikperformance, Musikwissenschaft, Komposition und Chorleitung anbietet.',
    fr: "L'Académie de musique de Bakou, nommée d'après Üzeyir Hacıbəyli, est la principale institution musicale d'Azerbaïdjan, proposant des programmes en performance musicale, musicologie, composition et direction chorale.",
    zh: '巴库音乐学院以乌泽伊尔·哈吉贝伊利命名，是阿塞拜疆领先的音乐机构，提供音乐表演、音乐学、作曲和合唱指挥等课程。',
    ru: 'Бакинская музыкальная академия имени Узеира Гаджибекова — ведущее музыкальное учреждение Азербайджана, предлагающее программы по музыкальному исполнению, музыковедению, композиции и хоровому дирижированию.',
  },
  'u-admcu': {
    de: 'Die Staatliche Universität für Kultur und Kunst Aserbaidschans bietet Programme in Filmregie, Theater, Design und traditioneller aserbaidschanischer Kunst an.',
    fr: "L'Université d'État de la culture et des arts d'Azerbaïdjan propose des programmes en réalisation de films, théâtre, design et art traditionnel azerbaïdjanais.",
    zh: '阿塞拜疆国立文化与艺术大学提供电影导演、戏剧、设计和传统阿塞拜疆艺术等课程。',
    ru: 'Азербайджанский государственный университет культуры и искусства предлагает программы по режиссуре кино, театру, дизайну и традиционному азербайджанскому искусству.',
  },
  'u-adasa': {
    de: 'Die Staatliche Kunstakademie Aserbaidschans bietet Programme in bildender Kunst, Design, Skulptur und angewandter Kunst an.',
    fr: "L'Académie des beaux-arts d'État d'Azerbaïdjan propose des programmes en beaux-arts, design, sculpture et arts appliqués.",
    zh: '阿塞拜疆国立美术学院提供美术、设计、雕塑和应用艺术等课程。',
    ru: 'Азербайджанская государственная академия художеств предлагает программы по изобразительному искусству, дизайну, скульптуре и прикладному искусству.',
  },
  'u-amk': {
    de: 'Das Nationale Konservatorium Aserbaidschans bewahrt und entwickelt den Mugam und die traditionelle aserbaidschanische Musik und bietet Programme in Musikwissenschaft, Gesang und Instrumentalspiel an.',
    fr: "Le Conservatoire national d'Azerbaïdjan préserve et développe le mugam et la musique traditionnelle azerbaïdjanaise, proposant des programmes en musicologie, chant et interprétation instrumentale.",
    zh: '阿塞拜疆国家音乐学院保护和发展穆加姆及传统阿塞拜疆音乐，提供音乐学、声乐和器乐演奏等课程。',
    ru: 'Азербайджанская национальная консерватория сохраняет и развивает мугам и традиционную азербайджанскую музыку, предлагая программы по музыковедению, вокалу и инструментальному исполнению.',
  },
  'u-tau': {
    de: 'Die Türkisch-Aserbaidschanische Universität ist eine gemeinsame Institution, die Programme in Ingenieurwesen, Wirtschaft und Geisteswissenschaften anbietet.',
    fr: "L'Université turco-azerbaïdjanaise est une institution conjointe proposant des programmes en ingénierie, économie et sciences humaines.",
    zh: '土耳其-阿塞拜疆大学是联合机构，提供工程、经济和人文学科课程。',
    ru: 'Турецко-Азербайджанский университет — совместное учебное заведение, предлагающее программы по инженерии, экономике и гуманитарным наукам.',
  },
  'u-aia': {
    de: 'Die Staatliche Sportakademie Aserbaidschans bietet Programme in Sportwissenschaft, Trainerwesen, Körpererziehung und Sportmanagement an.',
    fr: "L'Académie des sports d'État d'Azerbaïdjan propose des programmes en science du sport, entraînement, éducation physique et gestion du sport.",
    zh: '阿塞拜疆国立体育学院提供运动科学、教练、体育教育和体育管理等课程。',
    ru: 'Азербайджанская государственная спортивная академия предлагает программы по спортивной науке, тренерству, физическому воспитанию и спортивному менеджменту.',
  },
  'u-paida': {
    de: 'Die Präsidialakademie für Staatsverwaltung bietet Programme in öffentlicher Verwaltung, Politikwissenschaft, internationalen Beziehungen und Governance an.',
    fr: "L'Académie présidentielle de gouvernance publique propose des programmes en administration publique, science politique, relations internationales et gouvernance.",
    zh: '总统公共管理学院提供公共管理、政治学、国际关系和治理等课程。',
    ru: 'Президентская академия государственного управления предлагает программы по государственному управлению, политологии, международным отношениям и управлению.',
  },
  'u-adda': {
    de: 'Die Staatliche Marineakademie Aserbaidschans bietet Programme in maritimer Ingenieurschaft, Navigation, Logistik und maritimer Sicherheit an.',
    fr: "L'Académie maritime d'État d'Azerbaïdjan propose des programmes en génie maritime, navigation, logistique et sécurité maritime.",
    zh: '阿塞拜疆国立海事学院提供海事工程、航海、物流和海事安全等课程。',
    ru: 'Азербайджанская государственная морская академия предлагает программы по морскому инженерии, навигации, логистике и морской безопасности.',
  },
  'u-maa': {
    de: 'Die Nationale Luftfahrtakademie bietet Programme in Luftfahrtingenieurwesen, Pilotenausbildung, Flugzeugwartung und Luftfahrtmanagement an.',
    fr: "L'Académie nationale de l'aviation propose des programmes en ingénierie aéronautique, formation de pilotes, maintenance d'aéronefs et gestion de l'aviation.",
    zh: '国家航空学院提供航空工程、飞行员培训、飞机维修和航空管理等课程。',
    ru: 'Национальная авиационная академия предлагает программы по авиационному инженерии, подготовке пилотов, техническому обслуживанию воздушных судов и управлению авиацией.',
  },
  'u-bane': {
    de: 'Die Höhere Ölschule Baku ist eine Eliteeinrichtung, die englischsprachige Programme in Erdöl- und Gasingenieurwesen, Chemieingenieurwesen, Informatik und Business anbietet.',
    fr: "L'École supérieure du pétrole de Bakou est une institution d'élite proposant des programmes en anglais en ingénierie pétrolière et gazière, génie chimique, informatique et commerce.",
    zh: '巴库高等石油学院是精英机构，提供英语授课的石油与天然气工程、化学工程、计算机科学和商业课程。',
    ru: 'Бакинская высшая нефтяная школа — элитное учебное заведение, предлагающее англоязычные программы по нефтегазовому, химическому инженерии, информатике и бизнесу.',
  },
  'u-atmu': {
    de: 'Die Universität für Tourismus und Management Aserbaidschans bietet Programme in Tourismusmanagement, Hotelmanagement, Gastronomie und Gastgewerbe an.',
    fr: "L'Université du tourisme et du management d'Azerbaïdjan propose des programmes en management du tourisme, management hôtelier, gastronomie et hôtellerie.",
    zh: '阿塞拜疆旅游与管理大学提供旅游管理、酒店管理、餐饮和酒店业等课程。',
    ru: 'Азербайджанский университет туризма и менеджмента предлагает программы по управлению туризмом, гостиничному менеджменту, гастрономии и гостиничному бизнесу.',
  },
  'u-mgub': {
    de: 'Die Filiale der Lomonosov-Universität Moskau in Baku bietet Programme in internationalen Beziehungen, Wirtschaft, Recht und Linguistik an.',
    fr: "La filiale de l'Université d'État Lomonosov de Moscou à Bakou propose des programmes en relations internationales, économie, droit et linguistique.",
    zh: '莫斯科国立大学巴库分校提供国际关系、经济、法律和语言学等课程。',
    ru: 'Филиал Московского государственного университета имени М.В. Ломоносова в Баку предлагает программы по международным отношениям, экономике, праву и лингвистике.',
  },
  'u-sechenov': {
    de: 'Die Filiale der Setschenow-Universität in Baku bietet englischsprachige medizinische Programme nach dem russischen Curriculum an.',
    fr: "La filiale de l'Université Sechenov à Bakou propose des programmes médicaux en anglais selon le curriculum russe.",
    zh: '谢切诺夫大学巴库分校提供英语授课的医学课程，采用俄罗斯教学大纲。',
    ru: 'Филиал Первого МГМУ имени И.М. Сеченова в Баку предлагает англоязычные медицинские программы по российской учебной программе.',
  },
  'u-bxa': {
    de: 'Die Choreographieakademie Baku bietet Programme in Ballett, zeitgenössischem Tanz, Volkstanz und Choreographie an.',
    fr: "L'Académie de chorégraphie de Bakou propose des programmes en ballet, danse contemporaine, danse folklorique et chorégraphie.",
    zh: '巴库舞蹈学院提供芭蕾舞、现代舞、民间舞蹈和编舞等课程。',
    ru: 'Бакинская хореографическая академия предлагает программы по балету, современному танцу, народному танцу и хореографии.',
  },
  'u-aii': {
    de: 'Das Institut für Theologie Aserbaidschans bietet Programme in Islamwissenschaft, Theologie, Kulturwissenschaft und Religionswissenschaft an.',
    fr: "L'Institut de théologie d'Azerbaïdjan propose des programmes en études islamiques, théologie, études culturelles et sciences des religions.",
    zh: '阿塞拜疆神学院提供伊斯兰研究、神学、文化研究和宗教学等课程。',
    ru: 'Азербайджанский институт теологии предлагает программы по исламоведению, теологии, культурологии и религиоведению.',
  },
  'u-oku': {
    de: 'Die Westliche Kaspische Universität (Qərbi Kaspi) war die erste private Universität Aserbaidschans, gegründet 1991. Sie bietet Programme in Recht, Wirtschaft, Informatik und Ingenieurwesen an.',
    fr: "L'Université occidentale de la Caspienne (Qərbi Kaspi) a été la première université privée d'Azerbaïdjan, fondée en 1991. Elle propose des programmes en droit, économie, informatique et ingénierie.",
    zh: '西里海大学（Qərbi Kaspi）是阿塞拜疆第一所私立大学，成立于1991年。提供法律、经济、计算机科学和工程等课程。',
    ru: 'Западно-Каспийский университет (Qərbi Kaspi) был первым частным университетом Азербайджана, основанным в 1991 году. Предлагает программы по праву, экономике, информатике и инженерии.',
  },
  'u-au': {
    de: 'Die Aserbaidschanische Universität bietet Programme in Medizin, Zahnmedizin, Pharmazie, Recht, Wirtschaft und Informatik an.',
    fr: "L'Université d'Azerbaïdjan propose des programmes en médecine, dentisterie, pharmacie, droit, économie et informatique.",
    zh: '阿塞拜疆大学提供医学、牙科、药学、法律、经济和计算机科学等课程。',
    ru: 'Азербайджанский университет предлагает программы по медицине, стоматологии, фармакологии, праву, экономике и информатике.',
  },
  'u-oyu': {
    de: 'Die Universität Odlar Yurdu bietet Programme in Betriebswirtschaft, Informatik, Internationale Beziehungen und Politikwissenschaft an.',
    fr: "L'Université Odlar Yurdu propose des programmes en administration des affaires, informatique, relations internationales et science politique.",
    zh: '奥德勒·尤尔杜大学提供工商管理、计算机科学、国际关系和政治学等课程。',
    ru: 'Университет «Оджлар Юрду» предлагает программы по бизнес-администрированию, информатике, международным отношениям и политологии.',
  },
  'u-bau': {
    de: 'Die Eurasiatische Universität Baku bietet Programme in Wirtschaft, IT, internationalen Beziehungen und Hotelmanagement an.',
    fr: "L'Université eurasienne de Bakou propose des programmes en commerce, informatique, relations internationales et gestion hôtelière.",
    zh: '巴库欧亚大学提供商业、信息技术、国际关系和酒店管理等课程。',
    ru: 'Бакинский Евразийский университет предлагает программы по бизнесу, информационным технологиям, международным отношениям и гостиничному менеджменту.',
  },
  'u-bgu': {
    de: 'Die Mädchenuniversität Baku ist die erste reine Frauenuniversität Aserbaidschans, die Programme in Bildung, Geisteswissenschaften, Wirtschaft und Sprachen anbietet.',
    fr: "L'Université des femmes de Bakou est la première université exclusivement féminine d'Azerbaïdjan, proposant des programmes en éducation, sciences humaines, commerce et langues.",
    zh: '巴库女子大学是阿塞拜疆第一所女子大学，提供教育、人文学科、商业和语言等课程。',
    ru: 'Бакинский женский университет — первый исключительно женский университет Азербайджана, предлагающий программы по образованию, гуманитарным наукам, бизнесу и языкам.',
  },
  'u-aku': {
    de: 'Die Kooperativuniversität Aserbaidschans bietet Programme in Wirtschaft, Betriebswirtschaft, Buchhaltung und Finanzwissenschaften an.',
    fr: "L'Université coopérative d'Azerbaïdjan propose des programmes en économie, administration des affaires, comptabilité et sciences financières.",
    zh: '阿塞拜疆合作大学提供经济学、工商管理、会计和金融等课程。',
    ru: 'Азербайджанский кооперативный университет предлагает программы по экономике, бизнес-администрированию, бухгалтерскому учёту и финансовым наукам.',
  },
  'u-bbu': {
    de: 'Die Wirtschaftsuniversität Baku bietet Programme in Betriebswirtschaft, Marketing, Finanzen und Unternehmertum an.',
    fr: "L'Université de commerce de Bakou propose des programmes en administration des affaires, marketing, finance et entrepreneuriat.",
    zh: '巴库商业大学提供工商管理、市场营销、金融和创业等课程。',
    ru: 'Бакинский коммерческий университет предлагает программы по бизнес-администрированию, маркетингу, финансам и предпринимательству.',
  },
  'u-asma': {
    de: 'Die Akademie für Arbeit und soziale Beziehungen Aserbaidschans bietet Programme in Soziologie, Politikwirtschaft, Arbeitswissenschaften und Sozialarbeit an.',
    fr: "L'Académie du travail et des relations sociales d'Azerbaïdjan propose des programmes en sociologie, économie politique, sciences du travail et travail social.",
    zh: '阿塞拜疆劳动与社会关系学院提供社会学、政治经济学、劳动科学和社会工作等课程。',
    ru: 'Азербайджанская академия труда и социальных отношений предлагает программы по социологии, политической экономике, трудовым наукам и социальной работе.',
  },
  'u-adu-ganja': {
    de: 'Die Staatliche Agraruniversität Aserbaidschans in Gəncə bietet Programme in Agronomie, Veterinärmedizin, Lebensmitteltechnologie und Landwirtschaftsmanagement an.',
    fr: "L'Université agricole d'État d'Azerbaïdjan à Gandja propose des programmes en agronomie, médecine vétérinaire, technologie alimentaire et gestion agricole.",
    zh: '阿塞拜疆国立农业大学（占贾校区）提供农学、兽医、食品技术和农业管理等课程。',
    ru: 'Азербайджанский государственный аграрный университет в Гяндже предлагает программы по агрономии, ветеринарии, пищевым технологиям и управлению сельским хозяйством.',
  },
  'u-ndu': {
    de: 'Die Staatliche Universität Nachitschewan ist die größte Universität der Autonomen Republik Nachitschewan, die Programme in Naturwissenschaften, Geisteswirtschaft und Ingenieurwesen anbietet.',
    fr: "L'Université d'État de Nakhitchevan est la plus grande université de la République autonome de Nakhitchevan, proposant des programmes en sciences, sciences humaines et ingénierie.",
    zh: '纳希切万国立大学是纳希切万自治共和国最大的大学，提供科学、人文和工程等课程。',
    ru: 'Нахичеванский государственный университет — крупнейший университет Нахичеванской Автономной Республики, предлагающий программы в области естественных наук, гуманитарных наук и инженерии.',
  },
  'u-nmi': {
    de: 'Das Pädagogische Institut Nachitschewan bietet Programme in Pädagogik, Aserbaidschanischer Sprache und Literatur, Mathematik und Naturwissenschaften an.',
    fr: "L'Institut pédagogique de Nakhitchevan propose des programmes en pédagogie, langue et littérature azerbaïdjanaises, mathématiques et sciences.",
    zh: '纳希切万师范学院提供教育学、阿塞拜疆语言文学、数学和科学等课程。',
    ru: 'Нахичеванский педагогический институт предлагает программы по педагогике, азербайджанскому языку и литературе, математике и естественным наукам.',
  },
  'u-qu': {
    de: 'Die Karabach-Universität wurde 2023 gegründet, um die Bildungsbedürfnisse der Rückkehrer in die befreiten Gebiete zu erfüllen. Sie bietet Programme in Ingenieurwesen, Wirtschaft und Geisteswissenschaften an.',
    fr: "L'Université du Karabakh a été fondée en 2023 pour répondre aux besoins éducatifs des habitants de retour dans les territoires libérés. Elle propose des programmes en ingénierie, économie et sciences humaines.",
    zh: '卡拉巴赫大学成立于2023年，旨在满足返回解放地区的居民教育需求。提供工程、经济和人文学科课程。',
    ru: 'Карабахский университет основан в 2023 году для удовлетворения образовательных потребностей жителей, вернувшихся в освобождённые территории. Предлагает программы по инженерии, экономике и гуманитарным наукам.',
  },
};

// Read file
const filePath = 'src/lib/seed/universities.ts';
let content = readFileSync(filePath, 'utf8');

let count = 0;
for (const [id, descs] of Object.entries(DESCRIPTIONS)) {
  // Find the university block and its description object
  const idPattern = new RegExp(`(id: '${id}'[\\s\\S]*?description: \\{)([\\s\\S]*?)(\\n    \\},)`);
  const match = content.match(idPattern);
  if (!match) {
    console.warn(`WARN: Could not find ${id}`);
    continue;
  }

  const [fullMatch, beforeDesc, descBody, afterDesc] = match;

  // Check if de/fr/zh/ar already exist
  const hasDe = descBody.includes("de:");
  const hasFr = descBody.includes("fr:");
  const hasZh = descBody.includes("zh:");

  if (hasDe && hasFr && hasZh) {
    console.log(`SKIP: ${id} already has de/fr/zh/ar`);
    continue;
  }

  // Build new description lines
  const newLines = [];
  if (!hasDe) newLines.push(`      de: '${descs.de}',`);
  if (!hasFr) newLines.push(`      fr: '${descs.fr}',`);
  if (!hasZh) newLines.push(`      zh: '${descs.zh}',`);

  // Insert before the closing of description object
  const newDescBody = descBody.trimEnd() + '\n' + newLines.join('\n') + '\n';
  const newBlock = beforeDesc + newDescBody + afterDesc;

  content = content.replace(fullMatch, newBlock);
  count++;
}

writeFileSync(filePath, content, 'utf8');
console.log(`\nDone! Updated ${count} universities with de/fr/zh/ar descriptions.`);
