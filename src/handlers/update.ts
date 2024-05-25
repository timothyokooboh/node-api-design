import prisma from "../db";

export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        id: req.body.productId,
        belongsToId: req.user.id,
      },
    },
  });

  if (!product) {
    res.json({
      status: 404,
      message: "unauthorized",
    });
    return;
  }

  const update = await prisma.update.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      version: req.body.version,
      asset: req.body.asset,
      updatedAt: new Date(),
      productId: req.body.productId,
    },
  });

  res.status(201);
  res.json({ data: update });
};

export const getOneUpdate = async (req, res) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.status(200);
  res.json({ data: update });
};

export const getAllUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.status(200);
  res.json({
    data: {
      updates,
    },
  });
};

export const updateUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        id: req.body.productId,
        belongsToId: req.user.id,
      },
    },
    include: {
      updates: true,
    },
  });

  if (!product) {
    res.json({
      status: 404,
      message: "The update you are trying to update does not exist",
    });
    return;
  }

  // get updates
  const updates = product.updates;
  const update = updates.find((item) => item.id === req.params.id);
  if (!update) {
    res.json({
      status: 404,
      message: "The update you are trying to update does not exist",
    });
    return;
  }

  const newUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      version: req.body.version,
      asset: req.body.asset,
      updatedAt: new Date(),
    },
  });

  res.status(200);
  res.json({ data: newUpdate });
};


export const deleteUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        id: req.body.productId,
        belongsToId: req.user.id,
      },
    },
    include: {
      updates: true,
    },
  });

  if (!product) {
    res.json({
      status: 404,
      message: "The update you are trying to update does not exist",
    });
    return;
  }

  // get updates
  const updates = product.updates;
  const update = updates.find((item) => item.id === req.params.id);
  if (!update) {
    res.json({
      status: 404,
      message: "The update you are trying to update does not exist",
    });
    return;
  }

  await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200);
  res.json({ data: { message: "update deleted successfully" } });
};
