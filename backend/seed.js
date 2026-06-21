require('dotenv').config({ path: __dirname + '/.env', override: true });
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/database');
const Category = require('./src/models/Category');
const Brand = require('./src/models/Brand');
const Product = require('./src/models/Product');

const DUMMY_TAG = 'dummy-seed-data';

const categoryData = [
  { name: 'Mobile Accessories', slug: 'mobile-accessories-d', image: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Chargers & Adapters', slug: 'chargers-d', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'TWS Earbuds', slug: 'tws-earbuds-d', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Neckbands', slug: 'neckbands-d', image: 'https://images.unsplash.com/photo-1612444530582-fc66184b156d?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Smart Watches', slug: 'smart-watches-d', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Power Banks', slug: 'power-banks-d', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Phone Cases', slug: 'phone-cases-d', image: 'https://images.unsplash.com/photo-1541814674681-3211516e107f?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Screen Protectors', slug: 'screen-protectors-d', image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Data Cables', slug: 'data-cables-d', image: 'https://images.unsplash.com/photo-1588611849852-70b1cb3b320e?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Car Accessories', slug: 'car-accessories-d', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Speakers', slug: 'speakers-d', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Computer Accessories', slug: 'computer-accessories-d', image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=200', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Deals of the Day', slug: 'deals-of-the-day-d', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200', isActive: true, tags: [DUMMY_TAG] }
];

const brandData = [
  { name: 'Kevix', slug: 'kevix-d', logo: 'https://ui-avatars.com/api/?name=Kevix&background=6B21A8&color=fff', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Samsung', slug: 'samsung-d', logo: 'https://ui-avatars.com/api/?name=Samsung&background=000&color=fff', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Apple', slug: 'apple-d', logo: 'https://ui-avatars.com/api/?name=Apple&background=000&color=fff', isActive: true, tags: [DUMMY_TAG] },
  { name: 'OnePlus', slug: 'oneplus-d', logo: 'https://ui-avatars.com/api/?name=OnePlus&background=E50000&color=fff', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Xiaomi', slug: 'xiaomi-d', logo: 'https://ui-avatars.com/api/?name=Xiaomi&background=FF6700&color=fff', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Boat', slug: 'boat-d', logo: 'https://ui-avatars.com/api/?name=Boat&background=000&color=fff', isActive: true, tags: [DUMMY_TAG] },
  { name: 'Noise', slug: 'noise-d', logo: 'https://ui-avatars.com/api/?name=Noise&background=000&color=fff', isActive: true, tags: [DUMMY_TAG] }
];

const productTitles = [
  "Ultra Fast 65W GaN Charger", "Premium Braided Type-C Cable", "Kevix Pro TWS Earbuds Active Noise Cancellation",
  "Magnetic Wireless Power Bank 10000mAh", "Slim Fit Liquid Silicone Case", "Tempered Glass Screen Protector 9H",
  "Bluetooth 5.3 Neckband with Bass Boost", "Smart Watch with Heart Rate Monitor", "Car Fast Charger Dual Port",
  "Portable Waterproof Bluetooth Speaker", "Adjustable Laptop Stand", "Wireless Mouse with Silent Clicks",
  "Universal Magnetic Car Mount", "USB-C Hub 6-in-1 Adapter", "Selfie Stick with Bluetooth Remote",
  "Gaming Earphones with Mic", "Heavy Duty Rugged Phone Case", "20W PD Fast Charger Adapter",
  "3-in-1 Wireless Charging Station", "AirPods Pro Protective Cover", "Micro USB to Type-C Adapter",
  "Flexible Tripod Stand for Mobile", "Privacy Screen Protector", "Aux Cable 3.5mm Gold Plated",
  "OTG Pendrive 64GB", "Ring Light with Stand for Creators", "Webcam 1080p with Microphone",
  "Gaming Mouse Pad Extended", "Mechanical Keyboard RGB", "Laptop Sleeve Water Resistant"
];

const productImages = [
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400",
  "https://images.unsplash.com/photo-1588611849852-70b1cb3b320e?q=80&w=400",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400",
  "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=400",
  "https://images.unsplash.com/photo-1541814674681-3211516e107f?q=80&w=400",
  "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=400",
  "https://images.unsplash.com/photo-1612444530582-fc66184b156d?q=80&w=400",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=400",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=400",
  "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=400"
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Clean up existing dummy data
    await Category.deleteMany({ tags: DUMMY_TAG });
    await Brand.deleteMany({ tags: DUMMY_TAG });
    await Product.deleteMany({ tags: DUMMY_TAG });
    console.log('Cleaned up old dummy data');

    // Insert Categories
    const insertedCategories = await Category.insertMany(categoryData);
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Insert Brands
    const insertedBrands = await Brand.insertMany(brandData);
    console.log(`Inserted ${insertedBrands.length} brands`);

    const sections = ['Deals of the Day', 'Best Sellers', 'New Arrivals', 'Trending Accessories'];

    const products = [];
    for (let i = 0; i < productTitles.length; i++) {
      const isLot = i % 4 === 0; // Make every 4th product a lot
      const mrp = Math.floor(Math.random() * 2000) + 500;
      const salePrice = Math.floor(mrp * (Math.random() * 0.4 + 0.4)); // 20-60% off

      const product = {
        name: productTitles[i] + ' (Dummy)',
        slug: `dummy-product-${i}`,
        description: 'This is a dummy product created for testing the storefront design and layout.',
        images: [productImages[i % productImages.length]],
        category: [insertedCategories[i % insertedCategories.length]._id],
        brand: insertedBrands[i % insertedBrands.length]._id,
        sku: `DUMMY-SKU-${i}`,
        salePrice,
        mrp,
        stock: Math.floor(Math.random() * 100) + 10,
        isActive: true,
        tags: [DUMMY_TAG],
        homepageSections: [sections[i % sections.length]],
        isLot,
        lotDetails: isLot ? {
          fullLotQuantity: 50,
          fullLotPrice: salePrice * 0.7,
          allowHalfLot: true,
          halfLotQuantity: 25,
          halfLotPrice: salePrice * 0.8
        } : undefined
      };
      products.push(product);
    }

    const insertedProducts = await Product.insertMany(products);
    console.log(`Inserted ${insertedProducts.length} products (Lots: ${products.filter(p => p.isLot).length})`);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit(0);
  }
}

seed();
