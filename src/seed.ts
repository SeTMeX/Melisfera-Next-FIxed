import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { hashPassword } from './lib/password'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@melisfera.md' },
    update: {},
    create: {
      email: 'admin@melisfera.md',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      balance: 0
    }
  })

  console.log('Created admin user:', admin)

  // Create sample products
  const products = [
    {
      name: { ro: "Miere de salcâm", en: "Acacia Honey", ru: "Акациевый мёд" },
      description: {
        ro: "Mierea de salcâm este una dintre cele mai apreciate sortimente de miere, recunoscută prin culoarea sa deschisă, galben-pai, și gustul delicat, floral. Bogată în fructoză, cristalizează foarte greu, rămânând lichidă timp îndelungat.",
        en: "Acacia honey is one of the most appreciated honey varieties, recognized by its light, straw-yellow color and delicate floral taste. Rich in fructose, it crystallizes very slowly, remaining liquid for a long time.",
        ru: "Акациевый мёд — один из самых ценимых сортов мёда, узнаваемый по светло-соломенному цвету и нежному цветочному вкусу. Богат фруктозой, очень медленно кристаллизуется и долго остаётся жидким."
      },
      price: 120,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "0.5 kg", price: 80 },
        { label: "1 kg", price: 150 },
        { label: "5 kg", price: 600 }
      ]),
      images: JSON.stringify(["/photos/salcam1kg01.jpeg", "/photos/fagure.jpg", "/photos/image.jpg"]),
      imageColor: "B45309",
      badge: JSON.stringify({ ro: "Bestseller", en: "Bestseller", ru: "Хит продаж" }),
      details: JSON.stringify({
        ro: ["100% natural, neprocesată termic", "Fără aditivi sau conservanți", "Recoltată în Moldova"],
        en: ["100% natural, not heat-processed", "No additives or preservatives", "Harvested in Moldova"],
        ru: ["100% натуральный, без термообработки", "Без добавок и консервантов", "Собран в Молдове"]
      }),
      inStock: true
    },
    {
      name: { ro: "Miere de tei", en: "Linden Honey", ru: "Липовый мёд" },
      description: {
        ro: "Mierea de tei are un parfum puternic și caracteristic, cu un gust ușor amărui și aromatic. Este renumită pentru proprietățile sale calmante și este recomandată în special seara, înainte de culcare.",
        en: "Linden honey has a strong and characteristic fragrance, with a slightly bitter and aromatic taste. It is renowned for its calming properties and is especially recommended in the evening before bedtime.",
        ru: "Липовый мёд обладает сильным характерным ароматом, слегка горьковатым и ароматным вкусом. Известен своими успокаивающими свойствами и особенно рекомендуется вечером перед сном."
      },
      price: 110,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "0.5 kg", price: 70 },
        { label: "1 kg", price: 130 },
        { label: "5 kg", price: 500 }
      ]),
      images: JSON.stringify(["/photos/tei1kg02.png", "/photos/salcam.jpg", "/photos/fagure.jpg"]),
      imageColor: "D97706",
      badge: JSON.stringify({ ro: "Popular", en: "Popular", ru: "Популярный" }),
      details: JSON.stringify({
        ro: ["Efect calmant natural", "Ideală pentru ceai", "Recoltată în Moldova"],
        en: ["Natural calming effect", "Ideal for tea", "Harvested in Moldova"],
        ru: ["Естественный успокаивающий эффект", "Идеален для чая", "Собран в Молдове"]
      }),
      inStock: true
    },
    {
      name: { ro: "Miere de flori de câmp", en: "Wildflower Honey", ru: "Луговой мёд" },
      description: {
        ro: "Mierea polifloră provine din nectarul mai multor specii de flori de câmp. Are un gust complex, bogat și aromat, cu nuanțe diferite în funcție de sezon și locul recoltării.",
        en: "Wildflower honey comes from the nectar of multiple wildflower species. It has a complex, rich and aromatic taste, with different nuances depending on the season and harvest location.",
        ru: "Полифлёрный мёд получают из нектара множества полевых цветов. Обладает сложным, насыщенным и ароматным вкусом с разными оттенками в зависимости от сезона и места сбора."
      },
      price: 100,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "0.5 kg", price: 70 },
        { label: "1 kg", price: 130 },
        { label: "5 kg", price: 500 }
      ]),
      images: JSON.stringify(["/photos/1flori1kg.png", "/photos/2flori1kg.png", "/photos/3flori1kg.png"]),
      imageColor: "92400E",
      details: JSON.stringify({
        ro: ["Aromă complexă și bogată", "Mix natural de flori", "Recoltată în Moldova"],
        en: ["Complex and rich aroma", "Natural flower mix", "Harvested in Moldova"],
        ru: ["Сложный и богатый аромат", "Природная смесь цветов", "Собран в Молдове"]
      }),
      inStock: true
    },
    {
      name: { ro: "Țuică de miere", en: "Honey Brandy", ru: "Медовая брэнди" },
      description: {
        ro: "Țuica de miere este o băutură tradițională moldovenească, obținută prin fermentarea și distilarea mierii de albine. Are un gust cald, dulceag, cu note florale specifice mierii, și un conținut de alcool moderat.",
        en: "Honey brandy is a traditional Moldovan drink, obtained through the fermentation and distillation of bee honey. It has a warm, sweet taste with floral notes specific to honey, and a moderate alcohol content.",
        ru: "Медовая брэнди — традиционный молдавский напиток, получаемый путём ферментации и дистилляции пчелиного мёда. Имеет тёплый, сладковатый вкус с характерными для мёда цветочными нотами и умеренное содержание алкоголя."
      },
      price: 100,
      currency: "MDL",
      variants: null,
      images: JSON.stringify(["/photos/tuica1.png", "/photos/22tuica.png", "/photos/tuica3.png"]),
      imageColor: "78350F",
      badge: JSON.stringify({ ro: "Exclusiv", en: "Exclusive", ru: "Эксклюзив" }),
      details: JSON.stringify({
        ro: ["Rețetă tradițională", "Produs artizanal", "Fabricat în Moldova", "Volum: 500ml"],
        en: ["Traditional recipe", "Artisan product", "Made in Moldova", "Volume: 500ml"],
        ru: ["Традиционный рецепт", "Ручная работа", "Сделано в Молдове", "Объём: 500мл"]
      }),
      inStock: true
    },
    {
      name: { ro: "Cadouri de miere", en: "Honey Gift Sets", ru: "Подарочные наборы мёда" },
      description: {
        ro: "Setul cadou Melisfera conține o selecție atent aleasă de produse apicole de calitate superioară. Perfect pentru orice ocazie — Crăciun, zile de naștere sau gesturi de apreciere pentru cei dragi.",
        en: "The Melisfera gift set contains a carefully selected collection of premium apiary products. Perfect for any occasion — Christmas, birthdays or appreciation gestures for loved ones.",
        ru: "Подарочный набор Melisfera содержит тщательно подобранную коллекцию пчеловодческих продуктов премиум-класса. Идеален для любого случая — Рождество, дни рождения или знаки внимания для близких."
      },
      price: 250,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "Mic", price: 300 },
        { label: "Mare", price: 550 }
      ]),
      images: JSON.stringify(["/photos/cadoumare01.png", "/photos/salcam.jpg", "/photos/tei.jpg"]),
      imageColor: "B45309",
      badge: JSON.stringify({ ro: "Cadou ideal", en: "Perfect Gift", ru: "Идеальный подарок" }),
      details: JSON.stringify({
        ro: ["Include 3 sortimente de miere", "Ambalaj cadou elegant", "Personalizabil"],
        en: ["Includes 3 honey varieties", "Elegant gift packaging", "Customizable"],
        ru: ["Включает 3 сорта мёда", "Элегантная подарочная упаковка", "Персонализация"]
      }),
      inStock: true
    },
    {
      name: { ro: "Miere cu Polen", en: "Honey with Pollen", ru: "Мёд с пыльцой" },
      description: {
        ro: "Mierea cu polen este o combinație perfectă între beneficiile mierii și proprietățile nutritive ale polenului. Polenul adaugă un plus de vitamine, minerale și proteine, transformând mierea într-un superfood complet.",
        en: "Honey with pollen is a perfect combination between the benefits of honey and the nutritional properties of pollen. Pollen adds extra vitamins, minerals and proteins, turning honey into a complete superfood.",
        ru: "Мёд с пыльцой — это идеальное сочетание пользы мёда и питательных свойств пыльцы. Пыльца добавляет дополнительные витамины, минералы и белки, превращая мёд в полноценный суперфуд."
      },
      price: 110,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "250g", price: 110 },
        { label: "500g", price: 200 }
      ]),
      images: JSON.stringify(["/photos/polenm1.png", "/photos/polenm2.png", "/photos/polenm3.png"]),
      imageColor: "F59E0B",
      badge: JSON.stringify({ ro: "Superfood", en: "Superfood", ru: "Суперфуд" }),
      details: JSON.stringify({
        ro: ["Bogat în nutrienți", "Energizant natural", "Recoltat în Moldova"],
        en: ["Rich in nutrients", "Natural energizer", "Harvested in Moldova"],
        ru: ["Богат питательными веществами", "Природный энергетик", "Собран в Молдове"]
      }),
      inStock: true
    },
    {
      name: { ro: "Fagure de Miere", en: "Honeycomb", ru: "Медовые соты" },
      description: {
        ro: "Fagurul de miere este mierea în forma sa cea mai pură și naturală, direct din stup. Ceara de albine și mierea formează împreună un produs excepțional, bogat în enzime și antioxidanți.",
        en: "Honeycomb is honey in its purest and most natural form, directly from the hive. Beeswax and honey together form an exceptional product, rich in enzymes and antioxidants.",
        ru: "Медовые соты — это мёд в его самой чистой и натуральной форме, прямо из улья. Пчелиный воск и мёд вместе образуют исключительный продукт, богатый ферментами и антиоксидантами."
      },
      price: 150,
      currency: "MDL",
      variants: null,
      images: JSON.stringify(["/photos/fagure.jpg", "/photos/salcam.jpg", "/photos/image.jpg"]),
      imageColor: "D97706",
      details: JSON.stringify({
        ro: ["Formă naturală de miere", "Ceară comestibilă", "Bogat în enzime"],
        en: ["Natural form of honey", "Edible wax", "Rich in enzymes"],
        ru: ["Природная форма мёда", "Съедобный воск", "Богат ферментами"]
      }),
      inStock: true
    },
    {
      name: { ro: "Polen de Albine", en: "Bee Pollen", ru: "Пчелиная пыльца" },
      description: {
        ro: "Polenul de albine este considerat unul dintre cele mai complete alimente din natură. Conține proteine, aminoacizi esențiali, vitamine și minerale. Este un energizant natural excelent.",
        en: "Bee pollen is considered one of the most complete foods in nature. It contains proteins, essential amino acids, vitamins and minerals. It is an excellent natural energizer.",
        ru: "Пчелиная пыльца считается одним из самых полноценных продуктов в природе. Содержит белки, незаменимые аминокислоты, витамины и минералы. Это превосходный натуральный энергетик."
      },
      price: 90,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "100g", price: 50 },
        { label: "200g", price: 100 }
      ]),
      images: JSON.stringify(["/photos/polen02.png", "/photos/image.jpg", "/photos/fagure.jpg"]),
      imageColor: "F59E0B",
      badge: JSON.stringify({ ro: "Superfood", en: "Superfood", ru: "Суперфуд" }),
      details: JSON.stringify({
        ro: ["Bogat în proteine", "Energizant natural", "Recoltat primăvara"],
        en: ["Rich in proteins", "Natural energizer", "Spring harvested"],
        ru: ["Богат белками", "Природный энергетик", "Собран весной"]
      }),
      inStock: true
    },
    {
      name: { ro: "Propolis", en: "Propolis", ru: "Прополис" },
      description: {
        ro: "Propolisul este o substanță rășinoasă produsă de albine, cu puternice proprietăți antibacteriene și antiinflamatoare. Este folosit în medicina tradițională de secole pentru întărirea sistemului imunitar.",
        en: "Propolis is a resinous substance produced by bees, with powerful antibacterial and anti-inflammatory properties. It has been used in traditional medicine for centuries to strengthen the immune system.",
        ru: "Прополис — смолистое вещество, производимое пчёлами, с мощными антибактериальными и противовоспалительными свойствами. Веками используется в традиционной медицине для укрепления иммунной системы."
      },
      price: 130,
      currency: "MDL",
      variants: JSON.stringify([
        { label: "Lichid", price: 50 },
        { label: "Solid", price: 130 }
      ]),
      images: JSON.stringify(["/photos/propolis.jpg", "/photos/image.jpg", "/photos/salcam.jpg"]),
      imageColor: "451A03",
      badge: JSON.stringify({ ro: "Imunitate", en: "Immunity", ru: "Иммунитет" }),
      details: JSON.stringify({
        ro: ["Proprietăți antibacteriene", "Întărește imunitatea", "Extras natural"],
        en: ["Antibacterial properties", "Strengthens immunity", "Natural extract"],
        ru: ["Антибактериальные свойства", "Укрепляет иммунитет", "Натуральный экстракт"]
      }),
      inStock: true
    }
  ]

  // Check if products already exist
  const existingProducts = await prisma.product.count()
  if (existingProducts === 0) {
    for (const productData of products) {
      // Convert object fields to JSON strings for Prisma
      const createData = {
        name: JSON.stringify(productData.name),
        description: JSON.stringify(productData.description),
        price: productData.price,
        currency: productData.currency,
        variants: productData.variants,
        images: productData.images,
        imageColor: productData.imageColor,
        badge: productData.badge,
        details: productData.details,
        inStock: productData.inStock
      }
      
      const product = await prisma.product.create({
        data: createData
      })
      console.log('Created product:', product.id)
    }
  } else {
    console.log('Products already exist, skipping creation')
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
