import prisma from "../db";

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      products: true,
    },
  });

  res.status(200);
  res.json({
    data: {
      products: user.products,
      message: "products listed successfully",
    },
  });
};

// GET ONE PRODUCT
export const getOneProduct = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
  });

  res.status(200);
  res.json({ data: product });
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      belongsToId: req.user.id,
    },
  });

  res.status(201);
  res.json({ data: product });
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  const product = await prisma.product.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.status(200);
  res.json({ data: product });
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
  });

  res.status(200);
  res.json({ data: { message: "product deleted successfully" } });
};
