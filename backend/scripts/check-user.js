// Debug script to print a user document from the DB.
// Usage:
//   node ./scripts/check-user.js admin
//   node ./scripts/check-user.js admin@domain.tld
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in backend/.env');
    process.exit(1);
  }

  const arg = process.argv[2];
  if (!arg) {
    console.error('Provide a username or email as the first argument');
    process.exit(1);
  }

  await mongoose.connect(uri, { keepAlive: true });

  const userSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  let doc = null;
  if (arg.includes('@')) {
    doc = await User.findOne({ email: arg }).lean().exec();
  } else {
    doc = await User.findOne({ username: arg }).lean().exec();
  }

  if (!doc) {
    console.log('User not found');
  } else {
    console.log('User document:');
    console.log(JSON.stringify(doc, null, 2));
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Error checking user:', err);
  process.exit(1);
});
