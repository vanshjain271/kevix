const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const Category = require('./src/models/Category');
    const count = await Category.countDocuments();
    console.log('Categories count:', count);
    if (count > 0) {
      const cats = await Category.find().limit(2);
      console.log('Sample category:', cats[0].name);
    }
  } catch (error) {
    console.error('DB Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}
checkDb();
