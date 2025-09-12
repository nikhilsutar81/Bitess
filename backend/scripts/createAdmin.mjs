import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error('Usage: node scripts/createAdmin.mjs <email> <password>');
      process.exit(1);
    }

    await connectDB();

    const saltRounds = Number(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const existing = await userModel.findOne({ email });
    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'admin';
      await existing.save();
      console.log('Admin user updated:', email);
    } else {
      await userModel.create({ name: 'Admin', email, password: hashedPassword, role: 'admin' });
      console.log('Admin user created:', email);
    }

    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exit(1);
  }
}

main();
