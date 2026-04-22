export interface Product {
  id: string;
  name: { ro: string; en: string };
  description: { ro: string; en: string };
  images: string[];
  imageColor: string;
  price: string;
  badge?: { ro: string; en: string };
  details: { ro: string[]; en: string[] };
}

export const products: Product[] = [
  {
    id: "1",
    name: { ro: "Miere de salcâm", en: "Acacia Honey" },
    description: {
      ro: "Mierea de salcâm este una dintre cele mai apreciate sortimente de miere, recunoscută prin culoarea sa deschisă, galben-pai, și gustul delicat, floral. Bogată în fructoză, cristalizează foarte greu, rămânând lichidă timp îndelungat.",
      en: "Acacia honey is one of the most appreciated honey varieties, recognized by its light, straw-yellow color and delicate floral taste. Rich in fructose, it crystallizes very slowly, remaining liquid for a long time.",
    },
    images: ["/photos/salcam1kg01.jpeg", "/photos/fagure.jpg", "/photos/image.jpg"],
    imageColor: "B45309",
    price: "120 MDL",
    badge: { ro: "Bestseller", en: "Bestseller" },
    details: {
      ro: ["100% natural, neprocesată termic", "Fără aditivi sau conservanți", "Recoltată în Moldova", "Cantitate: 500g"],
      en: ["100% natural, not heat-processed", "No additives or preservatives", "Harvested in Moldova", "Weight: 500g"],
    },
  },
  {
    id: "2",
    name: { ro: "Miere de tei", en: "Linden Honey" },
    description: {
      ro: "Mierea de tei are un parfum puternic și caracteristic, cu un gust ușor amărui și aromatic. Este renumită pentru proprietățile sale calmante și este recomandată în special seara, înainte de culcare.",
      en: "Linden honey has a strong and characteristic fragrance, with a slightly bitter and aromatic taste. It is renowned for its calming properties and is especially recommended in the evening before bedtime.",
    },
    images: ["/photos/tei1kg02.png", "/photos/salcam.jpg", "/photos/fagure.jpg"],
    imageColor: "D97706",
    price: "110 MDL",
    badge: { ro: "Popular", en: "Popular" },
    details: {
      ro: ["Efect calmant natural", "Ideală pentru ceai", "Recoltată în Moldova", "Cantitate: 500g"],
      en: ["Natural calming effect", "Ideal for tea", "Harvested in Moldova", "Weight: 500g"],
    },
  },
  {
    id: "3",
    name: { ro: "Miere de flori de câmp", en: "Wildflower Honey" },
    description: {
      ro: "Mierea polifloră provine din nectarul mai multor specii de flori de câmp. Are un gust complex, bogat și aromat, cu nuanțe diferite în funcție de sezon și locul recoltării.",
      en: "Wildflower honey comes from the nectar of multiple wildflower species. It has a complex, rich and aromatic taste, with different nuances depending on the season and harvest location.",
    },
    images: ["/photos/salcam.jpg", "/photos/tei.jpg", "/photos/image.jpg"],
    imageColor: "92400E",
    price: "100 MDL",
    details: {
      ro: ["Aromă complexă și bogată", "Mix natural de flori", "Recoltată în Moldova", "Cantitate: 500g"],
      en: ["Complex and rich aroma", "Natural flower mix", "Harvested in Moldova", "Weight: 500g"],
    },
  },
  {
    id: "4",
    name: { ro: "Țuică de miere", en: "Honey Brandy" },
    description: {
      ro: "Țuica de miere este o băutură tradițională moldovenească, obținută prin fermentarea și distilarea mierii de albine. Are un gust cald, dulceag, cu note florale specifice mierii, și un conținut de alcool moderat.",
      en: "Honey brandy is a traditional Moldovan drink, obtained through the fermentation and distillation of bee honey. It has a warm, sweet taste with floral notes specific to honey, and a moderate alcohol content.",
    },
    images: ["/photos/tuica.jpg", "/photos/image.jpg", "/photos/salcam.jpg"],
    imageColor: "78350F",
    price: "180 MDL",
    badge: { ro: "Exclusiv", en: "Exclusive" },
    details: {
      ro: ["Rețetă tradițională", "Produs artizanal", "Fabricat în Moldova", "Volum: 500ml"],
      en: ["Traditional recipe", "Artisan product", "Made in Moldova", "Volume: 500ml"],
    },
  },
  {
    id: "5",
    name: { ro: "Cadouri de miere", en: "Honey Gift Sets" },
    description: {
      ro: "Setul cadou Melisfera conține o selecție atent aleasă de produse apicole de calitate superioară. Perfect pentru orice ocazie — Crăciun, zile de naștere sau gesturi de apreciere pentru cei dragi.",
      en: "The Melisfera gift set contains a carefully selected collection of premium apiary products. Perfect for any occasion — Christmas, birthdays or appreciation gestures for loved ones.",
    },
    images: ["/photos/cadoumare01.png", "/photos/salcam.jpg", "/photos/tei.jpg"],
    imageColor: "B45309",
    price: "250 MDL",
    badge: { ro: "Cadou ideal", en: "Perfect Gift" },
    details: {
      ro: ["Include 3 sortimente de miere", "Ambalaj cadou elegant", "Personalizabil", "Livrare în toată Moldova"],
      en: ["Includes 3 honey varieties", "Elegant gift packaging", "Customizable", "Delivery across Moldova"],
    },
  },
  {
    id: "6",
    name: { ro: "Fagure de Miere", en: "Honeycomb" },
    description: {
      ro: "Fagurul de miere este mierea în forma sa cea mai pură și naturală, direct din stup. Ceara de albine și mierea formează împreună un produs excepțional, bogat în enzime și antioxidanți.",
      en: "Honeycomb is honey in its purest and most natural form, directly from the hive. Beeswax and honey together form an exceptional product, rich in enzymes and antioxidants.",
    },
    images: ["/photos/fagure.jpg", "/photos/salcam.jpg", "/photos/image.jpg"],
    imageColor: "D97706",
    price: "150 MDL",
    details: {
      ro: ["Formă naturală de miere", "Ceară comestibilă", "Bogat în enzime", "Greutate: 400g"],
      en: ["Natural form of honey", "Edible wax", "Rich in enzymes", "Weight: 400g"],
    },
  },
  {
    id: "7",
    name: { ro: "Polen de Albine", en: "Bee Pollen" },
    description: {
      ro: "Polenul de albine este considerat unul dintre cele mai complete alimente din natură. Conține proteine, aminoacizi esențiali, vitamine și minerale. Este un energizant natural excelent.",
      en: "Bee pollen is considered one of the most complete foods in nature. It contains proteins, essential amino acids, vitamins and minerals. It is an excellent natural energizer.",
    },
    images: ["/photos/polen02.png", "/photos/image.jpg", "/photos/fagure.jpg"],
    imageColor: "F59E0B",
    price: "90 MDL",
    badge: { ro: "Superfood", en: "Superfood" },
    details: {
      ro: ["Bogat în proteine", "Energizant natural", "Recoltat primăvara", "Cantitate: 250g"],
      en: ["Rich in proteins", "Natural energizer", "Spring harvested", "Weight: 250g"],
    },
  },
  {
    id: "8",
    name: { ro: "Propolis", en: "Propolis" },
    description: {
      ro: "Propolisul este o substanță rășinoasă produsă de albine, cu puternice proprietăți antibacteriene și antiinflamatoare. Este folosit în medicina tradițională de secole pentru întărirea sistemului imunitar.",
      en: "Propolis is a resinous substance produced by bees, with powerful antibacterial and anti-inflammatory properties. It has been used in traditional medicine for centuries to strengthen the immune system.",
    },
    images: ["/photos/propolis.jpg", "/photos/image.jpg", "/photos/salcam.jpg"],
    imageColor: "451A03",
    price: "130 MDL",
    badge: { ro: "Imunitate", en: "Immunity" },
    details: {
      ro: ["Proprietăți antibacteriene", "Întărește imunitatea", "Extras natural", "Cantitate: 100g"],
      en: ["Antibacterial properties", "Strengthens immunity", "Natural extract", "Weight: 100g"],
    },
  },
];