const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

let prisma;
let pool;

if (isLocal) {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  const { PrismaNeon } = require('@prisma/adapter-neon');
  const adapter = new PrismaNeon({ connectionString: dbUrl });
  prisma = new PrismaClient({ adapter });
}

// Non-destructive: only creates what is missing, so it is safe to run on every deploy.
async function main() {
  console.log('Seeding database...');

  // Admin account. On a hosted database the credentials must come from env vars,
  // since the local defaults below are public in the repo.
  const adminEmail = process.env.ADMIN_EMAIL || (isLocal ? 'admin@store.com' : undefined);
  const adminPlainPassword = process.env.ADMIN_PASSWORD || (isLocal ? 'admin123' : undefined);

  if (adminEmail && adminPlainPassword) {
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`Admin ${adminEmail} already exists, leaving it unchanged.`);
    } else {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: await bcrypt.hash(adminPlainPassword, 10),
          name: 'Admin User',
          role: 'ADMIN',
        },
      });
      console.log(`Created admin ${adminEmail}.`);
    }
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin account.');
  }

  // Demo customer, local databases only
  if (isLocal) {
    await prisma.user.upsert({
      where: { email: 'user@store.com' },
      update: {},
      create: {
        email: 'user@store.com',
        password: await bcrypt.hash('user123', 10),
        name: 'Jane Doe',
        role: 'USER',
      },
    });
  }

  // Create Products
  const products = [
    {
      name: 'Apex Mechanical Keyboard',
      description: 'A premium mechanical keyboard with tactile switches, hot-swappable sockets, and customizable RGB lighting for the ultimate typing experience.',
      price: 129.99,
      stock: 50,
      imageUrl: 'keyboard', // Identifier for CSS-based drawing or local SVGs
    },
    {
      name: 'Acoustic Pro Headset',
      description: 'High-fidelity over-ear headphones featuring active noise cancellation, low-latency wireless connection, and memory foam earcups.',
      price: 189.99,
      stock: 35,
      imageUrl: 'headset',
    },
    {
      name: 'Omni Ergonomic Mouse',
      description: 'An ergonomic wireless mouse designed for all-day hand comfort, high-precision tracking, and customizable side buttons.',
      price: 79.99,
      stock: 60,
      imageUrl: 'mouse',
    },
    {
      name: 'UltraWide 34" Monitor',
      description: 'A curved 34-inch ultrawide monitor boasting a 144Hz refresh rate, HDR400 support, and spectacular color accuracy for creators.',
      price: 499.99,
      stock: 15,
      imageUrl: 'monitor',
    },
    {
      name: 'Lumina Smart Lamp',
      description: 'A sleek, minimalist table lamp with adjustable color temperatures, voice assistant integration, and a built-in wireless charging pad.',
      price: 59.99,
      stock: 40,
      imageUrl: 'lamp',
    },
    {
      name: 'Voyager Tech Backpack',
      description: 'Water-resistant daily travel backpack featuring a TSA-friendly laptop sleeve, hidden anti-theft pockets, and a built-in USB charging port.',
      price: 109.99,
      stock: 25,
      imageUrl: 'backpack',
    },
  ];

  if ((await prisma.product.count()) > 0) {
    console.log('Products already exist, skipping sample products.');
    return;
  }

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Successfully seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (pool) await pool.end();
  });
