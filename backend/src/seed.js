const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const DEMO_USERNAME = 'demo';
const DEMO_PASSWORD = 'demo1234';

const days = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const sampleTasks = (userId) => [
  { user: userId, text: 'Finish the project proposal', priority: 'High', category: 'Work', location: 'New York', dueDate: days(-1), completed: false },
  { user: userId, text: 'Buy groceries for the week', priority: 'Medium', category: 'Shopping', location: '', dueDate: days(1), completed: false },
  { user: userId, text: 'Morning run in the park', priority: 'Low', category: 'Health', location: 'London', dueDate: null, completed: true },
  { user: userId, text: 'Call the dentist', priority: 'Medium', category: 'Personal', location: '', dueDate: days(3), completed: false },
];

async function seed() {
  await connectDB();

  // Upsert the demo user (reset its password so it's always known).
  let user = await User.findOne({ username: DEMO_USERNAME });
  if (!user) {
    user = await User.create({ username: DEMO_USERNAME, password: DEMO_PASSWORD });
    console.log(`Created demo user "${DEMO_USERNAME}"`);
  } else {
    user.password = DEMO_PASSWORD; 
    await user.save();
    console.log(`Reset password for existing demo user "${DEMO_USERNAME}"`);
  }

  await Task.deleteMany({ user: user._id });
  await Task.insertMany(sampleTasks(user._id));
  console.log(`Seeded ${sampleTasks(user._id).length} sample tasks`);

  console.log(`\n✅ Demo login ready →  username: ${DEMO_USERNAME}   password: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
