import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_KEY;

const generateToken = (payload, time) => jwt.sign({ payload }, secret, time);

const verifyToken = (req, res, next) => {
  const token = req.headers.accesstoken;
  jwt.verify(token, secret, (error, decoded) => {
    if (error) error(401, 'Invalid authencation! Can you check and try again?');
    req.decoded = decoded;
    return next();
  });
};

export { generateToken, verifyToken };
