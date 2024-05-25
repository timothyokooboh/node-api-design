import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
  );

  return token;
};

export const protect = (req, res, next) => {
  // check for authorization header
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Not authorized" });
    return;
  }

  // check for token
  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    res.json("Not authorized");
    return;
  }

  // verify token
  try {
    // payload is the data used to sign the jwt token i.e { id: user.id, username: user.username }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401);
    res.json("Not valid token");
    return;
  }
};
