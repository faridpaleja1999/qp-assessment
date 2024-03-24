import { Request, Response } from "express";
import { Brackets, Not } from "typeorm";
import AppDataSource from "../database/typeormConfig";
import { Product } from "../models/product";
import { paginated, sendResponse, sortedBy } from "../utility/utils";

export const getAllProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      categoryId,
      search,
      page = 1,
      perPage = 20,
      sortBy,
      sortType,
    } = req.query;
    const paginatedRes = paginated(Number(page), Number(perPage));
    const sortedByRes = sortedBy(sortBy as string, sortType as string);
    const productRepository = AppDataSource.getRepository(Product);
    const dbQuery = productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category");
    if (categoryId) {
      dbQuery.where("category.id = :categoryId", { categoryId });
    }
    if (search) {
      dbQuery.andWhere(
        new Brackets((subQb: any) => {
          subQb.andWhere("product.name LIKE :name", {
            name: `%${search}%`,
          });
        })
      );
    }
    //pagination
    dbQuery.offset(paginatedRes.offset).limit(paginatedRes.limit);

    //sorting
    dbQuery.orderBy(`product.${sortedByRes[0]}`, `${sortedByRes[1]}`);

    //query execution
    const [productList, productCount] = await dbQuery.getManyAndCount();

    return res.status(200).json(
      sendResponse(true, "Successfully got the product list.", {
        list: productList,
        count: productCount,
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    let existsProduct = await productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!existsProduct) {
      return res
        .status(400)
        .json(sendResponse(false, "Product not found.", null));
    }
    return res
      .status(200)
      .json(sendResponse(true, "Product fetched successfully.", existsProduct));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const addProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, desc, image, countInStock, price, discount, categoryId } =
      req.body;
    const { user } = req;
    const productRepository = AppDataSource.getRepository(Product);
    const existingProduct = await productRepository.findOne({
      where: { name },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json(sendResponse(false, "Already product exists.", null));
    }
    let product = productRepository.create({
      name,
      desc,
      image,
      countInStock,
      price,
      discount,
      category: categoryId,
      createdBy: user?.userId,
    });
    product = await productRepository.save(product);
    return res
      .status(200)
      .json(sendResponse(true, "Product added successfully.", product));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const upadteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, desc, image, price, countInStock, categoryId, discount } =
      req.body;
    const { user } = req;
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    let deplicateProduct = await productRepository.findOne({
      where: { id: Not(Number(id)), name },
    });
    if (deplicateProduct) {
      return res
        .status(400)
        .json(sendResponse(false, "Product already exists.", null));
    }
    let existingProduct = await productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!existingProduct) {
      return res
        .status(400)
        .json(sendResponse(false, "Product not found.", null));
    }
    existingProduct.name = name;
    existingProduct.desc = desc;
    existingProduct.image = image;
    existingProduct.price = price;
    existingProduct.countInStock = countInStock;
    existingProduct.category = categoryId;
    existingProduct.discount = discount;
    existingProduct.updatedBy = user?.userId ? user?.userId : null;
    existingProduct = await productRepository.save(existingProduct);
    return res
      .status(200)
      .json(
        sendResponse(true, "Product update successfully.", existingProduct)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const upadteProductQty = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { countInStock, operation } = req.body;
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    let existsProduct = await productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!existsProduct) {
      return res
        .status(400)
        .json(sendResponse(false, "Product not found.", null));
    }
    if (operation === "remove") {
      if (existsProduct.countInStock >= countInStock) {
        existsProduct.countInStock -= countInStock;
      } else {
        return res
          .status(200)
          .json(sendResponse(false, "Please check with the quantity.", null));
      }
    } else {
      existsProduct.countInStock += countInStock;
    }

    existsProduct = await productRepository.save(existsProduct);
    return res
      .status(200)
      .json(
        sendResponse(
          true,
          "Product quantity update successfully.",
          existsProduct
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);
    const product = await productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!product) {
      return res
        .status(404)
        .json(sendResponse(false, "Product not found.", null));
    }
    await productRepository.remove(product);
    return res
      .status(200)
      .json(sendResponse(true, "Product deleted successfully.", null));
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", null));
  }
};
