import dbConnect from '../lib/dbConnect';
import User from '../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    await dbConnect();

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
