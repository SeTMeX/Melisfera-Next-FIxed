const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@melisfera.md' },
    update: {},
    create: {
      email: 'admin@melisfera.md',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Melisfera',
      role: 'admin',
    },
  });
  console.log('✓ Admin creat');

  await prisma.product.deleteMany({});
  const products = [
    { name: JSON.stringify({ro:'Miere de salcâm',en:'Acacia Honey'}), description: JSON.stringify({ro:'Mierea de salcâm este una dintre cele mai apreciate sortimente de miere.',en:'Acacia honey is one of the most appreciated honey varieties.'}), price:150, variants: JSON.stringify([{label:'0.5 kg',price:80},{label:'1 kg',price:150},{label:'5 kg',price:600}]), images: JSON.stringify(['/photos/salcam.jpg','/photos/fagure.jpg','/photos/image.jpg']), imageColor:'B45309', badge: JSON.stringify({ro:'Bestseller',en:'Bestseller'}), details: JSON.stringify({ro:['100% natural, neprocesată termic','Fără aditivi sau conservanți','Recoltată în Moldova','Cantitate: 500g'],en:['100% natural, not heat-processed','No additives or preservatives','Harvested in Moldova','Weight: 500g']}), inStock:true },
    { name: JSON.stringify({ro:'Miere de tei',en:'Linden Honey'}), description: JSON.stringify({ro:'Mierea de tei are un parfum puternic și caracteristic.',en:'Linden honey has a strong and characteristic fragrance.'}), price:130, variants: JSON.stringify([{label:'0.5 kg',price:70},{label:'1 kg',price:130},{label:'5 kg',price:500}]), images: JSON.stringify(['/photos/tei.jpg','/photos/salcam.jpg','/photos/fagure.jpg']), imageColor:'D97706', badge: JSON.stringify({ro:'Popular',en:'Popular'}), details: JSON.stringify({ro:['Efect calmant natural','Ideală pentru ceai','Recoltată în Moldova','Cantitate: 500g'],en:['Natural calming effect','Ideal for tea','Harvested in Moldova','Weight: 500g']}), inStock:true },
    { name: JSON.stringify({ro:'Miere de flori de câmp',en:'Wildflower Honey'}), description: JSON.stringify({ro:'Mierea polifloră provine din nectarul mai multor specii de flori de câmp.',en:'Wildflower honey comes from the nectar of multiple wildflower species.'}), price:130, variants: JSON.stringify([{label:'0.5 kg',price:70},{label:'1 kg',price:130},{label:'5 kg',price:500}]), images: JSON.stringify(['/photos/salcam.jpg','/photos/tei.jpg','/photos/image.jpg']), imageColor:'92400E', badge:null, details: JSON.stringify({ro:['Aromă complexă și bogată','Mix natural de flori','Recoltată în Moldova','Cantitate: 500g'],en:['Complex and rich aroma','Natural flower mix','Harvested in Moldova','Weight: 500g']}), inStock:true },
    { name: JSON.stringify({ro:'Țuică de miere',en:'Honey Brandy'}), description: JSON.stringify({ro:'Țuica de miere este o băutură tradițională moldovenească.',en:'Honey brandy is a traditional Moldovan drink.'}), price:120, variants:null, images: JSON.stringify(['/photos/tuica.jpg','/photos/image.jpg','/photos/salcam.jpg']), imageColor:'78350F', badge: JSON.stringify({ro:'Exclusiv',en:'Exclusive'}), details: JSON.stringify({ro:['Rețetă tradițională','Produs artizanal','Fabricat în Moldova','Volum: 500ml'],en:['Traditional recipe','Artisan product','Made in Moldova','Volume: 500ml']}), inStock:true },
    { name: JSON.stringify({ro:'Cadouri de miere',en:'Honey Gift Sets'}), description: JSON.stringify({ro:'Setul cadou Melisfera conține o selecție atent aleasă de produse apicole.',en:'The Melisfera gift set contains a carefully selected collection of premium apiary products.'}), price:300, variants: JSON.stringify([{label:'Mic',price:300},{label:'Mare',price:550}]), images: JSON.stringify(['/photos/cadou.jpg','/photos/salcam.jpg','/photos/tei.jpg']), imageColor:'B45309', badge: JSON.stringify({ro:'Cadou ideal',en:'Perfect Gift'}), details: JSON.stringify({ro:['Include 3 sortimente de miere','Ambalaj cadou elegant','Personalizabil','Livrare în toată Moldova'],en:['Includes 3 honey varieties','Elegant gift packaging','Customizable','Delivery across Moldova']}), inStock:true },
    { name: JSON.stringify({ro:'Fagure de Miere',en:'Honeycomb'}), description: JSON.stringify({ro:'Fagurul de miere este mierea în forma sa cea mai pură și naturală.',en:'Honeycomb is honey in its purest and most natural form.'}), price:100, variants:null, images: JSON.stringify(['/photos/fagure.jpg','/photos/salcam.jpg','/photos/image.jpg']), imageColor:'D97706', badge:null, details: JSON.stringify({ro:['Formă naturală de miere','Ceară comestibilă','Bogat în enzime','Greutate: 400g'],en:['Natural form of honey','Edible wax','Rich in enzymes','Weight: 400g']}), inStock:true },
    { name: JSON.stringify({ro:'Polen de Albine',en:'Bee Pollen'}), description: JSON.stringify({ro:'Polenul de albine este considerat unul dintre cele mai complete alimente din natură.',en:'Bee pollen is considered one of the most complete foods in nature.'}), price:50, variants: JSON.stringify([{label:'100g',price:50},{label:'200g',price:100}]), images: JSON.stringify(['/photos/polen.jpg','/photos/image.jpg','/photos/fagure.jpg']), imageColor:'F59E0B', badge: JSON.stringify({ro:'Superfood',en:'Superfood'}), details: JSON.stringify({ro:['Bogat în proteine','Energizant natural','Recoltat primăvara','Cantitate: 100g'],en:['Rich in proteins','Natural energizer','Spring harvested','Weight: 100g']}), inStock:true },
    { name: JSON.stringify({ro:'Propolis',en:'Propolis'}), description: JSON.stringify({ro:'Propolisul este o substanță rășinoasă produsă de albine.',en:'Propolis is a resinous substance produced by bees.'}), price:50, variants: JSON.stringify([{label:'Lichid',price:50},{label:'Solid',price:130}]), images: JSON.stringify(['/photos/propolis.jpg','/photos/image.jpg','/photos/salcam.jpg']), imageColor:'451A03', badge: JSON.stringify({ro:'Imunitate',en:'Immunity'}), details: JSON.stringify({ro:['Proprietăți antibacteriene','Întărește imunitatea','Extras natural','Cantitate: 100g'],en:['Antibacterial properties','Strengthens immunity','Natural extract','Weight: 100g']}), inStock:true },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✓ 8 produse inserate');
  console.log('Admin: admin@melisfera.md / Parola: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
