/**
 * ChemPulse — Chemical Data & Periodic Knowledge Base
 * Fully localized in Ukrainian with accurate chemical properties.
 */

const ELEMENTS_DATA = [
  {
    number: 1, symbol: "H", name: "Гідроген", mass: "1.008", en: 2.20,
    period: 1, group: 1, valence: 1, shells: [1],
    category: "nonmetal", config: "1s¹", oxidation: "+1, -1", radius: 53,
    fact: "Найпоширеніший хімічний елемент у Всесвіті (понад 75% усієї видимої маси). Головне паливо зірок."
  },
  {
    number: 2, symbol: "He", name: "Гелій", mass: "4.0026", en: 0,
    period: 1, group: 18, valence: 0, shells: [2],
    category: "noble", config: "1s²", oxidation: "0", radius: 31,
    fact: "Другий за поширеністю елемент Всесвіту. Має завершений 2-електронний дублет, тому хімічно інертний."
  },
  {
    number: 3, symbol: "Li", name: "Літій", mass: "6.94", en: 0.98,
    period: 2, group: 1, valence: 1, shells: [2, 1],
    category: "alkali", config: "[He] 2s¹", oxidation: "+1", radius: 167,
    fact: "Найлегший твердий метал на Землі; може плавати на поверхні води чи гасу."
  },
  {
    number: 4, symbol: "Be", name: "Берилій", mass: "9.0122", en: 1.57,
    period: 2, group: 2, valence: 2, shells: [2, 2],
    category: "alkaline-earth", config: "[He] 2s²", oxidation: "+2", radius: 112,
    fact: "Міцний та легкий метал, незамінний в аерокосмічній галузі та вікнах рентгенівських трубок."
  },
  {
    number: 5, symbol: "B", name: "Бор", mass: "10.81", en: 2.04,
    period: 2, group: 13, valence: 3, shells: [2, 3],
    category: "metalloid", config: "[He] 2s² 2p¹", oxidation: "+3", radius: 87,
    fact: "Напівметал із надзвичайною твердістю; використовується у бронежилетах та термостійкому склі (боросилікат)."
  },
  {
    number: 6, symbol: "C", name: "Карбон", mass: "12.011", en: 2.55,
    period: 2, group: 14, valence: 4, shells: [2, 4],
    category: "nonmetal", config: "[He] 2s² 2p²", oxidation: "-4, +2, +4", radius: 67,
    fact: "Основа всього органічного життя. Утворює як найм'якший мінерал (графіт), так і найтвердіший (алмаз)."
  },
  {
    number: 7, symbol: "N", name: "Нітроген", mass: "14.007", en: 3.04,
    period: 2, group: 15, valence: 3, shells: [2, 5],
    category: "nonmetal", config: "[He] 2s² 2p³", oxidation: "-3, +1..+5", radius: 56,
    fact: "Складає 78% атмосфери Землі. Утворює надміцний потрійний ковалентний зв'язок у молекулі N₂."
  },
  {
    number: 8, symbol: "O", name: "Оксиген", mass: "15.999", en: 3.44,
    period: 2, group: 16, valence: 2, shells: [2, 6],
    category: "nonmetal", config: "[He] 2s² 2p⁴", oxidation: "-2, -1, +2", radius: 48,
    fact: "Другий за електронегативністю елемент періодичної системи. Необхідний для дихання і горіння."
  },
  {
    number: 9, symbol: "F", name: "Флуор", mass: "18.998", en: 3.98,
    period: 2, group: 17, valence: 1, shells: [2, 7],
    category: "halogen", config: "[He] 2s² 2p⁵", oxidation: "-1", radius: 42,
    fact: "Абсолютний чемпіон за електронегативністю (3.98). Найсильніший окисник серед усіх відомих речовин."
  },
  {
    number: 10, symbol: "Ne", name: "Неон", mass: "20.180", en: 0,
    period: 2, group: 18, valence: 0, shells: [2, 8],
    category: "noble", config: "[He] 2s² 2p⁶", oxidation: "0", radius: 38,
    fact: "Має ідеальний стійкий октет із 8 валентних електронів. Світиться яскравим червоно-оранжевим кольором у трубках."
  },
  {
    number: 11, symbol: "Na", name: "Натрій", mass: "22.990", en: 0.93,
    period: 3, group: 1, valence: 1, shells: [2, 8, 1],
    category: "alkali", config: "[Ne] 3s¹", oxidation: "+1", radius: 190,
    fact: "М'який лужний метал, який можна різати ножем. Бурхливо взаємодіє з водою з виділенням водню."
  },
  {
    number: 12, symbol: "Mg", name: "Магній", mass: "24.305", en: 1.31,
    period: 3, group: 2, valence: 2, shells: [2, 8, 2],
    category: "alkaline-earth", config: "[Ne] 3s²", oxidation: "+2", radius: 145,
    fact: "Горить сліпучо-білим полум'ям; входить до складу хлорофілу рослин, роблячи фотосинтез можливим."
  },
  {
    number: 13, symbol: "Al", name: "Алюміній", mass: "26.982", en: 1.61,
    period: 3, group: 13, valence: 3, shells: [2, 8, 3],
    category: "post-transition", config: "[Ne] 3s² 3p¹", oxidation: "+3", radius: 118,
    fact: "Найпоширеніший метал у земній корі (близько 8% її маси). Легкий, стійкий до корозії завдяки оксидній плівці."
  },
  {
    number: 14, symbol: "Si", name: "Силіцій", mass: "28.085", en: 1.90,
    period: 3, group: 14, valence: 4, shells: [2, 8, 4],
    category: "metalloid", config: "[Ne] 3s² 3p²", oxidation: "-4, +4", radius: 111,
    fact: "Серце сучасної мікроелектроніки (напівпровідникові кремнієві чіпи). Складає основу піску і скла."
  },
  {
    number: 15, symbol: "P", name: "Фосфор", mass: "30.974", en: 2.19,
    period: 3, group: 15, valence: 3, shells: [2, 8, 5],
    category: "nonmetal", config: "[Ne] 3s² 3p³", oxidation: "-3, +3, +5", radius: 98,
    fact: "Білий фосфор світиться в темряві через повільне окиснення; необхідний елемент для ДНК і молекул АТФ."
  },
  {
    number: 16, symbol: "S", name: "Сульфур", mass: "32.06", en: 2.58,
    period: 3, group: 16, valence: 2, shells: [2, 8, 6],
    category: "nonmetal", config: "[Ne] 3s² 3p⁴", oxidation: "-2, +4, +6", radius: 88,
    fact: "Жовта кристалічна речовина; входить до складу білків (кератину волосся) та сірчаної кислоти."
  },
  {
    number: 17, symbol: "Cl", name: "Хлор", mass: "35.45", en: 3.16,
    period: 3, group: 17, valence: 1, shells: [2, 8, 7],
    category: "halogen", config: "[Ne] 3s² 3p⁵", oxidation: "-1, +1..+7", radius: 79,
    fact: "Жовто-зелений отруйний газ із різким запахом. Один із ключових компонентів кухонної солі NaCl."
  },
  {
    number: 18, symbol: "Ar", name: "Аргон", mass: "39.948", en: 0,
    period: 3, group: 18, valence: 0, shells: [2, 8, 8],
    category: "noble", config: "[Ne] 3s² 3p⁶", oxidation: "0", radius: 71,
    fact: "Складає майже 1% атмосфери Землі. Використовується як захисне інертне середовище при зварюванні металів."
  },
  {
    number: 19, symbol: "K", name: "Калій", mass: "39.098", en: 0.82,
    period: 4, group: 1, valence: 1, shells: [2, 8, 8, 1],
    category: "alkali", config: "[Ar] 4s¹", oxidation: "+1", radius: 243,
    fact: "Критично важливий електроліт для передачі нервових імпульсів та скорочення серцевого м'яза людини."
  },
  {
    number: 20, symbol: "Ca", name: "Кальцій", mass: "40.078", en: 1.00,
    period: 4, group: 2, valence: 2, shells: [2, 8, 8, 2],
    category: "alkaline-earth", config: "[Ar] 4s²", oxidation: "+2", radius: 194,
    fact: "Головний будівельний матеріал кісток і зубів (у вигляді гідроксиапатиту); забарвлює полум'я в цегляно-червоний."
  },
  {
    number: 21, symbol: "Sc", name: "Скандій", mass: "44.956", en: 1.36,
    period: 4, group: 3, valence: 3, shells: [2, 8, 9, 2],
    category: "transition", config: "[Ar] 3d¹ 4s²", oxidation: "+3", radius: 184,
    fact: "Рідкісний перехідний метал; сплави алюмінію зі скандієм використовуються у висококласних спортивних рамах і винищувачах."
  },
  {
    number: 22, symbol: "Ti", name: "Титан", mass: "47.867", en: 1.54,
    period: 4, group: 4, valence: 4, shells: [2, 8, 10, 2],
    category: "transition", config: "[Ar] 3d² 4s²", oxidation: "+4", radius: 176,
    fact: "Метал із міцністю сталі, але на 45% легший. Повністю біосумісний, тому використовується для медичних імплантів."
  },
  {
    number: 23, symbol: "V", name: "Ванадій", mass: "50.942", en: 1.63,
    period: 4, group: 5, valence: 5, shells: [2, 8, 11, 2],
    category: "transition", config: "[Ar] 3d³ 4s²", oxidation: "+5", radius: 171,
    fact: "Названий на честь скандинавської богині краси Ванадіс завдяки дивовижній різноманітності кольорів його розчинів."
  },
  {
    number: 24, symbol: "Cr", name: "Хром", mass: "51.996", en: 1.66,
    period: 4, group: 6, valence: 6, shells: [2, 8, 13, 1],
    category: "transition", config: "[Ar] 3d⁵ 4s¹", oxidation: "+2, +3, +6", radius: 166,
    fact: "Найтвердіший чистий метал на Землі. Надає дзеркальний блиск деталям та захищає нержавіючу сталь від іржі."
  },
  {
    number: 25, symbol: "Mn", name: "Манган", mass: "54.938", en: 1.55,
    period: 4, group: 7, valence: 7, shells: [2, 8, 13, 2],
    category: "transition", config: "[Ar] 3d⁵ 4s²", oxidation: "+2, +4, +7", radius: 161,
    fact: "Сполука KMnO₄ (марганцівка) — відомий антисептик з інтенсивним фіолетовим забарвленням."
  },
  {
    number: 26, symbol: "Fe", name: "Ферум", mass: "55.845", en: 1.83,
    period: 4, group: 8, valence: 2, shells: [2, 8, 14, 2],
    category: "transition", config: "[Ar] 3d⁶ 4s²", oxidation: "+2, +3", radius: 156,
    fact: "Основа важкої промисловості людства та ключовий атом у гемоглобіні крові, що зв'язує кисень."
  },
  {
    number: 27, symbol: "Co", name: "Кобальт", mass: "58.933", en: 1.88,
    period: 4, group: 9, valence: 2, shells: [2, 8, 15, 2],
    category: "transition", config: "[Ar] 3d⁷ 4s²", oxidation: "+2, +3", radius: 152,
    fact: "Надає склу та кераміці глибокого синього відтінку; входить до складу вітаміну B₁₂."
  },
  {
    number: 28, symbol: "Ni", name: "Нікель", mass: "58.693", en: 1.91,
    period: 4, group: 10, valence: 2, shells: [2, 8, 16, 2],
    category: "transition", config: "[Ar] 3d⁸ 4s²", oxidation: "+2", radius: 149,
    fact: "Ковкий метал зі сріблястим блиском; входить до складу ядра Землі разом із залізом."
  },
  {
    number: 29, symbol: "Cu", name: "Купрум", mass: "63.546", en: 1.90,
    period: 4, group: 11, valence: 2, shells: [2, 8, 18, 1],
    category: "transition", config: "[Ar] 3d¹⁰ 4s¹", oxidation: "+1, +2", radius: 145,
    fact: "Один із перших металів, освоєних людством; має виняткову тепло- та електропровідність."
  },
  {
    number: 30, symbol: "Zn", name: "Цинк", mass: "65.38", en: 1.65,
    period: 4, group: 12, valence: 2, shells: [2, 8, 18, 2],
    category: "transition", config: "[Ar] 3d¹⁰ 4s²", oxidation: "+2", radius: 142,
    fact: "Оцинковане залізо захищене від корозії; цинк необхідний для функціонування імунної системи."
  },
  {
    number: 31, symbol: "Ga", name: "Галій", mass: "69.723", en: 1.81,
    period: 4, group: 13, valence: 3, shells: [2, 8, 18, 3],
    category: "post-transition", config: "[Ar] 3d¹⁰ 4s² 4p¹", oxidation: "+3", radius: 136,
    fact: "Тане просто в долоні людини при температурі 29.8°C; був передбачений Менделєєвим як 'ека-алюміній'."
  },
  {
    number: 32, symbol: "Ge", name: "Германій", mass: "72.630", en: 2.01,
    period: 4, group: 14, valence: 4, shells: [2, 8, 18, 4],
    category: "metalloid", config: "[Ar] 3d¹⁰ 4s² 4p²", oxidation: "+4", radius: 125,
    fact: "Передбачений Менделєєвим 'ека-силіцій'. Використовується в оптиці інфрачервоного бачення."
  },
  {
    number: 33, symbol: "As", name: "Арсен", mass: "74.922", en: 2.18,
    period: 4, group: 15, valence: 3, shells: [2, 8, 18, 5],
    category: "metalloid", config: "[Ar] 3d¹⁰ 4s² 4p³", oxidation: "-3, +3, +5", radius: 114,
    fact: "Історично сумнозвісний отруйний напівметал; сьогодні застосовується у лазерних діодах (GaAs)."
  },
  {
    number: 34, symbol: "Se", name: "Селен", mass: "78.971", en: 2.55,
    period: 4, group: 16, valence: 2, shells: [2, 8, 18, 6],
    category: "nonmetal", config: "[Ar] 3d¹⁰ 4s² 4p⁴", oxidation: "-2, +4, +6", radius: 103,
    fact: "Його електропровідність різко зростає під дією світла, тому використовується у сонячних батареях."
  },
  {
    number: 35, symbol: "Br", name: "Бром", mass: "79.904", en: 2.96,
    period: 4, group: 17, valence: 1, shells: [2, 8, 18, 7],
    category: "halogen", config: "[Ar] 3d¹⁰ 4s² 4p⁵", oxidation: "-1, +1..+7", radius: 94,
    fact: "Єдиний рідкий неметал за звичайних умов (темно-бура рідина з їдкими задушливими парами)."
  },
  {
    number: 36, symbol: "Kr", name: "Криптон", mass: "83.798", en: 3.00,
    period: 4, group: 18, valence: 0, shells: [2, 8, 18, 8],
    category: "noble", config: "[Ar] 3d¹⁰ 4s² 4p⁶", oxidation: "0", radius: 88,
    fact: "Інертний благородний газ. Раніше метр офіційно визначався за довжиною хвилі світла ізотопу Kr-86."
  },
  // Key heavy elements
  {
    number: 47, symbol: "Ag", name: "Аргентум", mass: "107.87", en: 1.93,
    period: 5, group: 11, valence: 1, shells: [2, 8, 18, 18, 1],
    category: "transition", config: "[Kr] 4d¹⁰ 5s¹", oxidation: "+1", radius: 165,
    fact: "Має найвищу електропровідність та оптичну відбивну здатність серед усіх металів на Землі."
  },
  {
    number: 53, symbol: "I", name: "Йод", mass: "126.90", en: 2.66,
    period: 5, group: 17, valence: 1, shells: [2, 8, 18, 18, 7],
    category: "halogen", config: "[Kr] 4d¹⁰ 5s² 5p⁵", oxidation: "-1, +1..+7", radius: 115,
    fact: "Фіолетово-чорні кристали, що під час нагрівання легко сублімують (випаровуються без плавлення)."
  },
  {
    number: 79, symbol: "Au", name: "Аурум", mass: "196.97", en: 2.54,
    period: 6, group: 11, valence: 1, shells: [2, 8, 18, 32, 18, 1],
    category: "transition", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", oxidation: "+1, +3", radius: 174,
    fact: "Шляхетний метал, що не окиснюється на повітрі. З 1 грама золота можна витягнути дріт завдовжки 3 кілометри."
  }
];

