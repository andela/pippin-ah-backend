import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_KEY;

const generateToken = (payload, time) => jwt.sign({ payload }, secret, time);

const verifyToken = (req, res, next) => {
  const token = req.headers.accesstoken;
  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      error = new Error('Invalid authencation! Can you check and try again?');
      error.status = 400;
      return next(error);
    }
    req.decoded = decoded;
    return next();
  });
};

export { generateToken, verifyToken };
