require('dotenv').config({ path: __dirname + '/.env', override: true });
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/database');
const StoreSettings = require('./src/models/StoreSettings');
const Banner = require('./src/models/Banner');
const User = require('./src/models/User');
const Cart = require('./src/models/Cart');
const Product = require('./src/models/Product');

const DUMMY_TAG = 'dummy-seed-data';

const DUMMY_POLICY = `<h2>Our Commitment</h2>
<p>This is a dummy policy generated for testing purposes. You can easily edit this text from the admin panel under the Store Settings section.</p>
<h3>1. First Clause</h3>
<p>All products are covered under a standard warranty. Please retain your original receipt for any claims.</p>
<h3>2. Second Clause</h3>
<p>Returns are accepted within 7 days of delivery, provided the item is in its original packaging and unused.</p>`;

const bannerData = [
  {
    title: 'Grand Festive Sale',
    description: 'Up to 60% off on all accessories',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&h=400&fit=crop',
    placement: 'HOME_TOP',
    sortOrder: 1,
    isActive: true
  },
  {
    title: 'New Arrivals: Smart Watches',
    description: 'Track your fitness with the latest tech',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1200&h=400&fit=crop',
    placement: 'HOME_TOP',
    sortOrder: 2,
    isActive: true
  },
  {
    title: 'Premium Sound Quality',
    description: 'Explore our range of TWS Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&h=400&fit=crop',
    placement: 'HOME_TOP',
    sortOrder: 3,
    isActive: true
  }
];

async function seedSettings() {
  try {
    await connectDB();
    console.log('Connected to DB');

    // 1. Setup Store Settings
    let settings = await StoreSettings.findOne();
    if (!settings) settings = new StoreSettings();

    settings.minOrderAmount = 500;
    settings.advancePartialPayment = true;
    settings.partialPaymentPercent = 20;
    settings.codEnabled = true;
    settings.razorpayEnabled = true;
    
    settings.aboutUs = `<h2>About Kevix</h2><p>Welcome to Kevix, your premium destination for high-quality mobile accessories. We strive to bring you the best tech at unbeatable prices. This is dummy text that can be changed in the admin panel.</p>`;
    settings.privacyPolicy = `<h2>Privacy Policy</h2><p>We respect your privacy. All your data is securely stored.</p>` + DUMMY_POLICY;
    settings.termsAndConditions = `<h2>Terms & Conditions</h2><p>By using this website, you agree to our terms.</p>` + DUMMY_POLICY;
    settings.refundPolicy = `<h2>Refund Policy</h2><p>Refunds are processed within 5-7 business days.</p>` + DUMMY_POLICY;
    settings.returnPolicy = `<h2>Return Policy</h2><p>Items can be returned within 7 days.</p>` + DUMMY_POLICY;
    settings.shippingPolicy = `<h2>Shipping Policy</h2><p>We ship all across India within 3-5 business days.</p>` + DUMMY_POLICY;
    
    settings.tickerText = '💥 GRAND SALE IS LIVE! GET UP TO 60% OFF ON ALL ACCESSORIES 💥';
    settings.tickerEnabled = true;

    await settings.save();
    console.log('Store Settings updated with dummy data & policies');

    // 2. Clean up old dummy banners and carts
    await Banner.deleteMany({ title: { $in: bannerData.map(b => b.title) } });
    
    // 3. Insert Banners
    await Banner.insertMany(bannerData);
    console.log('Inserted 3 Promotional Banners');

    // 4. Create Dummy Users and Abandoned Carts
    const products = await Product.find({ isActive: true }).limit(5);
    if (products.length > 0) {
      // Find or create dummy users
      const dummyPhones = ['9999999991', '9999999992', '9999999993'];
      
      for (let i = 0; i < dummyPhones.length; i++) {
        let user = await User.findOne({ phone: dummyPhones[i] });
        if (!user) {
          user = await User.create({
            name: `Dummy User ${i+1}`,
            phone: dummyPhones[i],
            role: 'BUYER'
          });
        }

        // Clean existing cart
        await Cart.deleteOne({ user: user._id });

        // Create abandoned cart (modified > 24h ago)
        const cart = new Cart({
          user: user._id,
          items: [
            { product: products[i]._id, quantity: i + 1 },
            { product: products[products.length - 1 - i]._id, quantity: 2 }
          ],
          isAbandoned: true,
          lastModified: new Date(Date.now() - (48 * 60 * 60 * 1000)), // 48 hours ago
          abandonedAt: new Date(Date.now() - (24 * 60 * 60 * 1000)) // 24 hours ago
        });
        
        await cart.save();
      }
      console.log('Created 3 Dummy Abandoned Carts');
    }

    console.log('Settings, Banners, and Abandoned Carts seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit(0);
  }
}

seedSettings();