// Presets for the Chemical Bond Simulator
const BOND_PRESETS = {
  nacl: {
    atom1: "Na",
    atom2: "Cl",
    formula: "NaCl",
    name: "Натрій хлорид (Кухонна сіль)",
    type: "ionic",
    typeName: "Йонний зв'язок",
    mechanism: "Різниця електронегативностей Δχ = 2.23 (> 1.7). Електрон повністю переходить від Натрію (Na) до Хлору (Cl). Утворюються йони Na⁺ та Cl⁻, які міцно утримуються електростатичними кулонівськими силами.",
    properties: [
      "Кристалічна ґратка: йонна",
      "Висока температура плавлення (801 °C)",
      "Розчини та розплави проводять струм (електроліти)",
      "Твердий, крихкий кристалічний стан"
    ],
    lewis: "[Na]⁺  :Cl̈:⁻"
  },
  h2o: {
    atom1: "H",
    atom2: "O",
    formula: "H₂O",
    name: "Вода",
    type: "polar",
    typeName: "Ковалентний полярний",
    mechanism: "Різниця електронегативностей Δχ = 1.24 (знаходиться в межах 0.4 < Δχ ≤ 1.7). Обидва атоми — неметали. Спільні електронні пари зміщені до більш електронегативного Оксигену (δ⁻), утворюючи диполь.",
    properties: [
      "Молекулярна кристалічна ґратка (у твердому стані — лід)",
      "Універсальний полярний розчинник на Землі",
      "Утворює водневі зв'язки між сусідніми молекулами",
      "Низька електропровідність чистої води"
    ],
    lewis: "H : Ö̈ : H"
  },
  hcl: {
    atom1: "H",
    atom2: "Cl",
    formula: "HCl",
    name: "Хлороводень",
    type: "polar",
    typeName: "Ковалентний полярний",
    mechanism: "Різниця електронегативностей Δχ = 0.96. Хлор сильніше притягує спільну електронну пару, ніж Гідроген. Молекула поляризується: H(δ⁺)—Cl(δ⁻).",
    properties: [
      "Безбарвний газ із різким запахом за нормальних умов",
      "Водний розчин — сильна хлоридна (соляна) кислота",
      "Молекулярна будова з низькою температурою кипіння (-85 °C)"
    ],
    lewis: "H : Cl̈:"
  },
  o2: {
    atom1: "O",
    atom2: "O",
    formula: "O₂",
    name: "Кисень",
    type: "nonpolar",
    typeName: "Ковалентний неполярний",
    mechanism: "Різниця електронегативностей Δχ = 0.00. Атоми Оксигену мають однакову електронегативність, тому спільні дві електронні пари розміщені абсолютно симетрично між ядрами.",
    properties: [
      "Молекулярна структура (подвійний зв'язок O=O)",
      "Газ без кольору і запаху, слабко розчинний у воді",
      "Дуже низька температура кипіння (-183 °C)",
      "Не проводить електричний струм"
    ],
    lewis: ":Ö::Ö:"
  },
  ch4: {
    atom1: "C",
    atom2: "H",
    formula: "CH₄",
    name: "Метан (Природний газ)",
    type: "polar",
    typeName: "Ковалентний слабополярний",
    mechanism: "Різниця електронегативностей Δχ = 0.35. Зв'язки C-H мають дуже низьку полярність, а через симетричну тетраедричну геометрію вся молекула метану загалом є неполярною.",
    properties: [
      "Легкий горючий газ без запаху",
      "Основна складова природного газу (до 98%)",
      "Не розчиняється у воді"
    ],
    lewis: "H : C̈(H₂) : H"
  },
  fefe: {
    atom1: "Fe",
    atom2: "Fe",
    formula: "Fe-Fe",
    name: "Залізо (Металічний стан)",
    type: "metallic",
    typeName: "Металічний зв'язок",
    mechanism: "Утворюється між атомами металів. Валентні електрони усуспільнюються всією кристалічною ґраткою, утворюючи рухливий 'електронний газ' навколо позитивних йонів заліза.",
    properties: [
      "Металічна кристалічна ґратка",
      "Висока тепло- та електропровідність",
      "Пластичність, ковкість та металічний блиск",
      "Феромагнітні властивості (притягується магнітом)"
    ],
    lewis: "[Fe²⁺] e⁻ [Fe²⁺] e⁻"
  }
};

