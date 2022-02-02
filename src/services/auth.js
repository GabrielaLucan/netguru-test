import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';

export const users = [
  {
    id: 123,
    role: "basic",
    name: "Basic Thomas",
    username: "basic-thomas",
    password: "sR-_pcoow-27-6PAwCD8",
  },
  {
    id: 434,
    role: "premium",
    name: "Premium Jim",
    username: "premium-jim",
    password: "GBLtTyq3E_UNjFnpo9m6",
  },
];

export class AuthError extends Error { }

export const authFactory = (secret) => (username, password) => {
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    throw new AuthError("invalid username or password");
  }

  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      role: user.role,
    },
    secret,
    {
      issuer: "https://www.netguru.com/",
      subject: `${user.id}`,
      expiresIn: 30 * 600000,// to do move back to 30 * 60
    }
  );
};

export const checkJwt = (req, res, next) => {
  const authHeader = req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send("Invalid Authorization token.");
  }

  const token = authHeader?.substring(7, authHeader.length);

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET, {
      issuer: "https://www.netguru.com/",
    });

    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
