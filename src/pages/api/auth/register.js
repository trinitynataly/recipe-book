// pages/api/auth/register.js
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { validateUserRegistration } from '@/validators/UserValidators';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    await validateUserRegistration(req, res, async () => {
      const { firstName, lastName, email, password } = req.body;
      const newUser = new User({
        firstName,
        lastName,
        email: email.toLowerCase(), // Ensure email is stored in lowercase
        password,
      });

      await newUser.save();

      return res.status(201).json({ message: 'User created successfully', user: newUser });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
