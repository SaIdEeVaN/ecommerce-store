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

    {
      name: 'Nova 65% Wireless Keyboard',
      description: 'A compact 65% mechanical keyboard with Bluetooth and 2.4GHz wireless, gasket-mounted plate, and a 4000mAh battery that lasts for weeks.',
      price: 99.99,
      stock: 45,
      imageUrl: 'keyboard',
    },
    {
      name: 'Stealth Low-Profile Keyboard',
      description: 'An ultra-slim low-profile mechanical keyboard with quiet linear switches and an aluminium top case, built for fast, silent typing.',
      price: 89.99,
      stock: 30,
      imageUrl: 'keyboard',
    },
    {
      name: 'Titan Full-Size Keyboard',
      description: 'A full-size mechanical keyboard with a dedicated numpad, media dial, magnetic wrist rest, and PBT double-shot keycaps.',
      price: 149.99,
      stock: 20,
      imageUrl: 'keyboard',
    },
    {
      name: 'Echo Studio Headphones',
      description: 'Open-back studio headphones with 50mm drivers and a flat, natural sound signature for mixing, editing, and critical listening.',
      price: 219.99,
      stock: 18,
      imageUrl: 'headset',
    },
    {
      name: 'Pulse Wireless Gaming Headset',
      description: 'A lightweight wireless gaming headset with a detachable noise-cancelling mic, 7.1 surround sound, and 30-hour battery life.',
      price: 129.99,
      stock: 40,
      imageUrl: 'headset',
    },
    {
      name: 'Aria Noise-Cancelling Headphones',
      description: 'Foldable travel headphones with adaptive noise cancellation, multipoint Bluetooth, and a plush carry case.',
      price: 159.99,
      stock: 4,
      imageUrl: 'headset',
    },
    {
      name: 'Swift Ultralight Mouse',
      description: 'A 58g ultralight gaming mouse with a 26K DPI optical sensor, PTFE feet, and a flexible paracord-style cable.',
      price: 59.99,
      stock: 55,
      imageUrl: 'mouse',
    },
    {
      name: 'Glide Vertical Mouse',
      description: 'A vertical ergonomic mouse that keeps your wrist in a natural handshake position to reduce strain during long workdays.',
      price: 49.99,
      stock: 35,
      imageUrl: 'mouse',
    },
    {
      name: 'Vista 27" 4K Monitor',
      description: 'A 27-inch 4K IPS monitor with USB-C 90W power delivery, factory colour calibration, and a height-adjustable stand.',
      price: 379.99,
      stock: 12,
      imageUrl: 'monitor',
    },
    {
      name: 'Halo LED Desk Lamp',
      description: 'A dimmable LED desk lamp with a flicker-free light bar, auto-brightness sensor, and a USB-C charging port in the base.',
      price: 44.99,
      stock: 50,
      imageUrl: 'lamp',
    },
    {
      name: 'Orbit Monitor Light Bar Lamp',
      description: 'A screen-mounted light bar lamp that lights your desk without glare on the display, with a wireless control puck.',
      price: 69.99,
      stock: 0,
      imageUrl: 'lamp',
    },
    {
      name: 'Nomad Sling Backpack',
      description: 'A slim everyday sling backpack with a padded 14-inch laptop pocket, quick-access phone slot, and water-repellent fabric.',
      price: 79.99,
      stock: 28,
      imageUrl: 'backpack',
    },
  ];

  // Add each sample product only if no product with that name exists (archived ones included)
  let created = 0;
  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({
        data: product,
      });
      created++;
    }
  }

  console.log(`Added ${created} of ${products.length} sample products.`);
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
