import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createNewUser = async (req, res, next) => {
  try {
    console.log("WAHALA");
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    res.json({
      status: 401,
      message: "invalid username or password",
    });
    return;
  }

  const isValidPassword = await comparePasswords(password, user.password);
  if (!isValidPassword) {
    res.json({
      status: 401,
      message: "invalid username or password",
    });
    return;
  }

  const token = createJWT(user);
  res.json({ token, user: { id: user.id, username: user.username } });
};
