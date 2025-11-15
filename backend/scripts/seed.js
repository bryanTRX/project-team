// Simple seed script to create a mock account once.
// Run: node ./scripts/seed.js (from backend folder)
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

  const userSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String },
      donorTier: { type: String },
      totalDonated: { type: Number, default: 0 },
      familiesHelped: { type: Number, default: 0 },
      goal: { type: Number, default: 0 },
      donationsRequiredForTier: { type: Number, default: 0 },
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const defaults = {
    username: process.env.SEED_USERNAME || 'admin',
    email: process.env.SEED_EMAIL || 'admin@shieldofathena.org',
    password: process.env.SEED_PASSWORD || 'admin',
    name: process.env.SEED_NAME || 'Zeus Donor',
    donorTier: process.env.SEED_DONOR_TIER || 'Zeus',
    totalDonated: Number(process.env.SEED_TOTAL_DONATED || 3750),
    familiesHelped: Number(process.env.SEED_FAMILIES_HELPED || 12),
    goal: Number(process.env.SEED_GOAL || 5000),
    donationsRequiredForTier: Number(process.env.SEED_DONATIONS_REQUIRED_FOR_TIER || 5000),
  };

  const { email, username } = defaults;

  const existing = await User.findOne({ $or: [{ email }, { username }] }).exec();
  if (existing) {
    console.log('Mock user already exists (by email or username):', existing.email || existing.username);
  } else {
    const created = await User.create(defaults);
    console.log('Created mock user:', {
      id: created._id.toString(),
      username: created.username,
      email: created.email,
    });
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
