import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("I want to know that i decoded")
    return res.json({ success: true, userId: decoded.id });
  } catch {
    return res.json({ success: false });
  }
};




