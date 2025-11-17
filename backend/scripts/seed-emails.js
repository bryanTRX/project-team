// Seed script to create demo users for email testing
// Run: node ./scripts/seed-emails.js
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

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    totalDonated: Number,
    goal: Number,
    
  });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const demo = [
  { username: 'alexandre.d', email: 'alexandre.desmarais@example.com', password: 'demo1', name: 'Alexandre Desmarais', totalDonated: 95, goal: 1000 },
  { username: 'maria.g', email: 'maria.gonzalez@example.com', password: 'demo2', name: 'Maria Gonzalez', totalDonated: 420, goal: 2500 },
  { username: 'chen.w', email: 'chen.wei@example.com', password: 'demo3', name: 'Chen Wei', totalDonated: 1320, goal: 5000 },
  ];

  for (const u of demo) {
    const exists = await User.findOne({ $or: [{ email: u.email }, { username: u.username }] }).exec();
    if (!exists) {
      const created = await User.create(u);
      console.log('created', created.email);
    } else {
      console.log('skipped existing', u.email);
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
