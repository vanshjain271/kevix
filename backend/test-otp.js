require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      console.log('Finding or creating user...');
      let user = await User.findOrCreateByPhone('+919999999999');
      console.log('User created:', user);
      await user.setOTP('123456');
      console.log('Attempting to save...');
      await user.save();
      console.log('User saved successfully!');
    } catch(err) {
      console.error('SAVE ERROR:', err);
    }
    process.exit(0);
  });
