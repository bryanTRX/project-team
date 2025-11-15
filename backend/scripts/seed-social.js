// Seed script to create mock social accounts (Facebook & Google)
// Run: node ./scripts/seed-social.js (from backend folder)
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
      name: { type: String, required: true },
      donorTier: { type: String, required: true },
      totalDonated: { type: Number, required: true },
      familiesHelped: { type: Number, required: true },
      goal: { type: Number, required: true },
      donationsRequiredForTier: { type: Number, required: true },
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const accounts = [
    {
      provider: 'facebook',
      username: process.env.FB_USERNAME || 'facebook',
      email: process.env.FB_EMAIL || 'facebook@shieldofathena.org',
      password: process.env.FB_PASSWORD || 'facebook',
      name: process.env.FB_NAME || 'Facebook Donor',
      donorTier: process.env.FB_DONOR_TIER || 'Olympian',
      totalDonated: Number(process.env.FB_TOTAL_DONATED || 1200),
      familiesHelped: Number(process.env.FB_FAMILIES_HELPED || 8),
      goal: Number(process.env.FB_GOAL || 2000),
      donationsRequiredForTier: Number(process.env.FB_DONATIONS_REQUIRED_FOR_TIER || 2000),
    },
    {
      provider: 'google',
      username: process.env.GOOGLE_USERNAME || 'google',
      email: process.env.GOOGLE_EMAIL || 'google@shieldofathena.org',
      password: process.env.GOOGLE_PASSWORD || 'google',
      name: process.env.GOOGLE_NAME || 'Google Donor',
      donorTier: process.env.GOOGLE_DONOR_TIER || 'Olympian',
      totalDonated: Number(process.env.GOOGLE_TOTAL_DONATED || 900),
      familiesHelped: Number(process.env.GOOGLE_FAMILIES_HELPED || 5),
      goal: Number(process.env.GOOGLE_GOAL || 1500),
      donationsRequiredForTier: Number(process.env.GOOGLE_DONATIONS_REQUIRED_FOR_TIER || 1500),
    },
  ];

  for (const acc of accounts) {
    const existing = await User.findOne({ $or: [{ username: acc.username }, { email: acc.email }] }).exec();
    if (existing) {
      console.log(`Account for ${acc.provider} already exists:`, existing.email || existing.username);
    } else {
      const created = await User.create({
        username: acc.username,
        email: acc.email,
        password: acc.password,
        name: acc.name,
        donorTier: acc.donorTier,
        totalDonated: acc.totalDonated,
        familiesHelped: acc.familiesHelped,
        goal: acc.goal,
        donationsRequiredForTier: acc.donationsRequiredForTier,
      });
      console.log(`Created ${acc.provider} account:`, created.email);
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed social failed:', err);
  process.exit(1);
});
