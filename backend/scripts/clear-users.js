// Script to clear all User documents from the database.
// Run: node ./scripts/clear-users.js (from backend folder)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in backend/.env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(uri, { keepAlive: true });

  const userSchema = new mongoose.Schema({
    // minimal schema to match existing User docs
  }, { strict: false });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const res = await User.deleteMany({});
  console.log('Deleted users count:', res.deletedCount);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Clear users failed:', err);
  process.exit(1);
});
