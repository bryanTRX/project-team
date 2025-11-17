// Removes the donorTier field from all User documents in MongoDB
// Usage: node ./scripts/remove-donortier.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in backend/.env — aborting.');
    process.exit(1);
  }

  await mongoose.connect(uri, { keepAlive: true });

  const userSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

  const result = await User.updateMany({}, { $unset: { donorTier: '' } });
  console.log('Updated documents:', result.modifiedCount || result.nModified || result.modified || result);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
