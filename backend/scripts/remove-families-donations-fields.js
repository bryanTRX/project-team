// Migration: unset familiesHelped and donationsRequiredForTier from all users
// Run: node ./scripts/remove-families-donations-fields.js (from backend folder)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }
  await mongoose.connect(uri, { keepAlive: true });

  const userSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

  console.log('Unsetting fields familiesHelped and donationsRequiredForTier on all user documents...');
  const res = await User.updateMany({}, { $unset: { familiesHelped: 1, donationsRequiredForTier: 1 } });
  console.log('Update result:', res);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