// Quiz Questions Bank — Тема: Хімічний зв'язок (11 клас, жовтень)
const QUIZ_QUESTIONS = [
  {
    question: "Що таке хімічний зв'язок?",
    options: [
      "Зіткнення атомів під час хімічної реакції",
      "Електростатична взаємодія, що утримує атоми разом у молекулі або кристалі",
      "Рух електронів всередині одного атома",
      "Сила тяжіння між молекулами газу"
    ],
    correctIndex: 1,
    explanation: "Хімічний зв'язок — це електростатична взаємодія між атомами, що зумовлює їх поєднання в молекули або кристали. Він виникає через взаємодію електронів і ядер сусідніх атомів і є основою хімії."
  },
  {
    question: "Який тип хімічного зв'язку утворюється між атомами металу Натрію (Na) та неметалу Хлору (Cl)? (ЕН: Na = 0.93, Cl = 3.16, Δχ = 2.23)",
    options: [
      "Ковалентний неполярний зв'язок",
      "Металічний зв'язок",
      "Йонний зв'язок",
      "Ковалентний полярний зв'язок"
    ],
    correctIndex: 2,
    explanation: "Різниця електронегативностей Δχ = 3.16 − 0.93 = 2.23, що більше за 1.7. Натрій повністю віддає електрон Хлору → утворюються йони Na⁺ і Cl⁻, між якими діє електростатичне притягання — йонний зв'язок."
  },
  {
    question: "Що таке правило октету і навіщо воно виникає?",
    options: [
      "Атоми прагнуть мати 8 протонів у ядрі",
      "Атоми прагнуть набути 8 валентних електронів, як у найближчого інертного газу, бо це найстабільніша конфігурація",
      "Атоми можуть утворювати лише 8 хімічних зв'язків",
      "Молекули стабільні, коли мають рівно 8 атомів"
    ],
    correctIndex: 1,
    explanation: "Правило октету: атоми в хімічних реакціях намагаються набути 8 електронів на зовнішньому рівні (як у благородних газів Ne, Ar), бо така електронна конфігурація є найенергетично вигіднішою і стійкою."
  },
  {
    question: "Визнач тип хімічного зв'язку в молекулі O₂ (обидва атоми Оксигену, ЕН = 3.44):",
    options: [
      "Йонний зв'язок",
      "Ковалентний полярний зв'язок",
      "Ковалентний неполярний зв'язок",
      "Металічний зв'язок"
    ],
    correctIndex: 2,
    explanation: "Різниця ЕН Δχ = 3.44 − 3.44 = 0.00. Обидва атоми однакові, тому спільні електронні пари (подвійний зв'язок O=O) розташовані строго посередині. Це ковалентний неполярний зв'язок."
  },
  {
    question: "Чим металічний зв'язок відрізняється від йонного та ковалентного?",
    options: [
      "У металічному зв'язку атоми взагалі не взаємодіють між собою",
      "Металічний зв'язок — це взаємодія між катіонами металу та спільним 'електронним газом' з усуспільнених валентних електронів",
      "Металічний зв'язок утворюється тільки між неметалами",
      "Металічний зв'язок можливий лише у розплавленому стані"
    ],
    correctIndex: 1,
    explanation: "У металах валентні електрони не належать конкретним атомам, а вільно переміщуються по всій кристалічній ґратці ('електронний газ'). Саме ця особливість пояснює електропровідність, теплопровідність та ковкість металів."
  },
  {
    question: "Яка з наведених речовин має йонний зв'язок і йонну кристалічну ґратку?",
    options: [
      "H₂O (вода)",
      "O₂ (кисень)",
      "Fe (залізо)",
      "NaCl (кухонна сіль)"
    ],
    correctIndex: 3,
    explanation: "NaCl (натрій хлорид) — класичний приклад йонного зв'язку. Він складається з катіонів Na⁺ і аніонів Cl⁻, що утворюють тверду йонну кристалічну ґратку з високою температурою плавлення (801°C) та електропровідністю у розплаві."
  }
];

