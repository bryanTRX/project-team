// Migration: copy familiesHelped -> lives_touched (if present) and remove donationsRequiredForTier
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

  console.log('Migrating field: copying familiesHelped -> lives_touched (if present) and unsetting donationsRequiredForTier...');

  // Copy existing familiesHelped into lives_touched for documents that have it
  const cursor = User.find({ familiesHelped: { $exists: true } }).cursor();
  let count = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const val = doc.familiesHelped;
    try {
      await User.updateOne({ _id: doc._id }, { $set: { lives_touched: val }, $unset: { familiesHelped: 1 } });
      count++;
    } catch (err) {
      console.error('Failed to migrate doc', doc._id, err);
    }
  }
  console.log(`Migrated ${count} documents from familiesHelped -> lives_touched`);

  // Unset donationsRequiredForTier across all docs (legacy field)
  const res = await User.updateMany({}, { $unset: { donationsRequiredForTier: 1 } });
  console.log('Removed donationsRequiredForTier result:', res);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
