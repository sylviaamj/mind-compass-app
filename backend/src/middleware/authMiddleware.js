import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);
    if (!decoded) {
      return res.status(401).json({ message: 'Token decoding failed' });
    }

    req.user = decoded;
    console.log("User from token:", req.user);

    next();
  } catch (error) {
    console.error("Error during token verification:", error); 
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