// Helper to calculate bond type between any two elements
function calculateBondInfo(el1, el2) {
  const isMetal1 = ["alkali", "alkaline-earth", "transition", "post-transition"].includes(el1.category);
  const isMetal2 = ["alkali", "alkaline-earth", "transition", "post-transition"].includes(el2.category);

  // Metal + Metal
  if (isMetal1 && isMetal2) {
    return {
      type: "metallic",
      typeName: "Металічний зв'язок",
      deltaEn: Math.abs(el1.en - el2.en).toFixed(2),
      mechanism: `Обидва елементи є металами (${el1.name} та ${el2.name}). Їхні валентні електрони легко відриваються й вільно рухаються по всій ґратці, утворюючи міцний металічний зв'язок.`,
      properties: [
        "Металічна кристалічна ґратка",
        "Висока пластичність та ковкість",
        "Добра електро- та теплопровідність"
      ],
      lewis: `[${el1.symbol}]⁺ e⁻ [${el2.symbol}]⁺`
    };
  }

  // Inert gases check
  if (el1.category === "noble" || el2.category === "noble") {
    return {
      type: "noble",
      typeName: "Хімічний зв'язок не утворюється",
      deltaEn: "0.00",
      mechanism: `Один або обидва елементи є благородними інертними газами із завершеною оболонкою. У нормальних умовах вони не утворюють хімічних сполук.`,
      properties: ["Інертний стан", "Існує у формі окремих одноатомних молекул"],
      lewis: `${el1.symbol}  ${el2.symbol}`
    };
  }

  const deltaEn = Math.abs(el1.en - el2.en);

  // Ionic bond
  if (deltaEn > 1.7 && (isMetal1 || isMetal2)) {
    const metal = isMetal1 ? el1 : el2;
    const nonmetal = isMetal1 ? el2 : el1;
    return {
      type: "ionic",
      typeName: "Йонний зв'язок",
      deltaEn: deltaEn.toFixed(2),
      mechanism: `Різниця електронегативностей Δχ = ${deltaEn.toFixed(2)} (> 1.7). Метал ${metal.name} віддає валентний електрон неметалу ${nonmetal.name}. Виникають протилежно заряджені йони (${metal.symbol}⁺ та ${nonmetal.symbol}⁻), які притягуються.`,
      properties: [
        "Йонна кристалічна ґратка",
        "Висока твердість та крихкість",
        "Розчини й розплави проводять електричний струм",
        "Високі температури плавлення"
      ],
      lewis: `[${metal.symbol}]⁺ [:${nonmetal.symbol}̈:]⁻`
    };
  }

  // Polar covalent
  if (deltaEn > 0.4) {
    const moreEn = el1.en > el2.en ? el1 : el2;
    const lessEn = el1.en > el2.en ? el2 : el1;
    return {
      type: "polar",
      typeName: "Ковалентний полярний",
      deltaEn: deltaEn.toFixed(2),
      mechanism: `Різниця електронегативностей Δχ = ${deltaEn.toFixed(2)} (0.4 < Δχ ≤ 1.7). Спільна електронна хмара зміщується в бік більш електронегативного атома (${moreEn.name}), утворюючи часткові заряди (δ⁺ на ${lessEn.symbol}, δ⁻ на ${moreEn.symbol}).`,
      properties: [
        "Молекулярна будова (зазвичай рідини або гази)",
        "Полярність молекул",
        "Низькі температури плавлення та кипіння"
      ],
      lewis: `${lessEn.symbol} : ${moreEn.symbol}`
    };
  }

  // Nonpolar covalent
  return {
    type: "nonpolar",
    typeName: "Ковалентний неполярний",
    deltaEn: deltaEn.toFixed(2),
    mechanism: `Різниця електронегативностей Δχ = ${deltaEn.toFixed(2)} (Δχ ≤ 0.4). Обидва атоми мають однакову або майже однакову електронегативність. Спільна електронна пара знаходиться посередині між ядрами.`,
    properties: [
      "Молекулярна кристалічна ґратка",
      "Симетричний розподіл електронної густини",
      "Не розчиняється або погано розчиняється у воді",
      "Діелектрик (не проводить електричний струм)"
    ],
    lewis: `${el1.symbol} : ${el2.symbol}`
  };
}
