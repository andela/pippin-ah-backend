import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET_KEY;
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, secret, (err, decoded) => {
    let error;
    if (!token) {
      error = new Error('No token provided');
      error.status = 400;
      return next(error);
    }
    if (err) {
      error = new Error('Invalid token');
      error.status = 401;
      return next(error);
    }

    req.decoded = decoded;
    console.log('******', decoded);

    if (req.decoded.id !== req.params.id) {
      error = new Error('Unauthorized');
      error.status = 401;
      return next(error);
    }
    return next();
  });
};

export default verifyToken;
