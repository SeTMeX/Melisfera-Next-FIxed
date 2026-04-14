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
      name: { ro: "Miere de salcâm", en: "Acacia Honey" },
      description: {
        ro: "Mierea de salcâm este una dintre cele mai apreciate sortimente de miere, recunoscutã prin culoarea sa deschisã, galben-pai, i gustul delicat, floral. Bogatã în fructozã, cristalizeazã foarte greu, rãmânând lichidã timp îndelungat.",
        en: "Acacia honey is one of the most appreciated honey varieties, recognized by its light, straw-yellow color and delicate floral taste. Rich in fructose, it crystallizes very slowly, remaining liquid for a long time."
      },
      price: 120,
      images: JSON.stringify(["/photos/salcam.jpg", "/photos/fagure.jpg", "/photos/image.jpg"]),
      imageColor: "B45309",
      badge: JSON.stringify({ ro: "Bestseller", en: "Bestseller" }),
      details: JSON.stringify({
        ro: ["100% natural, neprocesatã termic", "Fãrã aditivi sau conservanþi", "Recoltatã în Moldova", "Cantitate: 500g"],
        en: ["100% natural, not heat-processed", "No additives or preservatives", "Harvested in Moldova", "Weight: 500g"]
      }),
      inStock: true
    },
    {
      name: { ro: "Miere de tei", en: "Linden Honey" },
      description: {
        ro: "Mierea de tei are un parfum puternic i caracteristic, cu un gust uºor amãrui i aromatic. Este renumitã pentru proprietãþile sale calmante i este recomandatã în special seara, înainte de culcare.",
        en: "Linden honey has a strong and characteristic fragrance, with a slightly bitter and aromatic taste. It is renowned for its calming properties and is especially recommended in the evening before bedtime."
      },
      price: 110,
      images: JSON.stringify(["/photos/tei.jpg", "/photos/salcam.jpg", "/photos/fagure.jpg"]),
      imageColor: "D97706",
      badge: JSON.stringify({ ro: "Popular", en: "Popular" }),
      details: JSON.stringify({
        ro: ["Efect calmant natural", "Idealã pentru ceai", "Recoltatã în Moldova", "Cantitate: 500g"],
        en: ["Natural calming effect", "Ideal for tea", "Harvested in Moldova", "Weight: 500g"]
      }),
      inStock: true
    },
    {
      name: { ro: "Miere de flori de câmp", en: "Wildflower Honey" },
      description: {
        ro: "Mierea poliflorã provine din nectarul mai multor specii de flori de câmp. Are un gust complex, bogat i aromatic, cu nuanþe diferite în funcþie de sezon i locul recoltãrii.",
        en: "Wildflower honey comes from the nectar of multiple wildflower species. It has a complex, rich and aromatic taste, with different nuances depending on the season and harvest location."
      },
      price: 100,
      images: JSON.stringify(["/photos/salcam.jpg", "/photos/tei.jpg", "/photos/image.jpg"]),
      imageColor: "92400E",
      details: JSON.stringify({
        ro: ["Aromã complexã i bogatã", "Mix natural de flori", "Recoltatã în Moldova", "Cantitate: 500g"],
        en: ["Complex and rich aroma", "Natural flower mix", "Harvested in Moldova", "Weight: 500g"]
      }),
      inStock: true
    },
    {
      name: { ro: "Þuicã de miere", en: "Honey Brandy" },
      description: {
        ro: "Þuica de miere este o bãuturã tradiþionalã moldoveneascã, obþinutã prin fermentarea i distilarea mierii de albine. Are un gust cald, dulceag, cu note florale specifice mierii, i un conþinut de alcool moderat.",
        en: "Honey brandy is a traditional Moldovan drink, obtained through the fermentation and distillation of bee honey. It has a warm, sweet taste with floral notes specific to honey, and a moderate alcohol content."
      },
      price: 180,
      images: JSON.stringify(["/photos/tuica.jpg", "/photos/image.jpg", "/photos/salcam.jpg"]),
      imageColor: "78350F",
      badge: JSON.stringify({ ro: "Exclusiv", en: "Exclusive" }),
      details: JSON.stringify({
        ro: ["Reþetã tradiþionalã", "Produs artizanal", "Fabricat în Moldova", "Volum: 500ml"],
        en: ["Traditional recipe", "Artisan product", "Made in Moldova", "Volume: 500ml"]
      }),
      inStock: true
    },
    {
      name: { ro: "Cadouri de miere", en: "Honey Gift Sets" },
      description: {
        ro: "Setul cadou Melisfera conþine o selecþie atent aleasã de produse apicole de calitate superioarã. Perfect pentru orice ocazie - Crãciun, zile de naºtere sau gesturi de apreciere pentru cei dragi.",
        en: "The Melisfera gift set contains a carefully selected collection of premium apiary products. Perfect for any occasion - Christmas, birthdays or appreciation gestures for loved ones."
      },
      price: 250,
      images: JSON.stringify(["/photos/cadou.jpg", "/photos/salcam.jpg", "/photos/tei.jpg"]),
      imageColor: "B45309",
      badge: JSON.stringify({ ro: "Cadou ideal", en: "Perfect Gift" }),
      details: JSON.stringify({
        ro: ["Include 3 sortimente de miere", "Ambalaj cadou elegant", "Personalizabil", "Livrare în toatã Moldova"],
        en: ["Includes 3 honey varieties", "Elegant gift packaging", "Customizable", "Delivery across Moldova"]
      }),
      inStock: true
    },
    {
      name: { ro: "Fagure de Miere", en: "Honeycomb" },
      description: {
        ro: "Fagurul de miere este mierea în forma sa cea mai purã i naturalã, direct din stup. Ceara de albine i mierea formeazã împreunã un produs excepþional, bogat în enzime i antioxidanþi.",
        en: "Honeycomb is honey in its purest and most natural form, directly from the hive. Beeswax and honey together form an exceptional product, rich in enzymes and antioxidants."
      },
      price: 150,
      images: JSON.stringify(["/photos/fagure.jpg", "/photos/salcam.jpg", "/photos/image.jpg"]),
      imageColor: "D97706",
      details: JSON.stringify({
        ro: ["Formã naturalã de miere", "Cearã comestibilã", "Bogat în enzime", "Greutate: 400g"],
        en: ["Natural form of honey", "Edible wax", "Rich in enzymes", "Weight: 400g"]
      }),
      inStock: true
    },
    {
      name: { ro: "Polen de Albine", en: "Bee Pollen" },
      description: {
        ro: "Polenul de albine este considerat unul dintre cele mai complete alimente din naturã. Conþine proteine, aminoacizi esenþiali, vitamine i minerale. Este un energizant natural excelent.",
        en: "Bee pollen is considered one of the most complete foods in nature. It contains proteins, essential amino acids, vitamins and minerals. It is an excellent natural energizer."
      },
      price: 90,
      images: JSON.stringify(["/photos/polen.jpg", "/photos/image.jpg", "/photos/fagure.jpg"]),
      imageColor: "F59E0B",
      badge: JSON.stringify({ ro: "Superfood", en: "Superfood" }),
      details: JSON.stringify({
        ro: ["Bogat în proteine", "Energizant natural", "Recoltat primãvara", "Cantitate: 250g"],
        en: ["Rich in proteins", "Natural energizer", "Spring harvested", "Weight: 250g"]
      }),
      inStock: true
    },
    {
      name: { ro: "Propolis", en: "Propolis" },
      description: {
        ro: "Propolisul este o substanþã rãsinoasã produsã de albine, cu puternice proprietãþi antibacteriene i antiinflamatoare. Este folosit în medicina tradiþionalã de secole pentru întãrirea sistemului imunitar.",
        en: "Propolis is a resinous substance produced by bees, with powerful antibacterial and anti-inflammatory properties. It has been used in traditional medicine for centuries to strengthen the immune system."
      },
      price: 130,
      images: JSON.stringify(["/photos/propolis.jpg", "/photos/image.jpg", "/photos/salcam.jpg"]),
      imageColor: "451A03",
      badge: JSON.stringify({ ro: "Imunitate", en: "Immunity" }),
      details: JSON.stringify({
        ro: ["Proprietãþi antibacteriene", "Întãreºte imunitatea", "Extras natural", "Cantitate: 100g"],
        en: ["Antibacterial properties", "Strengthens immunity", "Natural extract", "Weight: 100g"]
      }),
      inStock: true
    }
  ]

  // Check if products already exist
  const existingProducts = await prisma.product.count()
  if (existingProducts === 0) {
    for (const productData of products) {
      const product = await prisma.product.create({
        data: productData
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
