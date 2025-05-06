import dbConnect from '../lib/dbConnect';
import User from '../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await dbConnect();

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
